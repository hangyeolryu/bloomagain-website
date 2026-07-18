// 결 유형 테스트 익명 이벤트를 백엔드로 전송 → Firestore 적재 → 어드민이 읽음.
// GA4 로깅과 별개(병행). 무가입이라 개인정보 없음 — phase·유형·유입 소스만.
// fire-and-forget: 실패해도 UX를 막지 않는다. keepalive로 스토어 이동 중에도 전송.

// intro_download = 인트로에서 테스트 건너뛰고 바로 앱 받기 클릭(강한 신호).
type GyeolPhase = "start" | "complete" | "share" | "download" | "intro_download";

// 성별·편안함은 익명 집계용(개인식별 X). gender: "f"|"m", comfort: "same"|"any"|"opp".
// complete 시점에 함께 보내고, download 시점엔 sessionStorage에서 읽어 이어붙인다.
// store: 다운로드 클릭 시 어느 스토어 버튼인지("ios"|"android"). 스토어별 집계용.
type GyeolExtra = { gender?: string | null; comfort?: string | null; store?: string | null };

// 익명 세션 ID — 개인식별 아님. 한 번의 테스트(탭 세션)를 시작→완료→다운클릭으로
// 묶어 어드민이 '한 명이 어디까지 갔나'를 볼 수 있게 한다. sessionStorage라
// 탭을 닫으면 사라진다(재방문=새 세션). 저장 실패해도 이벤트는 계속 보낸다.
// 인앱 브라우저(인스타·페북·카톡·네이버·라인) 감지. 이 안에서는 스토어 앱으로
// 핸드오프가 자주 깨져 "다운클릭했는데 설치 안 됨" 누수의 주범 — 이벤트에 실어
// 어드민이 "인앱에서 다운클릭한 비율"을 집계할 수 있게 한다.
function isInAppBrowser(): boolean {
  try {
    const ua = navigator.userAgent || "";
    return /Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|NAVER\(inapp|Line\//.test(ua);
  } catch {
    return false;
  }
}

function getGyeolSessionId(): string | null {
  try {
    const KEY = "gyeol_sid";
    let sid = window.sessionStorage.getItem(KEY);
    if (!sid) {
      sid =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.sessionStorage.setItem(KEY, sid);
    }
    return sid;
  } catch {
    return null;
  }
}

export function recordGyeolEvent(
  phase: GyeolPhase,
  gyeolType?: string,
  extra?: GyeolExtra,
): void {
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
      gender: extra?.gender ?? null,
      comfort: extra?.comfort ?? null,
      store: extra?.store ?? null,
      source: source ?? null,
      referrer: document.referrer || null,
      path: window.location.pathname,
      session_id: getGyeolSessionId(),
      in_app: isInAppBrowser(),
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
