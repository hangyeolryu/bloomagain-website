#!/usr/bin/env node
// Meta 광고 생성 — 스펙 JSON 하나로 캠페인 → 광고 세트 → 크리에이티브 → 광고 순서로 만든다.
// 만드는 것 전부 PAUSED. 켜는 건 대표가 Ads Manager에서 눈으로 확인한 뒤 직접.
//
//   node scripts/meta-ads/create.mjs --dry-run scripts/meta-ads/specs/example.json   # 보낼 페이로드만 출력 (토큰 불필요)
//   node scripts/meta-ads/create.mjs scripts/meta-ads/specs/example.json             # 실제 생성 → ledger.json 기록
//
// 스펙 파일 모양 (specs/example.json 참고):
//   {
//     "campaign": { name, objective, special_ad_categories, ... }      → POST act_X/campaigns
//     "adset":    { name, daily_budget(원 단위), targeting, promoted_object, ... }  → POST act_X/adsets
//     "creative": { name, image(로컬 파일 또는 https URL) 또는 image_hash, object_story_spec }  → POST act_X/adcreatives
//     "ad":       { name }                                               → POST act_X/ads
//   }
// 문자열 값이 "$env:이름" 이면 .env.local / 환경변수 값으로 바꾼다 (META_APP_ID, META_PAGE_ID 등).
// 스펙에 status가 있어도 무시하고 PAUSED로 보낸다. campaign_id/adset_id/creative 연결은 스크립트가 넣는다.
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";
import { ACCOUNT_ID, api, currencyOffset, flag, needAuth, positional, readLedger, writeLedger } from "./lib.mjs";

const DRY = flag("dry-run");
const specPath = positional()[0];
if (!specPath) {
  console.error("사용법: node scripts/meta-ads/create.mjs [--dry-run] <스펙.json>");
  process.exit(1);
}
const spec = JSON.parse(await readFile(resolve(specPath), "utf8"));
for (const k of ["campaign", "adset", "creative", "ad"]) {
  if (!spec[k] || typeof spec[k] !== "object") { console.error(`스펙에 "${k}" 가 없다.`); process.exit(1); }
}

// ── "$env:NAME" 치환. dry-run이면 빠진 값은 자리표시로 두고 경고만, 실제 실행이면 중단. ──
const missingEnv = new Set();
function fill(v) {
  if (typeof v === "string") {
    const m = v.match(/^\$env:([A-Z0-9_]+)$/);
    if (!m) return v;
    const val = process.env[m[1]];
    if (val === undefined || val === "") { missingEnv.add(m[1]); return `<${m[1]} 미설정>`; }
    return val;
  }
  if (Array.isArray(v)) return v.map(fill);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]));
  return v;
}
const S = fill(spec);
if (missingEnv.size) {
  const msg = `.env.local에 없는 값: ${[...missingEnv].join(", ")} — README "앱·페이지 연결" 참고`;
  if (DRY) console.error(`주의: ${msg}\n`); else { console.error(msg); process.exit(1); }
}

// ── 예산 단위: 스펙은 원(통화 단위) 그대로 적고, 통화 offset을 곱해 API 단위로. ──
// 스펙에 currency를 꼭 적는다. 계정 통화와 다르면 중단 — 예산이 100배 틀어지는 걸 막는 안전장치.
// (티타 광고 계정은 USD. 10000을 KRW로 알고 보내면 $10,000/일이 된다.)
if (!S.currency) {
  const msg = "스펙에 currency가 없다. 광고 계정 통화(USD)를 적을 것 — 예산 단위가 통화마다 달라서 생략 못 한다.";
  if (DRY) console.error(`주의: ${msg}\n`); else { console.error(msg); process.exit(1); }
}
let currency = S.currency || "USD";
if (!DRY) {
  needAuth();
  const acct = await api("GET", ACCOUNT_ID, { fields: "name,currency,account_status" });
  currency = acct.currency;
  if (S.currency !== currency) {
    console.error(`스펙의 currency(${S.currency})와 광고 계정 통화(${currency})가 다르다. 스펙을 고칠 것.`);
    process.exit(1);
  }
  console.log(`광고 계정  ${acct.name} (${ACCOUNT_ID}) · ${currency}\n`);
}
const offset = currencyOffset(currency);
const toApiBudget = (n) => (n === undefined ? undefined : Math.round(Number(n) * offset));

// ── 페이로드 조립 ────────────────────────────────────────────────────────
const strip = (o, keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));

const campaignPayload = {
  ...strip(S.campaign, ["status", "daily_budget", "lifetime_budget"]),
  special_ad_categories: S.campaign.special_ad_categories ?? [],
  daily_budget: toApiBudget(S.campaign.daily_budget),
  lifetime_budget: toApiBudget(S.campaign.lifetime_budget),
  status: "PAUSED",
};

const adsetPayload = {
  ...strip(S.adset, ["status", "campaign_id", "daily_budget", "lifetime_budget"]),
  daily_budget: toApiBudget(S.adset.daily_budget),
  lifetime_budget: toApiBudget(S.adset.lifetime_budget),
  campaign_id: "<campaign_id>",
  status: "PAUSED",
};

// 이미지: image_hash 직접 / 로컬 파일(업로드해서 hash) / https URL(link_data.picture 로 그대로)
const img = S.creative.image;
let imageMode = "none";
if (S.creative.image_hash) imageMode = "hash";
else if (typeof img === "string" && /^https?:\/\//.test(img)) imageMode = "url";
else if (typeof img === "string") {
  if (!existsSync(resolve(img))) { console.error(`이미지 파일이 없다: ${img}`); process.exit(1); }
  imageMode = "file";
}
const creativePayload = (() => {
  const c = strip(S.creative, ["image", "image_hash", "status"]);
  const oss = structuredClone(c.object_story_spec || {});
  if (oss.link_data) {
    if (imageMode === "hash") oss.link_data.image_hash = S.creative.image_hash;
    if (imageMode === "file") oss.link_data.image_hash = "<업로드 후 image_hash>";
    if (imageMode === "url") oss.link_data.picture = img;
  }
  return { ...c, object_story_spec: oss };
})();

const adPayload = {
  ...strip(S.ad, ["status", "adset_id", "creative"]),
  adset_id: "<adset_id>",
  creative: { creative_id: "<creative_id>" },
  status: "PAUSED",
};

const show = (title, path, p) => {
  console.log(`── POST ${path}  (${title})`);
  console.log(JSON.stringify(p, null, 2));
  console.log();
};
show("캠페인", `${ACCOUNT_ID || "act_<META_AD_ACCOUNT_ID>"}/campaigns`, campaignPayload);
show("광고 세트", `${ACCOUNT_ID || "act_<META_AD_ACCOUNT_ID>"}/adsets`, adsetPayload);
if (imageMode === "file") console.log(`── POST ${ACCOUNT_ID || "act_<META_AD_ACCOUNT_ID>"}/adimages  (이미지 업로드: ${img})\n`);
show("크리에이티브", `${ACCOUNT_ID || "act_<META_AD_ACCOUNT_ID>"}/adcreatives`, creativePayload);
show("광고", `${ACCOUNT_ID || "act_<META_AD_ACCOUNT_ID>"}/ads`, adPayload);
console.log(`예산 단위: ${currency} offset ${offset} (스펙의 ${S.adset.daily_budget ?? S.campaign.daily_budget ?? "-"} → API ${adsetPayload.daily_budget ?? campaignPayload.daily_budget ?? "-"})`);

if (DRY) { console.log("\n--dry-run: API를 부르지 않았다. 위 페이로드가 그대로 나간다 (status 전부 PAUSED)."); process.exit(0); }

// ── 실제 생성. 하나 만들 때마다 장부에 적어서 중간에 실패해도 어디까지 됐는지 남긴다. ──
// --resume: 같은 스펙으로 중간에 실패한 마지막 장부 항목을 이어서 만든다 (이미 있는 캠페인·세트·크리에이티브는 다시 안 만든다).
const ledger = await readLedger();
const RESUME = flag("resume");
let entry = RESUME ? [...ledger].reverse().find((e) => e.spec === basename(specPath) && e.error && !e.ad_id) : undefined;
if (RESUME && !entry) { console.error("--resume: 이어서 만들 실패 항목이 장부에 없다."); process.exit(1); }
if (entry) { delete entry.error; entry.resumed_at = new Date().toISOString(); console.log(`이어서 만든다 (캠페인 ${entry.campaign_id || "-"} · 세트 ${entry.adset_id || "-"} · 크리에이티브 ${entry.creative_id || "-"})\n`); }
else { entry = { created_at: new Date().toISOString(), spec: basename(specPath), account: ACCOUNT_ID, currency, name: S.campaign.name, status: "PAUSED" }; ledger.push(entry); }
const save = () => writeLedger(ledger);

try {
  const c = entry.campaign_id ? { id: entry.campaign_id } : await api("POST", `${ACCOUNT_ID}/campaigns`, campaignPayload);
  entry.campaign_id = c.id; await save();
  console.log(`캠페인      ${c.id}`);

  const s = entry.adset_id ? { id: entry.adset_id } : await api("POST", `${ACCOUNT_ID}/adsets`, { ...adsetPayload, campaign_id: c.id });
  entry.adset_id = s.id; await save();
  console.log(`광고 세트   ${s.id}`);

  if (imageMode === "file" && !entry.creative_id) {
    const bytes = (await readFile(resolve(img))).toString("base64");
    const up = await api("POST", `${ACCOUNT_ID}/adimages`, { bytes });
    const first = Object.values(up.images || {})[0];
    if (!first?.hash) throw new Error(`이미지 업로드 응답에 hash가 없다: ${JSON.stringify(up)}`);
    creativePayload.object_story_spec.link_data.image_hash = first.hash;
    entry.image_hash = first.hash; await save();
    console.log(`이미지      ${first.hash}`);
  }

  const cr = entry.creative_id ? { id: entry.creative_id } : await api("POST", `${ACCOUNT_ID}/adcreatives`, creativePayload);
  entry.creative_id = cr.id; await save();
  console.log(`크리에이티브 ${cr.id}`);

  const ad = await api("POST", `${ACCOUNT_ID}/ads`, { ...adPayload, adset_id: s.id, creative: { creative_id: cr.id } });
  entry.ad_id = ad.id; await save();
  console.log(`광고        ${ad.id}`);

  console.log(`\n전부 PAUSED로 만들었다. Ads Manager에서 타깃·예산·미리보기 확인 뒤 직접 켤 것.
https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${ACCOUNT_ID.replace("act_", "")}`);
} catch (err) {
  entry.error = String(err.message); await save();
  console.error(`\n실패: ${err.message}`);
  if (err.body) console.error(JSON.stringify(err.body, null, 2));
  console.error(`여기까지 만들어진 ID는 scripts/meta-ads/ledger.json 에 있다. 원인 고친 뒤 같은 명령에 --resume 을 붙이면 거기서부터 이어서 만든다.`);
  process.exit(1);
}
