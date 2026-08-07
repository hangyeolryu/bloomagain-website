"use client";

// 어디서 눌러도 스토어로 가는 다운로드 버튼.
//
// 왜 따로 만들었나 — 페이지마다 다운 CTA를 새로 짜다 보니 iOS에서 "눌러도
// 아무 일도 안 나는" 사고가 반복됐다. 원인은 대부분 셋 중 하나다.
//   ① <button onClick>으로만 이동시킴 → 핸들러가 죽으면 이동 자체가 없다.
//      iOS Safari는 ITP·프라이빗 모드에서 firebase analytics가 예외를 던지는
//      일이 잦아, 집계 한 줄 때문에 버튼 전체가 먹통이 된다.
//   ② intent:// 를 iOS에도 걸어 버림 → Safari는 조용히 무시한다(에러도 없음).
//   ③ 인앱 브라우저(인스타·카톡)에서 JS로 스토어를 열려고 함 → iOS는
//      유니버설 링크를 "사용자 제스처로 시작된 이동"에서만 앱으로 넘긴다.
//      스크립트가 일으킨 이동은 웹뷰 안에서 apps.apple.com 웹페이지로 끝난다.
//
// 그래서 이 컴포넌트는
//   · 항상 진짜 <a href>를 둔다. JS가 죽어도 브라우저가 이동시킨다.
//   · 집계는 try/catch로 감싼다. 실패해도 이동을 막지 않는다.
//   · intent:// 는 안드로이드에서만 쓴다.
//   · 인앱 브라우저면 "외부 브라우저로 열기" 안내를 같이 보여준다.
//   · 기기 오감지에 대비해 반대 스토어 탈출구를 항상 남긴다.

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { detectPlatform, detectInApp, type Platform } from "./store-env";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
  PLAY_STORE_INTENT_URL,
} from "./tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setInApp(detectInApp());
  }, []);

  // 인앱 브라우저 탈출용. navigator.clipboard는 오래된 웹뷰에 없을 수 있어
  // execCommand로 폴백한다. 어느 쪽도 안 되면 조용히 넘어간다 —
  // 실패해도 위의 ⋯ 안내가 남아 있다.
  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      try {
        const el = document.createElement("textarea");
        el.value = url;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      } catch {
        return;
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

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

  // 문자 본문에는 우리 페이지가 아니라 **스토어 주소**를 담는다. 페이지 주소를
  // 보내면 사용자가 문자에서 링크를 눌러도 여기로 다시 와서 한 번 더 눌러야
  // 한다. 목적은 설치이므로 한 단계를 없앤다.
  const smsBody = encodeURIComponent(
    `티타 앱 설치 링크예요.\n${isAndroid ? PLAY_STORE_URL : APP_STORE_URL}`
  );

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

      {/* 인앱 브라우저(인스타·카톡)에서 iOS는 스토어로 못 간다.
          WKWebView는 유니버설 링크를 앱으로 넘기지 않고, 호스트 앱이 직접
          처리해 주지 않는 한 apps.apple.com 링크 탭은 아무 일도 일으키지
          않는다. 커스텀 스킴(itms-apps://)은 더 확실히 막힌다. 웹페이지가
          프로그램으로 웹뷰를 탈출하는 방법은 없다.

          그래서 남는 건 사용자가 이 링크를 웹뷰 밖으로 꺼내는 것뿐이다.
          "⋯ 눌러 Safari로 열기"가 정석이지만 45+ 사용자에게는 실패율이 높다.
          그보다 문자로 보내는 편이 낫다 — sms: 는 시스템 스킴이라 인앱
          브라우저도 메시지 앱으로 넘겨주고, 문자 앱에서 링크를 누르면 그건
          웹뷰 밖이라 스토어가 정상적으로 열린다. 손가락 두 번이면 끝난다. */}
      {inApp && (
        <div
          style={{
            margin: "14px 0 0",
            padding: "18px 18px 16px",
            borderRadius: 16,
            background: TITA.surface,
            border: `1.5px solid ${TITA.camel}`,
            fontFamily: KOREAN_FONT_STACK,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 16.5,
              fontWeight: 800,
              lineHeight: 1.5,
              color: TITA.forestDeep,
            }}
          >
            버튼이 안 눌리시죠?
          </p>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 15,
              lineHeight: 1.7,
              color: TITA.ink,
            }}
          >
            잘못 누르신 게 아니에요. 지금은{" "}
            <b>인스타그램 안에서 보고 계셔서</b> 설치 화면으로 넘어가지 않습니다.
            <br />
            아래 버튼을 누르시면 <b>문자로 링크를 보내드려요.</b> 그 문자를 열고
            링크를 누르시면 바로 설치됩니다.
          </p>

          {/* sms: 는 시스템 스킴이라 인앱 브라우저도 메시지 앱으로 넘겨준다.
              iOS는 수신자 없이 sms:&body=, 안드로이드는 sms:?body= 를 쓴다. */}
          <a
            href={
              isAndroid
                ? `sms:?body=${smsBody}`
                : `sms:&body=${smsBody}`
            }
            onClick={() => safeTrack(isAndroid ? "android" : "ios", `${source}_sms`)}
            style={{
              display: "block",
              marginTop: 16,
              padding: "15px 16px",
              fontSize: 16,
              fontWeight: 800,
              textAlign: "center",
              borderRadius: 999,
              background: TITA.forest,
              color: TITA.cream,
              textDecoration: "none",
              fontFamily: KOREAN_FONT_STACK,
            }}
          >
            문자로 링크 받기
          </a>

          <button
            type="button"
            onClick={copyLink}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "13px 16px",
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 999,
              border: `1.5px solid ${TITA.forest}`,
              background: copied ? TITA.forest : "transparent",
              color: copied ? TITA.cream : TITA.forest,
              fontFamily: KOREAN_FONT_STACK,
              cursor: "pointer",
            }}
          >
            {copied ? "복사됐어요 — 주소창에 붙여넣으세요" : "주소 복사하기"}
          </button>

          <p
            style={{
              margin: "14px 0 0",
              fontSize: 13.5,
              lineHeight: 1.6,
              color: TITA.muted,
            }}
          >
            익숙하시면 오른쪽 위 <b>⋯</b> → {" "}
            <b>{isAndroid ? "‘다른 브라우저로 열기’" : "‘Safari로 열기’"}</b> 도
            됩니다.
          </p>
        </div>
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
