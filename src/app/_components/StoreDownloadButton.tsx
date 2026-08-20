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

export type StoreKind = "ios" | "android";

// 집계는 절대 이동을 막지 않는다. 이 컴포넌트의 핵심 안전장치.
//
// onStoreClick은 호출한 쪽이 자기 저장소에도 남기고 싶을 때 쓴다(/enjoy는
// needs_survey_events에 남긴다). 여기서도 try/catch로 감싼다 — 남의 집계가
// 터져서 스토어로 못 가는 일은 없어야 한다.
function safeTrack(
  store: StoreKind,
  source: string,
  onStoreClick?: (store: StoreKind, source: string) => void,
) {
  try {
    logAnalyticsEvent("app_download_click", { store, source });
  } catch {
    /* 집계 실패는 무시 — 스토어로 보내는 게 우선 */
  }
  try {
    onStoreClick?.(store, source);
  } catch {
    /* 위와 같다 */
  }
}

export function StoreDownloadButton({
  source,
  label = "앱 다운로드",
  style,
  children,
  onStoreClick,
}: {
  /** 어느 페이지/위치에서 눌렀는지 (집계용) */
  source: string;
  label?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /**
   * 스토어로 보낼 때 호출된다. 어느 스토어인지는 이 컴포넌트만 안다(기기
   * 판별을 여기서 하므로). 호출한 쪽이 자기 집계에 그 값을 남길 통로다.
   *
   * 이게 없어서 8/8~8/10 사흘간 needs_survey_events의 store가 통째로 비었다.
   * 다운로드 클릭 수는 멀쩡히 쌓이는데 iOS/안드로이드 구분만 사라져서,
   * 어드민에서는 "전환이 0이 됐다"처럼 보였다.
   */
  onStoreClick?: (store: StoreKind, source: string) => void;
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
        <a href={APP_STORE_URL} onClick={() => safeTrack("ios", source, onStoreClick)} style={btn}>
          아이폰
        </a>
        <a
          href={PLAY_STORE_URL}
          onClick={() => safeTrack("android", source, onStoreClick)}
          style={{ ...btn, backgroundColor: TITA.forestMid }}
        >
          안드로이드
        </a>
      </div>
    );
  }

  const isAndroid = platform === "android";

  // 인스타 인앱 브라우저의 iOS — 여기서는 스토어 링크가 작동하지 않는다.
  // 실측: apps.apple.com 링크를 누르면 웹뷰가 이동은 하는데 **빈 흰 화면**이
  // 뜬다. App Store 앱으로 넘어가지도, 웹페이지가 그려지지도 않는다.
  //
  // 그래서 이 조합에서는 스토어 버튼을 1순위에 두지 않는다. 눌러도 설치가
  // 안 되는 데다, 사용자가 빈 화면으로 끌려가면서 이 페이지의 안내까지 통째로
  // 잃기 때문이다(돌아오려면 X를 눌러야 한다). 안 되는 길로 보내는 버튼은
  // 없느니만 못하다.
  //
  // 안드로이드 인앱은 다르다 — intent:// 가 Play 스토어 앱을 실제로 띄우므로
  // 기존 버튼을 그대로 쓴다.
  const iosInApp = inApp && !isAndroid;

  // 문자 본문에는 우리 페이지가 아니라 **스토어 주소**를 담는다. 페이지 주소를
  // 보내면 사용자가 문자에서 링크를 눌러도 여기로 다시 와서 한 번 더 눌러야
  // 한다. 목적은 설치이므로 한 단계를 없앤다.
  const smsBody = encodeURIComponent(
    `티타 앱 설치 링크예요.\n${isAndroid ? PLAY_STORE_URL : APP_STORE_URL}`
  );
  // sms: 는 시스템 스킴이라 인앱 브라우저도 메시지 앱으로 넘겨준다.
  // iOS는 수신자 없이 sms:&body=, 안드로이드는 sms:?body= 를 쓴다.
  const smsHref = isAndroid ? `sms:?body=${smsBody}` : `sms:&body=${smsBody}`;

  return (
    <div>
      {iosInApp ? (
        // 아이폰 + 인앱 브라우저(인스타·카톡).
        //
        // 예전엔 여기서 버튼을 없애고 "아이폰은 여기서 설치가 안 돼요"라는
        // 경고 카드부터 띄웠다. 그런데 실측해보니 **되는 사람이 더 많다** —
        // 최근 3주 아이폰 인앱에서 다운로드 클릭 11건(2026-08-20). 막힌 건
        // 특정 기기·설정이었다. 되는 사람에게까지 "안 됩니다"를 먼저 말하면
        // 그 자리에서 접는다(아이폰 완료→다운로드 20%, 안드로이드는 30%).
        //
        // 그래서 순서를 뒤집는다: 평소처럼 버튼을 먼저 주고, 안 열렸을 때의
        // 길만 아래에 작게 둔다.
        <div>
          <a
            href={APP_STORE_URL}
            onClick={() => safeTrack("ios", source, onStoreClick)}
            style={btn}
          >
            {children ?? label}
          </a>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 13.5,
              lineHeight: 1.65,
              color: TITA.muted,
              textAlign: "center",
              fontFamily: KOREAN_FONT_STACK,
            }}
          >
            안 열리면 <b style={{ color: TITA.ink }}>App Store</b>에서{" "}
            <b style={{ color: TITA.forest }}>티타</b>를 검색해 주세요.
            <br />
            <button
              type="button"
              onClick={copyLink}
              style={{
                marginTop: 8,
                padding: "8px 14px",
                fontSize: 13.5,
                fontWeight: 700,
                borderRadius: 999,
                border: `1px solid ${TITA.sage}`,
                background: copied ? TITA.forest : "transparent",
                color: copied ? TITA.cream : TITA.muted,
                fontFamily: KOREAN_FONT_STACK,
                cursor: "pointer",
              }}
            >
              {copied ? "복사됐어요 — Safari에 붙여넣으세요" : "주소 복사하기"}
            </button>
          </p>
        </div>
      ) : (
        <a
          // href를 항상 진짜 스토어 주소로 둔다 — JS가 죽어도 이동한다.
          href={isAndroid ? PLAY_STORE_URL : APP_STORE_URL}
          onClick={(e) => {
            safeTrack(isAndroid ? "android" : "ios", source, onStoreClick);
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
      )}

      {/* 인앱 브라우저 안내.
          iOS에서는 위 버튼이 이미 문자 보내기이므로, 여기서는 왜 그런지만
          설명하고 대안(주소 복사 / Safari로 열기)을 준다. 안드로이드는 위
          버튼이 정상 동작하므로 이 안내는 실패했을 때의 보조 수단이다. */}
      {inApp && !iosInApp && (
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
          {iosInApp ? (
            <>
              <p
                style={{
                  margin: 0,
                  fontSize: 16.5,
                  fontWeight: 800,
                  lineHeight: 1.5,
                  color: TITA.forestDeep,
                }}
              >
                검색이 번거로우시면
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: TITA.ink,
                }}
              >
                아래 버튼을 누르면 <b>문자 앱이 열립니다.</b> 나에게 보낸 뒤
                문자 속 링크를 누르시면 설치 화면이 바로 떠요.
              </p>
              <a
                href={smsHref}
                onClick={() => safeTrack("ios", `${source}_sms`, onStoreClick)}
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
            </>
          ) : (
            <>
              <p
                style={{
                  margin: 0,
                  fontSize: 16.5,
                  fontWeight: 800,
                  lineHeight: 1.5,
                  color: TITA.forestDeep,
                }}
              >
                설치가 안 되시나요?
              </p>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: TITA.ink,
                }}
              >
                지금 인스타그램 안에서 보고 계셔서 막혔을 수 있어요. 아래
                버튼으로 문자를 받으신 뒤, 문자 속 링크를 눌러주세요.
              </p>
              <a
                href={smsHref}
                onClick={() => safeTrack("android", `${source}_sms`, onStoreClick)}
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
            </>
          )}

          <button
            type="button"
            onClick={copyLink}
            style={{
              marginTop: 14,
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
            익숙하시면 오른쪽 위 <b>⋯</b> →{" "}
            <b>{isAndroid ? "‘다른 브라우저로 열기’" : "‘Safari로 열기’"}</b> 도
            됩니다.
          </p>
        </div>
      )}

      {/* 기기 오감지 대비 탈출구. iOS 인앱에서는 숨긴다 — 반대 스토어 링크도
          같은 웹뷰 안에서 빈 화면이 될 뿐이라, 또 하나의 막다른 길이 된다. */}
      {!iosInApp && (
      <a
        href={isAndroid ? APP_STORE_URL : PLAY_STORE_URL}
        onClick={() => safeTrack(isAndroid ? "ios" : "android", `${source}_alt`, onStoreClick)}
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
      )}
    </div>
  );
}
