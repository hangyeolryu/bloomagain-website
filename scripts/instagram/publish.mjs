#!/usr/bin/env node
// 인스타그램 캐러셀 자동 게시 — @titakorea
//
//   node scripts/instagram/publish.mjs --slug insight-15 --dry-run   # 올라갈 내용만 보여줌
//   node scripts/instagram/publish.mjs --slug insight-15             # 실제 게시
//   node scripts/instagram/publish.mjs --next                        # queue.txt의 첫 미게시 세트 (크론용)
//   node scripts/instagram/publish.mjs --story insight-16 [--dry-run]  # 폴더의 story.jpg(1080×1920)를 스토리로
//   node scripts/instagram/publish.mjs --whoami                      # 토큰이 누구 건지
//   node scripts/instagram/publish.mjs --refresh-token [--write]     # 60일 토큰 연장 (Instagram 로그인형만)
//   node scripts/instagram/publish.mjs --debug-token                 # 토큰에 붙은 인스타 자산 확인 (META_APP_ID/SECRET 필요)
//   node scripts/instagram/publish.mjs --login-url                   # Unified login 창 주소 (콘솔 Generate token이 빈 토큰을 줄 때)
//   node scripts/instagram/publish.mjs --exchange-code <주소> --write # 로그인 뒤 돌아온 주소의 code → 토큰 → .env.local
//   node scripts/instagram/publish.mjs --ig-login-url                # Business Login for Instagram 창 주소 (IG_APP_ID 필요)
//   node scripts/instagram/publish.mjs --ig-exchange-code <주소> --write # 그 code → 60일 토큰 → .env.local (IG_APP_SECRET 필요)
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
    // Facebook/Unified 로그인형. 시스템 유저 토큰이면 배정된 인스타 자산에서,
    // 일반 사용자 토큰이면 페이지에 연결된 인스타 계정에서 찾는다.
    const me = await api("GET", "me", { fields: "id,name" });
    console.log(`토큰 주인: ${me.name} (${me.id})`);
    let found = 0;
    const assigned = await api("GET", "me/assigned_instagram_accounts", { fields: "id,username" }).catch(() => ({ data: [] }));
    for (const a of assigned.data || []) { found++; console.log(`\nIG_USER_ID=${a.id}  (@${a.username}, 시스템 유저에 배정된 자산)`); }
    const pages = await api("GET", "me/accounts", { fields: "name,instagram_business_account{id,username}" }).catch(() => ({ data: [] }));
    for (const p of pages.data || []) {
      if (p.instagram_business_account) { found++; console.log(`\nIG_USER_ID=${p.instagram_business_account.id}  (@${p.instagram_business_account.username}, 페이지 "${p.name}")`); }
    }
    // business_management 권한이 있으면 포트폴리오의 인스타 계정에서도 찾는다.
    const biz = await api("GET", "me/businesses", { fields: "id,name" }).catch(() => ({ data: [] }));
    for (const b of biz.data || []) {
      for (const edge of ["owned_instagram_accounts", "instagram_accounts"]) {
        const r = await api("GET", `${b.id}/${edge}`, { fields: "id,username" }).catch(() => ({ data: [] }));
        for (const a of r.data || []) { found++; console.log(`\nIG_USER_ID=${a.id}  (@${a.username}, 포트폴리오 "${b.name}")`); }
      }
    }
    if (!found) console.log(`\n⚠️  이 토큰에 배정된 인스타 계정이 없다.
→ business.facebook.com/settings → 사용자 → 시스템 사용자 → "${me.name}" → 자산 추가 → Instagram 계정 → @titakorea 선택(콘텐츠 관리 권한).
  @titakorea가 목록에 없으면 먼저 계정 → Instagram 계정 에서 포트폴리오에 추가한 뒤 다시.`);
  }
  if (USER_ID) {
    const acct = await api("GET", USER_ID, { fields: "username,media_count" });
    console.log(`\nIG_USER_ID=${USER_ID} → @${acct.username}, 게시물 ${acct.media_count}개`);
  }
}

// ── --debug-token: 토큰에 어떤 인스타 자산이 붙었는지 (META_APP_ID·META_APP_SECRET 필요) ──
async function debugToken() {
  needToken();
  const appId = process.env.META_APP_ID, secret = process.env.META_APP_SECRET;
  if (!appId || !secret) throw new Error("META_APP_ID와 META_APP_SECRET이 .env.local에 있어야 한다 (콘솔 App settings → Basic).");
  const u = new URL(`https://graph.facebook.com/${VERSION}/debug_token`);
  u.searchParams.set("input_token", TOKEN);
  u.searchParams.set("access_token", `${appId}|${secret}`);
  const j = await (await fetch(u)).json();
  if (j.error) throw new Error(j.error.message);
  const d = j.data;
  console.log(`종류 ${d.type} · 앱 "${d.application}" · 유효 ${d.is_valid} · 만료 ${d.expires_at ? new Date(d.expires_at * 1000).toISOString() : "없음"}`);
  let bound = 0;
  for (const g of d.granular_scopes || []) {
    const ids = g.target_ids || [];
    if (g.scope.startsWith("instagram")) bound += ids.length;
    console.log(`  ${g.scope.padEnd(32)} ${ids.length ? ids.join(", ") : "(자산 없음)"}`);
  }
  if (!bound) console.log(`\n⚠️  인스타 자산이 하나도 안 붙은 토큰이다. 이 토큰으론 어떤 계정도 못 연다.
→ 비즈니스 설정 → 시스템 사용자 중 인스타 계정이 배정된 유저로 토큰을 다시 뽑을 것 (README "토큰 수명" 참고).`);
  else console.log(`\n이 토큰이 여는 인스타 계정 ID 위 목록 중 하나를 IG_USER_ID에.`);
}

// ── --login-url / --exchange-code: Unified login(Facebook Login for Business) 정식 경로 ──
// 콘솔의 "Generate token" 단추가 자산 없는 빈 토큰을 주는 경우가 있다. 그땐 로그인 창에서
// 비즈니스 관리자가 인스타 계정을 직접 고르게 하고, 돌아온 code를 토큰으로 바꾼다.
const REDIRECT = process.env.IG_REDIRECT_URI || "https://tita-app.com/auth/callback";
function loginUrl() {
  const appId = process.env.META_APP_ID, cfg = process.env.META_LOGIN_CONFIG_ID;
  if (!appId || !cfg) throw new Error("META_APP_ID와 META_LOGIN_CONFIG_ID(콘솔 1단계 Configuration ID)가 .env.local에 있어야 한다.");
  const u = new URL("https://www.facebook.com/v24.0/dialog/oauth");
  u.searchParams.set("client_id", appId);
  u.searchParams.set("config_id", cfg);
  u.searchParams.set("redirect_uri", REDIRECT);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("override_default_response_type", "true");
  console.log(`1) 콘솔 1단계 "Register a new redirect URL"에 아래를 등록(Save):\n   ${REDIRECT}\n2) 브라우저에서 열기 → 비즈니스 TITA · 인스타 titakorea 선택 → 허용:\n   ${u}\n3) 돌아온 주소 전체(…/auth/callback?code=…)를 --exchange-code 에 넘긴다.`);
}
async function exchangeCode(codeOrUrl) {
  const appId = process.env.META_APP_ID, secret = process.env.META_APP_SECRET;
  if (!appId || !secret) throw new Error("META_APP_ID·META_APP_SECRET이 필요하다.");
  let code = codeOrUrl;
  try { const u = new URL(codeOrUrl); code = u.searchParams.get("code") || u.hash.match(/code=([^&]+)/)?.[1] || codeOrUrl; } catch {}
  code = code.replace(/#.*$/, "");
  const u = new URL(`https://graph.facebook.com/${VERSION}/oauth/access_token`);
  u.searchParams.set("client_id", appId); u.searchParams.set("client_secret", secret);
  u.searchParams.set("redirect_uri", REDIRECT); u.searchParams.set("code", code);
  const j = await (await fetch(u)).json();
  if (j.error) throw new Error(`code 교환 실패: ${j.error.message}`);
  console.log(`토큰 받음 (${j.token_type || "bearer"}, 만료 ${j.expires_in ? Math.round(j.expires_in / 86400) + "일" : "없음"})`);
  if (flag("write") && existsSync(ENV_LOCAL)) {
    const src = await readFile(ENV_LOCAL, "utf8");
    const out = src.match(/^IG_ACCESS_TOKEN=/m)
      ? src.replace(/^IG_ACCESS_TOKEN=.*$/m, `IG_ACCESS_TOKEN=${j.access_token}`)
      : src + `\nIG_ACCESS_TOKEN=${j.access_token}\n`;
    await writeFile(ENV_LOCAL, out);
    console.log(".env.local의 IG_ACCESS_TOKEN 갱신됨");
  } else console.log(`IG_ACCESS_TOKEN=${j.access_token}`);
}

// ── --ig-login-url / --ig-exchange-code: Business Login for Instagram (graph.instagram.com) ──
// Unified login이 자산 없는 토큰만 줄 때의 우회로. 인스타 계정에서 직접 허용하므로 자산이 붙는다.
// 필요: IG_APP_ID(콘솔 "API setup with Instagram login"의 Instagram app ID), IG_APP_SECRET(같은 화면).
const IG_SCOPES = "instagram_business_basic,instagram_business_content_publish";
function igLoginUrl() {
  const appId = process.env.IG_APP_ID;
  if (!appId) throw new Error("IG_APP_ID가 .env.local에 있어야 한다.");
  const u = new URL("https://www.instagram.com/oauth/authorize");
  u.searchParams.set("enable_fb_login", "0");
  u.searchParams.set("force_authentication", "1");
  u.searchParams.set("client_id", appId);
  u.searchParams.set("redirect_uri", REDIRECT);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", IG_SCOPES);
  console.log(`1) 콘솔 "API setup with Instagram login" → Business login settings → OAuth redirect URIs에 등록:\n   ${REDIRECT}\n2) 브라우저에서 열기 → titakorea로 로그인 → 허용:\n   ${u}\n3) 돌아온 주소 전체를 --ig-exchange-code 에 넘긴다.`);
}
async function igExchangeCode(codeOrUrl) {
  const appId = process.env.IG_APP_ID, secret = process.env.IG_APP_SECRET;
  if (!appId || !secret) throw new Error("IG_APP_ID·IG_APP_SECRET이 필요하다.");
  let code = codeOrUrl;
  try { code = new URL(codeOrUrl).searchParams.get("code") || codeOrUrl; } catch {}
  code = code.replace(/#.*$/, "");
  const body = new URLSearchParams({ client_id: appId, client_secret: secret, grant_type: "authorization_code", redirect_uri: REDIRECT, code });
  const short = await (await fetch("https://api.instagram.com/oauth/access_token", { method: "POST", body })).json();
  if (short.error_message || short.error) throw new Error(`code 교환 실패: ${short.error_message || JSON.stringify(short.error)}`);
  const lu = new URL("https://graph.instagram.com/access_token");
  lu.searchParams.set("grant_type", "ig_exchange_token"); lu.searchParams.set("client_secret", secret); lu.searchParams.set("access_token", short.access_token);
  const long = await (await fetch(lu)).json();
  if (long.error) throw new Error(`장기 토큰 교환 실패: ${long.error.message}`);
  const mu = new URL("https://graph.instagram.com/me"); mu.searchParams.set("fields", "user_id,username"); mu.searchParams.set("access_token", long.access_token);
  const me = await (await fetch(mu)).json();
  console.log(`토큰 받음 — @${me.username} (user_id ${me.user_id}), ${Math.round(long.expires_in / 86400)}일 뒤 만료`);
  if (flag("write") && existsSync(ENV_LOCAL)) {
    let src = await readFile(ENV_LOCAL, "utf8");
    const set = (k, v) => { src = src.match(new RegExp(`^${k}=`, "m")) ? src.replace(new RegExp(`^${k}=.*$`, "m"), `${k}=${v}`) : src + `\n${k}=${v}`; };
    set("IG_ACCESS_TOKEN", long.access_token); set("IG_GRAPH_HOST", "graph.instagram.com"); set("IG_USER_ID", me.user_id);
    await writeFile(ENV_LOCAL, src.replace(/\n*$/, "\n"));
    console.log(".env.local 갱신됨 (IG_ACCESS_TOKEN · IG_GRAPH_HOST · IG_USER_ID)");
  } else console.log(`IG_ACCESS_TOKEN=${long.access_token}\nIG_GRAPH_HOST=graph.instagram.com\nIG_USER_ID=${me.user_id}`);
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

// ── --story <slug>: assets/instagram/<slug>/story.jpg 를 스토리로 ─────────────
async function publishStory(slug) {
  needToken();
  if (!USER_ID) throw new Error("IG_USER_ID가 없다.");
  const file = join(ASSETS, slug, "story.jpg");
  if (!existsSync(file)) throw new Error(`story.jpg가 없다: assets/instagram/${slug}/story.jpg (1080×1920 JPEG)`);
  const url = `${IMAGE_BASE}/${slug}/story.jpg`;
  const r0 = await fetch(url, { method: "HEAD" });
  if (!r0.ok) throw new Error(`공개 URL이 안 열린다 (${r0.status}): ${url}\n→ main에 푸시했는지 확인.`);
  if (DRY) { console.log(`(dry-run) 스토리 이미지: ${url}`); return; }
  const r = await api("POST", `${USER_ID}/media`, { media_type: "STORIES", image_url: url });
  await waitReady(r.id, "스토리");
  const pub = await api("POST", `${USER_ID}/media_publish`, { creation_id: r.id });
  const ledger = await readLedger();
  ledger[`${slug}#story`] = { media_id: pub.id, published_at: new Date().toISOString(), story: true };
  await writeFile(LEDGER, JSON.stringify(ledger, null, 2) + "\n");
  console.log(`스토리 게시 완료 (media ${pub.id}). 24시간 뒤 사라진다. 장부 갱신됨.`);
}

// ── main ──────────────────────────────────────────────────────────────────
try {
  if (flag("whoami")) { await whoami(); process.exit(0); }
  if (flag("refresh-token")) { await refreshToken(); process.exit(0); }
  if (flag("debug-token")) { await debugToken(); process.exit(0); }
  if (flag("login-url")) { loginUrl(); process.exit(0); }
  if (flag("ig-login-url")) { igLoginUrl(); process.exit(0); }
  if (flag("ig-exchange-code")) { await igExchangeCode(opt("ig-exchange-code")); process.exit(0); }
  if (flag("exchange-code")) { await exchangeCode(opt("exchange-code")); process.exit(0); }

  if (flag("story")) { await publishStory(opt("story")); process.exit(0); }

  const ledger = await readLedger();
  let slug = opt("slug");
  if (!slug && flag("next")) {
    slug = await nextFromQueue(ledger);
    if (!slug) { console.log("큐에 남은 세트가 없다 (assets/instagram/queue.txt). 할 일 없음."); process.exit(0); }
  }
  if (!slug) {
    console.log("쓰는 법: --slug <폴더> [--dry-run] | --story <폴더> | --next | --whoami | --debug-token | --refresh-token [--write]");
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
