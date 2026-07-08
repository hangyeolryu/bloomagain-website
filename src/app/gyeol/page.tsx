"use client";

// 결 유형 테스트 — 무가입 최상단 유입 훅.
// intro → 12문항 → 결과 페이지(/gyeol/[code])로 client 라우팅.
// 목적: 자기발견 호기심으로 다운로드가 아니라 "테스트"를 시작하게 하고,
// 결과 공유 링크가 바이럴 루프를 돈다. 앱 다운로드는 결과 페이지에서 유도.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { QUESTIONS, scoreToCode } from "./types";
import { logAnalyticsEvent } from "@/lib/firebase";
import { recordGyeolEvent } from "./gyeol-events";

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

export default function GyeolTestPage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<("a" | "b")[]>([]);
  // "quiz" → 12문항, "profile" → 마지막 두 가지(성별·편안함)
  const [stage, setStage] = useState<"quiz" | "profile">("quiz");
  const [gender, setGender] = useState<string | null>(null);
  const [comfort, setComfort] = useState<string | null>(null);

  const total = QUESTIONS.length;

  function begin() {
    logAnalyticsEvent("gyeol_test_start", {});
    recordGyeolEvent("start");
    setStarted(true);
  }

  function choose(pick: "a" | "b") {
    const next = [...answers];
    next[step] = pick;
    setAnswers(next);
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      // 12문항 끝 → 결과 직전 프로필 한 화면
      setStage("profile");
    }
  }

  function finish() {
    const code = scoreToCode(answers);
    // 결과 페이지(정적)가 읽어 다운로드 훅을 개인화한다.
    try {
      // taken: 이 세션에서 직접 테스트를 마쳤다는 표시 — 결과 페이지가
      // "친구에게 물어보기"(테스트함) vs "나도 해보기"(공유로 유입)를 가른다.
      sessionStorage.setItem("tita_gyeol_taken", "1");
      if (comfort) sessionStorage.setItem("tita_gyeol_comfort", comfort);
      else sessionStorage.removeItem("tita_gyeol_comfort");
      if (gender) sessionStorage.setItem("tita_gyeol_gender", gender);
      else sessionStorage.removeItem("tita_gyeol_gender");
    } catch {
      /* sessionStorage 막힘 — 훅은 기본값으로 뜬다 */
    }
    logAnalyticsEvent("gyeol_test_complete", {
      gyeol_type: code,
      gyeol_gender: gender ?? "",
      gyeol_comfort: comfort ?? "",
    });
    recordGyeolEvent("complete", code, { gender, comfort });
    router.push(`/gyeol/${code}`);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(160deg, ${TITA.cream} 0%, ${TITA.surface} 100%)`,
        fontFamily: KOREAN_FONT_STACK,
        color: TITA.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
      }}
    >
      {!started ? (
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🍵</div>
          <p
            style={{
              color: TITA.forestMid,
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
              color: TITA.forestDeep,
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
              color: TITA.muted,
              margin: "0 0 32px",
            }}
          >
            12개의 질문으로 알아보는 나의 <b style={{ color: TITA.ink }}>결 유형</b>.
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
              color: TITA.cream,
              background: TITA.forest,
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              fontFamily: KOREAN_FONT_STACK,
              boxShadow: "0 8px 24px rgba(31,78,61,0.24)",
            }}
          >
            테스트 시작하기
          </button>
          <p style={{ fontSize: 13, color: TITA.mutedSoft, marginTop: 16 }}>
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
                color: TITA.muted,
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
                  color: step === 0 ? TITA.mutedSoft : TITA.forestMid,
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
                background: TITA.sage,
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((step + 1) / total) * 100}%`,
                  background: TITA.forest,
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
              color: TITA.forestDeep,
              margin: "0 0 28px",
              minHeight: 68,
            }}
          >
            {QUESTIONS[step].q}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(["a", "b"] as const).map((key) => {
              const opt = QUESTIONS[step][key];
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
          <div style={{ fontSize: 44, marginBottom: 8 }}>🍵</div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-0.8px",
              lineHeight: 1.35,
              color: TITA.forestDeep,
              margin: "0 0 8px",
            }}
          >
            마지막으로, 딱 두 가지만
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: TITA.muted, margin: "0 0 28px" }}>
            결과를 더 잘 맞춰드릴게요. (선택 · 익명으로 집계돼요)
          </p>

          {/* 성별 */}
          <p style={{ fontSize: 14, fontWeight: 700, color: TITA.forestMid, margin: "0 0 10px", textAlign: "left" }}>
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
                    color: on ? TITA.cream : TITA.ink,
                    background: on ? TITA.forest : TITA.white,
                    border: `2px solid ${on ? TITA.forest : TITA.sage}`,
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
          <p style={{ fontSize: 14, fontWeight: 700, color: TITA.forestMid, margin: "0 0 4px", textAlign: "left" }}>
            어떤 분들과 함께일 때 더 편안하세요?
          </p>
          <p style={{ fontSize: 12.5, color: TITA.mutedSoft, margin: "0 0 10px", textAlign: "left" }}>
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
                    color: on ? TITA.cream : TITA.ink,
                    background: on ? TITA.forest : TITA.white,
                    border: `2px solid ${on ? TITA.forest : TITA.sage}`,
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
              color: TITA.cream,
              background: TITA.forest,
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              fontFamily: KOREAN_FONT_STACK,
              boxShadow: "0 8px 24px rgba(31,78,61,0.24)",
            }}
          >
            결과 보기 🍵
          </button>
          <button
            onClick={finish}
            style={{
              background: "none",
              border: "none",
              color: TITA.mutedSoft,
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
