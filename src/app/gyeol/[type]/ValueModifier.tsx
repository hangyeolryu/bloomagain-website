"use client";

// 유형 이름 위에 붙는 '가치 수식어' — 결과를 8×4=최대 32조합으로 세분화한다.
// 정적 페이지라 값은 마운트 후 클라이언트에서 읽는다(?v= 우선 → sessionStorage).
// 값이 없으면(그냥 8유형 링크 방문) 아무것도 안 그린다.

import { useEffect, useState } from "react";
import { TITA } from "../../_components/tita-brand";
import { parseValue, valueModifier, type ValueResult } from "../types";

export function ValueModifier() {
  const [value, setValue] = useState<ValueResult | null>(null);

  useEffect(() => {
    let raw: string | null = null;
    try {
      raw =
        new URLSearchParams(window.location.search).get("v") ||
        window.sessionStorage.getItem("tita_gyeol_value");
    } catch {
      /* 접근 불가 — 안 그림 */
    }
    setValue(parseValue(raw));
  }, []);

  if (!value) return null;
  const modifier = valueModifier(value);
  if (!modifier) return null;

  return (
    <div
      style={{
        fontSize: 17,
        fontWeight: 700,
        color: TITA.forestMid,
        letterSpacing: "-0.4px",
        marginBottom: 4,
      }}
    >
      {modifier}
    </div>
  );
}
