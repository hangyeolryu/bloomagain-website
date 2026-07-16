"use client";

// 결과 페이지 CTA — 전환 최적화 (2차 개편).
// 문제: 공유를 큰 버튼으로 올린 뒤 다운로드 클릭이 0으로 떨어졌다. 두 원인:
//  (1) 결과를 방금 본 사람에게 다운로드와 공유가 같은 무게로 경쟁 → 분산.
//  (2) 공유 링크로 들어온 방문자(아직 테스트 안 함)에게도 다운로드를 1차로
//      들이밀었다 — 자기 결을 아직 못 본 사람은 다운로드할 이유가 없다.
// 해법: 관객을 나눈다.
//  · 방금 테스트를 마친 사람(taken) → **다운로드가 유일한 히어로**, 공유는
//    가벼운 2차로 강등(확산은 유지하되 경쟁하지 않게).
//  · 공유 링크로 온 방문자(!taken) → **"나도 해보기"가 히어로** (테스트를
//    먼저 하게 = 확산 + 워밍업), 다운로드는 작은 링크로만.

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
  PLAY_STORE_INTENT_URL,
} from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import { shareKakao, KAKAO_JS_KEY } from "@/lib/kakao";
import { recordGyeolEvent } from "./gyeol-events";

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

// 인앱 브라우저(인스타·페북·카톡·네이버·라인) 감지. 이 안에서는 스토어
// 앱으로 핸드오프가 자주 깨져서 "다운로드는 눌렀는데 설치가 안 되는" 누수의
// 주범 — 감지되면 외부 브라우저로 열라는 안내를 띄운다.
function detectInApp(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|NAVER\(inapp|Line\//.test(ua);
}

// 다운로드 훅을 "누구와 편한지(comfort)" 답으로 개인화한다. 짧게 — 45+ 여성이
// 훑어 읽어도 한눈에 들어오게. 값이 없으면(공유 링크 방문자 등) default.
// same=동성 편함 / any=상관없음 / opp=이성도 좋음. 성별(gender)은 집계용.
const HOOKS: Record<string, { head: string; body: string }> = {
  same: {
    head: "결이 맞는 동성 친구,\n앱에서 만나요",
    body: "본인인증받은 동성 친구부터, 결이 통하는 순서로 안전하게.",
  },
  any: {
    head: "결만 맞으면\n친구가 돼요",
    body: "매일 한 질문(결큐)에 답할수록, 결이 통하는 친구에 가까워져요.",
  },
  opp: {
    head: "결이 맞으면\n누구든 친구예요",
    body: "본인인증·4계층 안전 위에서, 편하게 만나요.",
  },
  default: {
    head: "그 친구,\n티타에서 만나요",
    body: "당신과 결이 맞는 사람은 어딘가 분명 있어요. 매일 한 질문에 답하며 한 걸음씩 가까워져요.",
  },
};

export function ResultActions({
  code,
  name,
  matchName,
}: {
  code: string;
  name: string;
  matchName?: string;
}) {
  const [platform, setPlatform] = useState<Platform>("other");
  // comfort/gender: 테스트를 방금 마친 세션에서만 존재. 초기값 null → SSR/정적
  // 출력과 첫 렌더는 항상 방문자 뷰(하이드레이션 불일치 방지), 마운트 후 개인화.
  const [comfort, setComfort] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  // 이 세션에서 직접 테스트를 마쳤는가 — false면 공유 링크로 온 방문자.
  const [taken, setTaken] = useState(false);
  // 인앱 브라우저 여부 + 안내 시트 표시.
  const [inApp, setInApp] = useState(false);
  const [showInAppHint, setShowInAppHint] = useState(false);
  useEffect(() => {
    setPlatform(detectPlatform());
    setInApp(detectInApp());
    try {
      setComfort(sessionStorage.getItem("tita_gyeol_comfort"));
      setGender(sessionStorage.getItem("tita_gyeol_gender"));
      setTaken(sessionStorage.getItem("tita_gyeol_taken") === "1");
    } catch {
      /* sessionStorage 막힘 — 방문자 뷰 유지 */
    }
  }, []);

  const hook = (comfort && HOOKS[comfort]) || HOOKS.default;
  const shareUrl = `https://tita-app.com/gyeol/${code}`;

  function download(store: "ios" | "android") {
    logAnalyticsEvent("app_download_click", {
      store,
      source: `gyeol_result_${code}`,
      gyeol_comfort: comfort ?? "",
      gyeol_gender: gender ?? "",
    });
    recordGyeolEvent("download", code, { gender, comfort });
    trackPixel("AppDownloadClick", { store, content_name: code }, true);
  }

  // 카카오톡 공유 — 45+ 확산 최강. 키 없거나 실패하면 일반 공유로 폴백.
  async function shareToKakao() {
    logAnalyticsEvent("gyeol_share", { gyeol_type: code, channel: "kakao" });
    recordGyeolEvent("share", code);
    trackPixel("GyeolShare", { content_name: code, channel: "kakao" }, true);
    const ok = await shareKakao({
      title: `나의 결 유형: ${name}`,
      description: "나는 이런 결이래요. 우리, 결이 맞을까요? 3분이면 나와요 🍵",
      imageUrl: `https://tita-app.com/gyeol/${code}/opengraph-image`,
      url: shareUrl,
    });
    if (!ok) share();
  }

  async function share() {
    logAnalyticsEvent("gyeol_share", { gyeol_type: code });
    recordGyeolEvent("share", code);
    trackPixel("GyeolShare", { content_name: code }, true); // 확산 청중 → 유사타겟 씨앗

    const shareData = {
      title: `나의 결 유형: ${name}`,
      // "너는 뭐야?"가 아니라 "우리 맞을까?" — 비교 궁금증이 클릭을 만든다.
      text: `나는 '${name}' 결이래요. 우리, 결이 맞을까요? 3분이면 나와요 🍵`,
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

  // 플랫폼별 다운로드 집계용 (href는 /download 리다이렉트 사용)
  const primaryStore: "ios" | "android" =
    platform === "android" ? "android" : "ios";
  const primaryStoreLabel =
    platform === "android"
      ? "Google Play"
      : platform === "ios"
      ? "App Store"
      : "App Store · Google Play";

  const linkBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
    cursor: "pointer",
  };

  const heroButton: React.CSSProperties = {
    ...linkBase,
    padding: "20px 24px",
    fontSize: 18,
    fontWeight: 800,
    color: TITA.cream,
    background: TITA.forest,
    borderRadius: 16,
    boxShadow: "0 10px 26px rgba(31,78,61,0.28)",
    letterSpacing: "-0.3px",
    width: "100%",
    border: "none",
  };

  // ─────────────────────────────────────────────────────────────────────
  // 방문자 뷰 (공유 링크로 옴, 아직 자기 결 모름) — 히어로는 "나도 해보기".
  // 다운로드를 아직 들이밀지 않는다: 테스트를 마쳐야 워밍업 → 다운로드가 산다.
  // ─────────────────────────────────────────────────────────────────────
  if (!taken) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: TITA.forestMid,
              margin: "0 0 10px",
            }}
          >
            잠깐, 당신의 결은요?
          </p>
          <h2
            style={{
              fontSize: 23,
              fontWeight: 800,
              letterSpacing: "-0.6px",
              lineHeight: 1.35,
              color: TITA.forestDeep,
              margin: "0 0 12px",
            }}
          >
            「{name}」와 결이 맞을까요?
            <br />
            3분이면 내 결이 나와요
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: TITA.ink,
              margin: "0 0 8px",
            }}
          >
            가입 없이 바로 — 나와 결이 맞는 친구 유형까지 알려드려요.
          </p>
        </div>

        <Link
          href="/gyeol"
          onClick={() =>
            logAnalyticsEvent("gyeol_take_from_shared", { from_type: code })
          }
          style={heroButton}
        >
          🍵 나도 테스트 해보기
        </Link>

        {/* 다운로드는 작은 링크로만 — 방문자에게 강요하지 않는다.
            href는 /download(기기 감지 리다이렉트)로 → 안드로이드가 App Store로
            새지 않게 (SSR href 하드코딩 레이스 방지). */}
        <a
          href="/download"
          onClick={() => download(primaryStore)}
          style={{
            ...linkBase,
            fontSize: 13,
            color: TITA.muted,
            fontWeight: 600,
            padding: 6,
            marginTop: 2,
          }}
        >
          이미 아는 결이라면 · 티타 앱 둘러보기 →
        </a>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  // 결과를 방금 본 사람 — 다운로드가 유일한 히어로. 공유는 가벼운 2차.
  // ─────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* 개인화 훅 — comfort 답에 따라 헤드라인/본문이 바뀐다 (짧게) */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <p
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: TITA.forestMid,
            margin: "0 0 6px",
          }}
        >
          이 결과로, 진짜 친구를 만나요
        </p>
        <h2
          style={{
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: "-0.6px",
            lineHeight: 1.35,
            color: TITA.forestDeep,
            margin: "0 0 12px",
          }}
        >
          {hook.head.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: TITA.ink,
            margin: "0 0 18px",
          }}
        >
          {hook.body}
        </p>
      </div>

      {/* 인앱 브라우저(인스타·카톡 등) 상시 경고 — 탭 전에 미리 보여준다.
          유입의 ~90%가 인스타/스레드/페북 인앱이고, 여기선 스토어 핸드오프가
          깨져 "다운클릭했는데 설치 안 됨" 누수가 가장 크다. 눌러야 뜨는 시트
          (아래 showInAppHint)에만 의존하지 않고, 버튼 위에 상시 안내한다. */}
      {inApp && (platform === "ios" || platform === "android") && (
        <div
          style={{
            background: "#FFF4E5",
            border: "1px solid #F0C088",
            borderRadius: 14,
            padding: "13px 15px",
            marginBottom: 4,
          }}
        >
          <p style={{ fontSize: 15, fontWeight: 800, color: "#8A5A00", margin: "0 0 4px" }}>
            📱 설치 화면이 바로 안 뜨나요?
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#6B4E16", margin: 0 }}>
            아래 <b>초록 버튼</b>을 한 번 더 눌러주세요. 잠시 기다리면 스토어가 열려요.
          </p>
        </div>
      )}

      {/* 1차 — 지배적 다운로드 버튼 (유일한 히어로).
          href는 /download(기기 감지 후 올바른 스토어로 리다이렉트)로 둔다.
          하이드레이션 전에 눌러 onClick이 아직 안 붙었어도 안드로이드 유저가
          App Store로 새지 않는다. 하이드레이션 후엔 onClick이 UA를 재감지해
          직접 스토어로 보내 한 홉 아낀다. */}
      <a
        href="/download"
        onClick={(e) => {
          // 인앱 브라우저(모바일): 먼저 스토어 앱 강제 실행을 시도한다. 안드로이드는
          // intent://, iOS는 App Store 링크가 인앱에서도 대개 열린다 — 50대가 아무
          // 조작 안 해도 설치 화면이 뜨게. 혹시 인앱이 막아 페이지에 그대로 남으면
          // 잠시 뒤 수동 안내 시트를 폴백으로 띄운다. (다운클릭은 그대로 집계)
          if (inApp && (platform === "ios" || platform === "android")) {
            e.preventDefault();
            download(platform);
            window.location.href =
              platform === "android" ? PLAY_STORE_INTENT_URL : APP_STORE_URL;
            setTimeout(() => setShowInAppHint(true), 1200);
            return;
          }
          const p = detectPlatform();
          if (p === "ios" || p === "android") {
            e.preventDefault();
            download(p);
            // 안드로이드는 intent://로 스토어 앱을 강제 실행 → 인앱 브라우저에서도
            // 사용자가 아무 조작 없이 설치 화면이 뜬다(실패 시 자동 폴백).
            window.location.href = p === "android" ? PLAY_STORE_INTENT_URL : APP_STORE_URL;
          } else {
            // 데스크탑: 기본 href(App Store)로 진행 — 아래 보조 링크로 양쪽 노출
            download("ios");
          }
        }}
        style={heroButton}
      >
        🍵 티타에서 결친구 만나기
      </a>
      {inApp && (platform === "ios" || platform === "android") && (
        <p
          style={{
            textAlign: "center",
            fontSize: 12,
            color: TITA.muted,
            margin: "8px 0 0",
          }}
        >
          ⚠️ 지금 인스타그램 안이에요. 설치가 안 되면 아래 안내를 따라주세요.
        </p>
      )}
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
      {/* 데스크탑 등 — 어느 폰인지 모르니 양쪽 다 노출 */}
      {platform === "other" && (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a
            href={APP_STORE_URL}
            onClick={() => download("ios")}
            style={{ ...linkBase, fontSize: 13, color: TITA.forestMid, fontWeight: 600, padding: 4 }}
          >
            App Store
          </a>
          <a
            href={PLAY_STORE_URL}
            onClick={() => download("android")}
            style={{ ...linkBase, fontSize: 13, color: TITA.forestMid, fontWeight: 600, padding: 4 }}
          >
            Google Play
          </a>
        </div>
      )}

      {/* 2차 — 공유. 카카오 키가 있으면 카카오톡 버튼(45+ 최강 채널)을
          먼저, 없으면 일반 공유만. */}
      {KAKAO_JS_KEY && (
        <button
          onClick={shareToKakao}
          style={{
            ...linkBase,
            width: "100%",
            padding: "14px 20px",
            fontSize: 16,
            fontWeight: 700,
            color: "#3C1E1E",
            background: "#FEE500",
            border: "none",
            borderRadius: 12,
            marginTop: 8,
          }}
        >
          카카오톡으로 친구에게 물어보기
        </button>
      )}
      <button
        onClick={share}
        style={{
          ...linkBase,
          width: "100%",
          padding: "13px 20px",
          fontSize: 15,
          fontWeight: 700,
          color: TITA.forestMid,
          background: "transparent",
          border: `1px solid ${TITA.sage}`,
          borderRadius: 12,
          marginTop: 8,
        }}
      >
        🍵 {KAKAO_JS_KEY ? "다른 방법으로 공유" : "친구의 결도 물어보세요"}
      </button>
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: TITA.muted,
          margin: "2px 0 0",
        }}
      >
        {matchName
          ? `「${matchName}」와 정말 맞는지, 친구와 유형을 비교해 보세요`
          : "결이 맞는 친구인지, 서로의 유형으로 비교해 보세요"}
      </p>

      {/* 3차 — 다시 하기, 작게 */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Link
          href="/gyeol"
          style={{ color: TITA.mutedSoft, fontWeight: 600, textDecoration: "none", padding: 4, fontSize: 13 }}
        >
          다시 하기
        </Link>
      </div>

      {/* 인앱 브라우저 안내 시트 — 45+가 따라 하기 쉽게 최소 단계로 */}
      {showInAppHint && (
        <div
          onClick={() => setShowInAppHint(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", background: "#fff", borderRadius: "24px 24px 0 0",
              padding: "28px 24px 32px", boxSizing: "border-box",
            }}
          >
            <p style={{ fontSize: 22, fontWeight: 800, color: TITA.ink, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              한 번만 더 눌러볼까요? 🙏
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, color: TITA.forestMid, margin: "0 0 20px" }}>
              아래 <b>초록 버튼</b>을 눌러주세요. 스토어가 열리면 &lsquo;받기·설치&rsquo;를
              누르면 돼요.<br />
              <span style={{ fontSize: 13.5, color: TITA.muted }}>
                그래도 안 열리면, 이 문자·카톡 링크를 눌러 열어주세요.
              </span>
            </p>
            <a
              href={platform === "android" ? PLAY_STORE_INTENT_URL : APP_STORE_URL}
              onClick={() => download(platform === "android" ? "android" : "ios")}
              style={{
                display: "block", textAlign: "center", background: TITA.forest,
                color: TITA.cream, fontWeight: 800, fontSize: 17, borderRadius: 16,
                padding: "16px 0", textDecoration: "none",
              }}
            >
              🍵 스토어 열기
            </a>
            <button
              onClick={() => setShowInAppHint(false)}
              style={{
                display: "block", width: "100%", marginTop: 10, background: "none",
                border: "none", color: TITA.muted, fontSize: 14, fontWeight: 600, padding: 8,
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
