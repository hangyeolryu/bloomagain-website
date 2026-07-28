"use client";

// "요즘 나에게 필요한 것" — 겉은 1분 테스트, 속은 수요 설문 (5060 광고 전용 퍼널).
//
// 결 테스트(/gyeol)와 별개 라우트·별개 컬렉션(needs_survey_events). 골든 서클
// 순서로 설계: 제품(WHAT)이 아니라 그 사람의 삶(WHY)부터 묻는다.
//  · situation = "왜 외로운가"를 돌려 물은 것 — 자녀독립·이혼·사별·은퇴.
//    "비슷한 길을 걷는 사람끼리"가 그냥 솔로 매칭보다 강하다는 가설의 데이터.
//  · activity = 모임 주제 수요, worry = 광고 첫 줄 각도, ageBand = 나이 게이트 겸.
// 결과 카드는 activity로 유형을, worry·situation으로 안심 문구를 개인화한다.

import { useState } from "react";
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
    key: "situation",
    title: "요즘 내 시간이 많아졌다면,\n어떤 변화가 있으셨나요?",
    sub: "비슷한 길을 걷는 분들을 찾아드리려고 여쭤봐요",
    options: [
      { value: "empty_nest", label: "자녀가 독립해서 집이 조용해졌어요" },
      { value: "spouse_diff", label: "배우자와는 취미·성향이 달라요" },
      { value: "divorce", label: "이혼 후 새로 시작하고 있어요" },
      { value: "bereave", label: "배우자와 사별했어요" },
      { value: "retire", label: "은퇴하거나 일을 쉬게 됐어요" },
      { value: "no_change", label: "큰 변화는 없어요" },
    ],
  },
  {
    key: "activity",
    title: "새 친구가 생기면,\n뭘 함께 하고 싶으세요?",
    options: [
      { value: "walk", label: "동네 산책" },
      { value: "tea", label: "차 한잔, 맛있는 집" },
      { value: "hobby", label: "취미 함께 (독서·문화·운동)" },
      { value: "chat", label: "그냥 편한 수다" },
    ],
  },
  {
    key: "person",
    title: "어떤 분이 편하세요?",
    options: [
      { value: "same", label: "동성 또래가 편해요" },
      { value: "any", label: "결만 맞으면 상관없어요" },
      { value: "calm", label: "조용조용한 분" },
      { value: "lively", label: "활발한 분" },
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
    sub: "모임 구성(동성끼리가 기본)에 참고해요",
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
  chat: {
    emoji: "💬",
    head: "말이 통하는 사람",
    body: "대단한 일이 아니어도, 오늘 있었던 일을 편하게 나눌 사람. 사실 제일 귀한 게 그거죠.",
  },
};

const WORRY_LINES: Record<string, string> = {
  scam: "걱정하시는 것, 저희도 제일 신경 써요 — 티타는 NICE 본인인증을 마친 45세 이상 또래만 있고, 수상한 접근은 AI가 걸러내요.",
  awkward:
    "어색할까 걱정되시죠? 티타의 찻자리는 둘이 아니라 서넛이 함께라, 말없이 있어도 어색하지 않아요.",
  time: "부담 없이 — 온라인 대화부터 천천히, 시간 날 때만 하면 돼요.",
  none: "티타는 NICE 본인인증을 마친 45세 이상 또래만 있어 안심하고 시작할 수 있어요.",
};

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
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<NeedsAnswers>({});
  const [done, setDone] = useState(false);
  const [platform] = useState<Platform>(detectPlatform);
  // "또는, 직접 쓸게요" — 보기 밖의 진짜 수요를 받는 입력. 연령대 문항 제외.
  const [customOpen, setCustomOpen] = useState(false);
  const [customText, setCustomText] = useState("");

  function begin() {
    setStarted(true);
    recordNeedsEvent("start");
    logAnalyticsEvent("needs_survey_start", {});
    trackPixel("NeedsSurveyStart", {}, true);
  }

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
    if (step > 0) setStep(step - 1);
    else setStarted(false);
  }

  function download(store: "ios" | "android") {
    recordNeedsEvent("download", { ...answers, store });
    logAnalyticsEvent("app_download_click", { store, source: "needs_survey" });
    trackPixel("AppDownloadClick", { store, source: "needs" }, true);
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
    padding: "18px 20px",
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

  // ── 인트로 (WHY 먼저 — 제품 언급 없음) ────────────────────────────────────
  if (!started && !done) {
    return (
      <main style={{ ...page, paddingBottom: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ ...inner, textAlign: "center", paddingTop: 56, position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: TITA.sage, margin: "0 0 14px" }}>
            가입 없이 1분
          </p>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1.4,
              letterSpacing: "-0.8px",
              color: TITA.cream,
              margin: "0 0 18px",
            }}
          >
            요즘 나에게
            <br />
            필요한 것
          </h1>
          <p
            style={{
              fontSize: 16.5,
              lineHeight: 1.75,
              color: "rgba(251,247,240,0.85)",
              margin: "0 0 36px",
            }}
          >
            자녀 독립, 은퇴, 부쩍 많아진 나만의 시간 —
            <br />
            삶이 바뀌면, 필요한 것도 바뀝니다.
            <br />
            지금 나에게 필요한 게 뭔지, 1분이면 나와요.
          </p>
          <button onClick={begin} style={{ ...heroBtn, background: TITA.cream, color: TITA.forestDeep }}>
            1분, 알아보기
          </button>
          <p style={{ fontSize: 13, color: "rgba(251,247,240,0.6)", marginTop: 14 }}>
            질문 9개 · 이름·연락처 안 물어요
          </p>
        </div>
        {/* 하단 배경 — 딥그린과 한 몸인 50대 여성 컷아웃 (webp, 투명배경).
            absolute 바닥 고정이라 어떤 화면에서도 하단에 보이고, 콘텐츠(z:1)가
            위 레이어라 짧은 화면에선 자연스럽게 버튼 뒤로 깔린다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/needs/woman50.webp"
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "auto",
            maxWidth: "min(78%, 380px)",
            maxHeight: "46vh",
            zIndex: 0,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      </main>
    );
  }

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
                  fontSize: 15.5,
                  lineHeight: 1.7,
                  color: TITA.ink,
                  fontWeight: 600,
                  margin: "0 0 16px",
                }}
              >
                {worryLine}
              </p>
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
                  그 사람, 티타에서 만나기 (무료)
                </a>
              )}
              <p style={{ fontSize: 12.5, color: TITA.muted, fontWeight: 600, margin: "10px 0 0" }}>
                만 45세 이상 · NICE 본인인증 — 검증된 또래만 있어 안전해요
              </p>
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
                  b: "처음부터 얼굴 보는 게 아니에요. 결이 맞는 서넛이 대화방에서 먼저 인사하고, 편해지면 그때 동네 찻자리에서 만나요.",
                },
                {
                  t: "누가 있나요?",
                  b: "NICE 본인인증을 마친 만 45세 이상 또래만 있어요. 수상한 접근·사기는 AI가 지켜보다 걸러내요.",
                },
                {
                  t: "누가 만들었나요?",
                  b: "이사 후 동네 친구가 없어진 엄마를 보고, 아들이 만들었어요. 엄마가 안심하고 쓸 수 있는 것만 넣습니다.",
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
        </div>
      </main>
    );
  }

  // ── 퀴즈 ──────────────────────────────────────────────────────────────────
  const q = QUESTIONS[step];
  return (
    <main style={page}>
      <div style={{ ...inner, paddingTop: 40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 26 }}>
          <button
            onClick={back}
            style={{
              fontFamily: KOREAN_FONT_STACK,
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(251,247,240,0.7)",
              background: "transparent",
              border: "none",
              padding: 6,
              cursor: "pointer",
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
          <p style={{ fontSize: 13.5, color: "rgba(251,247,240,0.65)", margin: "0 0 20px", fontWeight: 600 }}>
            {q.sub}
          </p>
        )}
        {!q.sub && <div style={{ height: 20 }} />}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                  fontWeight: 600,
                }}
              >
                또는, 직접 쓸게요 ✏️
              </button>
            ))}
        </div>
      </div>
    </main>
  );
}
