"use client";

// 티타임 모집 페이지의 클릭 버튼 — 다운로드(주 목표) + 관심 신청(선택).
// 페이지 본문은 SEO/공유를 위해 서버 렌더, 클릭 로깅만 이 조각으로 분리.
// 마운트 시 가격 실험 view 이벤트도 여기서 1회 기록한다(페이지당 한 번).

import { useEffect } from "react";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import { getPriceArm, recordTitatimeEvent } from "./titatime-events";

// 관심 신청 폼(구글폼 등)이 준비되면 이 URL만 채우면 버튼이 노출된다.
// 비워두면 다운로드 CTA만 보인다 (앱 다운이 주 목표라 기본은 이걸로 충분).
const INTEREST_FORM_URL = "";

export function TitatimeCTA() {
  // 가격 암별 노출 수(view) — 신청 클릭률의 분모.
  useEffect(() => {
    recordTitatimeEvent("view", { priceArm: getPriceArm() });
  }, []);

  function download(store: "ios" | "android") {
    logAnalyticsEvent("app_download_click", { store, source: "titatime" });
  }
  function interest() {
    logAnalyticsEvent("titatime_interest_click", {});
  }

  const btn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "18px 22px",
    fontSize: 17,
    fontWeight: 700,
    borderRadius: 15,
    cursor: "pointer",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p
        style={{
          fontSize: 14,
          color: TITA.muted,
          textAlign: "center",
          margin: "0 0 4px",
          fontWeight: 600,
        }}
      >
        참여는 앱에서 본인인증 후 진행돼요
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <a
          href={APP_STORE_URL}
          onClick={() => download("ios")}
          style={{ ...btn, flex: 1, color: TITA.cream, background: TITA.forest }}
        >
           App Store
        </a>
        <a
          href={PLAY_STORE_URL}
          onClick={() => download("android")}
          style={{ ...btn, flex: 1, color: TITA.cream, background: TITA.forest }}
        >
          ▶ Google Play
        </a>
      </div>
      {INTEREST_FORM_URL ? (
        <a
          href={INTEREST_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={interest}
          style={{
            ...btn,
            color: TITA.forestDeep,
            background: TITA.white,
            border: `2px solid ${TITA.sage}`,
          }}
        >
          아직 앱이 부담되면, 관심만 남기기
        </a>
      ) : null}
    </div>
  );
}
