"use client";

// 다운로드 직전 '나이 자기선택' 게이트. 티타는 만 45세 이상 전용인데, 결 유형
// 테스트는 재밌어서 더 젊은 층이 몰린다 → 테스트 끝까지 풀고, 다운 누르고,
// 설치하고, 그제서야 NICE 45+ 벽에 튕겨나간다(가입 시도의 ~43%가 나이 미달).
// 여기서 한 번의 탭으로 자기선택하게 해서, 45 미만은 설치 전에 걸러내고(광고비
// 낭비·헛설치 차단) 진짜 연령 분포 데이터도 확보한다.
//
// 상태는 sessionStorage 1곳(tita_gyeol_age)에 저장하고, 모듈 pub/sub으로 같은
// 탭의 두 다운로드 CTA(TopDownloadCTA·ResultActions)가 즉시 동기화된다.

import { useEffect, useState } from "react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { recordGyeolEvent } from "./gyeol-events";

export type AgeBand = "under45" | "45-54" | "55-64" | "65plus";
export type AgeStatus = "pending" | "qualified" | "disqualified";

const KEY = "tita_gyeol_age";
const listeners = new Set<() => void>();

function readBand(): AgeBand | null {
  try {
    return (window.sessionStorage.getItem(KEY) as AgeBand) || null;
  } catch {
    return null;
  }
}

function bandToStatus(b: AgeBand | null): AgeStatus {
  if (!b) return "pending";
  return b === "under45" ? "disqualified" : "qualified";
}

export function setAgeBand(band: AgeBand, code?: string): void {
  try {
    window.sessionStorage.setItem(KEY, band);
  } catch {
    /* sessionStorage 막힘 — 이벤트는 계속 보내고, 상태는 이 렌더에만 반영 */
  }
  recordGyeolEvent("age_gate", code, { ageBand: band });
  listeners.forEach((l) => l());
}

/// 같은 탭의 모든 게이트가 공유하는 상태. 마운트 전(SSR/첫 렌더)엔 "pending".
export function useAgeStatus(): AgeStatus {
  const [band, setBand] = useState<AgeBand | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const update = () => setBand(readBand());
    update();
    setReady(true);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);
  return ready ? bandToStatus(band) : "pending";
}

const BANDS: { band: AgeBand; label: string }[] = [
  { band: "45-54", label: "45–54세" },
  { band: "55-64", label: "55–64세" },
  { band: "65plus", label: "65세 이상" },
  { band: "under45", label: "만 45세 미만" },
];

/// 나이 자기선택 카드 — 한 번의 탭. 45+ 밴드 3개 + '미만' 1개. 코드(결 유형)는
/// 이벤트에 실어 어느 유형이 어느 연령대인지까지 집계한다.
export function AgeQuestion({ code }: { code?: string }) {
  const primaryBtn: React.CSSProperties = {
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: "-0.3px",
    color: TITA.cream,
    background: TITA.forest,
    border: "none",
    borderRadius: 14,
    padding: "16px 12px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(31,78,61,0.20)",
  };
  const underBtn: React.CSSProperties = {
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 14,
    fontWeight: 700,
    color: TITA.muted,
    background: "transparent",
    border: `1px solid ${TITA.sage}`,
    borderRadius: 12,
    padding: "13px 12px",
    cursor: "pointer",
    marginTop: 4,
  };

  return (
    <div
      style={{
        marginTop: 18,
        background: TITA.white,
        border: `1.5px solid ${TITA.forest}`,
        borderRadius: 20,
        padding: "22px 20px",
        boxShadow: "0 14px 34px rgba(31,78,61,0.15)",
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: 12.5,
          fontWeight: 800,
          letterSpacing: "-0.2px",
          color: TITA.forestMid,
          margin: "0 0 8px",
        }}
      >
        만나기 전에, 하나만요
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.5,
          letterSpacing: "-0.5px",
          color: TITA.forestDeep,
          margin: "0 0 4px",
        }}
      >
        티타는 <span style={{ color: TITA.forest }}>만 45세 이상</span> 전용이에요
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          color: TITA.muted,
          fontWeight: 600,
          margin: "0 0 16px",
        }}
      >
        연령대를 알려주시면 딱 맞는 또래를 찾아드려요
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {BANDS.filter((b) => b.band !== "under45").map((b) => (
          <button
            key={b.band}
            onClick={() => setAgeBand(b.band, code)}
            style={primaryBtn}
          >
            {b.label}
          </button>
        ))}
        <button
          onClick={() => setAgeBand("under45", code)}
          style={underBtn}
        >
          만 45세 미만이에요
        </button>
      </div>
    </div>
  );
}

/// 45 미만 선택 시 — 다운로드 대신 '45세 이상 친구에게 추천'을 히어로로. 못 쓰는
/// 사람을 그냥 돌려보내지 않고, 딱 맞는 또래(부모님·이모·삼촌·선배)에게 퍼뜨리는
/// 리퍼럴 지점으로 바꾼다. onShare가 있으면 카카오(45+ 최강 채널) 강조 버튼.
export function AgeDisqualifiedNote({
  onShare,
  kakao,
}: {
  onShare?: () => void;
  kakao?: boolean;
}) {
  return (
    <div
      style={{
        marginTop: 18,
        background: TITA.white,
        border: `1.5px solid ${TITA.forest}`,
        borderRadius: 20,
        padding: "22px 20px",
        textAlign: "center",
        boxShadow: "0 14px 34px rgba(31,78,61,0.15)",
      }}
    >
      <p style={{ fontSize: 30, margin: "0 0 8px" }}>🍵</p>
      <p
        style={{
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.5,
          letterSpacing: "-0.5px",
          color: TITA.forestDeep,
          margin: "0 0 8px",
        }}
      >
        티타는 <span style={{ color: TITA.forest }}>만 45세 이상</span> 전용이에요
      </p>
      <p
        style={{
          fontSize: 14.5,
          lineHeight: 1.7,
          color: TITA.ink,
          margin: "0 0 18px",
          fontWeight: 600,
        }}
      >
        대신, 이 결과가 딱 맞을 것 같은
        <br />
        <b>만 45세 이상 가족·친구</b>가 떠오르지 않나요?
        <br />
        결이 맞을지 함께 해보자고 보내보세요.
      </p>
      {onShare && (
        <button
          onClick={onShare}
          style={{
            width: "100%",
            fontFamily: KOREAN_FONT_STACK,
            padding: "16px 20px",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "-0.3px",
            color: kakao ? "#3C1E1E" : TITA.cream,
            background: kakao ? "#FEE500" : TITA.forest,
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            boxShadow: kakao
              ? "0 8px 20px rgba(254,229,0,0.35)"
              : "0 8px 20px rgba(31,78,61,0.22)",
          }}
        >
          {kakao ? "카카오톡으로 추천하기" : "45세 이상 친구에게 추천하기"}
        </button>
      )}
    </div>
  );
}
