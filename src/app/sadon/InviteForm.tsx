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
import {
  EVENT_CHILD_AGES,
  EVENT_CHILD_JOBS,
  EVENT_MATCH_PREFS,
  EVENT_MATCH_NONE,
  CHILD_SIDE,
} from "./_sadon";

const API =
  process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL ??
  "https://bloomagain-backend-api-469607573966.asia-northeast3.run.app";

type Choice = { id: string; label: string; options: readonly string[]; required?: boolean };

const CHOICES: Choice[] = [
  { id: "childSide", label: "자녀분은", options: CHILD_SIDE },
  { id: "childAge", label: "자녀분 나이", options: EVENT_CHILD_AGES },
  // 하시는 일은 반드시 받는다. 자리를 짜는 데 쓰고, 없으면 편성이 안 된다.
  { id: "childJob", label: "하시는 일", options: EVENT_CHILD_JOBS, required: true },
];

export function InviteForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [referral, setReferral] = useState("");
  // 보기에 없으면 적으신다. 「그 밖의 일」 같은 뭉뚱그린 보기를 두면
  // 고르시기는 쉬운데 우리는 아무것도 알지 못한다.
  const [jobEtc, setJobEtc] = useState("");
  // 우리가 묻지 않은 것이 들어오는 유일한 칸. 비어 있어도 괜찮다.
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<Record<string, string>>({});
  // 「어떤 점이 비슷했으면」은 여러 개 고르실 수 있다. 하나만 고르게 하면
  // 제일 중요한 것 하나로 눌러 담게 되는데, 실제로는 여럿이다.
  const [prefs, setPrefs] = useState<string[]>([]);
  const togglePref = (v: string) =>
    setPrefs((cur) => {
      if (v === EVENT_MATCH_NONE) return cur.includes(v) ? [] : [v];
      const next = cur.filter((x) => x !== EVENT_MATCH_NONE);
      return next.includes(v) ? next.filter((x) => x !== v) : [...next, v];
    });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  // 받침이 있으면 을, 없으면 를. "성함을" · "연락처를" · "하시는 일을".
  const particle = (w: string) => {
    const c = w.charCodeAt(w.length - 1) - 0xac00;
    return c >= 0 && c <= 11171 && c % 28 !== 0 ? "을" : "를";
  };
  const missing: { word: string; verb: string } | null =
    name.trim().length < 2 ? {word: "성함", verb: "적어주세요"}
      : contact.trim().length < 4 ? {word: "연락처", verb: "적어주세요"}
        // 하시는 일은 고르는 것이지 적는 것이 아니다.
        : !(picked.childJob || jobEtc.trim())
          ? {word: "하시는 일", verb: "골라주세요"}
          : null;
  const ready = missing === null;

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
        body: JSON.stringify({
          name, contact, referral, ...picked,
          // 적으신 게 있으면 그걸 쓴다.
          childJob: jobEtc.trim() || picked.childJob || null,
          matchPref: prefs.join(", ") || null,
          note: note.trim() || null,
        }),
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
              const on = picked[c.id] === o && !(c.id === "childJob" && jobEtc.trim());
              return (
                <button
                  key={o}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    if (c.id === "childJob") setJobEtc("");
                    setPicked((p) => ({ ...p, [c.id]: o }));
                  }}
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
          {c.id === "childJob" && (
            <input
              style={{ ...input, marginTop: 10, minHeight: 50, fontSize: 16 }}
              value={jobEtc}
              placeholder="보기에 없으면 여기에 적어주세요"
              onChange={(e) => {
                setJobEtc(e.target.value);
                if (e.target.value.trim()) {
                  setPicked((p) => {
                    const n = { ...p }; delete n.childJob; return n;
                  });
                }
              }}
            />
          )}
        </div>
      ))}

      <label style={label}>
        어떤 점이 비슷했으면 하세요
        <span style={{ fontWeight: 400, color: TITA.mutedSoft, fontSize: 15 }}>
          {"  여러 개 고르셔도 돼요"}
        </span>
      </label>
      {/* 아홉 줄을 격자로 깔면 빽빽해서 눈이 못 따라간다. 한 줄에 하나씩,
          왼쪽으로 붙여 목록처럼 읽히게 한다. 고른 것에는 체크를 세워
          "몇 개 골랐는지"가 훑어서 보이게 한다. */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...EVENT_MATCH_PREFS, EVENT_MATCH_NONE].map((o) => {
          const on = prefs.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => togglePref(o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                minHeight: 54,
                padding: "0 16px",
                borderRadius: 12,
                border: `1px solid ${on ? TITA.forest : TITA.sage}`,
                background: on ? TITA.surface : "#fff",
                color: on ? TITA.forestDeep : TITA.ink,
                fontWeight: on ? 700 : 400,
                fontSize: 16.5,
                fontFamily: "inherit",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <span
                aria-hidden
                style={{
                  flex: "none",
                  width: 20,
                  color: on ? TITA.forest : TITA.sage,
                  fontWeight: 800,
                }}
              >
                {on ? "✓" : "○"}
              </span>
              {o}
            </button>
          );
        })}
      </div>

      <label htmlFor="iv-ref" style={label}>어느 분을 통해 들으셨어요</label>
      <input id="iv-ref" style={input} value={referral} placeholder="성함을 적어주시면 됩니다"
        onChange={(e) => setReferral(e.target.value)} />

      <label htmlFor="iv-note" style={label}>
        더 하고 싶은 말씀
        <span style={{ fontWeight: 400, color: TITA.mutedSoft, fontSize: 15 }}>
          {"  안 쓰셔도 돼요"}
        </span>
      </label>
      <textarea
        id="iv-note"
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="자녀분 이야기나, 이 자리에 바라시는 것이 있으면 편하게 적어주세요."
        style={{
          ...input,
          minHeight: 120,
          padding: "14px 16px",
          lineHeight: 1.7,
          resize: "vertical",
        }}
      />

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
        {state === "sending"
          ? "보내는 중이에요"
          : ready
            ? "신청할게요"
            : `${missing.word}${particle(missing.word)} ${missing.verb}`}
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
