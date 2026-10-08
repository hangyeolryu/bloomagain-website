"use client";

/**
 * 티타 아너스 — 자리 안내 받기 (두 칸).
 *
 * 2026-10-08 8칸 신청서를 두 칸으로 줄였다. 10/5–10/8 측정에서 신청서를
 * 건드린 15번이 전부 중간에 멈췄고(10/5 상세: 시작 3명이 성함 한 칸도 못
 * 채움), 제출은 0이었다. 처음 보는 브랜드에 자녀 정보·출생연도·15만 원
 * 결심까지 한 번에 받는 게 문턱이었다.
 *
 * 이제 성함·연락처만 받고, 나머지(자녀 성별·나이대·출생연도·소개)는
 * 이틀 안의 **확인 전화**에서 여쭌다. 그 통화가 진짜 신청서다.
 *
 * 백엔드는 그대로 `/gyeol/sadon-event-signup`. 자녀 칸은 비워서 보낸다.
 * 면책 고지(DISCLAIMER)는 제출 직전에 원문 그대로 둔다.
 */

import { useRef, useState } from "react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { trackPixel } from "@/lib/pixel";
import { logAnalyticsEvent } from "@/lib/firebase";
import { DISCLAIMER } from "./_sadon";

const API =
  process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL ??
  "https://bloomagain-backend-api-469607573966.asia-northeast3.run.app";

// 이탈 지점 측정 — 값은 보내지 않고 "어디까지 왔나"만.
function track(event: string, params: Record<string, string | number> = {}) {
  logAnalyticsEvent(event, params);
  trackPixel(
    "Honors" + event.replace(/^honors_/, "").replace(/(^|_)(\w)/g, (_m, _p, c: string) => c.toUpperCase()),
    params,
    true,
  );
}

export function InviteForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const started = useRef(false);
  const onFirstTouch = () => {
    if (started.current) return;
    started.current = true;
    track("honors_form_start", { form: "short" });
  };
  const done = useRef(new Set<string>());
  const markDone = (field: string, ok: boolean) => {
    if (ok && !done.current.has(field)) {
      done.current.add(field);
      track("honors_field_done", { field, step: done.current.size });
    }
  };

  const digits = contact.replace(/\D/g, "");
  const missing =
    name.trim().length < 2 ? "성함을 적어주세요"
      : digits.length < 9 ? "연락처를 적어주세요"
        : !agreed ? "아래 안내에 동의해 주세요"
          : null;
  const ready = missing === null;

  async function send() {
    if (!ready || state === "sending") return;
    track("honors_submit", { form: "short" });
    setState("sending");
    try {
      const r = await fetch(`${API}/api/v1/gyeol/sadon-event-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          childSide: null,
          childAge: null,
          note: "구분: 티타 아너스 자리 안내 받기(두 칸) · 제1회 15만 원 · 고지 확인함 · 자녀 정보는 통화로",
        }),
      });
      // 백엔드는 저장에 실패해도 200 + {ok:false} 를 준다. 본문까지 본다.
      const body = r.ok ? await r.json().catch(() => ({})) : {};
      if (body?.ok) {
        trackPixel("Lead", { content_name: "honors_2026_10_31", value: 150000, currency: "KRW" });
      }
      setState(body?.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  const input: React.CSSProperties = {
    width: "100%",
    minHeight: 58,
    padding: "0 18px",
    fontSize: 18,
    border: `1px solid ${TITA.sage}`,
    borderRadius: 12,
    background: "#fff",
    color: TITA.ink,
    fontFamily: "inherit",
  };
  const label: React.CSSProperties = { display: "block", fontSize: 17, fontWeight: 700, color: TITA.ink, margin: "20px 0 10px" };

  if (state === "done") {
    return (
      <div style={{ background: TITA.surface, borderRadius: 20, padding: "40px 28px", textAlign: "center", fontFamily: KOREAN_FONT_STACK }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 12px" }}>남겨주셔서 고맙습니다</p>
        <p style={{ fontSize: 17, lineHeight: 1.85, color: TITA.muted, margin: 0, wordBreak: "keep-all" }}>
          이틀 안에 티타에서 전화를 드릴게요.
          <br />
          모임을 자세히 안내드리고, 오실지는
          <br />
          그때 편하게 정하시면 돼요.
        </p>
      </div>
    );
  }

  return (
    <div
      onFocusCapture={onFirstTouch}
      onPointerDownCapture={onFirstTouch}
      style={{ background: TITA.white, border: `1px solid ${TITA.sage}`, borderRadius: 20, padding: "26px 22px", fontFamily: KOREAN_FONT_STACK }}
    >
      <label htmlFor="iv-name" style={{ ...label, marginTop: 0 }}>성함</label>
      <input
        id="iv-name"
        style={input}
        value={name}
        autoComplete="name"
        placeholder="홍길동"
        onChange={(e) => setName(e.target.value)}
        onBlur={() => markDone("name", name.trim().length >= 2)}
      />

      <label htmlFor="iv-tel" style={label}>연락처</label>
      <input
        id="iv-tel"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        style={input}
        value={contact}
        placeholder="010-0000-0000"
        onChange={(e) => setContact(e.target.value)}
        onBlur={() => markDone("contact", digits.length >= 9)}
      />

      {/* 면책 고지 — 원문 그대로, 제출 직전. 접지 않고 작게 둔다. */}
      <p style={{ fontSize: 13, lineHeight: 1.75, color: TITA.muted, margin: "22px 0 0", wordBreak: "keep-all" }}>
        {DISCLAIMER}
      </p>

      <button
        type="button"
        role="checkbox"
        aria-checked={agreed}
        onClick={() => {
          setAgreed((v) => !v);
          markDone("agreed", !agreed);
        }}
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
          fontSize: 15.5,
          lineHeight: 1.65,
          fontFamily: "inherit",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span aria-hidden style={{ flex: "none", width: 20, fontWeight: 800, color: agreed ? TITA.forest : TITA.sage }}>
          {agreed ? "✓" : "○"}
        </span>
        <span style={{ wordBreak: "keep-all" }}>
          위 내용을 확인했고, 성함·연락처를 이 모임 안내 전화에만 쓰는 데 동의합니다. 모임이 끝나면 3개월 안에 파기합니다.
        </span>
      </button>

      {/* 꺼진 버튼은 클릭을 삼켜서, 감싼 div가 "눌렀는데 막힌" 순간을 잡는다. */}
      <div onClick={() => { if (!ready && missing) track("honors_submit_blocked", { missing }); }}>
        <button
          type="button"
          onClick={send}
          disabled={!ready || state === "sending"}
          style={{
            pointerEvents: ready ? "auto" : "none",
            width: "100%",
            minHeight: 60,
            marginTop: 20,
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
          {state === "sending" ? "보내는 중이에요" : ready ? "자리 안내 받기" : missing}
        </button>
      </div>

      {state === "error" && (
        <p style={{ fontSize: 15, color: "#B4433A", textAlign: "center", marginTop: 14 }}>
          잠시 문제가 있었어요. 다시 한 번 눌러주시겠어요?
        </p>
      )}

      <p style={{ fontSize: 14, lineHeight: 1.8, color: TITA.mutedSoft, textAlign: "center", marginTop: 14, wordBreak: "keep-all" }}>
        남기신다고 바로 신청되는 게 아니에요. 참가비는 통화 뒤에 정하셔도 돼요.
      </p>
    </div>
  );
}
