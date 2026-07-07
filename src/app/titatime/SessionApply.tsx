"use client";

// 세션 카드의 가격 표시 + "이 자리 신청하기" — 가격 스모크 테스트의 핵심 조각.
// 방문자의 가격 암(arm)에 따라 참가비를 보여주고, 신청 클릭(=지불 의사의 행동
// 신호)을 기록한다. 클릭하면 실제 결제 대신 "신청은 앱에서" 안내가 열리며
// 다운로드 퍼널로 이어진다 (fake-door).
//
// 하이드레이션: 암은 localStorage에서 오므로 첫 렌더(SSR)는 가격 없이 나가고
// 마운트 후 채운다 — 서버/클라이언트 불일치 방지.

import { useEffect, useState } from "react";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import {
  getPriceArm,
  armLabel,
  recordTitatimeEvent,
  type PriceArmKey,
} from "./titatime-events";

export function SessionApply({ district }: { district: string }) {
  const [arm, setArm] = useState<PriceArmKey | null>(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setArm(getPriceArm());
  }, []);

  if (!arm) return null;
  const a = armLabel(arm);

  function apply() {
    logAnalyticsEvent("titatime_apply_click", { price_arm: arm ?? "", district });
    recordTitatimeEvent("apply", { priceArm: arm ?? undefined, district });
    setApplied(true);
  }

  function download(store: "ios" | "android") {
    logAnalyticsEvent("app_download_click", {
      store,
      source: "titatime_apply",
      price_arm: arm ?? "",
    });
    recordTitatimeEvent("download", { priceArm: arm ?? undefined, district, store });
  }

  const storeBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: "13px 14px",
    fontSize: 15,
    fontWeight: 700,
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
    color: TITA.cream,
    background: TITA.forest,
  };

  return (
    <div style={{ marginTop: 14, borderTop: `1px dashed ${TITA.sage}`, paddingTop: 14 }}>
      {!applied ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: TITA.forestDeep }}>
              {a.priceLabel}
            </div>
            <div style={{ fontSize: 12.5, color: TITA.muted, marginTop: 1 }}>
              {a.subLabel}
            </div>
          </div>
          <button
            onClick={apply}
            style={{
              flexShrink: 0,
              padding: "12px 18px",
              fontSize: 15,
              fontWeight: 700,
              color: TITA.cream,
              background: TITA.forest,
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              fontFamily: KOREAN_FONT_STACK,
              boxShadow: "0 6px 16px rgba(31,78,61,0.2)",
            }}
          >
            이 자리 신청하기
          </button>
        </div>
      ) : (
        <div>
          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.6,
              color: TITA.ink,
              margin: "0 0 12px",
            }}
          >
            좋아요! 🍵 티타임 신청은 <b>앱에서 본인인증 후</b> 받고 있어요.
            <br />
            설치하고 인증하면 이번 주 자리 신청이 열려요.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <a href={APP_STORE_URL} onClick={() => download("ios")} style={storeBtn}>
               App Store
            </a>
            <a href={PLAY_STORE_URL} onClick={() => download("android")} style={storeBtn}>
              ▶ Google Play
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
