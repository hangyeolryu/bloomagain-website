"use client";

// "요즘 나에게 필요한 것" — 겉은 1분 테스트, 속은 수요 설문 (5060 광고 전용 퍼널).
//
// 결 테스트(/gyeol)와 별개 라우트·별개 컬렉션(needs_survey_events). 골든 서클
// 순서로 설계: 제품(WHAT)이 아니라 그 사람의 삶(WHY)부터 묻는다.
//  · situation = "왜 외로운가"를 돌려 물은 것 — 자녀독립·이혼·사별·은퇴.
//    "비슷한 길을 걷는 사람끼리"가 그냥 솔로 매칭보다 강하다는 가설의 데이터.
//  · activity = 모임 주제 수요, worry = 광고 첫 줄 각도, ageBand = 나이 게이트 겸.
// 결과 카드는 activity로 유형을, worry·situation으로 안심 문구를 개인화한다.

import { useEffect, useRef, useState } from "react";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
  PLAY_STORE_INTENT_URL,
} from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import { recordNeedsEvent, type NeedsAnswers } from "./needs-events";
import { AppleMark, AndroidMark } from "../gyeol/StoreMarks";
import { FounderCard } from "./FounderCard";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  const iPadOS =
    /Macintosh/.test(ua) &&
    typeof document !== "undefined" &&
    "ontouchend" in document;
  if (/iPad|iPhone|iPod/.test(ua) || iPadOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

// ── 질문 정의 ────────────────────────────────────────────────────────────────
type Q = {
  key: keyof NeedsAnswers;
  title: string;
  sub?: string;
  options: { value: string; label: string }[];
};

const QUESTIONS: Q[] = [
  {
    // 실태 먼저 — 제일 답하기 쉬운 질문으로 시작(방어감 0) + 경쟁자 조사
    // (유튜브가 경쟁자인지, 이미 사교적인지, "그냥 흘러가요"=핵심 타겟).
    //
    // ── 한 번 '삶의 변화'로 바꿨다가 되돌렸다 (2026-08-04 저녁 ~ 08-05) ──
    // 첫 클릭 이탈 58%를 고치려고 상황 질문을 앞으로 뺐다. 논리는 "옛 질문은
    // 보기 다섯 중 넷이 자기 고백이라 부담스럽고, 상황은 사실이라 값이 싸다"
    // 였다. 결과는 반대였다:
    //
    //   첫 질문 이탈  56.5% → 70.4%  (시간대 맞춰도 58.0% → 70.4%,
    //                                 z=2.77 p=0.0056)
    //   완주율        11.0% →  5.6%
    //
    // 시간대도 광고 CTA 변경도 원인이 아니었다. 교체 직후 구간부터 이미 69%였다.
    //
    // 축을 잘못 잡았다. 낯선 사람의 첫 질문에서 중요한 건 '사실이냐 평가냐'가
    // 아니라 **얼마나 사적이냐**다. "자녀 독립 / 이혼 / 사별"은 가족사고,
    // "오후에 TV 봐요"와는 무게가 다르다. 첫 화면에 사별·이혼이 보이면
    // "이 설문이 어디까지 캐물으려나"가 된다.
    //
    // 보기가 자기 고백이라는 지적 자체는 아직 유효할 수 있다. 다만 다음 시도는
    // 질문을 통째로 바꾸는 게 아니라 **보기 문구만 덜 자책적으로** 다듬는
    // 쪽이어야 한다.
    key: "timeuse",
    title: "부쩍 많아진 그 시간,\n요즘은 주로 어떻게 보내세요?",
    options: [
      { value: "tv", label: "TV·유튜브 보면서" },
      { value: "solo_out", label: "혼자 산책·운동하면서" },
      { value: "hobby_alone", label: "혼자 취미 생활하면서" },
      { value: "with_people", label: "친구·모임 만나면서" },
      { value: "drift", label: "글쎄요, 그냥 흘러가요" },
    ],
  },
  {
    key: "moment",
    title: "문득 '누가 있었으면' 싶은\n순간이 있다면?",
    options: [
      { value: "meal", label: "맛있는 집을 발견했을 때" },
      { value: "meal_alone", label: "혼자 밥 먹을 때" },
      { value: "walk", label: "산책길 풍경이 좋을 때" },
      { value: "talk", label: "얘기하고 싶은 일이 생겼을 때" },
      { value: "goodnews", label: "좋은 일이 생겼는데 알릴 데가 없을 때" },
      { value: "sick", label: "몸이 아픈 날" },
      { value: "weekend", label: "주말·연휴가 길게 느껴질 때" },
      { value: "travel", label: "여행 가고 싶은데 같이 갈 사람이 없을 때" },
    ],
  },
  {
    // 세 번째 자리로 되돌렸다(2026-08-05). 첫 화면에 두니 오히려 더 나갔다 —
    // 사연은 timeuse 쪽 주석에 적어 뒀다. 사별·이혼이 든 질문은 낯선 첫 화면이
    // 아니라 몇 번 답해 온기가 생긴 뒤에 묻는 게 맞다.
    key: "situation",
    title: "요즘 내 시간이 많아졌다면,\n어떤 변화가 있으셨나요?",
    sub: "비슷한 길을 걷는 분들을 찾아드리려고 여쭤봐요",
    options: [
      { value: "empty_nest", label: "자녀가 독립해서 집이 조용해졌어요" },
      { value: "retire", label: "은퇴하거나 일을 쉬게 됐어요" },
      { value: "spouse_diff", label: "배우자와는 취미·성향이 달라요" },
      { value: "divorce", label: "이혼 후 새로 시작하고 있어요" },
      { value: "bereave", label: "배우자와 사별했어요" },
      { value: "no_change", label: "큰 변화는 없어요" },
    ],
  },
  {
    key: "activity",
    title: "새 친구가 생기면,\n뭘 함께 하고 싶으세요?",
    options: [
      { value: "walk", label: "동네 산책" },
      { value: "tea", label: "차 한잔, 맛있는 집" },
      { value: "culture", label: "전시·공연 나들이" },
      { value: "exercise", label: "운동·등산 같이" },
      { value: "travel", label: "같이 여행" },
      { value: "hobby", label: "취미·배움 함께" },
      { value: "chat", label: "그냥 편한 수다" },
    ],
  },
  {
    // 결큐(/gyeol)와 같은 축·같은 값으로 통일했다(2026-08-04).
    //
    // 원래 보기는 동성/상관없음 옆에 '조용조용한 분'·'활발한 분'이 같이 있었다.
    // 성별 축과 기질 축을 하나의 배타적 목록에 섞어 둔 것이라, 동성 또래를
    // 원하면서 조용한 분이 좋은 사람은 둘 중 하나만 골라야 했다. 결과도 그렇게
    // 나왔다 — 90%가 성별 축을 고르고 기질은 132명 중 13명뿐이라 안 걷혔다.
    //
    // 게다가 결큐와 앱은 same/any/**opp**를 쓰는데 여기엔 opp가 없어서
    // "이성 친구도 좋아요"를 고를 칸이 아예 없었다. 남성 유입이 늘기 시작한
    // 시점에 그 수요를 볼 방법이 없던 셈이다.
    //
    // 기질은 앱의 결 유형(네 번째 글자)이 이미 잡는다.
    key: "person",
    title: "어떤 분이 편하세요?",
    options: [
      { value: "same", label: "동성 친구가 편해요" },
      { value: "any", label: "상관없어요, 결만 맞으면" },
      { value: "opp", label: "이성 친구도 좋아요" },
    ],
  },
  {
    key: "worry",
    title: "새로운 만남에서\n제일 걱정되는 건?",
    options: [
      { value: "scam", label: "사기·이상한 사람" },
      { value: "awkward", label: "어색함" },
      { value: "time", label: "시간 부담" },
      { value: "none", label: "딱히 없어요" },
    ],
  },
  {
    key: "funnel",
    title: "어느 쪽이 더 끌리세요?",
    options: [
      { value: "online", label: "온라인 대화로 천천히" },
      { value: "offline", label: "만나서 얼굴 보고" },
    ],
  },
  {
    key: "gender",
    title: "성별이 어떻게 되세요?",
    sub: "모임 구성에 참고해요 — 동성만 원하시면 앱에서 그렇게 둘 수 있어요",
    options: [
      { value: "f", label: "여성" },
      { value: "m", label: "남성" },
      { value: "na", label: "말하지 않을래요" },
    ],
  },
  {
    key: "ageBand",
    title: "연령대가 어떻게 되세요?",
    sub: "딱 맞는 또래를 찾아드리려고요",
    options: [
      { value: "45-49", label: "45–49세" },
      { value: "50-54", label: "50–54세" },
      { value: "55-59", label: "55–59세" },
      { value: "60-64", label: "60–64세" },
      { value: "65plus", label: "65세 이상" },
      { value: "under45", label: "만 45세 미만" },
    ],
  },
];

// 질문마다 다른 유도 한 줄. 방금 답한 것과 앱이 무슨 상관인지를 그 자리에서
// 잇는다 — 같은 문구를 아홉 번 반복하면 배경처럼 안 읽힌다.
//
// 레드라인: 성사 보장 금지("만나게 돼요" X, "계세요/고르실 수 있어요"까지만),
// 안전 과장 금지(본인인증은 누구인지만 확인한다), 이모지 금지, 1:1 암시 금지.
const SKIP_NUDGE: Record<string, string> = {
  // 첫 화면은 "티타가 뭔지"부터 말해야 한다 — 여기까지 브랜드가 안 나온다.
  situation: "만 45세 이상, 결이 맞는 또래를 만나는 앱",
  moment: "그런 순간을 아는 분들이 앱에 계세요",
  timeuse: "그 시간에 차 한 잔, 앱에서 자리를 맡으실 수 있어요",
  activity: "이런 걸 같이 하고 싶은 분들이 앱에 계세요",
  person: "동성만 보기, 앱에서 켜실 수 있어요",
  worry: "본인인증 하신 분들만, 셋넷이 함께 만나요",
  funnel: "대화부터든 만나서든, 앱에서 고르실 수 있어요",
  gender: "만 45세 이상만 들어오는 곳이에요",
  ageBand: "만 45세 이상, 결이 맞는 또래를 만나는 앱",
};

// 결큐와 공유하는 나이 게이트 키는 굵은 밴드만 안다 — 세분 밴드를 접어서 저장.
const COARSE_AGE: Record<string, string> = {
  "45-49": "45-54",
  "50-54": "45-54",
  "55-59": "55-64",
  "60-64": "55-64",
};

// ── 결과 콘텐츠 ──────────────────────────────────────────────────────────────
const RESULTS: Record<string, { emoji: string; head: string; body: string }> = {
  walk: {
    emoji: "🚶‍♀️",
    head: "같이 걷는 사람",
    body: "풍경 좋은 길을 혼자 걷기 아까웠던 날이 많았죠. 같은 동네에 함께 걸을 또래가 있으면, 산책이 약속이 돼요.",
  },
  tea: {
    emoji: "☕",
    head: "마주 앉아 차 한잔할 사람",
    body: "맛있는 집을 발견해도 같이 갈 사람이 없으면 금방 시들해지죠. 마주 앉을 한 사람이면 충분해요.",
  },
  hobby: {
    emoji: "📖",
    head: "같이 즐길 사람",
    body: "혼자서도 즐겁지만, 같이 하면 계속하게 돼요. 취미가 같은 또래만큼 이야기가 잘 통하는 사이도 없죠.",
  },
  culture: {
    emoji: "🎭",
    head: "같이 나들이할 사람",
    body: "전시도 공연도, 같이 봐야 이야기가 남죠. 보고 나와서 차 한잔에 감상을 나눌 사람이 있으면 더요.",
  },
  exercise: {
    emoji: "🥾",
    head: "같이 걷고 움직일 사람",
    body: "운동은 혼자면 사흘, 같이면 석 달이죠. 약속이 생기면 몸이 먼저 움직여요.",
  },
  travel: {
    emoji: "🧳",
    head: "같이 떠날 사람",
    body: "가고 싶은 곳은 많은데 같이 갈 사람이 없어 미뤄둔 여행 — 동행이 생기면 계획이 됩니다.",
  },
  chat: {
    emoji: "💬",
    head: "말이 통하는 사람",
    body: "대단한 일이 아니어도, 오늘 있었던 일을 편하게 나눌 사람. 사실 제일 귀한 게 그거죠.",
  },
};

const WORRY_LINES: Record<string, string> = {
  scam: "걱정하시는 것, 저희도 제일 신경 써요 — 티타는 NICE 본인인증을 마친 45세 이상 또래만 있고, 수상한 접근은 AI가 걸러내요.",
  awkward:
    "어색할까 걱정되시죠? 티타의 티타임은 둘이 아니라 서넛이 함께라, 말없이 있어도 어색하지 않아요.",
  time: "부담 없이 — 온라인 대화부터 천천히, 시간 날 때만 하면 돼요.",
  none: "티타는 NICE 본인인증을 마친 45세 이상 또래만 있어 안심하고 시작할 수 있어요.",
};

// "당신의 답" 거울 칩 — 완주 보상을 가시화해 다운로드의 근거로 만든다.
const CHIP_LABELS: Record<string, string> = {
  // situation
  empty_nest: "자녀 독립", spouse_diff: "배우자와 결이 다름", divorce: "새 출발",
  bereave: "혼자가 된 시간", retire: "은퇴 후", no_change: "요즘의 나",
  // activity
  walk: "동네 산책", tea: "차 한잔·맛집", culture: "전시·공연", exercise: "운동·등산",
  travel: "같이 여행", hobby: "취미·배움", chat: "편한 수다",
  // worry
  scam: "사기 걱정", awkward: "어색함 걱정", time: "시간 부담", none: "걱정 없음",
};

// 다운로드 카드 헤드라인 — activity 개인화 ("그 사람들"이 기다린다는 그림).
const ACTIVITY_WAIT: Record<string, string> = {
  walk: "같이 걸을 분들이",
  tea: "마주 앉아 차 한잔할 분들이",
  culture: "같이 나들이할 분들이",
  exercise: "같이 운동할 분들이",
  travel: "같이 떠날 분들이",
  hobby: "취미를 같이할 분들이",
  chat: "말이 통하는 분들이",
};

// 사회적 증거 — 홈/결큐와 동일한 '상황 라벨' 페르소나(각색, 실존 사칭 아님).
// 응답자 상황과 맞는 카드를 맨 위로 올린다.
const PERSONA_CARDS: { key: string; tag: string; quote: string }[] = [
  { key: "empty_nest", tag: "빈 둥지의 오후", quote: "아이들 다 키우고 나니, 낮이 참 조용하더라고요. 커피 한 잔 같이할 사람이 있었으면." },
  { key: "retire", tag: "은퇴, 그 다음", quote: "회사를 그만두고 알았어요. 매일 보던 건 '동료'였지, 친구는 아니었다는 걸." },
  { key: "spouse_diff", tag: "가족 말고, 내 사람", quote: "남편도 자식도 각자 바빠요. 나에게도 '내 사람'이 필요하더라고요." },
  { key: "any", tag: "연락처는 많은데", quote: "단톡방은 가득한데, 정작 속 얘기 편히 할 사람은 없더라고요." },
  { key: "hobby", tag: "혼자라 미뤄둔 것들", quote: "새 취미를 시작하고 싶은데, 혼자 가려니 영 용기가 안 나더라고요." },
];

const SITUATION_LINES: Record<string, string> = {
  empty_nest:
    "자녀가 독립해 조용해진 집 — 비슷한 시간을 보내는 또래들이 티타에서 서로의 하루를 나누고 있어요.",
  spouse_diff:
    "몇십 년을 함께해도 결이 다를 수 있죠. 내 결이 맞는 친구는 따로 있어요 — 티타가 찾아드려요.",
  divorce: "새로 시작하는 비슷한 길의 또래들이 티타에 있어요.",
  bereave:
    "비슷한 시간을 지나온 분들이 티타에서 서로에게 조용한 곁이 되고 있어요.",
  retire: "은퇴 후의 시간을 함께 채워갈 또래들이 티타에 있어요.",
};

export default function NeedsSurveyPage() {
  // 인트로 없이 도착 즉시 설문 시작 — 광고에서 이미 설득되고 온 사람에게
  // 인트로는 같은 말 반복 + 탭 하나 추가일 뿐(Meta 클릭 대비 시작 누락의 주범).
  // start 이벤트 = 페이지 도착.
  const started = true;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<NeedsAnswers>({});
  const [done, setDone] = useState(false);
  const [platform] = useState<Platform>(detectPlatform);
  // "또는, 직접 쓸게요" — 보기 밖의 진짜 수요를 받는 입력. 연령대 문항 제외.
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");
  // 설문을 건너뛰고 앱만 받으려는 사람 — 첫 질문에서만 열린다. null=안 열림.
  const [skipBand, setSkipBand] = useState<"none" | "ok" | "under45">("none");
  const [skipOpen, setSkipOpen] = useState(false);
  const skipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // start = "사람이 실제로 본" 도착. Meta 인앱 브라우저는 광고 노출 시
    // 랜딩을 백그라운드에서 프리로드하는데, 그때도 JS가 돌아 start가 찍히면
    // 팬텀 시작이 쌓인다 → 화면이 실제로 보일 때만 기록.
    const fire = () => {
      // performance.now() = 내비게이션 시작 기준 경과 ms. 이 effect가 도는
      // 시점부터 탭이 실제로 먹으므로, 곧 "죽은 탭 구간"의 길이다.
      const hydMs = Math.round(
        typeof performance !== "undefined" ? performance.now() : 0,
      );
      recordNeedsEvent("start", { hydMs });
      logAnalyticsEvent("needs_survey_start", { hyd_ms: hydMs });
      trackPixel("NeedsSurveyStart", {}, true);
    };
    if (typeof document === "undefined" || document.visibilityState === "visible") {
      fire();
      return;
    }
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        document.removeEventListener("visibilitychange", onVisible);
        fire();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // 나갈 때 "보고 있던 질문"을 기록 — 답도 안 하고 떠난 지점(특히 Q1)을
  // 정확히 잡는다. keepalive fetch라 pagehide에서도 전송된다. 앱 전환 후
  // 돌아와 계속하면 answer 이벤트가 뒤에 쌓여 어드민이 이 abandon을 무시한다.
  const stepRef = useRef(step);
  stepRef.current = step;
  const doneRef = useRef(done);
  doneRef.current = done;
  const abandonSentRef = useRef(false);
  useEffect(() => {
    const onHide = () => {
      if (doneRef.current || abandonSentRef.current) return;
      abandonSentRef.current = true;
      const cur = QUESTIONS[stepRef.current];
      recordNeedsEvent("abandon", { q: cur.key as string, step: stepRef.current });
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  function choose(value: string, text?: string) {
    const q = QUESTIONS[step];
    const next: NeedsAnswers = { ...answers, [q.key]: value };
    if (value === "other" && text) {
      (next as Record<string, string | null | undefined>)[`${q.key}Text`] =
        text.slice(0, 200);
    }
    setAnswers(next);
    setCustomOpen(false);
    setCustomText("");
    // 다음 질문으로 넘어갈 땐 우회로를 접는다. 열어둔 채로 넘기면 답을 고른
    // 사람 앞에 연령대 카드가 그대로 남아 "이건 또 뭐지"가 된다.
    setSkipOpen(false);
    setSkipBand("none");
    // 질문 하나 답할 때마다 가벼운 answer 이벤트 — 어느 질문에서 관두는지
    // (이탈 지점) + 중도 이탈자의 부분 답변까지 남긴다.
    recordNeedsEvent("answer", {
      [q.key]: value,
      ...(value === "other" && text
        ? { [`${q.key}Text`]: text.slice(0, 200) }
        : {}),
      q: q.key,
      step,
    } as NeedsAnswers);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }
    // 완료 — 답 전체를 한 번에 적재 + 픽셀 커스텀 이벤트(응답별 리타겟 씨앗).
    setDone(true);
    recordNeedsEvent("complete", next);
    logAnalyticsEvent("needs_survey_complete", {
      activity: next.activity ?? "",
      situation: next.situation ?? "",
      worry: next.worry ?? "",
      age_band: next.ageBand ?? "",
    });
    // 완주자도 Q9에서 나이를 답한다 — 같은 청중 규칙을 쓸 수 있게 같은
    // 이벤트를 남긴다(건너뛰기 경로와 이름을 맞춰야 청중이 하나로 모인다).
    if (next.ageBand === "under45") {
      trackPixel("NeedsUnderage", {}, true);
    } else if (next.ageBand) {
      trackPixel("NeedsAgeQualified", { age_band: next.ageBand }, true);
    }
    trackPixel(
      "NeedsSurveyComplete",
      {
        activity: next.activity ?? "",
        situation: next.situation ?? "",
        worry: next.worry ?? "",
        age_band: next.ageBand ?? "",
      },
      true,
    );
    // 결큐와 같은 나이 게이트 키를 공유 — 이후 /gyeol에 가도 다시 안 묻는다.
    try {
      if (next.ageBand) {
        window.sessionStorage.setItem(
          "tita_gyeol_age",
          COARSE_AGE[next.ageBand] ?? next.ageBand,
        );
      }
    } catch {
      /* ignore */
    }
  }

  function back() {
    setCustomOpen(false);
    setCustomText("");
    setSkipOpen(false);
    setSkipBand("none");
    if (step > 0) setStep(step - 1);
  }

  function download(store: "ios" | "android") {
    recordNeedsEvent("download", { ...answers, store });
    logAnalyticsEvent("app_download_click", { store, source: "needs_survey" });
    trackPixel("AppDownloadClick", { store, source: "needs" }, true);
  }

  // 설문 없이 앱만 받는 우회로. 도착한 사람의 78%가 첫 질문에서 떠나는데,
  // 그때까지 다운로드는 결과 화면에만 있어 받을 방법 자체가 없었다.
  // 다만 티타는 만 45세 이상 전용이라, 결큐와 같이 나이를 한 번 묻고 보낸다 —
  // 안 물으면 설치하고 본인인증에서 튕긴다(결큐 시도자의 43%가 나이 미달이었다).
  function openSkip() {
    setSkipOpen(true);
    recordNeedsEvent("skip_open", { step });
    // 카드가 보기 목록 아래에 열려 화면 밖이다 — 안 끌어오면 눌러도
    // 아무 일 없는 것처럼 보인다.
    requestAnimationFrame(() => {
      skipRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function skipAge(band: "45-49" | "50-54" | "55-59" | "60-64" | "65plus" | "under45") {
    recordNeedsEvent("skip_age", { ageBand: band, step });
    // 리타게팅용 픽셀(2026-08-05). 여기가 나이를 **자기 입으로 밝히는** 유일한
    // 지점이라, 광고 청중을 정확히 가를 수 있는 유일한 신호이기도 하다.
    //
    //  - 자격자: "45+인데 아직 앱을 안 받은 사람"만 다시 부를 수 있다.
    //  - 미달자: 제외 청중으로 쓴다. 결큐 시도자의 43%가 만 45세 미만이었는데,
    //    그분들을 다시 부르는 건 돈만 쓰고 본인인증에서 막히는 일이다.
    if (band === "under45") {
      trackPixel("NeedsUnderage", {}, true);
    } else {
      trackPixel("NeedsAgeQualified", { age_band: band }, true);
    }
    setSkipBand(band === "under45" ? "under45" : "ok");
  }

  function skipDownload(store: "ios" | "android") {
    recordNeedsEvent("skip_download", { store, step });
    logAnalyticsEvent("app_download_click", { store, source: "needs_skip" });
    trackPixel("AppDownloadClick", { store, source: "needs_skip" }, true);
  }

  async function share() {
    recordNeedsEvent("share", answers);
    logAnalyticsEvent("needs_survey_share", {});
    const shareData = {
      title: "요즘 나에게 필요한 것",
      text: "1분이면 나와요 — 요즘 나에게 필요한 게 뭔지. 가입 없이 해보세요 🍵",
      url: "https://tita-app.com/needs",
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      /* closed */
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert("링크를 복사했어요. 친구에게 붙여넣어 보내보세요 🍵");
    } catch {
      /* ignore */
    }
  }

  // ── 스타일 ────────────────────────────────────────────────────────────────
  const page: React.CSSProperties = {
    minHeight: "100dvh",
    background: TITA.forest,
    fontFamily: KOREAN_FONT_STACK,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 20px 48px",
  };
  const inner: React.CSSProperties = { width: "100%", maxWidth: 460 };
  const optionBtn: React.CSSProperties = {
    width: "100%",
    textAlign: "left",
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 16.5,
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: "-0.3px",
    color: TITA.forestDeep,
    background: TITA.cream,
    border: "none",
    borderRadius: 16,
    // 여백이 18이면 보기 하나가 61px이 되고, 다섯 개를 쌓으면 아래의 "앱 먼저
    // 받기"가 작은 화면(375×667)에서 접힌 자리 밑으로 밀린다 — 안 보이면 없는
    // 것과 같다. 13이면 49px이라 손가락 최소치(44)는 넉넉히 넘으면서 화면 안에
    // 다 들어온다. 글씨 크기는 그대로다 — 5060에게 줄이면 안 되는 건 여백이
    // 아니라 글씨다.
    padding: "11px 18px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  };
  const heroBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: "-0.3px",
    color: TITA.cream,
    background: TITA.forest,
    border: "none",
    borderRadius: 999,
    padding: "18px 24px",
    cursor: "pointer",
    boxShadow: "0 10px 26px rgba(31,78,61,0.28)",
  };

  // ── 결과 ──────────────────────────────────────────────────────────────────
  if (done) {
    // 직접 입력(other)이면 그 사람의 말을 결과에 그대로 되살린다 — "내 답을
    // 읽어줬다"는 느낌이 보기 선택보다 강한 보상이 된다.
    const customActivity = answers.activity === "other" && answers.activityText;
    const r = customActivity
      ? {
          emoji: "🍵",
          head: "함께할 사람",
          body: `"${(answers.activityText ?? "").slice(0, 40)}" — 좋네요. 그거, 같이할 사람이 생기면 훨씬 즐거워져요.`,
        }
      : RESULTS[answers.activity ?? "chat"] ?? RESULTS.chat;
    const worryLine =
      answers.worry === "other" && answers.worryText
        ? `"${(answers.worryText ?? "").slice(0, 40)}" — 그 마음 이해해요. 티타는 NICE 본인인증을 마친 45세 이상 또래만 있고, 서넛이 함께라 부담이 덜해요.`
        : WORRY_LINES[answers.worry ?? "none"] ?? WORRY_LINES.none;
    const situationLine =
      answers.situation === "other"
        ? "비슷한 마음의 또래들이 티타에 있어요."
        : answers.situation
          ? SITUATION_LINES[answers.situation]
          : undefined;
    const under45 = answers.ageBand === "under45";
    return (
      <main style={{ ...page, background: TITA.cream }}>
        <div style={{ ...inner, paddingTop: 56 }}>
          <div
            style={{
              background: TITA.white,
              borderRadius: 24,
              padding: "34px 26px",
              textAlign: "center",
              boxShadow: "0 18px 44px rgba(31,78,61,0.14)",
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 700, color: TITA.forestMid, margin: "0 0 10px" }}>
              당신에게 지금 필요한 건
            </p>
            <p style={{ fontSize: 44, margin: "0 0 8px" }}>{r.emoji}</p>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-0.7px",
                lineHeight: 1.4,
                color: TITA.forestDeep,
                margin: "0 0 14px",
              }}
            >
              {r.head}
            </h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.75, color: TITA.ink, margin: 0 }}>
              {r.body}
            </p>
            {situationLine && (
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: TITA.forestMid,
                  fontWeight: 700,
                  margin: "16px 0 0",
                }}
              >
                {situationLine}
              </p>
            )}
            {/* 거울 칩 — "나를 읽었네" 보상. 답 3개를 그대로 되비춘다. */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 8,
                marginTop: 18,
              }}
            >
              {[answers.situation, answers.activity, answers.worry]
                .map((k) => (k ? CHIP_LABELS[k] : null))
                .filter(Boolean)
                .map((label) => (
                  <span
                    key={label}
                    style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: TITA.forestMid,
                      background: TITA.surface,
                      border: `1px solid ${TITA.sage}`,
                      borderRadius: 999,
                      padding: "6px 12px",
                    }}
                  >
                    {label}
                  </span>
                ))}
            </div>
          </div>

          {under45 ? (
            <div
              style={{
                marginTop: 18,
                background: TITA.white,
                border: `1.5px solid ${TITA.forest}`,
                borderRadius: 20,
                padding: "22px 20px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 17, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 8px" }}>
                티타는 <span style={{ color: TITA.forest }}>만 45세 이상</span> 전용이에요
              </p>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: TITA.ink, fontWeight: 600, margin: "0 0 16px" }}>
                이 테스트가 딱 맞을 것 같은
                <br />
                45세 이상 가족·친구에게 보내보세요.
              </p>
              <button onClick={share} style={heroBtn}>
                가족·친구에게 보내기
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: 18,
                background: TITA.white,
                border: `1.5px solid ${TITA.forest}`,
                borderRadius: 20,
                padding: "22px 20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  lineHeight: 1.5,
                  letterSpacing: "-0.4px",
                  color: TITA.forestDeep,
                  margin: "0 0 10px",
                }}
              >
                {ACTIVITY_WAIT[answers.activity ?? "chat"] ?? "결이 맞는 분들이"}
                <br />
                티타에서 기다려요
              </p>
              <p
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: TITA.ink,
                  fontWeight: 600,
                  margin: "0 0 16px",
                }}
              >
                {worryLine}
              </p>

              {/* 동성 선호자의 다운로드 전환이 유독 낮다(29% vs 상관없음 47%,
                  완주 95명 기준). 답할 때 본 건 성별 문항의 작은 부제 한 줄뿐이라,
                  정작 받기 직전엔 자기 답이 반영된다는 확인이 없다. 여기서
                  되돌려준다. 편성은 실제로 양방향 하드 규칙이라 지킬 수 있는 약속. */}
              {answers.person === "same" && (
                <p
                  style={{
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    fontWeight: 700,
                    color: TITA.forestMid,
                    background: TITA.surface,
                    border: `1px solid ${TITA.sage}`,
                    borderRadius: 12,
                    padding: "11px 13px",
                    margin: "0 0 16px",
                  }}
                >
                  동성 또래가 편하다고 하셨죠. 앱에서 ‘동성만’으로 두시면
                  이성은 아예 자리에 들어오지 않아요.
                </p>
              )}
              {platform === "other" ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <a href={APP_STORE_URL} onClick={() => download("ios")} style={{ ...heroBtn, flex: 1 }}>
                    <AppleMark size={20} />
                    아이폰
                  </a>
                  <a href={PLAY_STORE_URL} onClick={() => download("android")} style={{ ...heroBtn, flex: 1 }}>
                    <AndroidMark size={20} />
                    삼성폰
                  </a>
                </div>
              ) : (
                <a
                  href={platform === "android" ? PLAY_STORE_URL : APP_STORE_URL}
                  onClick={(e) => {
                    download(platform === "android" ? "android" : "ios");
                    if (platform === "android") {
                      e.preventDefault();
                      window.location.href = PLAY_STORE_INTENT_URL;
                    }
                  }}
                  style={heroBtn}
                >
                  결이 맞는 분들 보러 가기 (무료)
                </a>
              )}
              {/* 감지가 틀린 드문 경우(태블릿 등) 탈출구 — 결큐와 동일 패턴 */}
              {platform !== "other" && (
                <a
                  href={platform === "android" ? APP_STORE_URL : PLAY_STORE_URL}
                  onClick={() => download(platform === "android" ? "ios" : "android")}
                  style={{
                    display: "block",
                    marginTop: 10,
                    fontSize: 12.5,
                    color: TITA.muted,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {platform === "android" ? "아이폰" : "안드로이드"}이라면 여기로
                </a>
              )}
              <p style={{ fontSize: 12.5, color: TITA.muted, fontWeight: 600, margin: "10px 0 0" }}>
                만 45세 이상 · NICE 본인인증 — 검증된 또래만 있어 안전해요
              </p>
            </div>
          )}

          {/* 두 걱정 허물기 — 설문 데이터: 걱정의 90%가 사기(60%)·어색함(30%).
              안심 "문구"가 아니라 실제 작동 "방식"을 시연한다(명단 공개·티타지기
              첫 질문·넛지 = 전부 실제 운영 기능). 전원 노출, 본인 걱정 먼저. */}
          {!under45 && (() => {
            const scamBlock = (
              <div
                key="scam"
                style={{
                  marginTop: 18,
                  background: TITA.surface,
                  border: `1px solid ${TITA.sage}`,
                  borderRadius: 18,
                  padding: "20px 18px",
                }}
              >
                <p style={{ textAlign: "center", fontSize: 15, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 14px" }}>
                  이상한 사람이 걱정된다면 — 티타는 이렇게 지켜요
                </p>
                {[
                  ["본인인증 없이는 입장 자체가 안 돼요", "NICE 실명 인증을 마친 만 45세 이상만 있어요. 익명 가입이 없어요."],
                  ["수상한 접근은 AI가 먼저 봐요", "돈 이야기, 카톡·라인으로 데려가려는 시도를 자동 감지해 경고하고 차단해요."],
                  ["처음엔 둘이 아니라 여럿이 만나요", "서넛이 함께하는 티타임 구조라, 이상한 사람이 발 붙이기 어려워요."],
                  ["의심되면 바로 신고할 수 있어요", "확인 즉시 조치하고, 문제 계정은 다시 매칭되지 않아요."],
                ].map(([t, b]) => (
                  <div key={t} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 11, background: TITA.forest, color: TITA.cream, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>✓</span>
                    <div>
                      <p style={{ fontSize: 14.5, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 2px" }}>{t}</p>
                      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: TITA.ink, margin: 0 }}>{b}</p>
                    </div>
                  </div>
                ))}
                {/* "굳이" 신호 — 이동 자체가 아니라 이유 없이 서두르는 게 신호.
                    (서사 원본: docs/product/in_app_safety_narrative_2026_07.md) */}
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: `1px dashed ${TITA.sage}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      lineHeight: 1.55,
                      color: TITA.forestDeep,
                      margin: "0 0 8px",
                      textAlign: "center",
                    }}
                  >
                    만나는 건 좋아요.
                    <br />
                    다만 연락은 티타 안에서 하세요
                  </p>
                  <p
                    style={{
                      fontSize: 13.5,
                      lineHeight: 1.75,
                      color: TITA.ink,
                      margin: "0 0 12px",
                      textAlign: "center",
                    }}
                  >
                    차 마시고 산책하는 건 저희가 바라는 일이에요.
                    <br />
                    다만 <b>굳이</b> 카톡·문자로 옮기자는 분은 한 번 더 생각해 보세요.
                    <br />
                    <br />
                    사기는 무언가를 주고받아야 성립해요 — 링크, 송금, 앱 설치.
                    <br />
                    티타 안에서는 그런 말이 오가면 AI가 먼저 알아챕니다.
                    <br />
                    <b>밖으로 나가는 순간, 그 보호가 사라져요.</b>
                  </p>
                  <div
                    style={{
                      background: TITA.white,
                      border: `1px solid ${TITA.sage}`,
                      borderRadius: 14,
                      padding: "14px 16px",
                      textAlign: "left",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13.5,
                        fontWeight: 800,
                        color: TITA.forestDeep,
                        margin: "0 0 8px",
                      }}
                    >
                      만나실 때는 이것만 지켜주세요
                    </p>
                    {[
                      "처음엔 낮에, 사람 있는 카페에서",
                      "누가 부탁해도 내 휴대폰은 맡기지 마세요 — 잠깐이면 된다고 해도요",
                      "돈·계좌·앱 설치 이야기가 나오면 그 자리에서 멈추세요",
                      "연락은 티타 안에서 — 그래야 무슨 일이 있어도 기록이 남아요",
                    ].map((line) => (
                      <p
                        key={line}
                        style={{
                          fontSize: 13,
                          lineHeight: 1.65,
                          color: TITA.ink,
                          margin: "0 0 5px",
                        }}
                      >
                        · {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
            const awkwardBlock = (
              <div
                key="awkward"
                style={{
                  marginTop: 18,
                  background: TITA.surface,
                  border: `1px solid ${TITA.sage}`,
                  borderRadius: 18,
                  padding: "20px 18px",
                }}
              >
                <p style={{ textAlign: "center", fontSize: 15, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 14px" }}>
                  어색할까 걱정된다면 — 첫 자리는 이렇게 흘러가요
                </p>
                {[
                  ["1", "들어가면 누가 있는지 먼저 보여요", "이름 옆에 여성·남성까지 — 모르는 사람들 속에 던져지지 않아요."],
                  ["2", "첫 마디는 티타지기가 대신 꺼내요", "\"OO님부터 가볍게 여쭤볼게요\" — 말 걸 고민을 할 필요가 없어요."],
                  ["3", "답만 해도 대화가 시작돼요", "짧게 한 줄이면 충분하고, 듣고만 있어도 괜찮아요."],
                  ["4", "조용해지면 티타가 살짝 이어줘요", "답이 없으면 다음 이야기를 대신 청해 드려요."],
                ].map(([n, t, b]) => (
                  <div key={t} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 11, background: TITA.camel, color: TITA.forestDeep, fontSize: 12.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{n}</span>
                    <div>
                      <p style={{ fontSize: 14.5, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 2px" }}>{t}</p>
                      <p style={{ fontSize: 13.5, lineHeight: 1.6, color: TITA.ink, margin: 0 }}>{b}</p>
                    </div>
                  </div>
                ))}
                <p style={{ fontSize: 13, lineHeight: 1.6, color: TITA.forestMid, fontWeight: 700, margin: "4px 0 0", textAlign: "center" }}>
                  용기 내는 건 티타가 할게요.
                  <br />
                  당신은 편하게 앉아 계시면 돼요.
                </p>
              </div>
            );
            // 답한 걱정에 맞는 블록만 — 사기 선택자에겐 사기 허물기,
            // 어색함 선택자에겐 어색함 허물기. 걱정 없음/시간 부담은 둘 다.
            // 사기 선택자 = 사기 블록만. 어색함 선택자도 안전은 늘 궁금하므로
            // 어색함 먼저 + 사기 블록도 함께. 그 외(시간·없음)는 둘 다.
            if (answers.worry === "scam") return [scamBlock];
            if (answers.worry === "awkward") return [awkwardBlock, scamBlock];
            return [scamBlock, awkwardBlock];
          })()}

          {/* 사회적 증거 — 상황 맞춤 우선 정렬 3장 (상황 라벨 페르소나) */}
          {!under45 && (
            <div style={{ marginTop: 24 }}>
              <p
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  color: TITA.forestMid,
                  margin: "0 0 12px",
                }}
              >
                티타에는 이런 분들이 있어요
              </p>
              {[...PERSONA_CARDS]
                .sort((a, b) =>
                  (b.key === answers.situation ? 1 : 0) -
                  (a.key === answers.situation ? 1 : 0),
                )
                .slice(0, 3)
                .map((c) => (
                  <div
                    key={c.tag}
                    style={{
                      background: TITA.white,
                      border: `1px solid ${TITA.sage}`,
                      borderRadius: 16,
                      padding: "16px 18px",
                      marginBottom: 10,
                    }}
                  >
                    <p style={{ fontSize: 12, fontWeight: 800, color: TITA.forestMid, margin: "0 0 6px" }}>{c.tag}</p>
                    <p style={{ fontSize: 14.5, lineHeight: 1.65, color: TITA.ink, margin: 0 }}>
                      &ldquo;{c.quote}&rdquo;
                    </p>
                  </div>
                ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button
              onClick={share}
              style={{
                fontFamily: KOREAN_FONT_STACK,
                fontSize: 14,
                fontWeight: 700,
                color: TITA.forestMid,
                background: "transparent",
                border: `1px solid ${TITA.sage}`,
                borderRadius: 999,
                padding: "10px 22px",
                cursor: "pointer",
              }}
            >
              친구에게도 보내기
            </button>
          </div>

          {/* 신뢰 블록 — "떠나는 링크"가 아니라 그 자리에서 읽히는 안심 3단.
              확신 있는 사람은 위에서 이미 다운로드; 망설이는 사람(어색함·사기
              걱정)만 스크롤해 읽고, 블록 끝에서 다운로드 한 번 더. 결큐에서
              경쟁 CTA가 다운을 0으로 만든 전례가 있어 위쪽엔 절대 안 올린다. */}
          {!under45 && (
            <div style={{ marginTop: 44 }}>
              <p
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "-0.2px",
                  color: TITA.forestMid,
                  margin: "0 0 14px",
                }}
              >
                아직 망설여진다면, 조금만 더 읽어보세요
              </p>
              {[
                {
                  t: "어떻게 만나나요?",
                  b: "처음부터 얼굴 보는 게 아니에요. 결이 맞는 서넛이 대화방에서 먼저 인사하고, 편해지면 그때 동네에서 티타임을 가져요.",
                },
                {
                  t: "누가 있나요?",
                  b: "NICE 본인인증을 마친 만 45세 이상 또래만 있어요. 수상한 접근·사기는 AI가 지켜보다 걸러내요.",
                },
              ].map((x) => (
                <div
                  key={x.t}
                  style={{
                    background: TITA.white,
                    borderRadius: 16,
                    padding: "18px 20px",
                    marginBottom: 10,
                    border: `1px solid ${TITA.sage}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: 15.5,
                      fontWeight: 800,
                      color: TITA.forestDeep,
                      margin: "0 0 6px",
                    }}
                  >
                    {x.t}
                  </p>
                  <p
                    style={{
                      fontSize: 14.5,
                      lineHeight: 1.7,
                      color: TITA.ink,
                      margin: 0,
                    }}
                  >
                    {x.b}
                  </p>
                </div>
              ))}
              {/* 기기를 못 알아본 접속을 App Store로 흘려보내면 안 된다. 위 744번
                  줄은 이미 두 버튼으로 갈라 주는데 여기만 빠져 있었다 — 그래서
                  iOS 클릭 27건 중 18건이 허수로 잡혔다(2026-08-06). */}
              {platform === "other" ? (
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <a href={APP_STORE_URL} onClick={() => download("ios")} style={{ ...heroBtn, flex: 1 }}>
                    <AppleMark size={20} />
                    아이폰
                  </a>
                  <a href={PLAY_STORE_URL} onClick={() => download("android")} style={{ ...heroBtn, flex: 1 }}>
                    <AndroidMark size={20} />
                    삼성폰
                  </a>
                </div>
              ) : (
                <a
                  href={platform === "android" ? PLAY_STORE_URL : APP_STORE_URL}
                  onClick={(e) => {
                    download(platform === "android" ? "android" : "ios");
                    if (platform === "android") {
                      e.preventDefault();
                      window.location.href = PLAY_STORE_INTENT_URL;
                    }
                  }}
                  style={{ ...heroBtn, marginTop: 8 }}
                >
                  안심하고 시작하기 (무료)
                </a>
              )}
              <p style={{ textAlign: "center", margin: "16px 0 0" }}>
                <a
                  href="/"
                  style={{
                    fontFamily: KOREAN_FONT_STACK,
                    fontSize: 13,
                    fontWeight: 600,
                    color: TITA.muted,
                    textDecoration: "none",
                  }}
                >
                  티타 더 알아보기 →
                </a>
              </p>
            </div>
          )}

          {/* 마지막 — 만든 사람의 얼굴·이름·약속 + 문의 창구 */}
          <FounderCard source="needs_result" />
        </div>
      </main>
    );
  }

  // ── 퀴즈 ──────────────────────────────────────────────────────────────────
  const q = QUESTIONS[step];
  return (
    <main style={page}>
      <div style={{ ...inner, paddingTop: 28 }}>
        {step === 0 && (
          <div style={{ textAlign: "center", margin: "0 0 18px" }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: TITA.cream,
                margin: "0 0 4px",
              }}
            >
              1분만 답하면, 지금 나에게 필요한 게 뭔지 알려드려요
            </p>
            {/* "가입 없음 · 이름·연락처 안 물어요"를 뺐다. 안심 문구였지만
                366명이 첫 질문에서 그냥 나가는 동안 아무것도 못 막았고, 그
                자리(19px + 여백)가 아래의 "앱 먼저 받기"를 화면 밖으로
                밀어내고 있었다. 안 읽히는 방어 문구보다 보이는 출구가 낫다. */}
          </div>
        )}
        {/* 진행 줄. 이 줄의 키는 "← 이전"이 정한다 — 첫 질문에선 감춰도
            자리는 그대로 차지해서, 여백을 줄이려면 여기 padding부터 손대야 한다. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button
            onClick={back}
            style={{
              fontFamily: KOREAN_FONT_STACK,
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(251,247,240,0.7)",
              background: "transparent",
              border: "none",
              padding: 3,
              cursor: "pointer",
              visibility: step === 0 ? "hidden" : "visible",
            }}
          >
            ← 이전
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {QUESTIONS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === step ? 18 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: i <= step ? TITA.cream : "rgba(251,247,240,0.25)",
                  transition: "all .2s",
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(251,247,240,0.7)" }}>
            {step + 1}/{QUESTIONS.length}
          </span>
        </div>

        <h2
          style={{
            fontSize: 23,
            fontWeight: 800,
            lineHeight: 1.45,
            letterSpacing: "-0.6px",
            color: TITA.cream,
            margin: "0 0 6px",
            whiteSpace: "pre-line",
          }}
        >
          {q.title}
        </h2>
        {q.sub && (
          <p style={{ fontSize: 13.5, color: "rgba(251,247,240,0.65)", margin: "0 0 14px", fontWeight: 600 }}>
            {q.sub}
          </p>
        )}
        {!q.sub && <div style={{ height: 12 }} />}

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {q.options.map((o) => (
            <button key={o.value} onClick={() => choose(o.value)} style={optionBtn}>
              {o.label}
            </button>
          ))}

          {/* "또는, 직접 쓸게요" — 보기 밖의 진짜 수요를 받는다 (연령·성별 제외).
              원문은 익명으로 저장돼 어드민에서 열람 → 다음 보기·모임 기획의 재료. */}
          {q.key !== "ageBand" &&
            q.key !== "gender" &&
            (customOpen ? (
              <div
                style={{
                  background: TITA.cream,
                  borderRadius: 16,
                  padding: "14px 14px 12px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                }}
              >
                <input
                  autoFocus
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customText.trim()) {
                      choose("other", customText.trim());
                    }
                  }}
                  maxLength={100}
                  placeholder="편하게 적어주세요"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    fontFamily: KOREAN_FONT_STACK,
                    fontSize: 16,
                    fontWeight: 600,
                    color: TITA.forestDeep,
                    background: TITA.white,
                    border: `1.5px solid ${TITA.sage}`,
                    borderRadius: 12,
                    padding: "13px 14px",
                    outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button
                    onClick={() => {
                      setCustomOpen(false);
                      setCustomText("");
                    }}
                    style={{
                      fontFamily: KOREAN_FONT_STACK,
                      fontSize: 14,
                      fontWeight: 700,
                      color: TITA.muted,
                      background: "transparent",
                      border: "none",
                      padding: "10px 12px",
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </button>
                  <button
                    onClick={() => customText.trim() && choose("other", customText.trim())}
                    disabled={!customText.trim()}
                    style={{
                      flex: 1,
                      fontFamily: KOREAN_FONT_STACK,
                      fontSize: 15.5,
                      fontWeight: 800,
                      color: TITA.cream,
                      background: customText.trim() ? TITA.forest : TITA.muted,
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 16px",
                      cursor: customText.trim() ? "pointer" : "default",
                    }}
                  >
                    이걸로 할게요
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setCustomOpen(true)}
                style={{
                  ...optionBtn,
                  background: "transparent",
                  color: "rgba(251,247,240,0.85)",
                  border: "1.5px dashed rgba(251,247,240,0.4)",
                  boxShadow: "none",
                  textAlign: "center",
                  // 보기가 아니라 보기 밖으로 나가는 길이다 — 보기와 같은 덩치면
                  // 여섯 번째 보기처럼 읽힌다. 한 급 낮춰 목록에서 빼낸다.
                  fontSize: 14.5,
                  padding: "10px 16px",
                  fontWeight: 600,
                }}
              >
                또는, 직접 쓸게요 ✏️
              </button>
            ))}
        </div>

        {/* 설문을 건너뛰고 앱만 받는 길 — 모든 질문에 둔다(2026-08-04).
            처음엔 첫 질문에서만 열었다. 이탈이 거기 몰려 있었으니까(도착 548명
            중 366명). 그런데 그건 "나갈 사람을 붙잡는" 관점이고, 설문을 하다가
            마음이 정해진 사람에게도 받을 자리가 있어야 한다. 완주자도 57%만
            받는다 — 끝까지 답한 사람의 43%를 그냥 놓치고 있다.

            처음엔 이 길을 회색 밑줄 글줄 하나로 뒀는데(2026-08-01), 366명 중
            12명(3.3%)만 눌렀고 실제 다운로드는 3건이었다. 사실상 없는 것과 같다.

            그렇다고 채운 버튼으로 올리면 설문 자체를 잡아먹는다 — 결큐에서
            경쟁 CTA가 다운을 0으로 만든 전례가 있다. 그래서 급을 나눈다:
            보기는 크림으로 **채우고**, 이 길은 **테두리만** 준다. 모양도 보기의
            둥근 사각(16)이 아니라 알약(999)이라 "보기 중 하나"로 안 읽힌다.
            위의 가로줄은 여기서부터 다른 길이라는 표시다.

            아래 한 줄(SKIP_NUDGE)은 질문마다 다르다. 아홉 화면에 같은 문구를
            반복하면 배경처럼 안 읽힌다. skip_open 이벤트에 step이 실리니
            어느 질문에서 새는지도 뒤에 볼 수 있다. */}
        {!skipOpen && (
          <div style={{ margin: "10px 0 0" }}>
            <div
              style={{
                height: 1,
                background: "rgba(251,247,240,0.16)",
                margin: "0 0 12px",
              }}
            />
            <button
              onClick={openSkip}
              style={{
                display: "block",
                width: "100%",
                fontFamily: KOREAN_FONT_STACK,
                fontSize: 15.5,
                fontWeight: 700,
                letterSpacing: "-0.3px",
                color: TITA.cream,
                background: "transparent",
                border: "1.5px solid rgba(251,247,240,0.55)",
                borderRadius: 999,
                padding: "15px 20px",
                cursor: "pointer",
              }}
            >
              {/* 첫 화면에선 "먼저"가 맞지만, 세 질문쯤 답한 사람에게 "먼저"는
                  어색하다 — 이미 하던 중이니까. */}
              {step === 0 ? "티타 앱 먼저 받아볼게요" : "티타 앱 받아볼게요"}
            </button>
            <p
              style={{
                textAlign: "center",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(251,247,240,0.55)",
                margin: "8px 0 0",
              }}
            >
              {/* 첫 화면까지 "티타"가 한 번도 안 나온다 — 광고를 누르고 온
                  사람은 설문만 보고 있어서, 버튼에 브랜드명만 쓰면 "티타가
                  뭔데?"가 된다. 그래서 무엇인지를 버튼 바로 밑에서 한 줄로
                  말한다. 뒤 질문에선 방금 답한 것과 앱을 잇는 문구로 바뀐다. */}
              {SKIP_NUDGE[q.key] ?? "만 45세 이상, 결이 맞는 또래를 만나는 앱"}
            </p>
          </div>
        )}

        {skipOpen && (
          <div
            ref={skipRef}
            style={{
              marginTop: 22,
              background: TITA.white,
              border: `1.5px solid ${TITA.forest}`,
              borderRadius: 20,
              padding: "20px 18px",
              boxShadow: "0 14px 34px rgba(31,78,61,0.15)",
            }}
          >
            {skipBand === "none" && (
              <>
                <p style={{ textAlign: "center", fontSize: 17, fontWeight: 800, lineHeight: 1.5, letterSpacing: "-0.5px", color: TITA.forestDeep, margin: "0 0 4px" }}>
                  티타는 <span style={{ color: TITA.forest }}>만 45세 이상</span> 전용이에요
                </p>
                <p style={{ textAlign: "center", fontSize: 13.5, color: TITA.muted, fontWeight: 600, margin: "0 0 16px" }}>
                  연령대만 알려주시면 바로 보내드릴게요
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {([
                    ["45-49", "45–49세"], ["50-54", "50–54세"],
                    ["55-59", "55–59세"], ["60-64", "60–64세"], ["65plus", "65세 이상"],
                  ] as const).map(([band, label]) => (
                    <button
                      key={band}
                      onClick={() => skipAge(band)}
                      style={{
                        fontFamily: KOREAN_FONT_STACK,
                        fontSize: 15.5,
                        fontWeight: 800,
                        letterSpacing: "-0.3px",
                        color: TITA.cream,
                        background: TITA.forest,
                        border: "none",
                        borderRadius: 13,
                        padding: "14px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    onClick={() => skipAge("under45")}
                    style={{
                      fontFamily: KOREAN_FONT_STACK,
                      fontSize: 14,
                      fontWeight: 700,
                      color: TITA.muted,
                      background: "transparent",
                      border: `1px solid ${TITA.sage}`,
                      borderRadius: 12,
                      padding: "13px 12px",
                      cursor: "pointer",
                      marginTop: 2,
                    }}
                  >
                    만 45세 미만이에요
                  </button>
                </div>
              </>
            )}

            {skipBand === "ok" && (
              <>
                <p style={{ textAlign: "center", fontSize: 17, fontWeight: 800, lineHeight: 1.5, letterSpacing: "-0.5px", color: TITA.forestDeep, margin: "0 0 14px" }}>
                  받으시면 바로 시작할 수 있어요
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {platform === "other" ? (
                    // 기기를 못 알아봤으면 고르시게 둔다. 임의로 한쪽에 보내면
                    // 엉뚱한 스토어로 가고, 집계도 그쪽으로 쏠린다.
                    <div style={{ display: "flex", gap: 10 }}>
                      <a href={APP_STORE_URL} onClick={() => skipDownload("ios")} style={{ ...heroBtn, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                        <AppleMark size={20} />
                        아이폰
                      </a>
                      <a href={PLAY_STORE_URL} onClick={() => skipDownload("android")} style={{ ...heroBtn, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                        <AndroidMark size={20} />
                        삼성폰
                      </a>
                    </div>
                  ) : (
                  <>
                  <a
                    href={platform === "android" ? PLAY_STORE_URL : APP_STORE_URL}
                    onClick={() => skipDownload(platform === "android" ? "android" : "ios")}
                    style={{ ...heroBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none" }}
                  >
                    {platform === "android" ? <AndroidMark /> : <AppleMark />}
                    티타 받기
                  </a>
                  <a
                    href={platform === "android" ? APP_STORE_URL : PLAY_STORE_URL}
                    onClick={() => skipDownload(platform === "android" ? "ios" : "android")}
                    style={{
                      fontFamily: KOREAN_FONT_STACK,
                      textAlign: "center",
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: TITA.muted,
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                      padding: 8,
                    }}
                  >
                    {platform === "android" ? "아이폰이신가요?" : "안드로이드이신가요?"}
                  </a>
                  </>
                  )}
                </div>
              </>
            )}

            {skipBand === "under45" && (
              <>
                <p style={{ textAlign: "center", fontSize: 17, fontWeight: 800, lineHeight: 1.5, letterSpacing: "-0.5px", color: TITA.forestDeep, margin: "0 0 8px" }}>
                  아직은 티타를 쓰실 수 없어요
                </p>
                <p style={{ textAlign: "center", fontSize: 14, lineHeight: 1.7, color: TITA.ink, fontWeight: 600, margin: "0 0 16px" }}>
                  대신, 요즘 부쩍 혼자인 시간이 많아지신
                  <br />
                  <b>만 45세 이상 가족·친구</b>가 떠오르지 않나요?
                </p>
                <button
                  onClick={share}
                  style={{ ...heroBtn, width: "100%", border: "none", cursor: "pointer" }}
                >
                  그분께 알려주기
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
