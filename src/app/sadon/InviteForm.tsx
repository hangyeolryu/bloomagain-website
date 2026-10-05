"use client";

/**
 * 티타 아너스 티타임 신청서 (2026-10-31, 유료).
 *
 * ⚠️ 2026-09-30 다시 썼다. 자녀 직군·「어떤 점이 비슷했으면」을 뺐다 —
 * 자녀 조건으로 자리를 짜면 알선의 모양이 된다. 자녀분은 성별(성비를 맞추는
 * 데만)과 나이대까지만 받는다. 이름·학교·회사는 받지 않는다.
 *
 * 백엔드는 기존 `/gyeol/sadon-event-signup` 을 그대로 쓴다. 새 문항(출생연도·
 * 본인 소개·신청 이유)은 스키마에 칸이 없어 note 에 이름표를 붙여 담는다.
 *
 * 제출 직전에 면책 고지(DISCLAIMER)를 원문 그대로 보여주고 확인을 받는다.
 */

import { useEffect, useRef, useState } from "react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { trackPixel } from "@/lib/pixel";
import { logAnalyticsEvent } from "@/lib/firebase";
import { BIRTH_YEARS, CHILD_SIDE, DISCLAIMER, EVENT_CHILD_AGES } from "./_sadon";

const API =
  process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL ??
  "https://bloomagain-backend-api-469607573966.asia-northeast3.run.app";

export function InviteForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [intro, setIntro] = useState("");
  const [childSide, setChildSide] = useState("");
  const [childAge, setChildAge] = useState("");
  const [reason, setReason] = useState("");
  const [referral, setReferral] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  // 받침이 있으면 을, 없으면 를.
  const particle = (w: string) => {
    const c = w.charCodeAt(w.length - 1) - 0xac00;
    return c >= 0 && c <= 11171 && c % 28 !== 0 ? "을" : "를";
  };
  const missing: { word: string; verb: string } | null =
    name.trim().length < 2 ? { word: "성함", verb: "적어주세요" }
      : contact.trim().length < 4 ? { word: "연락처", verb: "적어주세요" }
        : !birthYear ? { word: "태어나신 해", verb: "골라주세요" }
          : !childSide ? { word: "자녀분", verb: "골라주세요" }
            : !childAge ? { word: "자녀분 나이", verb: "골라주세요" }
              : !agreed ? { word: "안내 확인", verb: "해주세요" }
                : null;
  const ready = missing === null;

  // ── 이탈 지점 측정 (2026-10-05) — 값은 보내지 않고 "어디까지 왔나"만 ──
  const track = (event: string, params: Record<string, string | number> = {}) => {
    logAnalyticsEvent(event, params);
    trackPixel("Honors" + event.replace(/^honors_/, "").replace(/(^|_)(\w)/g, (_m, _p, c: string) => c.toUpperCase()), params, true);
  };
  const started = useRef(false);
  const onFirstTouch = () => {
    if (started.current) return;
    started.current = true;
    track("honors_form_start");
  };
  const doneFields = useRef(new Set<string>());
  useEffect(() => {
    const checks: [string, boolean][] = [
      ["name", name.trim().length >= 2],
      ["contact", contact.trim().length >= 4],
      ["birth_year", !!birthYear],
      ["child_side", !!childSide],
      ["child_age", !!childAge],
      ["agreed", agreed],
    ];
    checks.forEach(([f, ok]) => {
      if (ok && !doneFields.current.has(f)) {
        doneFields.current.add(f);
        track("honors_field_done", { field: f, step: doneFields.current.size });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, contact, birthYear, childSide, childAge, agreed]);

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
  const area: React.CSSProperties = { ...input, minHeight: 110, padding: "14px 16px", lineHeight: 1.7, resize: "vertical" };
  const label: React.CSSProperties = { display: "block", fontSize: 17, fontWeight: 700, color: TITA.ink, margin: "24px 0 10px" };
  const hint: React.CSSProperties = { fontWeight: 400, color: TITA.mutedSoft, fontSize: 15 };

  function Choices({ options, value, onPick }: { options: readonly string[]; value: string; onPick: (v: string) => void }) {
    return (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onPick(o)}
              style={{
                flex: "1 1 130px",
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
    );
  }

  async function send() {
    if (!ready || state === "sending") return;
    track("honors_submit");
    setState("sending");
    const note = [
      `태어난 해: ${birthYear}`,
      intro.trim() && `본인 소개: ${intro.trim()}`,
      reason.trim() && `신청 이유: ${reason.trim()}`,
      "구분: 티타 아너스 티타임(제1회 15만 원) · 고지 확인함",
    ]
      .filter(Boolean)
      .join("\n");
    try {
      const r = await fetch(`${API}/api/v1/gyeol/sadon-event-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, childSide, childAge, referral: referral.trim() || null, note }),
      });
      // 백엔드는 저장에 실패해도 200 + {ok:false} 를 준다. 본문까지 본다.
      const body = r.ok ? await r.json().catch(() => ({})) : {};
      if (body?.ok) {
        // Meta 광고가 '신청한 사람'을 학습하도록 표준 Lead 전환을 쏜다(2026-10-04).
        trackPixel("Lead", { content_name: "honors_2026_10_31", value: 150000, currency: "KRW" });
      }
      setState(body?.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div style={{ background: TITA.surface, borderRadius: 20, padding: "40px 28px", textAlign: "center", fontFamily: KOREAN_FONT_STACK }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 12px" }}>신청해 주셔서 고맙습니다</p>
        <p style={{ fontSize: 17, lineHeight: 1.85, color: TITA.muted, margin: 0, wordBreak: "keep-all" }}>
          이틀 안에 티타에서 전화를 드립니다.
          <br />
          참가가 확정되면 문자로 입금 계좌를 보내드리고,
          <br />
          입금이 확인되면 장소와 당일 안내를
          <br />
          다시 보내드려요.
        </p>
      </div>
    );
  }

  return (
    <div
      onFocusCapture={onFirstTouch}
      onPointerDownCapture={onFirstTouch}
      style={{ background: TITA.white, border: `1px solid ${TITA.sage}`, borderRadius: 20, padding: "28px 24px", fontFamily: KOREAN_FONT_STACK }}
    >
      <label htmlFor="iv-name" style={{ ...label, marginTop: 4 }}>1. 성함</label>
      <input id="iv-name" style={input} value={name} placeholder="성함을 적어주세요" onChange={(e) => setName(e.target.value)} />

      <label htmlFor="iv-tel" style={label}>2. 연락처</label>
      <input id="iv-tel" type="tel" style={input} value={contact} placeholder="010-0000-0000" onChange={(e) => setContact(e.target.value)} />

      <label htmlFor="iv-year" style={label}>3. 태어나신 해</label>
      <select id="iv-year" style={input} value={birthYear} onChange={(e) => setBirthYear(e.target.value)}>
        <option value="">골라주세요</option>
        {BIRTH_YEARS.map((y) => (
          <option key={y} value={y}>{y}년</option>
        ))}
      </select>

      <label htmlFor="iv-intro" style={label}>
        4. 어떤 분이신지 한두 줄로 소개해 주세요
        <span style={hint}>{"  안 쓰셔도 돼요"}</span>
      </label>
      <textarea
        id="iv-intro"
        rows={3}
        style={area}
        value={intro}
        placeholder="예: 교직에서 은퇴하고 요즘은 전시와 산책을 즐겨요."
        onChange={(e) => setIntro(e.target.value)}
      />

      <label style={label}>
        5. 자녀분은
        <span style={hint}>{"  고르게 모이도록 자리를 꾸리는 데만 써요"}</span>
      </label>
      <Choices options={CHILD_SIDE} value={childSide} onPick={setChildSide} />

      <label style={label}>6. 자녀분 나이</label>
      <Choices options={EVENT_CHILD_AGES} value={childAge} onPick={setChildAge} />

      <label htmlFor="iv-reason" style={label}>
        7. 이 모임에 오시려는 이유
        <span style={hint}>{"  안 쓰셔도 돼요"}</span>
      </label>
      <textarea
        id="iv-reason"
        rows={3}
        style={area}
        value={reason}
        placeholder="예: 요즘 아이들 결혼 이야기를 비슷한 입장의 분들과 나눠보고 싶어요."
        onChange={(e) => setReason(e.target.value)}
      />

      <label htmlFor="iv-ref" style={label}>
        어떻게 알게 되셨어요
        <span style={hint}>{"  소개해 주신 분이 있으면 성함을"}</span>
      </label>
      <input id="iv-ref" style={input} value={referral} onChange={(e) => setReferral(e.target.value)} />

      {/* ── 제출 직전 고지 — 원문 그대로 ─────────────────────────────── */}
      <div
        style={{
          marginTop: 30,
          background: TITA.surface,
          borderRadius: 14,
          padding: "20px 18px",
          fontSize: 15,
          lineHeight: 1.85,
          color: TITA.ink,
          wordBreak: "keep-all",
        }}
      >
        <b style={{ display: "block", marginBottom: 8 }}>신청 전에 읽어주세요</b>
        {DISCLAIMER}
      </div>
      <button
        type="button"
        role="checkbox"
        aria-checked={agreed}
        onClick={() => setAgreed((v) => !v)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          width: "100%",
          marginTop: 14,
          padding: "14px 16px",
          borderRadius: 12,
          border: `1px solid ${agreed ? TITA.forest : TITA.sage}`,
          background: agreed ? TITA.surface : "#fff",
          color: TITA.ink,
          fontSize: 16,
          lineHeight: 1.7,
          fontFamily: "inherit",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span aria-hidden style={{ flex: "none", width: 20, fontWeight: 800, color: agreed ? TITA.forest : TITA.sage }}>
          {agreed ? "✓" : "○"}
        </span>
        <span style={{ wordBreak: "keep-all" }}>
          위 내용을 확인했습니다. 적어주신 성함·연락처·출생연도와 자녀분 성별·나이대는 이 모임 안내와 자리 구성에만 쓰고,
          모임이 끝나면 3개월 안에 파기합니다.
        </span>
      </button>

      {/* 꺼진 버튼은 클릭을 삼켜서, 감싼 div가 "눌렀는데 막힌" 순간을 잡는다. */}
      <div
        onClick={() => {
          if (!ready && missing) track("honors_submit_blocked", { missing: missing.word });
        }}
      >
      <button
        type="button"
        onClick={send}
        disabled={!ready || state === "sending"}
        style={{
          pointerEvents: ready ? "auto" : "none",
          width: "100%",
          minHeight: 58,
          marginTop: 24,
          borderRadius: 999,
          border: "none",
          background: ready ? "#12211B" : TITA.mutedSoft,
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
            ? "참가 신청하기"
            : `${missing.word}${particle(missing.word)} ${missing.verb}`}
      </button>
      </div>

      {state === "error" && (
        <p style={{ fontSize: 15, color: "#B4433A", textAlign: "center", marginTop: 14 }}>
          잠시 문제가 있었어요. 다시 한 번 눌러주시겠어요?
        </p>
      )}

      <p style={{ fontSize: 14, lineHeight: 1.8, color: TITA.mutedSoft, textAlign: "center", marginTop: 16 }}>
        신청만으로 참가비가 나가지 않습니다. 확인 전화 뒤에 입금 안내를 드립니다.
      </p>
    </div>
  );
}
