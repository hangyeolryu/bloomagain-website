"use client";

// 어디서 눌러도 스토어로 가는 다운로드 버튼.
//
// 왜 따로 만들었나 — 페이지마다 다운 CTA를 새로 짜다 보니 iOS에서 "눌러도
// 아무 일도 안 나는" 사고가 반복됐다. 원인은 대부분 셋 중 하나다.
//   ① <button onClick>으로만 이동시킴 → 핸들러가 죽으면 이동 자체가 없다.
//      iOS Safari는 ITP·프라이빗 모드에서 firebase analytics가 예외를 던지는
//      일이 잦아, 집계 한 줄 때문에 버튼 전체가 먹통이 된다.
//   ② intent:// 를 iOS에도 걸어 버림 → Safari는 조용히 무시한다(에러도 없음).
//   ③ 인앱 브라우저(인스타·카톡)에서 스토어 핸드오프가 깨짐.
//
// 그래서 이 컴포넌트는
//   · 항상 진짜 <a href>를 둔다. JS가 죽어도 브라우저가 이동시킨다.
//   · 집계는 try/catch로 감싼다. 실패해도 이동을 막지 않는다.
//   · intent:// 는 안드로이드에서만 쓴다.
//   · 인앱 브라우저면 "외부 브라우저로 열기" 안내를 같이 보여준다.
//   · 기기 오감지에 대비해 반대 스토어 탈출구를 항상 남긴다.

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
  PLAY_STORE_INTENT_URL,
} from "./tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";

type Platform = "ios" | "android" | "other";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  // iPadOS 13+ Safari는 데스크탑 UA로 위장 → 터치 지원 Mac을 iOS로 본다.
  const iPadOS =
    /Macintosh/.test(ua) &&
    typeof document !== "undefined" &&
    "ontouchend" in document;
  if (/iPad|iPhone|iPod/.test(ua) || iPadOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function detectInApp(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|NAVER\(inapp|Line\//.test(
    navigator.userAgent
  );
}

// 집계는 절대 이동을 막지 않는다. 이 컴포넌트의 핵심 안전장치.
function safeTrack(store: "ios" | "android", source: string) {
  try {
    logAnalyticsEvent("app_download_click", { store, source });
  } catch {
    /* 집계 실패는 무시 — 스토어로 보내는 게 우선 */
  }
}

export function StoreDownloadButton({
  source,
  label = "앱 다운로드",
  style,
  children,
}: {
  /** 어느 페이지/위치에서 눌렀는지 (집계용) */
  source: string;
  label?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  // SSR에서는 기기를 알 수 없다. 정적 내보내기라 첫 페인트는 항상 "other"로
  // 나가고, 마운트 후 실제 기기로 좁힌다(하이드레이션 불일치 방지).
  const [platform, setPlatform] = useState<Platform>("other");
  const [inApp, setInApp] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInApp(detectInApp());
  }, []);

  const btn: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "16px 28px",
    borderRadius: 999,
    backgroundColor: TITA.forest,
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    textDecoration: "none",
    fontFamily: KOREAN_FONT_STACK,
    ...style,
  };

  // 기기를 모를 때(데스크탑·감지 실패)는 고르게 한다.
  if (platform === "other") {
    return (
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href={APP_STORE_URL} onClick={() => safeTrack("ios", source)} style={btn}>
          아이폰
        </a>
        <a
          href={PLAY_STORE_URL}
          onClick={() => safeTrack("android", source)}
          style={{ ...btn, backgroundColor: TITA.forestMid }}
        >
          안드로이드
        </a>
      </div>
    );
  }

  const isAndroid = platform === "android";

  return (
    <div>
      <a
        // href를 항상 진짜 스토어 주소로 둔다 — JS가 죽어도 이동한다.
        href={isAndroid ? PLAY_STORE_URL : APP_STORE_URL}
        onClick={(e) => {
          safeTrack(isAndroid ? "android" : "ios", source);
          // intent:// 는 안드로이드 전용. iOS에서는 절대 쓰지 않는다.
          if (isAndroid) {
            e.preventDefault();
            window.location.href = PLAY_STORE_INTENT_URL;
          }
        }}
        style={btn}
      >
        {children ?? label}
      </a>

      {/* 인앱 브라우저는 스토어 핸드오프가 깨진다 — 자동 탈출은 브라우저
          보안상 불가라, 여는 법을 알려주는 게 최선이다. */}
      {inApp && (
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 12.5,
            lineHeight: 1.6,
            color: TITA.muted,
            fontFamily: KOREAN_FONT_STACK,
          }}
        >
          설치가 안 되면 오른쪽 위 <b>⋯</b> 을 눌러{" "}
          <b>{isAndroid ? "다른 브라우저로 열기" : "Safari로 열기"}</b>를
          선택해 주세요.
        </p>
      )}

      {/* 기기 오감지 대비 탈출구 */}
      <a
        href={isAndroid ? APP_STORE_URL : PLAY_STORE_URL}
        onClick={() => safeTrack(isAndroid ? "ios" : "android", `${source}_alt`)}
        style={{
          display: "block",
          marginTop: 8,
          fontSize: 12.5,
          fontWeight: 600,
          color: TITA.muted,
          textDecoration: "underline",
          fontFamily: KOREAN_FONT_STACK,
        }}
      >
        {isAndroid ? "아이폰이신가요?" : "안드로이드폰이신가요?"}
      </a>
    </div>
  );
}
