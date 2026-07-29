// 니즈 설문("요즘 나에게 필요한 것") 익명 이벤트 → 백엔드 → Firestore
// `needs_survey_events`. 결큐(gyeol-events)와 같은 태도(fire-and-forget)지만
// 컬렉션·엔드포인트를 분리해 결큐 통계와 섞이지 않는다.
// 겉은 테스트, 속은 수요 설문 — 답 하나하나가 광고·제품 조준 데이터.

type NeedsPhase = "start" | "answer" | "abandon" | "complete" | "download" | "share";

export type NeedsAnswers = {
  // answer 이벤트 전용 — 어느 질문·몇 번째에 답했나 (질문별 이탈 파악)
  q?: string | null;
  step?: number | null;
  // start 전용 — 도착~인터랙티브(JS 준비) 지연 ms ("죽은 탭" 가설 검증)
  hydMs?: number | null;
  timeuse?: string | null; // tv | solo_out | hobby_alone | with_people | drift | other ⭐실태(경쟁자 조사)
  moment?: string | null; // meal | walk | talk | weekend | other
  situation?: string | null; // empty_nest | divorce | bereave | retire | no_change | other ⭐5060 세그먼트
  activity?: string | null; // walk | tea | hobby | chat | other  ⭐수요 핵심
  person?: string | null; // same | any | calm | lively | other
  worry?: string | null; // scam | awkward | time | none | other  ⭐광고 각도
  funnel?: string | null; // online | offline | other
  gender?: string | null; // f | m | na (결큐와 동일 코드)
  ageBand?: string | null; // under45 | 45-49 | 50-54 | 55-59 | 60-64 | 65plus (+구버전 45-54|55-64)
  store?: string | null; // ios | android (download 시)
  // "또는, 직접 쓸게요" 원문 — 해당 문항이 "other"일 때. 보기 밖 수요 발굴용.
  timeuseText?: string | null;
  momentText?: string | null;
  situationText?: string | null;
  activityText?: string | null;
  personText?: string | null;
  worryText?: string | null;
  funnelText?: string | null;
};

function isInAppBrowser(): boolean {
  try {
    const ua = navigator.userAgent || "";
    return /Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|NAVER\(inapp|Line\//.test(ua);
  } catch {
    return false;
  }
}

function getNeedsSessionId(): string | null {
  try {
    const KEY = "needs_sid";
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

export function recordNeedsEvent(phase: NeedsPhase, answers?: NeedsAnswers): void {
  if (typeof window === "undefined") return;
  const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
  if (!backendUrl) return;
  try {
    const params = new URLSearchParams(window.location.search);
    let source = params.get("utm_source") || params.get("source");
    if (!source && document.referrer) {
      try {
        source = new URL(document.referrer).hostname;
      } catch {
        /* ignore */
      }
    }
    const body = JSON.stringify({
      phase,
      q: answers?.q ?? null,
      step: answers?.step ?? null,
      hyd_ms: answers?.hydMs ?? null,
      timeuse: answers?.timeuse ?? null,
      moment: answers?.moment ?? null,
      situation: answers?.situation ?? null,
      activity: answers?.activity ?? null,
      person: answers?.person ?? null,
      worry: answers?.worry ?? null,
      funnel: answers?.funnel ?? null,
      gender: answers?.gender ?? null,
      age_band: answers?.ageBand ?? null,
      store: answers?.store ?? null,
      timeuse_text: answers?.timeuseText ?? null,
      moment_text: answers?.momentText ?? null,
      situation_text: answers?.situationText ?? null,
      activity_text: answers?.activityText ?? null,
      person_text: answers?.personText ?? null,
      worry_text: answers?.worryText ?? null,
      funnel_text: answers?.funnelText ?? null,
      source: source ?? null,
      referrer: document.referrer || null,
      session_id: getNeedsSessionId(),
      in_app: isInAppBrowser(),
    });
    fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/gyeol/needs-events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* analytics must never break the flow */
    });
  } catch {
    /* swallow */
  }
}
