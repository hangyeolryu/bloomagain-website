#!/usr/bin/env node
// 인스타그램 캐러셀 자동 게시 — @titakorea
//
//   node scripts/instagram/publish.mjs --slug insight-15 --dry-run   # 올라갈 내용만 보여줌
//   node scripts/instagram/publish.mjs --slug insight-15             # 실제 게시
//   node scripts/instagram/publish.mjs --next                        # queue.txt의 첫 미게시 세트 (크론용)
//   node scripts/instagram/publish.mjs --whoami                      # 토큰이 누구 건지
//   node scripts/instagram/publish.mjs --refresh-token [--write]     # 60일 토큰 연장 (Instagram 로그인형만)
//
// 세트 하나 = assets/instagram/<slug>/ 폴더:
//   card-1.jpg … card-N.jpg   순서대로 캐러셀 (2~10장, 1장이면 단일 게시물). JPEG만.
//   caption.txt               캡션 전문. 없으면 게시 안 함.
//
// 이미지는 Instagram이 **공개 URL**에서 가져간다. 이 레포가 public이라
// raw.githubusercontent.com/<repo>/main/assets/instagram/<slug>/card-N.jpg 를 그대로 준다.
// → 게시 전에 그 세트가 main에 **푸시돼 있어야** 한다. 스크립트가 HEAD로 확인한다.
//
// 환경변수 (.env.local 또는 CI secrets):
//   IG_ACCESS_TOKEN   필수
//   IG_USER_ID        필수 — 인스타 프로페셔널 계정 ID (--whoami로 찾음)
//   IG_GRAPH_HOST     graph.instagram.com (Instagram 로그인형, 기본)
//                     graph.facebook.com  (Unified/Facebook 로그인형 시스템유저 토큰)
//   IG_GRAPH_VERSION  기본 v24.0
//   IG_IMAGE_BASE_URL 기본 raw.githubusercontent.com 경로. 다른 공개 저장소를 쓰면 바꾼다.
//
// 의존성 없음 (Node 20+ fetch).
import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";

const ROOT = resolve(process.cwd());
const ASSETS = join(ROOT, "assets/instagram");
const LEDGER = join(ASSETS, "published.json");
const QUEUE = join(ASSETS, "queue.txt");
const ENV_LOCAL = join(ROOT, ".env.local");

// ── 인자 ──────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const opt = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
const DRY = flag("dry-run");

// ── .env.local 읽기 (dotenv 없이) ──────────────────────────────────────────
if (existsSync(ENV_LOCAL)) {
  for (const line of (await readFile(ENV_LOCAL, "utf8")).split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const TOKEN = process.env.IG_ACCESS_TOKEN;
const USER_ID = process.env.IG_USER_ID;
const HOST = process.env.IG_GRAPH_HOST || "graph.instagram.com";
const VERSION = process.env.IG_GRAPH_VERSION || "v24.0";
const IMAGE_BASE =
  process.env.IG_IMAGE_BASE_URL ||
  "https://raw.githubusercontent.com/hangyeolryu/bloomagain-website/main/assets/instagram";

// ── Graph API ─────────────────────────────────────────────────────────────
async function api(method, path, params = {}) {
  const url = new URL(`https://${HOST}/${VERSION}/${path}`);
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  const res = method === "GET"
    ? await fetch(`${url}?${body}`)
    : await fetch(url, { method, body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) {
    const e = json.error || json;
    throw new Error(`${method} ${path} → ${e.message || JSON.stringify(e)} (code ${e.code ?? res.status}${e.error_subcode ? `/${e.error_subcode}` : ""})`);
  }
  return json;
}
function needToken() {
  if (!TOKEN) throw new Error("IG_ACCESS_TOKEN이 없다. .env.local 또는 환경변수에 넣을 것.");
}

// ── --whoami ──────────────────────────────────────────────────────────────
async function whoami() {
  needToken();
  if (HOST === "graph.instagram.com") {
    const me = await api("GET", "me", { fields: "user_id,username,account_type,name" });
    console.log(me);
    console.log(`\nIG_USER_ID=${me.user_id || me.id}`);
  } else {
    // Facebook/Unified 로그인형: 페이지에 연결된 인스타 계정을 찾는다.
    const pages = await api("GET", "me/accounts", { fields: "name,instagram_business_account{id,username}" });
    console.log(JSON.stringify(pages, null, 2));
    for (const p of pages.data || []) {
      if (p.instagram_business_account) console.log(`\nIG_USER_ID=${p.instagram_business_account.id}  (@${p.instagram_business_account.username}, 페이지 "${p.name}")`);
    }
  }
  if (USER_ID) {
    const acct = await api("GET", USER_ID, { fields: "username,media_count" });
    console.log(`\nIG_USER_ID=${USER_ID} → @${acct.username}, 게시물 ${acct.media_count}개`);
  }
}

// ── --refresh-token ───────────────────────────────────────────────────────
async function refreshToken() {
  needToken();
  if (HOST !== "graph.instagram.com") {
    console.log("시스템유저 토큰(graph.facebook.com)은 만료가 없어 연장할 게 없다.");
    return;
  }
  const r = await api("GET", "refresh_access_token", { grant_type: "ig_refresh_token" });
  const days = Math.round(r.expires_in / 86400);
  console.log(`새 토큰 받음 — ${days}일 뒤 만료`);
  if (flag("write") && existsSync(ENV_LOCAL)) {
    const src = await readFile(ENV_LOCAL, "utf8");
    const out = src.match(/^IG_ACCESS_TOKEN=/m)
      ? src.replace(/^IG_ACCESS_TOKEN=.*$/m, `IG_ACCESS_TOKEN=${r.access_token}`)
      : src + `\nIG_ACCESS_TOKEN=${r.access_token}\n`;
    await writeFile(ENV_LOCAL, out);
    console.log(".env.local 갱신됨");
  } else {
    console.log("(--write를 주면 .env.local에 써 넣는다. CI면 secret IG_ACCESS_TOKEN을 갈아끼울 것)");
    console.log(`IG_ACCESS_TOKEN=${r.access_token}`);
  }
}

// ── 세트 읽기 ─────────────────────────────────────────────────────────────
async function readLedger() {
  return existsSync(LEDGER) ? JSON.parse(await readFile(LEDGER, "utf8")) : {};
}
async function nextFromQueue(ledger) {
  if (!existsSync(QUEUE)) return undefined;
  const slugs = (await readFile(QUEUE, "utf8")).split("\n")
    .map((l) => l.replace(/#.*/, "").trim()).filter(Boolean);
  return slugs.find((s) => !ledger[s]);
}
async function loadSet(slug) {
  const dir = join(ASSETS, slug);
  if (!existsSync(dir)) throw new Error(`세트 폴더가 없다: assets/instagram/${slug}`);
  const files = (await readdir(dir))
    .filter((f) => /^card-\d+\.jpe?g$/.test(f))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
  const pngs = (await readdir(dir)).filter((f) => /^card-\d+\.png$/.test(f));
  if (!files.length) throw new Error(`card-N.jpg가 없다 (${pngs.length ? "png만 있다 — 인스타 API는 JPEG만 받는다. sips -s format jpeg로 바꿀 것" : "빈 폴더"})`);
  if (files.length > 10) throw new Error(`캐러셀은 10장까지 (${files.length}장)`);
  const capPath = join(dir, "caption.txt");
  if (!existsSync(capPath)) throw new Error(`caption.txt가 없다: assets/instagram/${slug}/caption.txt`);
  const caption = (await readFile(capPath, "utf8")).trim();
  if (caption.length > 2200) throw new Error(`캡션이 2,200자를 넘는다 (${caption.length}자)`);
  const tags = (caption.match(/#[^\s#]+/g) || []).length;
  if (tags > 30) throw new Error(`해시태그가 30개를 넘는다 (${tags}개)`);
  const urls = files.map((f) => `${IMAGE_BASE}/${slug}/${f}`);
  return { slug, dir, files, urls, caption, tags };
}

// 공개 URL이 정말 열리는지. 안 열리면 main에 안 올라간 것.
async function checkUrls(set) {
  let dirty = "";
  try { dirty = execSync(`git status --porcelain -- "${set.dir}"`, { cwd: ROOT }).toString().trim(); } catch {}
  if (dirty) console.warn(`⚠️  assets/instagram/${set.slug}에 커밋 안 된 변경이 있다. 인스타는 main에 푸시된 파일을 가져간다.\n${dirty}`);
  for (const u of set.urls) {
    const r = await fetch(u, { method: "HEAD" });
    const ct = r.headers.get("content-type") || "";
    if (!r.ok) throw new Error(`공개 URL이 안 열린다 (${r.status}): ${u}\n→ main에 푸시했는지 확인. raw는 최대 5분 캐시.`);
    if (!/image\/jpe?g/.test(ct)) throw new Error(`JPEG가 아니다 (${ct}): ${u}`);
  }
}

// ── 게시 ──────────────────────────────────────────────────────────────────
async function waitReady(containerId, label) {
  for (let i = 0; i < 60; i++) {
    const s = await api("GET", containerId, { fields: "status_code,status" });
    if (s.status_code === "FINISHED") return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error(`${label} 컨테이너 실패: ${s.status}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`${label} 컨테이너가 5분 안에 준비되지 않았다`);
}

async function publishSet(set) {
  needToken();
  if (!USER_ID) throw new Error("IG_USER_ID가 없다. --whoami로 찾아 넣을 것.");
  let creationId;
  if (set.urls.length === 1) {
    const r = await api("POST", `${USER_ID}/media`, { image_url: set.urls[0], caption: set.caption });
    creationId = r.id;
    await waitReady(creationId, "이미지");
  } else {
    const children = [];
    for (const [i, u] of set.urls.entries()) {
      const r = await api("POST", `${USER_ID}/media`, { image_url: u, is_carousel_item: "true" });
      children.push(r.id);
      console.log(`  ${i + 1}/${set.urls.length} 컨테이너 ${r.id}`);
    }
    for (const [i, id] of children.entries()) await waitReady(id, `${i + 1}장`);
    const r = await api("POST", `${USER_ID}/media`, {
      media_type: "CAROUSEL", children: children.join(","), caption: set.caption,
    });
    creationId = r.id;
    await waitReady(creationId, "캐러셀");
  }
  const pub = await api("POST", `${USER_ID}/media_publish`, { creation_id: creationId });
  const media = await api("GET", pub.id, { fields: "permalink,timestamp" });
  return { media_id: pub.id, permalink: media.permalink, published_at: media.timestamp };
}

// ── main ──────────────────────────────────────────────────────────────────
try {
  if (flag("whoami")) { await whoami(); process.exit(0); }
  if (flag("refresh-token")) { await refreshToken(); process.exit(0); }

  const ledger = await readLedger();
  let slug = opt("slug");
  if (!slug && flag("next")) {
    slug = await nextFromQueue(ledger);
    if (!slug) { console.log("큐에 남은 세트가 없다 (assets/instagram/queue.txt). 할 일 없음."); process.exit(0); }
  }
  if (!slug) {
    console.log("쓰는 법: --slug <폴더> [--dry-run] | --next | --whoami | --refresh-token [--write]");
    process.exit(1);
  }
  if (ledger[slug] && !flag("force")) {
    throw new Error(`${slug}은 이미 올라갔다 (${ledger[slug].permalink || ledger[slug].published_at}). 다시 올리려면 --force.`);
  }

  const set = await loadSet(slug);
  console.log(`세트 ${slug}: ${set.files.length}장, 캡션 ${set.caption.length}자, 해시태그 ${set.tags}개`);
  await checkUrls(set);
  console.log("공개 URL 확인 완료");

  if (DRY) {
    console.log("\n── 캡션 ──\n" + set.caption + "\n── 이미지 ──");
    set.urls.forEach((u) => console.log("  " + u));
    console.log("\n(dry-run: 올리지 않았다)");
    process.exit(0);
  }

  console.log("올리는 중…");
  const result = await publishSet(set);
  ledger[slug] = { ...result, cards: set.files.length };
  await writeFile(LEDGER, JSON.stringify(ledger, null, 2) + "\n");
  console.log(`\n게시 완료: ${result.permalink}\n장부 갱신: assets/instagram/published.json (커밋할 것)`);
} catch (e) {
  console.error("\n❌ " + e.message);
  process.exit(1);
}
