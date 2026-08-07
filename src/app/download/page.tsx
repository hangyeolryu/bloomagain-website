"use client";

// 티타 다운로드 페이지 — QR·SNS 링크가 가장 자주 도착하는 곳이라 첫 인상은
// 최소·신뢰 톤. iOS/안드로이드는 감지되는 즉시 스토어로 자동 이동시킨다.
//
// 자동 이동이 실패해도(스토어 링크 문제·인앱 브라우저 차단 등) 막다른 길이
// 되면 안 되므로, 본문의 수동 버튼은 항상 렌더한다. 그 버튼은 페이지마다
// 새로 짜지 않고 <StoreDownloadButton/>을 쓴다 — 항상 진짜 <a href>를 두고,
// 집계 실패가 이동을 막지 않으며, intent://는 안드로이드에만 건다.

import { useEffect, useState } from "react";
import Image from "next/image";
import { TITA, KOREAN_FONT_STACK, APP_STORE_URL, PLAY_STORE_INTENT_URL } from "../_components/tita-brand";
import { StoreDownloadButton } from "../_components/StoreDownloadButton";
import {
  detectPlatform,
  detectInApp,
  canAutoRedirectToStore,
} from "../_components/store-env";
import { logAnalyticsEvent } from "@/lib/firebase";

export default function DownloadPage() {
  const [redirected, setRedirected] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState(false);

  useEffect(() => {
    const platform = detectPlatform();
    const inApp = detectInApp();
    setInAppBrowser(inApp);

    // 인스타·카톡 인앱 브라우저의 iOS에서는 자동 이동을 하지 않는다. JS가
    // 일으킨 이동은 유니버설 링크로 처리되지 않아 App Store 앱이 안 뜨고,
    // 웹뷰 안에 apps.apple.com 웹페이지만 남아 막다른 길이 된다.
    // 대신 아래 버튼을 사용자가 직접 탭하게 한다 — 탭은 제스처라 정상 동작.
    if (!canAutoRedirectToStore(platform, inApp)) return;

    // 집계가 던져도 이동은 반드시 일어나야 하므로 try/catch로 감싼다.
    try {
      logAnalyticsEvent("app_download_click", {
        store: platform,
        source: "auto_redirect",
      });
    } catch {
      /* 집계 실패는 무시 */
    }

    // 안드로이드는 intent://로 스토어 앱을 강제 실행(인앱 브라우저에서도 열림,
    // 실패 시 browser_fallback_url로 자동 폴백). iOS는 https 유니버설 링크.
    window.location.href =
      platform === "android" ? PLAY_STORE_INTENT_URL : APP_STORE_URL;
    setRedirected(true);
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
          ? "스토어가 안 열리면 아래를 눌러주세요"
          : inAppBrowser
            ? "아래 버튼을 눌러 스토어로 가세요"
            : "아래에서 앱을 받아주세요"}
      </p>

      <div className="w-full max-w-xs">
        <StoreDownloadButton
          source="download_page"
          label="티타 앱 받기 (무료)"
          style={{ width: "100%", padding: "17px 22px", fontSize: 17 }}
        />
      </div>

      <p className="mt-10 text-xs" style={{ color: TITA.mutedSoft }}>
        결이 맞는 친구
      </p>
    </main>
  );
}
