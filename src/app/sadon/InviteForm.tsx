"use client";

/**
 * 10월 31일 자리 신청서.
 *
 * 초대장 안에 있는 폼이라 짧게 간다. 성함과 연락처가 필수고 나머지는
 * 자리를 짜는 데만 쓴다 — **무엇을 보는지 설명하지 않는다.** 초대를 받고
 * 오시는 분께 자격을 늘어놓는 건 실례다.
 *
 * 자녀분 정보는 나이대·성별·직군 대분류까지만. 이름·학교·회사는 받지
 * 않는다 (제3자 개인정보).
 */

import { useState } from "react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { EVENT_CHILD_AGES, EVENT_CHILD_JOBS, EVENT_MATCH_PREFS, CHILD_SIDE } from "./_sadon";

const API =
  process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL ??
  "https://bloomagain-backend-api-469607573966.asia-northeast3.run.app";

type Choice = { id: string; label: string; options: readonly string[] };

const CHOICES: Choice[] = [
  { id: "childSide", label: "자녀분은", options: CHILD_SIDE },
  { id: "childAge", label: "자녀분 연세", options: EVENT_CHILD_AGES },
  { id: "childJob", label: "하시는 일", options: EVENT_CHILD_JOBS },
  { id: "matchPref", label: "어떤 점이 비슷했으면 하세요", options: EVENT_MATCH_PREFS },
];

export function InviteForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [referral, setReferral] = useState("");
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const ready = name.trim().length >= 2 && contact.trim().length >= 4;

  const input: React.CSSProperties = {
    width: "100%",
    minHeight: 54,
    padding: "0 16px",
    fontSize: 17,
    border: `1px solid ${TITA.sage}`,
    borderRadius: 12,
    background: "#fff",
    color: TITA.ink,
    fontFamily: "inherit",
  };
  const label: React.CSSProperties = {
    display: "block",
    fontSize: 17,
    fontWeight: 700,
    color: TITA.ink,
    margin: "22px 0 10px",
  };

  async function send() {
    if (!ready || state === "sending") return;
    setState("sending");
    try {
      const r = await fetch(`${API}/api/v1/gyeol/sadon-event-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, referral, ...picked }),
      });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div
        style={{
          background: TITA.surface,
          borderRadius: 20,
          padding: "40px 28px",
          textAlign: "center",
          fontFamily: KOREAN_FONT_STACK,
        }}
      >
        <p style={{ fontSize: 22, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 12px" }}>
          신청해 주셔서 고맙습니다
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: TITA.muted, margin: 0 }}>
          이틀 안에 전화로 연락드리겠습니다.
          <br />
          자리가 정해지면 장소도 그때 알려드릴게요.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: TITA.white,
        border: `1px solid ${TITA.sage}`,
        borderRadius: 20,
        padding: "28px 24px",
        fontFamily: KOREAN_FONT_STACK,
      }}
    >
      <label htmlFor="iv-name" style={{ ...label, marginTop: 4 }}>성함</label>
      <input id="iv-name" style={input} value={name} placeholder="성함을 적어주세요"
        onChange={(e) => setName(e.target.value)} />

      <label htmlFor="iv-tel" style={label}>연락처</label>
      <input id="iv-tel" type="tel" style={input} value={contact} placeholder="010-0000-0000"
        onChange={(e) => setContact(e.target.value)} />

      {CHOICES.map((c) => (
        <div key={c.id}>
          <label style={label}>{c.label}</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {c.options.map((o) => {
              const on = picked[c.id] === o;
              return (
                <button
                  key={o}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPicked((p) => ({ ...p, [c.id]: o }))}
                  style={{
                    flex: "1 1 140px",
                    minHeight: 52,
                    borderRadius: 12,
                    border: `1px solid ${on ? TITA.forest : TITA.sage}`,
                    background: on ? TITA.surface : "#fff",
                    color: on ? TITA.forestDeep : TITA.muted,
                    fontWeight: on ? 700 : 400,
                    fontSize: 16,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <label htmlFor="iv-ref" style={label}>어느 분을 통해 들으셨어요</label>
      <input id="iv-ref" style={input} value={referral} placeholder="성함을 적어주시면 됩니다"
        onChange={(e) => setReferral(e.target.value)} />

      <button
        type="button"
        onClick={send}
        disabled={!ready || state === "sending"}
        style={{
          width: "100%",
          minHeight: 58,
          marginTop: 28,
          borderRadius: 999,
          border: "none",
          background: ready ? TITA.forest : TITA.mutedSoft,
          color: "#fff",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: ready ? "pointer" : "default",
        }}
      >
        {state === "sending" ? "보내는 중이에요" : ready ? "신청할게요" : "성함과 연락처를 적어주세요"}
      </button>

      {state === "error" && (
        <p style={{ fontSize: 15, color: "#B4433A", textAlign: "center", marginTop: 14 }}>
          잠시 문제가 있었어요. 다시 한 번 눌러주시겠어요?
        </p>
      )}

      <p style={{ fontSize: 14, lineHeight: 1.8, color: TITA.mutedSoft, textAlign: "center", marginTop: 16 }}>
        받은 연락처는 이 자리를 안내해 드리는 데만 씁니다.
      </p>
    </div>
  );
}
