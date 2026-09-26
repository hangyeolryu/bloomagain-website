"use client";

/**
 * /sadon/survey — 사돈 수요조사
 *
 * 하는 일이 셋뿐이다 (docs/sadon/14_수요조사_문항.md).
 *   1. 관심 있는 분을 가려낸다
 *   2. 이런 기회가 있으면 하실 건지 묻는다
 *   3. 조건을 어디까지 보고 싶으신지 묻는다
 *
 * 탐색 조사가 아니라 선별이라 **자유서술을 두지 않는다.** 화면에서 글을 쓰게
 * 하면 대부분 건너뛰고, 쓰는 분만 남으면 표본이 한쪽으로 기운다. 말로 들어야
 * 할 것은 전화 인터뷰의 몫이다 (docs/sadon/12_참여자_검증.md).
 *
 * ⚠️ 신고 전이다. 신청도 결제도 받지 않고, 참가비를 얼마까지 내시겠냐고
 * 묻지도 않는다 — 가격 수용도를 묻는 순간 모집으로 읽힐 수 있다.
 * 그 사실을 화면 맨 위에 고정으로 적는다.
 *
 * ⚠️ 연락처(마지막 화면)는 설문 응답과 **다른 곳으로** 보낸다. 익명 세션에
 * 연락처가 붙으면 식별 가능해지고, 그 세션에는 종교·정치 선호가 들어 있어
 * 민감정보가 된다 (개인정보 보호법 제23조 · 04_법무_체크리스트 7장).
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "../../_components/tita-brand";
import {
  recordNeedsEvent,
  sendSadonContact,
  type NeedsAnswers,
} from "../../needs/needs-events";
import { QUESTIONS } from "./questions";

const VARIANT = "sadon";

export default function SadonSurveyPage() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<string, string | string[]>>({});
  const [multiSel, setMultiSel] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  // 1번에서 "아니요"를 고르신 분. 대상이 아니니 더 묻지 않고 인사만 한다.
  const [notTarget, setNotTarget] = useState(false);
  const [contact, setContact] = useState("");
  const [contactState, setContactState] =
    useState<"idle" | "sending" | "sent" | "failed">("idle");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    recordNeedsEvent("start", { variant: VARIANT });
  }, []);

  const q = QUESTIONS[step];
  const atEnd = step >= QUESTIONS.length;

  function send(phase: "answer" | "complete", extra?: NeedsAnswers) {
    recordNeedsEvent(phase, { variant: VARIANT, step, ...extra });
  }

  function advance(next: Record<string, string | string[]>) {
    setPicks(next);
    setMultiSel([]);
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
      recordNeedsEvent("complete", { variant: VARIANT, step: step + 1 });
    } else {
      setStep(step + 1);
    }
  }

  function chooseSingle(value: string) {
    const next = { ...picks, [q.field]: value };
    send("answer", { q: q.q, [q.field]: value } as NeedsAnswers);
    // 미혼 자녀가 없으시면 나머지 문항이 전부 쓸모없다. 붙잡지 않는다.
    if (q.q === "sdHasSingle" && value === "no") {
      setPicks(next);
      setNotTarget(true);
      recordNeedsEvent("complete", { variant: VARIANT, step });
      return;
    }
    advance(next);
  }

  function toggle(value: string) {
    setMultiSel((cur) => {
      if (cur.includes(value)) return cur.filter((v) => v !== value);
      // 상한은 권고다. 넘치면 제일 먼저 고른 것을 밀어낸다 — 못 고르게 막으면
      // 왜 안 눌리는지 알 수 없어 그냥 나가신다.
      if (q.max && cur.length >= q.max) return [...cur.slice(1), value];
      return [...cur, value];
    });
  }

  function submitMulti() {
    if (multiSel.length === 0) return;
    const next = { ...picks, [q.field]: multiSel };
    send("answer", { q: q.q, [q.field]: multiSel } as NeedsAnswers);
    advance(next);
  }

  function skip() {
    recordNeedsEvent("answer", { variant: VARIANT, q: "sdSkip", step });
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
      recordNeedsEvent("complete", { variant: VARIANT, step: step + 1 });
    } else {
      setStep(step + 1);
      setMultiSel([]);
    }
  }

  function back() {
    if (step === 0) return;
    setStep(step - 1);
    setMultiSel([]);
  }

  async function submitContact() {
    if (contact.trim().length < 4 || contactState === "sending") return;
    setContactState("sending");
    const ok = await sendSadonContact(contact);
    setContactState(ok ? "sent" : "failed");
  }

  // ── 스타일 ───────────────────────────────────────────────────────────
  const page: React.CSSProperties = {
    minHeight: "100dvh",
    background: TITA.cream,
    fontFamily: KOREAN_FONT_STACK,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 20px 48px",
  };
  const wrap: React.CSSProperties = { width: "100%", maxWidth: 480 };
  const notice: React.CSSProperties = {
    marginTop: 18,
    padding: "12px 14px",
    borderRadius: 12,
    background: TITA.surface,
    border: `1px solid ${TITA.sage}`,
    color: TITA.muted,
    fontSize: 13,
    lineHeight: 1.65,
  };
  const title: React.CSSProperties = {
    fontSize: 25,
    fontWeight: 800,
    lineHeight: 1.42,
    letterSpacing: "-0.6px",
    color: TITA.ink,
    whiteSpace: "pre-line",
    margin: "26px 0 8px",
  };
  const sub: React.CSSProperties = {
    fontSize: 14.5,
    lineHeight: 1.6,
    color: TITA.muted,
    margin: "0 0 22px",
  };
  const optionBtn = (on: boolean): React.CSSProperties => ({
    width: "100%",
    textAlign: "left",
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 16.5,
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: "-0.3px",
    color: on ? "#fff" : TITA.ink,
    background: on ? TITA.forest : "#fff",
    border: `1.5px solid ${on ? TITA.forest : "transparent"}`,
    borderRadius: 14,
    padding: "13px 18px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(160,90,70,0.10)",
  });
  // 45+ 화면 규칙 — 꺼진 버튼은 회색 + 할 일 라벨, 켜질 때 움직인다.
  const nextBtn = (on: boolean): React.CSSProperties => ({
    width: "100%",
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: "-0.3px",
    color: on ? "#fff" : TITA.muted,
    background: on ? TITA.forest : "#E6E1D8",
    border: "none",
    borderRadius: 999,
    padding: "15px 18px",
    cursor: on ? "pointer" : "default",
    transform: on ? "scale(1)" : "scale(0.985)",
    transition: "transform .18s ease, background .18s ease",
  });
  const ghost: React.CSSProperties = {
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 13.5,
    fontWeight: 700,
    color: TITA.muted,
    background: "transparent",
    border: `1px solid ${TITA.sage}`,
    borderRadius: 999,
    padding: "11px 14px",
    cursor: "pointer",
  };

  const Notice = () => (
    <p style={notice}>
      아직 문을 열지 않았습니다. 열기 전에 먼저 물어보려고 만든 조사예요.
      <br />
      <b style={{ color: TITA.ink }}>
        신청을 받거나 비용을 받는 화면이 아닙니다.
      </b>
    </p>
  );

  // ── 대상이 아니신 분 ─────────────────────────────────────────────────
  if (notTarget) {
    return (
      <main style={page}>
        <div style={wrap}>
          <h1 style={{ ...title, marginTop: 64 }}>
            {"답해주셔서\n고맙습니다."}
          </h1>
          <p style={sub}>
            이 조사는 미혼 자녀를 두신 분들께 드리는 것이라 여기서 마칩니다.
          </p>
          <Link href="/" style={{ ...ghost, display: "inline-block", textDecoration: "none" }}>
            티타 둘러보기
          </Link>
        </div>
      </main>
    );
  }

  // ── 마친 뒤 — 연락처(선택) ───────────────────────────────────────────
  if (done || atEnd) {
    return (
      <main style={page}>
        <div style={wrap}>
          <h1 style={{ ...title, marginTop: 56 }}>
            {"고맙습니다.\n큰 도움이 됐어요."}
          </h1>
          <p style={sub}>
            주신 답으로 자리를 어떻게 열지 정합니다.
          </p>

          {contactState === "sent" ? (
            <p style={{ ...notice, background: "#fff" }}>
              연락처를 받았습니다. 준비가 되면 알려드릴게요.
            </p>
          ) : (
            <>
              <p style={{ ...sub, marginBottom: 10 }}>
                자리가 준비되면 알려드릴까요? <b>선택이에요.</b>
              </p>
              <input
                type="text"
                inputMode="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="이메일 또는 휴대폰 번호"
                style={{
                  width: "100%",
                  fontFamily: KOREAN_FONT_STACK,
                  fontSize: 16.5,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: `1.5px solid ${TITA.sage}`,
                  background: "#fff",
                  color: TITA.ink,
                  marginBottom: 10,
                }}
              />
              <button
                onClick={submitContact}
                style={nextBtn(contact.trim().length >= 4)}
              >
                {contactState === "sending"
                  ? "보내는 중…"
                  : contact.trim().length >= 4
                    ? "알려주세요"
                    : "연락처를 적어주세요"}
              </button>
              {contactState === "failed" && (
                <p style={{ ...sub, marginTop: 10, color: "#C15A3C" }}>
                  잠깐 문제가 있었어요. 한 번만 다시 눌러주시겠어요?
                </p>
              )}
              <p style={{ ...sub, fontSize: 12.5, marginTop: 12 }}>
                적어주신 연락처는 <b>결과와 개설 안내에만</b> 씁니다. 설문
                답변과 따로 보관하고, 답변과 연결하지 않습니다.
              </p>
            </>
          )}

          <div style={{ marginTop: 26 }}>
            <Link
              href="/"
              style={{ ...ghost, display: "inline-block", textDecoration: "none" }}
            >
              티타 둘러보기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── 문항 ─────────────────────────────────────────────────────────────
  const canNext = multiSel.length > 0;
  return (
    <main style={page}>
      <div style={wrap}>
        <Notice />

        <div
          style={{
            marginTop: 20,
            height: 4,
            borderRadius: 999,
            background: TITA.sage,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((step + 1) / QUESTIONS.length) * 100}%`,
              height: "100%",
              background: TITA.forest,
              transition: "width .25s ease",
            }}
          />
        </div>
        <p style={{ ...sub, margin: "8px 0 0", fontSize: 13 }}>
          {step + 1} / {QUESTIONS.length}
        </p>

        <h1 style={title}>{q.title}</h1>
        {q.sub && <p style={sub}>{q.sub}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((o) => {
            const on = q.multi && multiSel.includes(o.value);
            return (
              <button
                key={o.value}
                onClick={() =>
                  q.multi ? toggle(o.value) : chooseSingle(o.value)
                }
                style={optionBtn(!!on)}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        {q.multi && (
          <div style={{ marginTop: 16 }}>
            <button onClick={submitMulti} style={nextBtn(canNext)}>
              {canNext ? "다음" : "하나 이상 골라주세요"}
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          {step > 0 && (
            <button onClick={back} style={{ ...ghost, flex: 1 }}>
              이전
            </button>
          )}
          <button onClick={skip} style={{ ...ghost, flex: 1 }}>
            건너뛰기
          </button>
        </div>
      </div>
    </main>
  );
}
