// 티타임 가격 스모크 테스트 — 이벤트 로깅 + 가격 암(arm) 배정.
//
// 질문: "45+가 유료 티타임에 신청 의사가 있는가"는 인터뷰로 답이 안 나온다
// (예의상 '네'). 행동으로만 답이 나온다 → 방문자를 가격 암에 랜덤 배정하고
// '이 자리 신청하기' 클릭률을 암별로 비교한다 (fake-door: 실제 결제는 없고
// 클릭 후 "신청은 앱에서" 안내 → 다운로드 퍼널로 연결).
//
// gyeol-events.ts와 같은 패턴: fire-and-forget, keepalive, 익명.

export type TitatimePhase = "view" | "apply" | "download";

// ── 가격 암 — 실험 조정은 여기만 고치면 된다 ──────────────────────────
// 암을 빼거나(예: 트래픽이 적으면 2개로) 가격을 바꾸면 새 방문자부터 적용.
// key는 이벤트에 그대로 남으니 짧고 안정적으로 유지할 것.
export const PRICE_ARMS = [
  { key: "free", priceLabel: "참가비 무료", subLabel: "첫 모임 한정" },
  { key: "9900", priceLabel: "참가비 9,900원", subLabel: "차 한 잔 · 다과 포함" },
  { key: "19000", priceLabel: "참가비 19,000원", subLabel: "차 · 다과 · 결 맞춤 편성" },
] as const;
export type PriceArmKey = (typeof PRICE_ARMS)[number]["key"];

const ARM_STORAGE_KEY = "tita_titatime_price_arm";

// 방문자당 1개 암을 배정하고 localStorage에 고정한다(재방문에도 같은 가격을
// 봐야 데이터가 오염되지 않는다). 저장이 막히면 세션 내 변수로만 유지.
let memoryArm: PriceArmKey | null = null;

export function getPriceArm(): PriceArmKey {
  if (typeof window === "undefined") return PRICE_ARMS[0].key;
  try {
    const saved = window.localStorage.getItem(ARM_STORAGE_KEY);
    if (saved && PRICE_ARMS.some((a) => a.key === saved)) {
      return saved as PriceArmKey;
    }
    const pick = PRICE_ARMS[Math.floor(Math.random() * PRICE_ARMS.length)].key;
    window.localStorage.setItem(ARM_STORAGE_KEY, pick);
    return pick;
  } catch {
    if (!memoryArm) {
      memoryArm = PRICE_ARMS[Math.floor(Math.random() * PRICE_ARMS.length)].key;
    }
    return memoryArm;
  }
}

export function armLabel(key: PriceArmKey) {
  return PRICE_ARMS.find((a) => a.key === key) ?? PRICE_ARMS[0];
}

export function recordTitatimeEvent(
  phase: TitatimePhase,
  extra?: { priceArm?: string; district?: string; store?: string },
): void {
  if (typeof window === "undefined") return;
  const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
  if (!backendUrl) return; // 미설정 시 조용히 스킵 (GA4는 별도로 남음)
  try {
    const params = new URLSearchParams(window.location.search);
    let source = params.get("utm_source") || params.get("source");
    if (!source && document.referrer) {
      try {
        source = new URL(document.referrer).hostname;
      } catch {
        /* ignore malformed referrer */
      }
    }
    const body = JSON.stringify({
      phase,
      price_arm: extra?.priceArm ?? null,
      district: extra?.district ?? null,
      store: extra?.store ?? null,
      source: source ?? null,
      referrer: document.referrer || null,
      path: window.location.pathname,
    });
    fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/titatime/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* swallow — analytics must never break the flow */
    });
  } catch {
    /* swallow */
  }
}
