"use client";

/**
 * /enjoy — "506070, 이제 즐길 때" 밝은판 랜딩 (3문항).
 *
 * ── 왜 따로 만드는가 ────────────────────────────────────────────────────────
 * /needs(9문항)는 도착 1134명 중 913명(80%)이 **첫 질문에서** 빠졌다. 그런데
 * 첫 질문만 넘기면 57%가 끝까지 간다 — 아홉 문항을 지나며 잃는 건 96명뿐이다.
 * 길이가 아니라 첫 화면이 문제였다.
 *
 * 그 첫 질문이 "그 시간을 어떻게 보내세요?"였고, 보기 다섯 중 넷이 자기
 * 고백이었다(TV만 본다 / 혼자다 / 그냥 흘러간다). 8/4에 이걸 '삶의 변화'로
 * 바꿔봤다가 더 나빠져서 되돌렸다(56.5% → 70.4%, z=2.77 p=0.0056). 사별·이혼이
 * 첫 화면에 보이니 더 사적이었던 것이다.
 *
 * 두 번의 실패가 축을 알려줬다. 중요한 건 '사실이냐 평가냐'가 아니라
 * **얼마나 사적이냐**다. 그래서 여기는 가장 덜 사적인 질문으로 연다 —
 * "뭐가 제일 하고 싶으세요?" 고백도, 가족사도 없다.
 *
 * 문항은 셋뿐이다. 실제로 서비스가 쓰는 값이 활동·지역·나이라서다. 나머지
 * 리서치용 문항은 /needs에서 이미 132명분을 받았다.
 *
 * ── 색 ──────────────────────────────────────────────────────────────────────
 * 딥그린이 아니라 연분홍/테라코타. 광고 소재(506070 캐러셀)와 같은 팔레트라
 * 광고를 누른 사람이 같은 화면에 도착한 느낌을 받는다. 딥그린으로 받으면
 * "다른 데로 왔나" 싶어진다.
 */

import { useEffect, useRef, useState } from "react";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  PLAY_STORE_INTENT_URL,
  KOREAN_FONT_STACK,
} from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import { recordNeedsEvent } from "../needs/needs-events";
import { AppleMark, AndroidMark } from "../gyeol/StoreMarks";

const VARIANT = "enjoy";

// 광고 캐러셀과 같은 색. 새로 만들지 않는다.
const C = {
  blush: "#F7E4E1",
  ink: "#1A1A1A",
  terra: "#C85A3A",
  terraDeep: "#A8482D",
  muted: "#786E6C",
  white: "#FFFFFF",
  line: "#E7CFCA",
} as const;

type Q = {
  key: "activity" | "district" | "outing" | "ageBand";
  title: string;
  sub?: string;
  options: { value: string; label: string }[];
};

// 활동 보기는 /needs 4번 문항의 실측 분포를 따랐다(차 한잔 23 · 취미배움 18 ·
// 수다 18 · 여행 16 · 전시공연 10 · 운동등산 8). 고르게 갈리는 게 첫 질문으로
// 좋다 — 누구나 자기 답이 있다. 광고에 쓴 낱말(전시·연극·뮤지컬·여행)이
// 보기에 그대로 있어야 "방금 본 그거"로 이어진다.
const QUESTIONS: Q[] = [
  {
    key: "activity",
    title: "뭐가 제일\n하고 싶으세요?",
    sub: "고르시면 그걸 같이 할 분들을 찾아드려요",
    options: [
      { value: "culture", label: "전시·공연 나들이" },
      { value: "theater", label: "연극·뮤지컬" },
      { value: "travel", label: "같이 여행" },
      { value: "tea", label: "차 한잔, 맛있는 집" },
      { value: "hobby", label: "취미·배움 함께" },
      { value: "exercise", label: "운동·등산 같이" },
      { value: "walk", label: "동네 산책" },
      { value: "chat", label: "그냥 편한 수다" },
    ],
  },
  {
    key: "district",
    title: "어디서 만나기\n편하세요?",
    sub: "가까운 분들끼리 모아드려요",
    options: [
      { value: "gangnam", label: "강남·서초·송파" },
      { value: "jongno", label: "종로·중구·용산" },
      { value: "mapo", label: "마포·서대문·은평" },
      { value: "yeongdeungpo", label: "영등포·구로·양천·강서" },
      { value: "nowon", label: "노원·도봉·강북·성북" },
      { value: "gangdong", label: "광진·성동·동대문·중랑·강동" },
      // 경기·인천이 응답의 33%로 단일 최대 블록인데 한 칸이라, 어디에 자리를
      // 열지 알 수가 없었다. 40분 안에 모일 수 있는 묶음으로 쪼갠다.
      { value: "incheon", label: "인천·부천·김포" },
      { value: "gg_north", label: "고양·파주·의정부" },
      { value: "gg_south", label: "성남·용인·수원" },
      { value: "gg_west", label: "안양·광명·안산" },
      { value: "etc", label: "그 외 지역" },
    ],
  },
  {
    key: "outing",
    title: "요즘 바깥 활동은\n어떠세요?",
    sub: "편하게 고르시면 돼요",
    // /needs 아홉 문항 중 앱 받기를 실제로 예측한 답은 둘뿐이었고, 그중 하나가
    // "혼자서라도 나간다"였다(34% 대 18%, p=0.013). 나머지 — 사기 걱정, 연령,
    // 지금 상황, 활동 종류 — 는 전부 차이가 없었다. 유일하게 검증된 행동
    // 신호라 밝은판으로 옮겨 온다.
    //
    // 세 번째에 두는 이유: "나가고 싶은데 잘 안 된다"에는 자기 고백이 조금
    // 섞인다. /needs가 그런 질문을 첫 화면에 뒀다가 80%를 잃었다.
    options: [
      { value: "solo_out", label: "혼자서라도 나가는 편" },
      { value: "want_out", label: "나가고 싶은데 잘 안 돼요" },
      { value: "home", label: "집이 편해요" },
      { value: "has_group", label: "이미 다니는 모임이 있어요" },
    ],
  },
  {
    key: "ageBand",
    title: "연령대가\n어떻게 되세요?",
    // 만 45세 이상 전용임을 여기서 밝힌다. 설치 뒤 본인인증에서 튕기는 것보다
    // 지금 아는 편이 서로 낫다 — 결큐 시도자의 43%가 만 45세 미만이었다.
    sub: "티타는 만 45세 이상만 이용하실 수 있어요",
    options: [
      { value: "45-49", label: "45–49세" },
      { value: "50-54", label: "50–54세" },
      { value: "55-59", label: "55–59세" },
      { value: "60-64", label: "60–64세" },
      { value: "65plus", label: "65세 이상" },
      { value: "under45", label: "만 45세 미만이에요" },
    ],
  },
];

function detectPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

export default function EnjoyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");

  useEffect(() => setPlatform(detectPlatform()), []);

  // start는 화면이 실제로 보일 때만 쏜다. Meta 인앱 브라우저는 광고를 띄울 때
  // 랜딩을 미리 로드하는데, 그때도 찍히면 팬텀 도착이 쌓인다(/needs에서
  // 겪은 문제 그대로).
  const firedRef = useRef(false);
  useEffect(() => {
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      const hydMs = Math.round(
        typeof performance !== "undefined" ? performance.now() : 0,
      );
      recordNeedsEvent("start", { variant: VARIANT, hydMs });
      logAnalyticsEvent("enjoy_start", { hyd_ms: hydMs });
      trackPixel("EnjoyStart", {}, true);
    };
    if (typeof document === "undefined" || document.visibilityState === "visible") {
      fire();
      return;
    }
    const onVisible = () => {
      if (document.visibilityState === "visible") fire();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // 나갈 때 보고 있던 질문을 남긴다 — 어디서 관두는지 잡는 유일한 방법.
  const stepRef = useRef(step);
  stepRef.current = step;
  const doneRef = useRef(done);
  doneRef.current = done;
  const abandonRef = useRef(false);
  useEffect(() => {
    const onHide = () => {
      if (doneRef.current || abandonRef.current) return;
      // 한 번도 보인 적 없는 페이지는 이탈로 세지 않는다. start를 못 쐈다는
      // 건 화면에 뜬 적이 없다는 뜻이다(/needs에서 이 구멍 때문에 검사
      // 트래픽이 '첫 질문 이탈'로 잡혔다).
      if (!firedRef.current) return;
      abandonRef.current = true;
      recordNeedsEvent("abandon", {
        variant: VARIANT,
        q: QUESTIONS[stepRef.current].key,
        step: stepRef.current,
      });
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  const underage = answers.ageBand === "under45";

  function choose(value: string) {
    const q = QUESTIONS[step];
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    recordNeedsEvent("answer", {
      variant: VARIANT,
      q: q.key,
      step,
      [q.key]: value,
    });
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }
    setDone(true);
    recordNeedsEvent("complete", {
      variant: VARIANT,
      activity: next.activity,
      district: next.district,
      outing: next.outing,
      ageBand: next.ageBand,
    });
    logAnalyticsEvent("enjoy_complete", { activity: next.activity ?? "" });
    if (value === "under45") {
      trackPixel("NeedsUnderage", {}, true);
    } else {
      trackPixel("NeedsAgeQualified", { age_band: value }, true);
      trackPixel("EnjoyComplete", { activity: next.activity ?? "" }, true);
    }
  }

  function back() {
    if (done) {
      setDone(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  }

  function download(store: "ios" | "android") {
    recordNeedsEvent("download", { variant: VARIANT, ...answers, store });
    logAnalyticsEvent("app_download_click", { store, source: "enjoy" });
    trackPixel("AppDownloadClick", { store, source: "enjoy" }, true);
  }

  async function share() {
    recordNeedsEvent("share", { variant: VARIANT });
    const data = {
      title: "506070, 이제 즐길 때",
      text: "전시, 연극, 뮤지컬, 여행 — 같이 할 분을 찾는 곳이에요. 만 45세 이상.",
      url: "https://tita-app.com/enjoy",
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
      }
    } catch {
      /* 사용자가 취소한 것 — 조용히 넘긴다 */
    }
  }

  const page: React.CSSProperties = {
    minHeight: "100dvh",
    background: C.blush,
    fontFamily: KOREAN_FONT_STACK,
    display: "flex",
    justifyContent: "center",
    padding: "20px 20px 40px",
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
    color: C.ink,
    background: C.white,
    border: "none",
    borderRadius: 14,
    padding: "13px 18px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(160,90,70,0.10)",
  };
  const bigBtn: React.CSSProperties = {
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
    color: C.white,
    background: C.terra,
    border: "none",
    borderRadius: 999,
    padding: "17px 24px",
    cursor: "pointer",
  };

  // ── 결과 ──────────────────────────────────────────────────────────────────
  if (done) {
    if (underage) {
      return (
        <main style={page}>
          <div style={inner}>
            <div style={{ height: 40 }} />
            <h1 style={{ fontSize: 25, fontWeight: 800, lineHeight: 1.45, color: C.ink, margin: "0 0 10px", letterSpacing: "-0.6px" }}>
              아직은 티타를
              <br />
              쓰실 수 없어요
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.muted, margin: "0 0 26px" }}>
              티타는 만 45세 이상만 이용하실 수 있어요.
              <br />
              대신, 요즘 즐길 거리를 찾고 계신{" "}
              <b style={{ color: C.ink }}>만 45세 이상 가족·친구</b>가
              <br />
              떠오르지 않으세요?
            </p>
            <button onClick={share} style={bigBtn}>
              그분께 알려주기
            </button>
          </div>
        </main>
      );
    }
    const chosen = QUESTIONS[0].options.find((o) => o.value === answers.activity);
    return (
      <main style={page}>
        <div style={inner}>
          <div style={{ height: 32 }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: C.terra, margin: "0 0 8px" }}>
            고르셨어요
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.45, color: C.ink, margin: "0 0 14px", letterSpacing: "-0.6px" }}>
            {chosen?.label ?? "함께할 거리"},
            <br />
            같이 하실 분들을 찾아드릴게요
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: C.muted, margin: "0 0 28px" }}>
            결이 통하는 서넛이 모이면 티타가 알려드려요.
            <br />
            첫마디도 티타가 꺼내드리니 편하게 오시면 돼요.
          </p>

          {/* 기기를 못 알아본 경우엔 두 스토어를 나란히 준다.
              전에는 "안드로이드가 아니면 App Store"였는데, 그러면 기기를 못
              읽은 접속이 전부 iOS로 집계된다 — 실제로 iOS 클릭 27건 중 18건이
              그렇게 만들어진 허수였다(2026-08-06). 지표만 흐린 게 아니라,
              UA가 이상하게 잡힌 안드로이드 사용자를 엉뚱한 스토어로 보낸다. */}
          {platform === "other" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <a
                href={APP_STORE_URL}
                onClick={() => download("ios")}
                style={bigBtn}
              >
                <AppleMark />
                App Store에서 받기
              </a>
              <a
                href={PLAY_STORE_URL}
                onClick={() => download("android")}
                style={{ ...bigBtn, background: C.white, color: C.terra, border: `1.5px solid ${C.terra}` }}
              >
                <AndroidMark />
                Google Play에서 받기
              </a>
            </div>
          ) : (
            <>
              <a
                href={platform === "android" ? PLAY_STORE_URL : APP_STORE_URL}
                onClick={(e) => {
                  download(platform === "android" ? "android" : "ios");
                  if (platform === "android") {
                    e.preventDefault();
                    window.location.href = PLAY_STORE_INTENT_URL;
                  }
                }}
                style={bigBtn}
              >
                {platform === "android" ? <AndroidMark /> : <AppleMark />}
                티타 받기
              </a>
              <a
                href={platform === "android" ? APP_STORE_URL : PLAY_STORE_URL}
                onClick={() => download(platform === "android" ? "ios" : "android")}
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: C.muted,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  padding: 14,
                }}
              >
                {platform === "android" ? "아이폰이신가요?" : "안드로이드이신가요?"}
              </a>
            </>
          )}

          <p style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted, textAlign: "center", margin: "18px 0 0" }}>
            만 45세 이상 · 본인인증 · 셋넷이 함께
            <br />
            실명과 연락처는 다른 회원에게 보이지 않아요
          </p>
        </div>
      </main>
    );
  }

  // ── 질문 ──────────────────────────────────────────────────────────────────
  const q = QUESTIONS[step];
  return (
    <main style={page}>
      <div style={inner}>
        {step === 0 && (
          <p style={{ fontSize: 15, fontWeight: 800, color: C.terra, textAlign: "center", margin: "8px 0 14px", letterSpacing: "-0.3px" }}>
            506070, 이제 즐길 때
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button
            onClick={back}
            style={{
              fontFamily: KOREAN_FONT_STACK,
              fontSize: 14,
              fontWeight: 700,
              color: C.muted,
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
                  background: i <= step ? C.terra : C.line,
                  transition: "all .2s",
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>
            {step + 1}/{QUESTIONS.length}
          </span>
        </div>

        <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.42, letterSpacing: "-0.6px", color: C.ink, margin: "0 0 6px", whiteSpace: "pre-line" }}>
          {q.title}
        </h2>
        {q.sub && (
          <p style={{ fontSize: 13.5, color: C.muted, fontWeight: 600, margin: "0 0 16px" }}>
            {q.sub}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {q.options.map((o) => (
            <button key={o.value} onClick={() => choose(o.value)} style={optionBtn}>
              {o.label}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 12.5, color: C.muted, textAlign: "center", margin: "18px 0 0" }}>
          가입 없이 30초 · 만 45세 이상
        </p>
      </div>
    </main>
  );
}
