#!/usr/bin/env node
// 서울시 문화행사 → 인스타 "갈 곳" 카드 세트
//
//   node scripts/instagram/seoul-events.mjs --list                      # 앞으로 3주, 무료, 5060 취향 분류만 골라 점수순
//   node scripts/instagram/seoul-events.mjs --list --days 30 --paid     # 기간·유료 포함
//   node scripts/instagram/seoul-events.mjs --make free-nov-w2          # 상위 6건으로 세트 생성 (set.json·caption.txt·카드 렌더)
//   node scripts/instagram/seoul-events.mjs --make free-nov-w2 --pick 2,5,7,9   # --list 번호로 직접 고르기
//
// 데이터: 서울 열린데이터광장 culturalEventInfo (data.seoul.go.kr). 키는 SEOUL_API_KEY.
// 키가 없으면 'sample'로 5건만 온다(개발용). 발급: 로그인 → 마이페이지 → 인증키 신청.
//
// ⚠️ 포스터(MAIN_IMG)는 주최 측 저작물이라 카드에 쓰지 않는다. 글만 우리 카드에 담는다.
// ⚠️ 무료 여부·날짜는 API 값 그대로. 카드엔 "무료"를 API가 무료라 한 것에만 쓴다.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

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
const KID_WORDS = /어린이|유아|초등|키즈|가족극|아동/;

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
const fmt = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일(${WD[d.getDay()]})`;

function cleanTitle(t) {
  return t.replace(/\[[^\]]*\]|【[^】]*】|<[^>]*>/g, " ").replace(/\s+/g, " ").replace(/\s+([,.·])/g, "$1").trim();
}
function dateLabel(e) {
  const s = d0(e.STRTDATE), en = d0(e.END_DATE);
  if (s.getTime() === en.getTime()) return fmt(s);
  if (s <= today) return `~${fmt(en)}`;
  return `${fmt(s)}~${fmt(en).replace(/^\d+월 /, s.getMonth() === en.getMonth() ? "" : "")}`;
}
// 카드의 왼쪽 날짜 칸(두 줄). 요일은 단일 날짜에만.
function cardDate(e) {
  const s = d0(e.STRTDATE), en = d0(e.END_DATE);
  const md = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
  if (s.getTime() === en.getTime()) return `${md(s)}<br>(${WD[s.getDay()]})`;
  if (s <= today) return `${md(en)}<br>까지`;
  return `${md(s)}<br>~${s.getMonth() === en.getMonth() ? `${en.getDate()}일` : md(en)}`;
}
// 세트가 가리키는 달: 고른 행사들이 가장 많이 시작하는 달(이미 시작한 건 이번 달로)
function setMonth(picked) {
  const c = {};
  for (const e of picked) { const s = d0(e.STRTDATE); const m = (s <= today ? today : s).getMonth() + 1; c[m] = (c[m] || 0) + 1; }
  return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0] + "월";
}
function score(e) {
  let n = 0;
  if (e.IS_FREE === "무료") n += 3;
  if (CENTRAL.includes(e.GUNAME)) n += 1;
  if (/전시|미술/.test(e.CODENAME)) n += 2;           // 낮에 혼자도 가는 종류
  if (/클래식|국악|전통/.test(e.CODENAME)) n += 1;
  if (/누구나|전체|성인|제한없음|전 연령|모든/.test(e.USE_TRGT || "")) n += 1;
  const span = (d0(e.END_DATE) - d0(e.STRTDATE)) / 86400000;
  if (span >= 7) n += 1;                               // 기간이 길면 날짜 맞추기 쉽다
  if (KID_WORDS.test(e.TITLE + " " + (e.USE_TRGT || ""))) n -= 4;
  if (/오디션|공모|접수|모집/.test(e.TITLE)) n -= 3;
  return n;
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
    .sort((a, b) => b.score - a.score || d0(a.STRTDATE) - d0(b.STRTDATE));
}

// ── 세트 만들기 ───────────────────────────────────────────────────────────
function shortPlace(p) {
  return (p || "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim().slice(0, 18);
}
function feeLabel(e) {
  if (e.IS_FREE === "무료") return "무료";
  const m = (e.USE_FEE || "").match(/[\d,]+원/);
  return m ? m[0] : "유료";
}
async function makeSet(slug, picked) {
  const dir = join(ROOT, "assets/instagram", slug);
  await mkdir(dir, { recursive: true });
  const month = setMonth(picked);
  const free = picked.filter((e) => e.IS_FREE === "무료").length;
  const rows = picked.map((e) => ({
    d: cardDate(e),
    t: e.GUNAME,
    p: e.title.length > 44 ? e.title.slice(0, 43) + "…" : e.title,
    m: `${shortPlace(e.PLACE)} · <b>${feeLabel(e)}</b>${e.USE_TRGT && !/누구나|전체|제한없음/.test(e.USE_TRGT) ? `<br>${e.USE_TRGT.slice(0, 22)}` : ""}`,
  }));
  const set = {
    cover: {
      badge: month,
      title: [`${month}에 서울에서,`, free === picked.length ? "무료로 볼 수 있는 것" : "가볼 만한 것"],
      sub: `${picked.length}군데 골랐어요.${free && free < picked.length ? ` ${free}군데는 <em>관람료가 없어요.</em>` : free === picked.length ? " 전부 <em>관람료가 없어요.</em>" : ""}`,
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
  lines.push(`${month}에 서울에서 ${free === picked.length ? "무료로 볼 수 있는 것" : "가볼 만한 것"}, ${picked.length}군데 골랐어요.`);
  lines.push("");
  for (const e of picked) {
    lines.push(`${e.when} · ${e.title}`);
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
  if (flag("list") || !flag("make")) {
    console.log(`전체 ${rows.length}건 → 조건(${DAYS}일 안, ${FREE_ONLY ? "무료" : "유료 포함"}, ${CATS.length}개 분류) ${sel.length}건\n`);
    sel.slice(0, parseInt(opt("limit", "30"))).forEach((e, i) =>
      console.log(`${String(i + 1).padStart(2)}. [${e.score}] ${e.when.padEnd(22)} ${e.CODENAME.padEnd(8)} ${e.GUNAME.padEnd(5)} ${e.title.slice(0, 34)} · ${shortPlace(e.PLACE)} · ${feeLabel(e)}`));
    if (!flag("make")) process.exit(0);
  }
  const slug = opt("make");
  const pick = opt("pick");
  const picked = pick ? pick.split(",").map((n) => sel[parseInt(n) - 1]).filter(Boolean) : sel.slice(0, parseInt(opt("n", "6")));
  if (!picked.length) throw new Error("고른 행사가 없다. --list로 번호를 보고 --pick 으로 지정할 것.");
  await makeSet(slug, picked);
} catch (e) {
  console.error("\n❌ " + e.message);
  process.exit(1);
}
