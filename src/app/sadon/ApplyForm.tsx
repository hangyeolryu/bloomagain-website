"use client";

/**
 * 사돈 찻자리 신청 폼 — 두 장이 필드 목록만 바꿔 같이 쓴다.
 *
 * 지금은 **아무 데도 전송하지 않는다.** 신청서를 받는 순간이 이미 영업이라
 * (docs/sadon/04_법무_체크리스트.md), 신고번호가 없는 동안에는 SADON_OPEN 이
 * false 이고 폼 전체가 잠긴다. 번호가 나오면
 *   1. `_sadon.ts` 의 LICENSE_NO 를 채우고
 *   2. 아래 handleSubmit 에 백엔드 엔드포인트를 연결한다
 * 두 단계면 열린다. 화면은 지금도 그대로 보여서 문안을 미리 볼 수 있다.
 */

import { useState } from "react";
import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { SADON_OPEN } from "./_sadon";

export type Field =
  | { kind: "text"; id: string; label: string; placeholder?: string; type?: "text" | "tel" }
  | { kind: "select"; id: string; label: string; options: readonly string[] }
  | { kind: "choice"; id: string; label: string; options: readonly string[] }
  | { kind: "upload"; id: string; label: string; hint: string };

export function ApplyForm({
  fields,
  submitLabel,
  foot,
}: {
  fields: Field[];
  submitLabel: string;
  foot: string[];
}) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);

  const disabled = !SADON_OPEN;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 52,
    padding: "0 14px",
    fontSize: 17,
    border: `1px solid ${TITA.sage}`,
    borderRadius: 12,
    background: disabled ? TITA.surface : "#fff",
    color: TITA.ink,
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 17,
    fontWeight: 700,
    color: TITA.ink,
    margin: "24px 0 10px",
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // 신고 완료 후 백엔드 접수 엔드포인트를 연결한다.
      }}
      style={{
        background: TITA.white,
        border: `1px solid ${TITA.sage}`,
        borderRadius: 20,
        padding: "28px 24px",
        fontFamily: KOREAN_FONT_STACK,
        opacity: disabled ? 0.72 : 1,
      }}
    >
      {disabled && (
        <div
          style={{
            background: TITA.surface,
            border: `1px solid ${TITA.sage}`,
            borderRadius: 12,
            padding: "16px 18px",
            fontSize: 16,
            lineHeight: 1.75,
            color: TITA.ink,
            marginBottom: 8,
            wordBreak: "keep-all",
          }}
        >
          아직 신청을 받지 않습니다. 국내결혼중개업 신고를 마친 뒤에 열립니다.
        </div>
      )}

      {fields.map((f, i) => {
        const first = i === 0;
        if (f.kind === "text") {
          return (
            <div key={f.id}>
              <label
                htmlFor={f.id}
                style={{ ...labelStyle, marginTop: first ? 8 : 24 }}
              >
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type ?? "text"}
                placeholder={f.placeholder}
                disabled={disabled}
                style={inputStyle}
              />
            </div>
          );
        }
        if (f.kind === "select") {
          return (
            <div key={f.id}>
              <label
                htmlFor={f.id}
                style={{ ...labelStyle, marginTop: first ? 8 : 24 }}
              >
                {f.label}
              </label>
              <select id={f.id} disabled={disabled} style={inputStyle}>
                {f.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          );
        }
        if (f.kind === "upload") {
          return (
            <div key={f.id}>
              <label style={{ ...labelStyle, marginTop: first ? 8 : 24 }}>
                {f.label}
              </label>
              <div
                style={{
                  border: `1px dashed ${TITA.sage}`,
                  background: TITA.surface,
                  borderRadius: 12,
                  padding: 22,
                  textAlign: "center",
                  color: TITA.muted,
                  fontSize: 16,
                  lineHeight: 1.7,
                  wordBreak: "keep-all",
                }}
              >
                {f.hint}
              </div>
            </div>
          );
        }
        // choice
        return (
          <div key={f.id}>
            <label style={{ ...labelStyle, marginTop: first ? 8 : 24 }}>
              {f.label}
            </label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {f.options.map((o) => {
                const on = picked[f.id] === o;
                return (
                  <button
                    key={o}
                    type="button"
                    disabled={disabled}
                    aria-pressed={on}
                    onClick={() =>
                      setPicked((p) => ({ ...p, [f.id]: o }))
                    }
                    style={{
                      flex: 1,
                      minWidth: 120,
                      minHeight: 52,
                      borderRadius: 12,
                      border: `1px solid ${on ? TITA.forest : TITA.sage}`,
                      background: on ? TITA.surface : "#fff",
                      color: on ? TITA.forestDeep : TITA.muted,
                      fontWeight: on ? 700 : 400,
                      fontSize: 17,
                      fontFamily: "inherit",
                      cursor: disabled ? "default" : "pointer",
                    }}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          margin: "28px 0 20px",
          fontSize: 17,
          lineHeight: 1.7,
        }}
      >
        <input
          id="sadon-agree"
          type="checkbox"
          checked={agree}
          disabled={disabled}
          onChange={(e) => setAgree(e.target.checked)}
          style={{ width: 24, height: 24, marginTop: 4, flex: "none" }}
        />
        <label htmlFor="sadon-agree" style={{ color: TITA.ink }}>
          개인정보 수집·이용에 동의합니다{" "}
          <Link href="/privacy/" style={{ color: TITA.forest }}>
            내용 보기
          </Link>
        </label>
      </div>

      <button
        type="submit"
        disabled={disabled}
        style={{
          width: "100%",
          minHeight: 56,
          borderRadius: 999,
          border: "none",
          background: disabled ? TITA.mutedSoft : TITA.forest,
          color: "#fff",
          fontSize: 18,
          fontWeight: 700,
          fontFamily: "inherit",
          cursor: disabled ? "default" : "pointer",
        }}
      >
        {disabled ? "신고 절차를 마친 뒤 열립니다" : submitLabel}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: 16,
          fontSize: 15,
          lineHeight: 1.8,
          color: TITA.mutedSoft,
        }}
      >
        {foot.map((f) => (
          <div key={f}>{f}</div>
        ))}
      </div>
    </form>
  );
}
