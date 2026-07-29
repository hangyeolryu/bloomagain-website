"use client";

// 결 유형 테스트 — 무가입 최상단 유입 훅.
// intro → 18문항(스타일 14 + 가치 4) → 결과 페이지(/gyeol/[code])로 client 라우팅.
// 목적: 자기발견 호기심으로 다운로드가 아니라 "테스트"를 시작하게 하고,
// 결과 공유 링크가 바이럴 루프를 돈다. 앱 다운로드는 결과 페이지에서 유도.

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
  PLAY_STORE_INTENT_URL,
} from "../_components/tita-brand";
import { QUIZ_QUESTIONS, scoreToCode, scoreToValue } from "./types";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import { recordGyeolEvent } from "./gyeol-events";
import { AppleMark, AndroidMark } from "./StoreMarks";

// 결과를 더 잘 맞추기 위한 두 가지(익명). 채점(8유형)에는 반영하지 않고,
// 결과 페이지 다운로드 훅 분기(comfort) + 대시보드 성비 집계(gender)에만 쓴다.
const GENDERS = [
  { key: "f", label: "여성" },
  { key: "m", label: "남성" },
] as const;
const COMFORTS = [
  { key: "same", label: "동성 친구가 편해요" },
  { key: "any", label: "상관없어요, 결만 맞으면" },
  { key: "opp", label: "이성 친구도 좋아요" },
] as const;


// 우리만의 찻잔 마크 — 앱 스플래시(tea_cup_icon.dart)의 도형을 그대로 SVG로.
// 초록 배경용: 크림 잔 + 테라코타 찻물 + 크림 김(모락모락, SMIL 애니메이션).
function TeaCupMark({ size = 96 }: { size?: number }) {
  const CREAM = "#F4EFE3";
  const bodyD = "M18 40 L66 40 L60 66 Q42 82 24 66 Z";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      style={{ display: "inline-block" }}
    >
      {/* 김 세 줄기 — 순서대로 모락모락 페이드 */}
      <g stroke={CREAM} strokeWidth={4.5} strokeLinecap="round">
        {[
          { d: "M34 36 C37 31 31 26 34 20", begin: "0s" },
          { d: "M42 34 C45 29 39 24 42 17", begin: "0.6s" },
          { d: "M50 36 C53 31 47 26 50 20", begin: "1.2s" },
        ].map((w, i) => (
          <path key={i} d={w.d} opacity={0}>
            <animate
              attributeName="opacity"
              values="0;0.85;0"
              dur="2.6s"
              begin={w.begin}
              repeatCount="indefinite"
            />
          </path>
        ))}
      </g>
      {/* 잔 몸통 + 찻물 + 표면 + 외곽선 + 손잡이 (스플래시와 동일 순서) */}
      <path d={bodyD} fill={CREAM} />
      <path d="M21.5 42 L62.5 42 L57.5 63 Q42 77 26.5 63 Z" fill="#D9694C" />
      <ellipse cx="42" cy="40" rx="24" ry="7" fill="#E8896F" />
      <path d={bodyD} stroke={CREAM} strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx="42" cy="40" rx="24" ry="7" stroke={CREAM} strokeWidth={6} />
      <path
        d="M66 46 C86 45 87 66 59.5 63"
        stroke={CREAM}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function GyeolTestPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<("a" | "b")[]>([]);
  // "quiz" → 14문항, "profile" → 마지막 두 가지(성별·편안함)
  const [stage, setStage] = useState<"quiz" | "profile">("quiz");
  const [gender, setGender] = useState<string | null>(null);
  const [comfort, setComfort] = useState<string | null>(null);

  const total = QUIZ_QUESTIONS.length;

  function begin() {
    logAnalyticsEvent("gyeol_test_start", {});
    recordGyeolEvent("start");
    trackPixel("GyeolTestStart", {}, true); // 커스텀 — 시작 청중
    setStarted(true);
  }

  function choose(pick: "a" | "b") {
    const next = [...answers];
    next[step] = pick;
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      // 문항 끝 → 결과 직전 프로필 한 화면
      setStage("profile");
    }
  }

  function finish() {
    const code = scoreToCode(answers);
    // 가치 결(성장/평온 · 열림/익숙) — 8유형과 별개로 계산해 결과에 얹는다.
    const value = scoreToValue(answers);
    const valueCode = `${value.direction}${value.openness}`; // 예: "GO"
    // 결과 페이지(정적)가 읽어 다운로드 훅을 개인화한다.
    try {
      // taken: 이 세션에서 직접 테스트를 마쳤다는 표시 — 결과 페이지가
      // "친구에게 물어보기"(테스트함) vs "나도 해보기"(공유로 유입)를 가른다.
      sessionStorage.setItem("tita_gyeol_taken", "1");
      sessionStorage.setItem("tita_gyeol_value", valueCode);
      if (comfort) sessionStorage.setItem("tita_gyeol_comfort", comfort);
      else sessionStorage.removeItem("tita_gyeol_comfort");
      if (gender) sessionStorage.setItem("tita_gyeol_gender", gender);
      else sessionStorage.removeItem("tita_gyeol_gender");
    } catch {
      /* sessionStorage 막힘 — 훅은 기본값으로 뜬다 */
    }
    logAnalyticsEvent("gyeol_test_complete", {
      gyeol_type: code,
      gyeol_value: valueCode,
      gyeol_gender: gender ?? "",
      gyeol_comfort: comfort ?? "",
    });
    recordGyeolEvent("complete", code, { gender, comfort });
    // 리타게팅 핵심: 완료 = Lead. 이 청중에게 다운로드 광고를 다시 띄운다.
    trackPixel("Lead", { content_name: code, content_category: "gyeol_test" });
    // 가치 결은 URL(?v=)로도 실어 공유 링크에서도 보이게(OG/라우트는 불변).
    router.push(`/gyeol/${code}?v=${valueCode}`);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  // 인트로에서 테스트 건너뛰고 바로 스토어로 — 클릭을 intro_download로 집계.
  function introDownload(store: "ios" | "android") {
    logAnalyticsEvent("app_download_click", { store, source: "gyeol_intro_direct" });
    recordGyeolEvent("intro_download", undefined, { store });
    trackPixel("AppDownloadClick", { store, source: "gyeol_intro_direct" }, true);
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        // 2026-07: 홈과 통일 — 딥그린 배경. 텍스트는 크림/세이지, 카드·주요
        // 버튼은 크림 반전으로 초록 위에서 또렷하게.
        background: `linear-gradient(160deg, ${TITA.forest} 0%, ${TITA.forestDeep} 100%)`,
        fontFamily: KOREAN_FONT_STACK,
        color: TITA.cream,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
      }}
    >
      {!started ? (
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          {/* 우리만의 찻잔 마크(앱 스플래시와 동일) — 김 모락모락. */}
          <div style={{ marginBottom: 12 }}>
            <TeaCupMark size={104} />
          </div>
          <p
            style={{
              color: TITA.camel,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              fontSize: 15,
              margin: "0 0 12px",
            }}
          >
            만 45세 이상, 결이 통하는 친구 찾기
          </p>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.3,
              margin: "0 0 16px",
              color: TITA.cream,
            }}
          >
            나는 어떤 결의
            <br />
            사람일까요?
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: TITA.sage,
              margin: "0 0 32px",
            }}
          >
            18개의 질문으로 알아보는 나의{" "}
            <b style={{ color: TITA.cream }}>결 유형</b>.
            <br />
            3분이면 충분해요. 가입 없이 바로 시작.
          </p>
          <button
            onClick={begin}
            style={{
              width: "100%",
              padding: "18px 24px",
              fontSize: 18,
              fontWeight: 700,
              color: TITA.forest,
              background: TITA.cream,
              border: "none",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: KOREAN_FONT_STACK,
              boxShadow: "0 10px 26px rgba(0,0,0,0.22)",
            }}
          >
            테스트 시작하기
          </button>

          {/* 테스트 건너뛰고 바로 앱 받기 — 스토어별 버튼(이미 마음먹은 사람용).
              안드로이드는 intent://로 인앱 브라우저 핸드오프 누수를 막는다.
              클릭은 intro_download로 집계. */}
          <p
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: TITA.camel,
              margin: "16px 0 10px",
            }}
          >
            바로 앱 받기 · 어떤 폰이세요?
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <a
              href={APP_STORE_URL}
              onClick={() => introDownload("ios")}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: "15px 12px",
                fontSize: 16,
                fontWeight: 700,
                color: TITA.cream,
                background: "transparent",
                border: "1.5px solid rgba(251,247,240,0.55)",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: KOREAN_FONT_STACK,
                textDecoration: "none",
              }}
            >
              <AppleMark size={22} />
              아이폰
            </a>
            <a
              href={PLAY_STORE_URL}
              onClick={(e) => {
                introDownload("android");
                // 안드로이드는 intent://로 스토어 앱 강제 실행(인앱에서도 뜸).
                if (
                  typeof navigator !== "undefined" &&
                  /Android/.test(navigator.userAgent)
                ) {
                  e.preventDefault();
                  window.location.href = PLAY_STORE_INTENT_URL;
                }
              }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                padding: "15px 12px",
                fontSize: 16,
                fontWeight: 700,
                color: TITA.cream,
                background: "transparent",
                border: "1.5px solid rgba(251,247,240,0.55)",
                borderRadius: 999,
                cursor: "pointer",
                fontFamily: KOREAN_FONT_STACK,
                textDecoration: "none",
              }}
            >
              <AndroidMark size={22} />
              삼성폰
            </a>
          </div>
          <p style={{ fontSize: 12.5, color: TITA.sage, marginTop: 8, fontWeight: 600 }}>
            무료 · NICE 본인인증으로 안전하게
          </p>

          <p style={{ fontSize: 13, color: TITA.sage, opacity: 0.85, marginTop: 16 }}>
            나와 결이 맞는 친구 유형까지 알려드려요.
            <br />
            티타에선 답할수록 더 또렷해져, 진짜 맞는 사람을 찾아줘요.
          </p>
        </div>
      ) : stage === "quiz" ? (
        <div style={{ maxWidth: 520, width: "100%" }}>
          {/* 진행 바 */}
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: TITA.sage,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              <span>
                {step + 1} / {total}
              </span>
              <button
                onClick={back}
                disabled={step === 0}
                style={{
                  background: "none",
                  border: "none",
                  color: step === 0 ? "rgba(214,226,216,0.45)" : TITA.cream,
                  cursor: step === 0 ? "default" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: KOREAN_FONT_STACK,
                  padding: 0,
                }}
              >
                ← 이전
              </button>
            </div>
            <div
              style={{
                height: 6,
                background: "rgba(251,247,240,0.18)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((step + 1) / total) * 100}%`,
                  background: TITA.camel,
                  borderRadius: 999,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* 질문 */}
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.8px",
              lineHeight: 1.4,
              color: TITA.cream,
              margin: "0 0 28px",
              minHeight: 68,
            }}
          >
            {QUIZ_QUESTIONS[step].q}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(["a", "b"] as const).map((key) => {
              const opt = QUIZ_QUESTIONS[step][key];
              return (
                <button
                  key={key}
                  onClick={() => choose(key)}
                  style={{
                    padding: "22px 24px",
                    fontSize: 17,
                    fontWeight: 600,
                    textAlign: "left",
                    color: TITA.ink,
                    background: TITA.white,
                    border: `2px solid ${TITA.sage}`,
                    borderRadius: 16,
                    cursor: "pointer",
                    fontFamily: KOREAN_FONT_STACK,
                    lineHeight: 1.5,
                    transition: "border-color 0.15s, transform 0.05s",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "scale(0.99)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = TITA.sage;
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = TITA.forestMid)
                  }
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ marginBottom: 8 }}>
            <TeaCupMark size={72} />
          </div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.8px",
              lineHeight: 1.35,
              color: TITA.cream,
              margin: "0 0 8px",
            }}
          >
            마지막으로, 딱 두 가지만
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: TITA.sage, margin: "0 0 28px" }}>
            결과를 더 잘 맞춰드릴게요. (선택 · 익명으로 집계돼요)
          </p>

          {/* 성별 */}
          <p style={{ fontSize: 14, fontWeight: 700, color: TITA.camel, margin: "0 0 10px", textAlign: "left" }}>
            나는
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {GENDERS.map((g) => {
              const on = gender === g.key;
              return (
                <button
                  key={g.key}
                  onClick={() => setGender(on ? null : g.key)}
                  style={{
                    flex: 1,
                    padding: "16px 12px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: on ? TITA.forestDeep : TITA.ink,
                    background: on ? TITA.camel : TITA.cream,
                    border: `2px solid ${on ? TITA.camel : "transparent"}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: KOREAN_FONT_STACK,
                  }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

          {/* 편안함 */}
          <p style={{ fontSize: 14, fontWeight: 700, color: TITA.camel, margin: "0 0 4px", textAlign: "left" }}>
            어떤 분들과 함께일 때 더 편안하세요?
          </p>
          <p style={{ fontSize: 12.5, color: TITA.sage, opacity: 0.85, margin: "0 0 10px", textAlign: "left" }}>
            친구로서요 🙂
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {COMFORTS.map((c) => {
              const on = comfort === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setComfort(on ? null : c.key)}
                  style={{
                    padding: "16px 18px",
                    fontSize: 16,
                    fontWeight: 600,
                    textAlign: "left",
                    color: on ? TITA.forestDeep : TITA.ink,
                    background: on ? TITA.camel : TITA.cream,
                    border: `2px solid ${on ? TITA.camel : "transparent"}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: KOREAN_FONT_STACK,
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={finish}
            style={{
              width: "100%",
              padding: "18px 24px",
              fontSize: 18,
              fontWeight: 700,
              color: TITA.forest,
              background: TITA.cream,
              border: "none",
              borderRadius: 999,
              cursor: "pointer",
              fontFamily: KOREAN_FONT_STACK,
              boxShadow: "0 10px 26px rgba(0,0,0,0.22)",
            }}
          >
            결과 보기
          </button>
          <button
            onClick={finish}
            style={{
              background: "none",
              border: "none",
              color: TITA.sage,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: KOREAN_FONT_STACK,
              marginTop: 14,
            }}
          >
            건너뛰고 결과 보기
          </button>
        </div>
      )}
    </main>
  );
}
