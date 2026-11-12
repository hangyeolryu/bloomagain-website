#!/usr/bin/env node
// Meta 광고 현황 — 읽기 전용. 아무것도 바꾸지 않는다.
//
//   node scripts/meta-ads/status.mjs                 # 계정 · 캠페인/세트/광고 · 최근 7일 인사이트
//   node scripts/meta-ads/status.mjs --days 30       # 최근 30일
//   node scripts/meta-ads/status.mjs --level ad      # 인사이트를 광고 단위로 (기본 campaign. adset도 됨)
//   node scripts/meta-ads/status.mjs --all           # 보관(ARCHIVED)·삭제된 것까지 목록에
//
// 필요: META_ADS_TOKEN(ads_read 이상), META_AD_ACCOUNT_ID — scripts/meta-ads/README.md
import { ACCOUNT_ID, ACCOUNT_STATUS, api, currencyOffset, flag, fmtInt, fmtMoney, getAll, needAuth, opt, printTable } from "./lib.mjs";

needAuth();

const DAYS = Math.max(1, parseInt(opt("days", "7"), 10) || 7);
const LEVEL = opt("level", "campaign");
if (!["campaign", "adset", "ad"].includes(LEVEL)) { console.error("--level 은 campaign | adset | ad"); process.exit(1); }
const INCLUDE_ALL = flag("all");

const ymd = (d) => d.toISOString().slice(0, 10);
const until = new Date(); // 오늘
const since = new Date(until.getTime() - (DAYS - 1) * 86400_000);

// ── 1. 광고 계정 ──────────────────────────────────────────────────────────
const acct = await api("GET", ACCOUNT_ID, {
  fields: "name,currency,account_status,disable_reason,timezone_name,amount_spent,balance,spend_cap",
});
const offset = currencyOffset(acct.currency);
const money = (raw) => (raw === undefined ? "-" : fmtMoney(Number(raw) / offset));
console.log(`광고 계정  ${acct.name} (${ACCOUNT_ID})`);
console.log(`상태       ${ACCOUNT_STATUS[acct.account_status] || acct.account_status}${acct.disable_reason ? ` (사유 코드 ${acct.disable_reason})` : ""}`);
console.log(`통화       ${acct.currency} · 시간대 ${acct.timezone_name}`);
console.log(`누적 지출  ${money(acct.amount_spent)} ${acct.currency}${acct.spend_cap && acct.spend_cap !== "0" ? ` · 지출 한도 ${money(acct.spend_cap)}` : ""}`);
console.log();

// ── 2. 캠페인 · 세트 · 광고 목록 ──────────────────────────────────────────
// 기본은 삭제·보관 빼고. --all 이면 전부.
const filtering = INCLUDE_ALL ? undefined : [{ field: "effective_status", operator: "NOT_IN", value: ["DELETED", "ARCHIVED"] }];

const campaigns = await getAll(`${ACCOUNT_ID}/campaigns`, {
  fields: "id,name,status,effective_status,objective,daily_budget,lifetime_budget,created_time",
  filtering,
});
console.log(`캠페인 ${campaigns.length}개`);
printTable(
  campaigns.map((c) => ({
    id: c.id, name: c.name, status: c.effective_status || c.status, objective: c.objective,
    budget: c.daily_budget ? `${money(c.daily_budget)}/일` : c.lifetime_budget ? `${money(c.lifetime_budget)} 총` : "세트별",
    created: (c.created_time || "").slice(0, 10),
  })),
  [{ key: "id", label: "ID" }, { key: "name", label: "이름" }, { key: "status", label: "상태" }, { key: "objective", label: "목표" }, { key: "budget", label: "예산", right: true }, { key: "created", label: "생성" }],
);
console.log();

const adsets = await getAll(`${ACCOUNT_ID}/adsets`, {
  fields: "id,name,status,effective_status,campaign_id,daily_budget,lifetime_budget,optimization_goal,billing_event,targeting{age_min,age_max,genders,geo_locations,user_os}",
  filtering,
});
const campName = Object.fromEntries(campaigns.map((c) => [c.id, c.name]));
const tgt = (t = {}) => {
  const g = { 1: "남", 2: "여" };
  const bits = [];
  if (t.geo_locations?.countries) bits.push(t.geo_locations.countries.join(","));
  if (t.genders) bits.push(t.genders.map((x) => g[x] || x).join(""));
  if (t.age_min || t.age_max) bits.push(`${t.age_min ?? ""}-${t.age_max ?? ""}`);
  if (t.user_os) bits.push(t.user_os.join("/"));
  return bits.join(" ");
};
console.log(`광고 세트 ${adsets.length}개`);
printTable(
  adsets.map((s) => ({
    id: s.id, name: s.name, status: s.effective_status || s.status, campaign: campName[s.campaign_id] || s.campaign_id,
    budget: s.daily_budget ? `${money(s.daily_budget)}/일` : s.lifetime_budget ? `${money(s.lifetime_budget)} 총` : "캠페인",
    goal: s.optimization_goal, target: tgt(s.targeting),
  })),
  [{ key: "id", label: "ID" }, { key: "name", label: "이름" }, { key: "status", label: "상태" }, { key: "campaign", label: "캠페인" }, { key: "budget", label: "예산", right: true }, { key: "goal", label: "최적화" }, { key: "target", label: "타깃" }],
);
console.log();

const ads = await getAll(`${ACCOUNT_ID}/ads`, { fields: "id,name,status,effective_status,adset_id,creative{id}", filtering });
const adsetName = Object.fromEntries(adsets.map((s) => [s.id, s.name]));
console.log(`광고 ${ads.length}개`);
printTable(
  ads.map((a) => ({ id: a.id, name: a.name, status: a.effective_status || a.status, adset: adsetName[a.adset_id] || a.adset_id, creative: a.creative?.id || "-" })),
  [{ key: "id", label: "ID" }, { key: "name", label: "이름" }, { key: "status", label: "상태" }, { key: "adset", label: "세트" }, { key: "creative", label: "크리에이티브" }],
);
console.log();

// ── 3. 인사이트 ──────────────────────────────────────────────────────────
// spend는 통화 단위 그대로(원). 앱설치는 actions[].action_type == mobile_app_install.
const INSTALL_TYPES = ["mobile_app_install", "omni_app_install", "app_install"];
const installsOf = (row) => {
  for (const t of INSTALL_TYPES) {
    const a = (row.actions || []).find((x) => x.action_type === t);
    if (a) return Number(a.value) || 0;
  }
  return 0;
};
const nameKey = { campaign: "campaign_name", adset: "adset_name", ad: "ad_name" }[LEVEL];
const rows = await getAll(`${ACCOUNT_ID}/insights`, {
  level: LEVEL,
  fields: `campaign_name,adset_name,ad_name,spend,impressions,clicks,actions`,
  time_range: { since: ymd(since), until: ymd(until) },
  limit: 500,
});
console.log(`최근 ${DAYS}일 (${ymd(since)} ~ ${ymd(until)}) · ${LEVEL} 단위 · 통화 ${acct.currency}`);
const tot = { spend: 0, impressions: 0, clicks: 0, installs: 0 };
const table = rows.map((r) => {
  const spend = Number(r.spend) || 0, imp = Number(r.impressions) || 0, clk = Number(r.clicks) || 0, inst = installsOf(r);
  tot.spend += spend; tot.impressions += imp; tot.clicks += clk; tot.installs += inst;
  return {
    name: r[nameKey] || r.campaign_name, spend: fmtMoney(spend), impressions: fmtInt(imp), clicks: fmtInt(clk),
    ctr: imp ? (clk / imp * 100).toFixed(2) + "%" : "-", installs: fmtInt(inst), cpi: inst ? fmtMoney(spend / inst) : "-",
  };
});
if (rows.length) {
  table.push({
    name: "합계", spend: fmtMoney(tot.spend), impressions: fmtInt(tot.impressions), clicks: fmtInt(tot.clicks),
    ctr: tot.impressions ? (tot.clicks / tot.impressions * 100).toFixed(2) + "%" : "-",
    installs: fmtInt(tot.installs), cpi: tot.installs ? fmtMoney(tot.spend / tot.installs) : "-",
  });
}
printTable(table, [
  { key: "name", label: LEVEL === "campaign" ? "캠페인" : LEVEL === "adset" ? "세트" : "광고" },
  { key: "spend", label: "지출", right: true }, { key: "impressions", label: "노출", right: true }, { key: "clicks", label: "클릭", right: true },
  { key: "ctr", label: "CTR", right: true }, { key: "installs", label: "앱설치", right: true }, { key: "cpi", label: "CPI", right: true },
]);
if (!rows.length) console.log("  (이 기간에 집행된 광고가 없다)");
