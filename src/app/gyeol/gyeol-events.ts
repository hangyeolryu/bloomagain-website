// 결 유형 테스트 익명 이벤트를 백엔드로 전송 → Firestore 적재 → 어드민이 읽음.
// GA4 로깅과 별개(병행). 무가입이라 개인정보 없음 — phase·유형·유입 소스만.
// fire-and-forget: 실패해도 UX를 막지 않는다. keepalive로 스토어 이동 중에도 전송.

type GyeolPhase = "start" | "complete" | "share" | "download";

export function recordGyeolEvent(phase: GyeolPhase, gyeolType?: string): void {
  if (typeof window === "undefined") return;
  const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
  if (!backendUrl) return; // 백엔드 URL 미설정 시 조용히 스킵 (GA4는 계속 남음)
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
      gyeol_type: gyeolType ?? null,
      source: source ?? null,
      referrer: document.referrer || null,
      path: window.location.pathname,
    });
    fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/gyeol/events`, {
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
