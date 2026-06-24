"use client";

// 티타 다운로드 페이지 — UA 감지로 자동 store 리다이렉트, 그 외(데스크탑·
// 알 수 없음)는 두 store 버튼을 보여줌. 호스팅된 QR 코드나 SNS 링크가
// 가장 자주 도착하는 페이지라 첫 인상은 최소·신뢰 톤.

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";

function detectPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

export default function DownloadPage() {
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    const platform = detectPlatform();
    if (platform === "ios") {
      // Track the auto-redirect as a download click so analytics reflects
      // the actual mobile traffic, not just desktop manual clicks below.
      // `source: 'auto_redirect'` lets us separate intent from incidental
      // visits in the dashboard.
      logAnalyticsEvent("app_download_click", {
        store: "ios",
        source: "auto_redirect",
      });
      window.location.href = APP_STORE_URL;
      setRedirected(true);
    } else if (platform === "android") {
      logAnalyticsEvent("app_download_click", {
        store: "android",
        source: "auto_redirect",
      });
      window.location.href = PLAY_STORE_URL;
      setRedirected(true);
    }
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{
        backgroundColor: TITA.cream,
        fontFamily: KOREAN_FONT_STACK,
      }}
    >
      <Image
        src="/logo.png"
        alt="티타 로고"
        width={96}
        height={96}
        className="mx-auto rounded-2xl mb-6"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      <h1
        className="text-2xl font-extrabold mb-2"
        style={{ color: TITA.ink, letterSpacing: "-0.02em" }}
      >
        티타
      </h1>
      <p className="text-sm mb-8" style={{ color: TITA.muted }}>
        {redirected
          ? "스토어로 이동 중..."
          : "아래에서 앱을 받아주세요"}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <a
          href={APP_STORE_URL}
          onClick={() =>
            logAnalyticsEvent("app_download_click", {
              store: "ios",
              source: "download_page",
            })
          }
          className="flex items-center justify-center gap-3 rounded-2xl px-6 py-3.5 font-medium transition-transform hover:scale-105"
          style={{ backgroundColor: "black", color: "white" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <div className="text-left">
            <div className="text-[10px] opacity-80">Download on the</div>
            <div className="text-sm font-semibold leading-tight">App Store</div>
          </div>
        </a>

        <a
          href={PLAY_STORE_URL}
          onClick={() =>
            logAnalyticsEvent("app_download_click", {
              store: "android",
              source: "download_page",
            })
          }
          className="flex items-center justify-center gap-3 rounded-2xl px-6 py-3.5 font-medium transition-transform hover:scale-105"
          style={{ backgroundColor: TITA.forest, color: "white" }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3.18 23.76c.3.17.64.22.99.14l12.45-7.2-2.78-2.78-10.66 9.84zm-1.1-20.2A1.99 1.99 0 0 0 2 4.56v14.88c0 .56.22 1.06.58 1.42l.08.07 8.34-8.34v-.2L2.08 3.56zm17.67 7.43-2.67-1.54-3.12 3.12 3.12 3.12 2.69-1.55c.77-.44.77-1.71-.02-2.15zM4.17.24 16.62 7.44l-2.78 2.78L3.18.38A1.31 1.31 0 0 1 4.17.24z" />
          </svg>
          <div className="text-left">
            <div className="text-[10px] opacity-80">Get it on</div>
            <div className="text-sm font-semibold leading-tight">Google Play</div>
          </div>
        </a>
      </div>

      <p
        className="mt-10 text-xs"
        style={{ color: TITA.mutedSoft }}
      >
        결이 맞는 40+ 친구
      </p>
    </main>
  );
}
