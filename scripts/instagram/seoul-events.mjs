#!/usr/bin/env node
// 서울시 문화행사 → 인스타 "갈 곳" 카드 세트
//
//   node scripts/instagram/seoul-events.mjs --list                      # 앞으로 3주, 무료, 5060 취향 분류만 골라 점수순
//   node scripts/instagram/seoul-events.mjs --list --days 30 --paid     # 기간·유료 포함
//   node scripts/instagram/seoul-events.mjs --make free-nov-w2          # 상위 6건으로 세트 생성 (set.json·caption.txt·카드 렌더)
//   node scripts/instagram/seoul-events.mjs --make free-nov-w2 --pick 2,5,7,9   # --list 번호로 직접 고르기
//   node scripts/instagram/seoul-events.mjs --auto [--dry-run]          # 크론용: 큐가 빈 목요일에 알아서 6건 골라 세트+큐 등록
//
// 데이터: 서울 열린데이터광장 culturalEventInfo (data.seoul.go.kr). 키는 SEOUL_API_KEY.
// 키가 없으면 'sample'로 5건만 온다(개발용). 발급: 로그인 → 마이페이지 → 인증키 신청.
//
// ⚠️ 포스터(MAIN_IMG)는 주최 측 저작물이라 카드에 쓰지 않는다. 글만 우리 카드에 담는다.
// ⚠️ 무료 여부·날짜는 API 값 그대로. 카드엔 "무료"를 API가 무료라 한 것에만 쓴다.
import { readFile, writeFile, mkdir, appendFile } from "node:fs/promises";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

// 날짜 계산·표기는 늘 한국 시각. GitHub 러너는 UTC라 이 줄이 없으면 "+09:00 자정"이 전날 15시가 되어
// 카드의 모든 날짜가 하루씩 당겨진다(2026-11-11 autofill 시험에서 발견).
process.env.TZ = "Asia/Seoul";

const ROOT = resolve(process.cwd());
const ENV_LOCAL = join(ROOT, ".env.local");
if (existsSync(ENV_LOCAL)) {
  for (const line of (await readFile(ENV_LOCAL, "utf8")).split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const KEY = process.env.SEOUL_API_KEY || "sample";

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : d; };

// ── 취향 설정 (5060 여성, 낮에 갈 수 있는 것) ──────────────────────────────
const CATS = (opt("cat", "전시/미술,클래식,국악,전통/역사,교육/체험,축제-전통/역사,축제-문화/예술,무용,연극,뮤지컬/오페라")).split(",");
const DAYS = parseInt(opt("days", "21"));
const FREE_ONLY = !flag("paid");
const CENTRAL = ["종로구", "중구", "용산구", "서대문구", "마포구", "성북구", "서초구", "강남구", "송파구", "영등포구"];
// 앱 functions/seoul_events.js와 같은 제외어 — 손으로 고른 것과 앱 목록이 어긋나지 않게
const KID_WORDS = /어린이|유아|키즈|아동|초등|중등|고등|청소년|가족극|인형극|아이돌|팬미팅|팬사인|보이그룹|걸그룹|아카데미|수강생|강좌 수강/;

// ── 수집 ──────────────────────────────────────────────────────────────────
async function fetchAll() {
  const cache = join(tmpdir(), `seoul-events-${KEY === "sample" ? "sample" : "full"}.json`);
  if (existsSync(cache) && !flag("fresh")) {
    const { at, rows } = JSON.parse(await readFile(cache, "utf8"));
    if (Date.now() - at < 6 * 3600 * 1000) return rows;
  }
  const page = KEY === "sample" ? 5 : 1000;
  let rows = [], start = 1, total = Infinity;
  while (start <= total) {
    const url = `http://openapi.seoul.go.kr:8088/${KEY}/json/culturalEventInfo/${start}/${start + page - 1}/`;
    const j = await (await fetch(url)).json();
    const r = j.culturalEventInfo;
    if (!r) throw new Error(`API 오류: ${JSON.stringify(j).slice(0, 200)}`);
    if (r.RESULT?.CODE !== "INFO-000") throw new Error(`API: ${r.RESULT?.MESSAGE}`);
    total = r.list_total_count;
    rows.push(...(r.row || []));
    if (KEY === "sample") break;
    start += page;
  }
  await writeFile(cache, JSON.stringify({ at: Date.now(), rows }));
  return rows;
}

// ── 선별 ──────────────────────────────────────────────────────────────────
const d0 = (s) => new Date(s.replace(" ", "T").replace(/\.0$/, "") + "+09:00");
const today = new Date(); today.setHours(0, 0, 0, 0);
const horizon = new Date(today.getTime() + DAYS * 86400000);
const WD = "일월화수목금토";
const fmt = (d) => `${d.getFullYear() !== today.getFullYear() ? "내년 " : ""}${d.getMonth() + 1}월 ${d.getDate()}일(${WD[d.getDay()]})`;

function cleanTitle(t) {
  return t.replace(/\[[^\]]*\]|【[^】]*】|<[^>]*>/g, " ").replace(/^\s*20\d\d년?\s*/, "").replace(/^(제\s*)?\d+회\s+/, "").replace(/\s+/g, " ").replace(/\s+([,.·])/g, "$1").trim();
}
function dateLabel(e) {
  const s = d0(e.STRTDATE), en = d0(e.END_DATE);
  if (s.getTime() === en.getTime()) return fmt(s);
  if (s <= today) return `~${fmt(en)}`;
  return `${fmt(s)}~${s.getMonth() === en.getMonth() && s.getFullYear() === en.getFullYear() ? fmt(en).replace(/^\d+월 /, "") : fmt(en)}`;
}
// 카드의 왼쪽 날짜 칸(두 줄). 요일은 단일 날짜에만.
function cardDate(e) {
  const s = d0(e.STRTDATE), en = d0(e.END_DATE);
  const md = (d) => `${d.getFullYear() !== today.getFullYear() ? "내년 " : ""}${d.getMonth() + 1}월 ${d.getDate()}일`;
  if (s.getTime() === en.getTime()) return `${md(s)}<br>(${WD[s.getDay()]})`;
  const next = en.getFullYear() !== today.getFullYear();
  if (s <= today) return next ? `내년 ${en.getMonth() + 1}월<br>${en.getDate()}일까지` : `${md(en)}<br>까지`;
  if (s.getMonth() === en.getMonth() && s.getFullYear() === en.getFullYear()) return `${md(s)}<br>~${en.getDate()}일`;
  return `${md(s)}<br>부터`;                                   // 달을 넘기는 긴 전시는 시작일만 — 끝 날짜는 캡션에 있다
}
// 세트가 가리키는 달: 고른 행사들이 가장 많이 시작하는 달(이미 시작한 건 이번 달로)
function setMonth(picked) {
  if (today.getDate() >= 25) return `${(today.getMonth() + 1) % 12 + 1}월`;   // 월말에 만드는 세트는 다음 달 것
  const c = {};
  for (const e of picked) { const s = d0(e.STRTDATE); const m = (s <= today ? today : s).getMonth() + 1; c[m] = (c[m] || 0) + 1; }
  return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0] + "월";
}
const VENUE = /박물관|미술관|궁|기념관|문화역|도서관|아트센터|갤러리|시립|국립|문화회관|아트홀|공예/;
const VAGUE = /^(\d{4}\s*)?(기획전|기획전시|개인전|특별전|전시|상설전|소장품전|릴레이 개인전|XR 전시|온라인 전시)\s*$/;
function score(e) {
  let n = 0;
  if (e.IS_FREE === "무료") n += 3;
  if (CENTRAL.includes(e.GUNAME)) n += 1;
  if (/전시|미술/.test(e.CODENAME)) n += 2;           // 낮에 혼자도 가는 종류
  if (/클래식|국악|전통/.test(e.CODENAME)) n += 2;     // 전시 일색이 되지 않게
  if (/누구나|전체|성인|제한없음|전 연령|모든/.test(e.USE_TRGT || "")) n += 1;
  if (VENUE.test(e.PLACE || "")) n += 2;               // 이름 들으면 아는 곳
  const s = d0(e.STRTDATE), en = d0(e.END_DATE);
  const left = (en - today) / 86400000, span = (en - s) / 86400000;
  if (span >= 7) n += 1;                               // 기간이 길면 날짜 맞추기 쉽다
  if (left <= 3) n -= 3;                               // 사흘 안에 끝나면 글 보고 못 간다
  if (left > 120) n -= 2;                              // 넉 달 넘게 하면 "이번 달 갈 곳"이 아니다
  if (VAGUE.test(cleanTitle(e.TITLE))) n -= 3;          // 제목만으론 뭔지 모른다
  if (/온라인|비대면|유튜브|라이브 스트리밍/.test(e.TITLE + " " + (e.PLACE || ""))) n -= 9;
  if (KID_WORDS.test(e.TITLE + " " + (e.USE_TRGT || ""))) n -= 4;
  if (/오디션|공모|접수|모집/.test(e.TITLE)) n -= 3;
  return n;
}
// 자동으로 고를 때 한 분류가 넘치지 않게 (전시 4 · 나머지 2 정도)
function diversify(sel, n) {
  const cap = { "전시/미술": Math.ceil(n * 0.6) }, cnt = {}, out = [];
  for (const e of sel) {
    const c = e.CODENAME, lim = cap[c] ?? Math.ceil(n * 0.4);
    if ((cnt[c] || 0) >= lim) continue;
    cnt[c] = (cnt[c] || 0) + 1; out.push(e);
    if (out.length >= n) break;
  }
  return out;
}
function select(rows) {
  const seen = new Set();
  return rows
    .filter((e) => e.STRTDATE && e.END_DATE)
    .filter((e) => d0(e.END_DATE) >= today && d0(e.STRTDATE) <= horizon)
    .filter((e) => CATS.includes(e.CODENAME))
    .filter((e) => !FREE_ONLY || e.IS_FREE === "무료")
    .map((e) => ({ ...e, title: cleanTitle(e.TITLE), when: dateLabel(e), score: score(e) }))
    .filter((e) => { const k = e.title.slice(0, 20); if (seen.has(k)) return false; seen.add(k); return true; })
    .sort((a, b) => b.score - a.score || d0(a.END_DATE) - d0(b.END_DATE));
}

// ── 자동 선별 (--auto) ─────────────────────────────────────────────────────
// 큐가 빈 목요일에 크론이 부른다. 사람이 고를 때보다 보수적으로:
//   · 전시·축제만 — 하루짜리 공연·강좌는 예약제인지 API로 알 수 없다(11/15 플루트 독주회가 그랬다)
//   · 일주일 넘게 하고, 닷새 넘게 남은 것 — 글 보고 주말에 갈 수 있어야 한다
//   · 앞 세트에 실은 건 빼고, 한 건물에 한 건, 한 구에 세 건까지
//   · 이름 들으면 아는 곳(VENUE)이거나 중심부 — 동네 도서관 북큐레이션·졸업전시는 뺀다
const AUTO_CATS = ["전시/미술", "축제-전통/역사", "축제-문화/예술"];
const AUTO_SKIP = /도서관|졸업|북큐레이션|원화 전시|공모|협력전시|수강|체험전|연계|예약|사전신청|신청자|접수/;
// 사람 없이 나가는 글이라 무거운 주제는 싣지 않는다(티타 축은 "즐기기"). 이런 전시는 손으로 고를 때만.
const AUTO_HEAVY = /항쟁|양심수|추모|참사|위안부|일본군|학살|규탄|희생자/;
const normKey = (t) => t.replace(/[^가-힣a-zA-Z0-9]/g, "").slice(0, 12);
function usedTitles() {
  const root = join(ROOT, "assets/instagram"), keys = new Set();
  for (const d of readdirSync(root)) {
    const f = join(root, d, "set.json");
    if (!existsSync(f)) continue;
    try { for (const e of JSON.parse(readFileSync(f, "utf8")).events || []) keys.add(normKey(e.title)); } catch { /* 깨진 세트는 건너뛴다 */ }
  }
  return keys;
}
// "동양화에 기운 Hearts Inclined to Ink" → "동양화에 기운", "아트페어(ARTNOMAD ARTFAIR)" → "아트페어"
function tidyTitle(t) {
  if (!/[가-힣]/.test(t)) return t;
  t = t.replace(/_/g, " ");
  return t.replace(/\s*\([A-Za-z0-9 .,:'&\-]+\)/g, "").replace(/\s+[A-Z][A-Za-z0-9 .,:'&\-]{8,}$/, "").trim() || t;
}
// 사람이 고를 때 기준을 점수로: 이름 들으면 아는 공공 기관이 먼저, 작은 화랑 개인전·제목만으론 모르는 전시는 뒤로.
const MAJOR = /국립|시립|박물관|미술관|기념관|전시관|문화역서울|남산골한옥마을|동대문디자인플라자|DDP|세종문화회관|청와대|노들섬|열린송현|교보아트스페이스|경복궁|덕수궁|창덕궁|창경궁|운현궁|돈의문|한옥마을/;
function isVague(e) {
  let t = e.title;
  for (const w of shortPlace(e.PLACE).split(/\s+/)) if (w.length >= 2) t = t.split(w).join("");
  t = t.replace(/기획전시|기획전|특별전|소장품|소장자료|상설전|전시|개인전|초대전|협력|하반기|상반기|봄|여름|가을|겨울|특별|기념|[^가-힣]/g, "");
  return t.length < 4 || !/[\s《〈]/.test(e.title.trim());      // 낱말 하나짜리 제목은 대개 기관·사업 이름뿐이다
}
function autoScore(e) {
  const place = e.PLACE || "";
  let n = e.score;
  if (MAJOR.test(place)) n += 3;
  if (e.TICKET === "기관" || (e.ORG_NAME && e.ORG_NAME !== "기타")) n += 2;   // 기관이 직접 올린 행사
  if (/개인전|초대전/.test(e.title) && !MAJOR.test(place)) n -= 4;
  if (/갤러리|화랑|스페이스/.test(place) && !MAJOR.test(place)) n -= 2;
  if (isVague(e)) n -= 5;
  return n;
}
function autoPick(sel, n = 6) {
  const used = usedTitles(), perPlace = new Set(), perGu = {}, out = [];
  sel = sel.map((e) => ({ ...e, auto: autoScore(e) })).sort((a, b) => b.auto - a.auto || d0(a.END_DATE) - d0(b.END_DATE));
  for (const e of sel) {
    if (!AUTO_CATS.includes(e.CODENAME)) continue;
    const s = d0(e.STRTDATE), en = d0(e.END_DATE);
    if ((en - s) / 86400000 < 7 || (en - today) / 86400000 < 5) continue;
    if (s > new Date(today.getTime() + 7 * 86400000)) continue;          // 일주일 안에 시작하는 것까지만
    if (AUTO_SKIP.test(e.TITLE + " " + (e.PLACE || "") + " " + (e.USE_TRGT || ""))) continue;
    if (AUTO_HEAVY.test(e.TITLE)) continue;
    if (e.auto < 11) continue;                                            // 공공 기관이거나 기관 등록 행사쯤 돼야 넘는다
    if (used.has(normKey(e.title))) continue;
    const place = shortPlace(e.PLACE).replace(/\s/g, "").slice(0, 8);      // "서울대학교미술관 2-"와 "… 코어라운지"는 같은 건물
    if (!place || perPlace.has(place) || (perGu[e.GUNAME] || 0) >= 3) continue;
    perPlace.add(place); perGu[e.GUNAME] = (perGu[e.GUNAME] || 0) + 1;
    out.push({ ...e, title: tidyTitle(e.title) });
    if (out.length >= n) break;
  }
  return out;
}
// 자동 세트 이름: seoul-free-YYYY-MM-wN — N은 그 달의 몇 번째 세트인지(달력 주차가 아니다)
function autoSlug(picked) {
  const m = parseInt(setMonth(picked));
  const y = today.getFullYear() + (m < today.getMonth() + 1 ? 1 : 0);
  const base = `seoul-free-${y}-${String(m).padStart(2, "0")}-w`;
  const root = join(ROOT, "assets/instagram");
  const nums = readdirSync(root).filter((d) => d.startsWith(base)).map((d) => parseInt(d.slice(base.length)) || 0);
  return { slug: base + (Math.max(0, ...nums) + 1), nth: Math.max(0, ...nums) + 1 };
}

// ── 세트 만들기 ───────────────────────────────────────────────────────────
// 장소는 건물 이름까지만 — 층·호수·전시실은 카드에서 소음이다
function shortPlace(p) {
  return (p || "").replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/\s*(B\d|지하\s*\d*층?|\d+층|\d+F|로비|앞|야외|(기획)?전시실\S*|제?\d+전시실).*$/, "")
    .replace(/[,·]\s*.*$/, "").replace(/\s+/g, " ").trim().slice(0, 20);
}
function cardPlace(p) {
  const full = shortPlace(p);
  if (full.length <= 14) return full;
  let out = "";
  for (const w of full.split(" ")) { if ((out + " " + w).trim().length > 14) break; out = (out + " " + w).trim(); }
  return out || full.slice(0, 14);
}
function feeLabel(e) {
  if (e.IS_FREE === "무료") return "무료";
  const m = (e.USE_FEE || "").match(/[\d,]+원/);
  return m ? m[0] : "유료";
}
async function makeSet(slug, picked, { nth = 1 } = {}) {
  const more = nth > 1 ? " 더" : "";   // 그 달 두 번째 세트부터는 "6군데 더 골랐어요"
  const dir = join(ROOT, "assets/instagram", slug);
  await mkdir(dir, { recursive: true });
  const month = setMonth(picked);
  const free = picked.filter((e) => e.IS_FREE === "무료").length;
  // 포스터 썸네일 — 서울시 문화행사 데이터는 공공누리 1유형(출처표시). 카드 하단에 출처를 적는다.
  // 작게(줄 옆 썸네일)만 쓴다. 포스터 안 작품 사진은 작가 저작물일 수 있어 전면엔 안 깐다.
  const thumbs = [];
  if (!flag("no-thumbs")) {
    for (const [i, e] of picked.entries()) {
      const out = join(dir, `thumb-${i + 1}.jpg`);
      try {
        const raw = join(dir, `_thumb-${i + 1}.bin`);
        try {
          const r = await fetch(e.MAIN_IMG, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) });
          if (!r.ok || !/image/.test(r.headers.get("content-type") || "")) throw new Error(`HTTP ${r.status}`);
          await writeFile(raw, Buffer.from(await r.arrayBuffer()));
        } catch (fe) {
          // Node fetch가 막히는 환경(CI)이 있다 — curl로 한 번 더. 둘 다 안 되면 썸네일 없이 간다.
          const why = fe.cause?.code || fe.cause?.message || fe.message;
          try {
            execFileSync("curl", ["-sSLf", "--max-time", "25", "-A", "Mozilla/5.0", "-o", raw, e.MAIN_IMG], { stdio: ["ignore", "ignore", "pipe"] });
          } catch (ce) {
            throw new Error(`fetch: ${why} / curl: ${String(ce.stderr || ce.message).trim().slice(0, 120)}`);
          }
        }
        execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "88", "-Z", "640", raw, "--out", out], { stdio: "ignore" });
        await import("node:fs/promises").then((fs) => fs.unlink(raw));
        thumbs[i] = `thumb-${i + 1}.jpg`;
      } catch (err) { console.warn(`  포스터 못 받음 (${e.title.slice(0, 20)}): ${err.message}`); }
    }
  }
  const rows = picked.map((e, i) => ({
    img: thumbs[i] || null,
    d: cardDate(e),
    t: e.GUNAME,
    p: e.title.length > 44 ? e.title.slice(0, 43) + "…" : e.title,
    m: `${cardPlace(e.PLACE)} · <b>${feeLabel(e)}</b>${e.USE_TRGT && !/누구나|전체|제한없음/.test(e.USE_TRGT) ? `<br>${e.USE_TRGT.slice(0, 22)}` : ""}`,
  }));
  const set = {
    cover: {
      badge: month,
      title: [`${month}에 서울에서,`, free === picked.length ? "무료로 볼 수 있는 것" : "가볼 만한 것"],
      sub: `${picked.length}군데${more} 골랐어요.${free && free < picked.length ? ` ${free}군데는 <em>관람료가 없어요.</em>` : free === picked.length ? " 전부 <em>관람료가 없어요.</em>" : ""}`,
    },
    rows,
    closing: {
      title: ["같은 걸 봐도", "느끼는 건 달라요"],
      sub: "비슷한 걸 좋아하는 또래끼리라<br><em>달라도 이야기할 게 생겨요.</em>",
      box: "티타는 <b>45세 이상</b>만 쓰는 앱이에요. 가고 싶은 곳이 있으면 앱에서 자리를 열어 보세요. <b>먼저 가서 기다리는 사람</b>이 되는 것도 좋구요.",
    },
    source: "서울시 문화행사 정보 (data.seoul.go.kr)",
    events: picked.map((e) => ({ title: e.title, when: e.when, place: e.PLACE, gu: e.GUNAME, fee: feeLabel(e), target: e.USE_TRGT, link: e.ORG_LINK || e.HMPG_ADDR, cat: e.CODENAME })),
  };
  await writeFile(join(dir, "set.json"), JSON.stringify(set, null, 2) + "\n");

  const lines = [];
  lines.push(`${month}에 서울에서 ${free === picked.length ? "무료로 볼 수 있는 것" : "가볼 만한 것"}, ${picked.length}군데${more} 골랐어요.`);
  lines.push("");
  for (const e of picked) {
    lines.push(`${e.when.startsWith("~") ? e.when.slice(1) + "까지" : e.when} · ${e.title}`);
    lines.push(`${shortPlace(e.PLACE)}${e.GUNAME ? ` (${e.GUNAME})` : ""}, ${feeLabel(e)}${e.USE_TRGT && !/누구나|전체|제한없음/.test(e.USE_TRGT) ? `. ${e.USE_TRGT.slice(0, 30)}` : ""}`);
    lines.push("");
  }
  lines.push("날짜와 시간은 주최 측 안내를 한 번 더 확인해 주세요. 서울문화포털(culture.seoul.go.kr)에 자세히 나와요.");
  lines.push("");
  lines.push("같은 걸 봐도 느끼는 건 달라요. 비슷한 걸 좋아하는 또래끼리라 달라도 이야기할 게 생겨요.");
  lines.push("");
  lines.push("티타는 45세 이상만 쓰는 앱이에요. 가고 싶은 곳이 있으면 앱에서 자리를 열어 보세요. 먼저 가서 기다리는 사람이 되는 것도 좋구요. tita-app.com");
  lines.push("");
  const tagCats = [...new Set(picked.map((e) => e.CODENAME.replace(/[\/\-].*/, "")))].slice(0, 3).map((c) => "#" + c.replace(/\s/g, ""));
  lines.push(["#티타", "#45세이상", "#5060", "#서울나들이", "#무료전시", ...tagCats, "#또래", `#${month}`].join(" "));
  await writeFile(join(dir, "caption.txt"), lines.join("\n") + "\n");

  console.log(`세트 저장: assets/instagram/${slug}/ (set.json · caption.txt)`);
  if (!flag("no-render")) {
    execFileSync("node", [join(ROOT, "scripts/cards/gen-event-cards.cjs"), slug], { stdio: "inherit" });
  }
}

// ── main ──────────────────────────────────────────────────────────────────
try {
  const rows = await fetchAll();
  const sel = select(rows);
  if (KEY === "sample") console.log("⚠️  SEOUL_API_KEY가 없어 sample 키로 5건만 받았다. 실제 선별은 키를 넣고 다시.");
  if (flag("auto")) {
    if (KEY === "sample") throw new Error("SEOUL_API_KEY가 없다 — 자동 선별은 전체 데이터가 있어야 한다.");
    const picked = autoPick(sel, parseInt(opt("n", "6")));
    picked.forEach((e, i) => console.log(`${String(i + 1).padStart(2)}. [${e.auto}] ${e.when.padEnd(22)} ${e.CODENAME.padEnd(8)} ${e.GUNAME.padEnd(5)} ${e.title} · ${shortPlace(e.PLACE)}`));
    if (picked.length < 4) throw new Error(`자동으로 고를 만한 행사가 ${picked.length}건뿐이다(4건 미만). 세트를 만들지 않는다 — 손으로 골라 --make 할 것.`);
    const { slug, nth } = autoSlug(picked);
    if (flag("dry-run")) { console.log(`\n(dry-run) ${slug} — ${picked.length}건, 그 달 ${nth}번째 세트. 만들지 않았다.`); process.exit(0); }
    await makeSet(slug, picked, { nth });
    if (!flag("no-queue")) await appendFile(join(ROOT, "assets/instagram/queue.txt"), `${slug}\n`);
    console.log(`AUTO_SLUG=${slug}`);
    process.exit(0);
  }
  if (flag("list") || !flag("make")) {
    console.log(`전체 ${rows.length}건 → 조건(${DAYS}일 안, ${FREE_ONLY ? "무료" : "유료 포함"}, ${CATS.length}개 분류) ${sel.length}건\n`);
    sel.slice(0, parseInt(opt("limit", "30"))).forEach((e, i) =>
      console.log(`${String(i + 1).padStart(2)}. [${e.score}] ${e.when.padEnd(22)} ${e.CODENAME.padEnd(8)} ${e.GUNAME.padEnd(5)} ${e.title.slice(0, 34)} · ${shortPlace(e.PLACE)} · ${feeLabel(e)}`));
    if (!flag("make")) process.exit(0);
  }
  const slug = opt("make");
  const pick = opt("pick");
  const picked = pick ? pick.split(",").map((n) => sel[parseInt(n) - 1]).filter(Boolean) : diversify(sel, parseInt(opt("n", "6")));
  if (!picked.length) throw new Error("고른 행사가 없다. --list로 번호를 보고 --pick 으로 지정할 것.");
  await makeSet(slug, picked);
} catch (e) {
  console.error("\n❌ " + e.message);
  process.exit(1);
}
