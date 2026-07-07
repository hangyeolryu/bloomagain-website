"use client";

// 결과 페이지 CTA — 전환 최적화.
// 문제: 테스트 완료는 느는데 다운로드 클릭 0. 원인은 (1) 경쟁 액션(공유·다시하기)이
// 다운로드와 같은 무게로 놓여 시선 분산, (2) 스토어 버튼 2개가 "결정"을 요구.
// 해법: 플랫폼 감지해 **단일 지배적 1차 버튼**(모바일은 바로 해당 스토어)으로,
// 혜택+안심 마이크로카피를 붙이고, 공유·다시하기는 작은 2차 행으로 강등.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import { recordGyeolEvent } from "./gyeol-events";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

export function ResultActions({ code, name }: { code: string; name: string }) {
  const [platform, setPlatform] = useState<Platform>("other");
  useEffect(() => setPlatform(detectPlatform()), []);

  const shareUrl = `https://tita-app.com/gyeol/${code}`;

  function download(store: "ios" | "android") {
    logAnalyticsEvent("app_download_click", { store, source: `gyeol_result_${code}` });
    recordGyeolEvent("download", code);
  }

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
      /* 사용자가 시트 닫음 */
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("링크를 복사했어요. 친구에게 붙여넣어 보내보세요 🍵");
    } catch {
      /* 클립보드 막힘 */
    }
  }

  // 플랫폼별 1차 버튼 대상
  const primaryHref =
    platform === "android" ? PLAY_STORE_URL : APP_STORE_URL;
  const primaryStore: "ios" | "android" =
    platform === "android" ? "android" : "ios";
  const primaryStoreLabel =
    platform === "android" ? "Google Play" : platform === "ios" ? "App Store" : "App Store · Google Play";

  const linkBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* 1차 — 지배적 다운로드 버튼 */}
      <a
        href={primaryHref}
        onClick={() => download(primaryStore)}
        style={{
          ...linkBase,
          padding: "20px 24px",
          fontSize: 18,
          fontWeight: 800,
          color: TITA.cream,
          background: TITA.forest,
          borderRadius: 16,
          boxShadow: "0 10px 26px rgba(31,78,61,0.28)",
          letterSpacing: "-0.3px",
        }}
      >
        🍵 티타 앱에서 결친구 만나기
      </a>
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: TITA.muted,
          margin: "0 0 2px",
          fontWeight: 600,
        }}
      >
        {primaryStoreLabel} · 무료로 시작 · NICE 본인인증으로 안전하게
      </p>

      {/* 모바일이면 반대편 스토어를 작게 노출 */}
      {platform === "ios" && (
        <a
          href={PLAY_STORE_URL}
          onClick={() => download("android")}
          style={{ ...linkBase, fontSize: 13, color: TITA.forestMid, fontWeight: 600, padding: 4 }}
        >
          안드로이드는 여기 → Google Play
        </a>
      )}
      {platform === "android" && (
        <a
          href={APP_STORE_URL}
          onClick={() => download("ios")}
          style={{ ...linkBase, fontSize: 13, color: TITA.forestMid, fontWeight: 600, padding: 4 }}
        >
          아이폰은 여기 → App Store
        </a>
      )}

      {/* 2차 — 공유(바이럴) + 다시하기, 시각적으로 강등 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 8,
          fontSize: 14,
        }}
      >
        <button
          onClick={share}
          style={{
            background: "none",
            border: "none",
            color: TITA.forestDeep,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: KOREAN_FONT_STACK,
            padding: 4,
          }}
        >
          친구에게 공유 🔗
        </button>
        <span style={{ color: TITA.sage }}>·</span>
        <Link
          href="/gyeol"
          style={{ color: TITA.muted, fontWeight: 600, textDecoration: "none", padding: 4 }}
        >
          다시 하기
        </Link>
      </div>
    </div>
  );
}
