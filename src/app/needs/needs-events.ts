// 니즈 설문("요즘 나에게 필요한 것") 익명 이벤트 → 백엔드 → Firestore
// `needs_survey_events`. 결큐(gyeol-events)와 같은 태도(fire-and-forget)지만
// 컬렉션·엔드포인트를 분리해 결큐 통계와 섞이지 않는다.
// 겉은 테스트, 속은 수요 설문 — 답 하나하나가 광고·제품 조준 데이터.

// skip_* = 설문을 건너뛰고 앱만 받는 우회로(2026-08-01). 첫 질문에서 78%가
// 떠나는데 그때까지 다운로드 버튼이 결과 화면에만 있어, 받고 싶어도 받을 데가
// 없었다. download와 별개 phase로 둬서 "완주→다운 41%" 지표가 흐려지지 않게 한다.
type NeedsPhase =
  | "start" | "answer" | "abandon" | "complete" | "download" | "share"
  | "skip_open" | "skip_age" | "skip_download"
  // "티타가 뭔가요?"를 펼쳐 봤다(2026-08-06). answer로 안 세는 이유 — 답을
  // 한 게 아니라서, 섞으면 첫 질문 답변율이 부풀어 오른다.
  | "explain";

export type NeedsAnswers = {
  /** 어느 랜딩인가. /enjoy 같은 새 페이지가 자기 이름을 남긴다. */
  variant?: string | null;
  /** 만나기 편한 동네 (/enjoy 2번 문항). */
  district?: string | null;
  /** 요즘 바깥 활동 (/enjoy 3번 문항). solo_out | want_out | home | has_group.
   *  timeuse와 낱말은 겹치지만 보기가 달라 일부러 다른 칸에 담는다. */
  outing?: string | null;
  /** 자녀 블록(/enjoy, 2026-09-25) — 연령을 답한 45세 이상에게만 묻는다.
   *  답에 따라 다음 질문이 갈리므로 step이 아니라 q로 읽는다. */
  hasChild?: string | null; // yes | no
  childAge?: string | null; // teen | 20s | 30s | 40plus (첫째 기준)
  childMarital?: string | null; // all_single | some_married | all_married (teen이면 안 묻는다)
  childContact?: string | null; // daily | weekly | monthly | rarely
  childRelation?: string | null; // close | ok | distant | complicated | na
  // 결혼 얘기 갈림길(2026-09-26). 미혼 + 30대 이상 자녀를 둔 분께만 묻고,
  // 관심을 보이신 분께만 childSex 를 묻는다.
  childTalk?: string | null; // sometimes | want_no_place | no_thanks
  childSex?: string | null; // son | daughter | both
  noChildStatus?: string | null; // single | couple | divorced | widowed | na
  /** ── 사돈 수요조사 (/sadon/survey, variant "sadon", 2026-09-26) ─────────
   *  문항 원본은 docs/sadon/14_수요조사_문항.md (bloomagain-korea).
   *  2번(아들/딸/둘 다)은 위 childSex를 그대로 쓴다 — 같은 걸 묻는데 칸을
   *  새로 만들면 두 설문을 견줄 수가 없다.
   *  ⚠️ 여기 넣고 아래 payload에 안 실으면, 웹은 멀쩡히 묻고 답만 사라진다. */
  sdHasSingle?: string | null; // yes | no
  sdChildAge?: string | null; // 20s | 30s_early | 30s_late | 40plus
  sdIntent?: string | null; // want | curious | ask_child | reluctant
  sdWhen?: string | null; // asap | months | if_child_agrees | unsure
  sdConditionLine?: string | null; // none | similar | tell_me | most_important
  // 복수 선택 — 서버가 리스트로 받아 보기 밖 값을 버린다
  sdAssurance?: string[] | null;
  sdPersuade?: string[] | null;
  sdWantMine?: string[] | null;
  sdWantChild?: string[] | null;
  sdGapWorry?: string[] | null;
  sdDealbreaker?: string[] | null;
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
    // 소재 단위 추적(2026-08-05). utm_source만 받던 탓에 "어떤 소재가 앱을
    // 받게 하는가"를 물어볼 데이터가 아예 없었다 — 채널(ig/meta5060) 두
    // 덩어리로만 보였다.
    //
    // Meta 광고 URL에 동적 파라미터를 넣어 보낸다:
    //   ?utm_source=meta&utm_campaign={{campaign.name}}
    //    &utm_content={{ad.name}}&utm_term={{placement}}
    // 값이 길거나 이상할 수 있으니 잘라서 담는다(서버도 한 번 더 자른다).
    // 값이 두 가지로 망가져 들어온다(2026-08-05 실측).
    //  1) `{{campaign.name}}` 그대로 — Meta가 매크로를 치환 못 한 광고다.
    //     그냥 저장하면 어드민에 캠페인 이름이 "{{campaign.name}}"으로 뜨고,
    //     여러 광고가 한 줄로 뭉쳐 아무것도 못 읽는다. 버리지도 않는다 —
    //     버리면 "태그 이전"과 섞여 광고 설정이 잘못된 걸 눈치 못 챈다.
    //  2) 이중 인코딩 — params.get()이 한 번 풀어도 %ED%99%8D처럼 남는다.
    //     한 번 더 풀어 한글 이름이 읽히게 한다.
    const tag = (k: string) => {
      let v = params.get(k);
      if (!v || !v.trim()) return null;
      v = v.trim();
      if (/^\{\{.*\}\}$/.test(v)) return "(치환 안 됨)";
      if (/%[0-9A-Fa-f]{2}/.test(v)) {
        try {
          v = decodeURIComponent(v.replace(/\+/g, " "));
        } catch {
          /* 잘못된 인코딩이면 원본을 쓴다 */
        }
      }
      return v.slice(0, 120);
    };
    if (!source && document.referrer) {
      try {
        // utm이 잘려서 오는 경우가 있다(쓰레드 l.threads.com 리다이렉트가
        // 쿼리스트링을 떨어뜨림). referrer 호스트를 읽기 쉬운 이름으로
        // 정규화하되 `_ref` 접미사로 "태그 유실 유입"임을 남긴다.
        const host = new URL(document.referrer).hostname.replace(/^www\./, "");
        const platform = /threads\./.test(host)
          ? "threads"
          : /instagram\./.test(host)
            ? "ig"
            : /facebook\.|fb\./.test(host)
              ? "fb"
              : /kakao/.test(host)
                ? "kakao"
                : /naver\./.test(host)
                  ? "naver"
                  : host;
        source = `${platform}_ref`;
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
      variant: answers?.variant ?? null,
      district: answers?.district ?? null,
      outing: answers?.outing ?? null,
      has_child: answers?.hasChild ?? null,
      child_age: answers?.childAge ?? null,
      child_marital: answers?.childMarital ?? null,
      child_contact: answers?.childContact ?? null,
      child_relation: answers?.childRelation ?? null,
      no_child_status: answers?.noChildStatus ?? null,
      // ⚠️ 여기 두 줄을 빠뜨리면 웹은 멀쩡히 묻고 답은 서버에서 사라진다.
      child_talk: answers?.childTalk ?? null,
      child_sex: answers?.childSex ?? null,
      // 사돈 수요조사. 위 타입에만 넣고 여기를 빠뜨리면 답이 사라진다.
      sd_has_single: answers?.sdHasSingle ?? null,
      sd_child_age: answers?.sdChildAge ?? null,
      sd_intent: answers?.sdIntent ?? null,
      sd_when: answers?.sdWhen ?? null,
      sd_condition_line: answers?.sdConditionLine ?? null,
      sd_assurance: answers?.sdAssurance ?? null,
      sd_persuade: answers?.sdPersuade ?? null,
      sd_want_mine: answers?.sdWantMine ?? null,
      sd_want_child: answers?.sdWantChild ?? null,
      sd_gap_worry: answers?.sdGapWorry ?? null,
      sd_dealbreaker: answers?.sdDealbreaker ?? null,
      source: source ?? null,
      campaign: tag("utm_campaign"),
      content: tag("utm_content"),
      term: tag("utm_term") ?? tag("placement"),
      medium: tag("utm_medium"),
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


/**
 * 사돈 수요조사 연락처 — **설문 응답과 다른 곳으로 보낸다.**
 *
 * 설문은 익명 세션이라 그 자체로는 개인정보가 아닌데, 연락처를 같은 세션에
 * 붙이면 식별 가능해진다. 그 세션에는 종교·정치 선호가 들어 있어서 그 순간
 * 민감정보(개인정보 보호법 제23조)가 된다. 그래서 세션 아이디를 안 싣고
 * 별도 엔드포인트로 보낸다 — 누가 무엇을 답했는지는 우리도 못 맞춘다.
 *
 * 보내는 데 성공했는지를 화면이 알아야 해서(설문 이벤트와 달리) 결과를
 * 돌려준다. 실패하면 사용자가 다시 누를 수 있다.
 */
export async function sendSadonContact(contact: string): Promise<boolean> {
  const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
  if (!backendUrl) return false;
  try {
    const res = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/v1/gyeol/sadon-contact`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: contact.trim() }),
      },
    );
    if (!res.ok) return false;
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}
