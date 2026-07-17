"use client";

// 가치 결 — 8유형(어떻게 어울리나) 위에 얹는 두 번째 층(무엇을 소중히 여기나).
// 정적 결과 페이지라 서버에서 못 그리므로, 마운트 후 클라이언트에서 값을 읽어
// 렌더한다. 값 출처: URL(?v=GO) 우선 → 없으면 sessionStorage(직접 본인). 둘 다
// 없으면(그냥 공유 8유형 링크 방문) 아무것도 그리지 않는다.

import { useEffect, useState } from "react";
import { TITA } from "../../_components/tita-brand";
import { VALUE_AXES, parseValue, valueHarmony, type ValueResult } from "../types";

export function ValueResultCard() {
  const [value, setValue] = useState<ValueResult | null>(null);

  useEffect(() => {
    let v: string | null = null;
    try {
      v = new URLSearchParams(window.location.search).get("v");
      if (!v) v = window.sessionStorage.getItem("tita_gyeol_value");
    } catch {
      /* 접근 불가 — 그냥 안 그림 */
    }
    setValue(parseValue(v));
  }, []);

  if (!value) return null;

  const dir = VALUE_AXES.direction[value.direction];
  const open = VALUE_AXES.openness[value.openness];

  const row = (
    label: string,
    tagline: string,
    blurb: string,
  ) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: TITA.cream,
            background: TITA.forest,
            borderRadius: 999,
            padding: "5px 13px",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: TITA.forestDeep }}>
          {tagline}
        </span>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.6, color: TITA.muted, margin: 0 }}>
        {blurb}
      </p>
    </div>
  );

  return (
    <section
      style={{
        marginTop: 16,
        background: TITA.white,
        borderRadius: 20,
        padding: "24px 24px",
        border: `1px solid ${TITA.sage}`,
      }}
    >
      <p
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: TITA.forestMid,
          letterSpacing: "-0.3px",
          margin: "0 0 4px",
        }}
      >
        내가 소중히 여기는 것 · 가치 결
      </p>
      <p style={{ fontSize: 13, color: TITA.mutedSoft, margin: "0 0 18px" }}>
        어떻게 어울리나만큼, 무엇을 소중히 여기나도 결이에요.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {row(dir.label, dir.tagline, dir.blurb)}
        <div style={{ height: 1, background: TITA.sage }} />
        {row(open.label, open.tagline, open.blurb)}
      </div>
      <p
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: TITA.forestDeep,
          lineHeight: 1.6,
          margin: "18px 0 0",
        }}
      >
        {valueHarmony(value)}
      </p>
    </section>
  );
}
