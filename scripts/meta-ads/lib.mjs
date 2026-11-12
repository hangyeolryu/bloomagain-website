// Meta Marketing API 공용 헬퍼 — scripts/meta-ads/*.mjs 가 같이 쓴다.
//
// 환경변수 (.env.local 또는 환경변수. 시크릿 쓰기는 사람이 직접):
//   META_ADS_TOKEN        비즈니스 관리자 시스템 사용자 토큰 (ads_management, ads_read)
//   META_AD_ACCOUNT_ID    광고 계정 ID. "act_" 없이 숫자만 넣어도 붙여 준다
//   META_GRAPH_VERSION    기본 v24.0 (v21 이상이면 된다)
//
// 토큰은 요청 파라미터로만 보내고 로그·에러·장부 어디에도 남기지 않는다.
// 의존성 없음 (Node 20+ fetch).
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(process.cwd());
export const HERE = dirname(fileURLToPath(import.meta.url));
export const LEDGER = join(HERE, "ledger.json");
const ENV_LOCAL = join(ROOT, ".env.local");

// ── .env.local 읽기 (dotenv 없이, publish.mjs와 같은 방식) ─────────────────
if (existsSync(ENV_LOCAL)) {
  for (const line of (await readFile(ENV_LOCAL, "utf8")).split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const TOKEN = process.env.META_ADS_TOKEN;
export const VERSION = process.env.META_GRAPH_VERSION || "v24.0";
export const HOST = "graph.facebook.com";
export const ACCOUNT_ID = (() => {
  const raw = (process.env.META_AD_ACCOUNT_ID || "").trim();
  if (!raw) return undefined;
  return raw.startsWith("act_") ? raw : `act_${raw}`;
})();

export const HELP_ENV =
  "META_ADS_TOKEN(시스템 사용자 토큰)과 META_AD_ACCOUNT_ID(광고 계정 ID)를 .env.local에 넣을 것 — 받는 법은 scripts/meta-ads/README.md";

/** 토큰·계정 ID가 없으면 한 줄 안내하고 종료. 읽기든 쓰기든 API를 부르기 전에 호출. */
export function needAuth() {
  const missing = [];
  if (!TOKEN) missing.push("META_ADS_TOKEN");
  if (!ACCOUNT_ID) missing.push("META_AD_ACCOUNT_ID");
  if (missing.length) {
    console.error(`${missing.join("·")} 없음 — ${HELP_ENV}`);
    process.exit(1);
  }
}

/** 혹시 토큰이 문자열에 섞여 들어와도 밖으로 안 나가게. */
export function redact(s) {
  return TOKEN && typeof s === "string" ? s.split(TOKEN).join("<META_ADS_TOKEN>") : s;
}

/** API 에러. Meta가 준 본문을 그대로 들고 있어서 호출한 쪽이 원인을 읽을 수 있다. */
export class GraphError extends Error {
  constructor(method, path, status, body) {
    const e = body?.error || body || {};
    const bits = [
      e.message || `HTTP ${status}`,
      e.code !== undefined ? `code ${e.code}${e.error_subcode ? `/${e.error_subcode}` : ""}` : null,
      e.error_user_title ? `${e.error_user_title}: ${e.error_user_msg || ""}` : null,
      e.fbtrace_id ? `fbtrace ${e.fbtrace_id}` : null,
    ].filter(Boolean);
    super(redact(`${method} ${path} → ${bits.join(" · ")}`));
    this.name = "GraphError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Graph API 한 번 호출. GET은 쿼리, POST는 폼 본문. 객체·배열 값은 JSON 문자열로 넣는다
 * (targeting, promoted_object, object_story_spec 등 Marketing API가 그렇게 받는다).
 */
export async function api(method, path, params = {}) {
  const url = new URL(`https://${HOST}/${VERSION}/${path}`);
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    form.set(k, typeof v === "object" ? JSON.stringify(v) : String(v));
  }
  form.set("access_token", TOKEN);
  let res;
  try {
    res = method === "GET"
      ? await fetch(`${url}?${form}`)
      : await fetch(url, { method, body: form });
  } catch (err) {
    throw new Error(redact(`${method} ${path} → 네트워크 오류: ${err.message}`));
  }
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok || json.error) throw new GraphError(method, path, res.status, json);
  return json;
}

/** 페이지네이션 끝까지 모아서 배열로. `limit`는 한 페이지 크기. */
export async function getAll(path, params = {}, { max = 5000 } = {}) {
  const out = [];
  let page = await api("GET", path, { limit: 100, ...params });
  for (;;) {
    for (const row of page.data || []) {
      out.push(row);
      if (out.length >= max) return out;
    }
    const after = page.paging?.cursors?.after;
    if (!page.paging?.next || !after) return out;
    page = await api("GET", path, { limit: 100, ...params, after });
  }
}

// ── 장부 (생성된 개체 ID 기록. 토큰·시크릿은 절대 안 들어간다) ─────────────
export async function readLedger() {
  if (!existsSync(LEDGER)) return [];
  try { return JSON.parse(await readFile(LEDGER, "utf8")); } catch { return []; }
}
export async function writeLedger(entries) {
  await writeFile(LEDGER, JSON.stringify(entries, null, 2) + "\n");
}

// ── 인자 ──────────────────────────────────────────────────────────────────
export const argv = process.argv.slice(2);
export const flag = (n) => argv.includes(`--${n}`);
export const opt = (n, dflt) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : dflt; };
/** `--opt value` 꼴의 값 옵션 이름을 넘기면 그 값을 빼고, `--`로 안 시작하는 인자만 돌려준다. */
export const positional = (valueOpts = []) => argv.filter((a, i) => !a.startsWith("--") && !valueOpts.includes(argv[i - 1]));

// ── 표 출력 (한글 폭 맞춤) ────────────────────────────────────────────────
function cellWidth(s) {
  let w = 0;
  for (const ch of String(s)) {
    const c = ch.codePointAt(0);
    w += (c >= 0x1100 && (c <= 0x115f || (c >= 0x2e80 && c <= 0xa4cf) || (c >= 0xac00 && c <= 0xd7a3) || (c >= 0xf900 && c <= 0xfaff) || (c >= 0xfe30 && c <= 0xfe4f) || (c >= 0xff00 && c <= 0xff60) || (c >= 0xffe0 && c <= 0xffe6))) ? 2 : 1;
  }
  return w;
}
function pad(s, w, right = false) {
  const str = String(s ?? "");
  const gap = Math.max(0, w - cellWidth(str));
  return right ? " ".repeat(gap) + str : str + " ".repeat(gap);
}
/** rows: 객체 배열. cols: [{key, label, right?}] */
export function printTable(rows, cols) {
  if (!rows.length) { console.log("  (없음)"); return; }
  const widths = cols.map((c) => Math.max(cellWidth(c.label), ...rows.map((r) => cellWidth(r[c.key] ?? ""))));
  const line = (r) => "  " + cols.map((c, i) => pad(r[c.key], widths[i], c.right)).join("  ");
  console.log(line(Object.fromEntries(cols.map((c) => [c.key, c.label]))));
  console.log("  " + widths.map((w) => "-".repeat(w)).join("  "));
  for (const r of rows) console.log(line(r));
}

export const fmtInt = (n) => (n === undefined || n === null || n === "" ? "-" : Math.round(Number(n)).toLocaleString("ko-KR"));
export const fmtMoney = (n) => (n === undefined || n === null || n === "" ? "-" : Number(n).toLocaleString("ko-KR", { maximumFractionDigits: 0 }));

// ── Meta가 통화별로 예산 단위를 다르게 받는다 (원 단위 ↔ API 단위) ───────────
// 대부분 통화는 최소 단위(센트)라 100배, 아래 통화는 1배. KRW는 1배 — 즉 10,000원이면 10000.
// 생성 뒤 Ads Manager에서 일 예산이 의도한 금액으로 보이는지 꼭 확인할 것.
const OFFSET_ONE = new Set(["KRW", "JPY", "TWD", "VND", "CLP", "COP", "HUF", "ISK", "PYG"]);
export const currencyOffset = (cur) => (OFFSET_ONE.has(String(cur).toUpperCase()) ? 1 : 100);

export const ACCOUNT_STATUS = {
  1: "ACTIVE", 2: "DISABLED", 3: "UNSETTLED", 7: "PENDING_RISK_REVIEW", 8: "PENDING_SETTLEMENT",
  9: "IN_GRACE_PERIOD", 100: "PENDING_CLOSURE", 101: "CLOSED", 201: "ANY_ACTIVE", 202: "ANY_CLOSED",
};
