"use client";

// 결과 페이지의 상호작용 버튼 — 공유(바이럴 루프의 핵심) + 앱 다운로드 + 다시하기.
// 결과 page.tsx는 정적 생성(서버)이라, 클릭 핸들러만 이 클라이언트 조각으로 분리.

import Link from "next/link";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import { recordGyeolEvent } from "./gyeol-events";

export function ResultActions({
  code,
  name,
}: {
  code: string;
  name: string;
}) {
  const shareUrl = `https://tita-app.com/gyeol/${code}`;

  async function share() {
    logAnalyticsEvent("gyeol_share", { gyeol_type: code });
    recordGyeolEvent("share", code);
    const shareData = {
      title: `나의 결 유형: ${name}`,
      text: `나는 '${name}' 결이래요. 당신의 결 유형은? 🍵`,
      url: shareUrl,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch {
      // 사용자가 공유 시트를 닫음 — 조용히 폴백
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("링크를 복사했어요. 친구에게 붙여넣어 보내보세요 🍵");
    } catch {
      // 클립보드도 막힌 환경 — 무시
    }
  }

  function download(store: "ios" | "android") {
    logAnalyticsEvent("app_download_click", {
      store,
      source: `gyeol_result_${code}`,
    });
    recordGyeolEvent("download", code);
  }

  const btnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px 20px",
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 14,
    cursor: "pointer",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
    border: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 12 }}>
        <a
          href={APP_STORE_URL}
          onClick={() => download("ios")}
          style={{
            ...btnBase,
            flex: 1,
            color: TITA.cream,
            background: TITA.forest,
          }}
        >
           App Store
        </a>
        <a
          href={PLAY_STORE_URL}
          onClick={() => download("android")}
          style={{
            ...btnBase,
            flex: 1,
            color: TITA.cream,
            background: TITA.forest,
          }}
        >
          ▶ Google Play
        </a>
      </div>
      <button
        onClick={share}
        style={{
          ...btnBase,
          color: TITA.forestDeep,
          background: TITA.white,
          border: `2px solid ${TITA.sage}`,
        }}
      >
        결과 공유하기 🔗
      </button>
      <Link
        href="/gyeol"
        style={{
          ...btnBase,
          color: TITA.muted,
          background: "transparent",
          fontWeight: 600,
        }}
      >
        다시 해보기
      </Link>
    </div>
  );
}
