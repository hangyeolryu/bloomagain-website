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

// 다운로드 훅을 "누구와 편한지(comfort)" 답으로 개인화한다. 답을 안 했거나
// (공유 링크로 바로 들어온 방문자 등) 값이 없으면 default(글로벌 궁금증) 문구.
// same=동성 편함 / any=상관없음 / opp=이성도 좋음. 성별(gender)은 훅에 안 쓰고 집계용.
const HOOKS: Record<string, { head: string; body: string }> = {
  same: {
    head: "결이 맞는 동성 친구,\n어디에 있을까요?",
    body: "티타에선 본인인증받은 동성 친구부터, 결이 통하는 순서로 안전하게 만나요.",
  },
  any: {
    head: "결만 맞으면 돼요.\n그 친구, 어디 있을까요?",
    body: "티타에선 매일 한 질문(결큐)에 답할수록, 결이 통하는 친구를 천천히 찾아줘요.",
  },
  opp: {
    head: "결이 맞으면\n누구든 친구가 돼요.",
    body: "본인인증·4계층 안전 위에서, 결이 통하는 친구를 편하게 만나요.",
  },
  default: {
    head: "그런데 그 사람,\n어디에 있을까요?",
    body: "당신과 결이 딱 맞는 사람은 어딘가 분명 있어요. 티타에서 매일 한 질문(결큐)에 답할수록 결이 또렷해지고, 그만큼 그 사람에 한 걸음씩 가까워져요. 우리 동네일 수도, 생각지 못한 먼 곳일 수도. 진짜 찾아볼래요? 🍵",
  },
};

export function ResultActions({ code, name }: { code: string; name: string }) {
  const [platform, setPlatform] = useState<Platform>("other");
  // comfort/gender: 테스트를 방금 마친 세션에서만 존재. 초기값 null → SSR/정적
  // 출력과 첫 렌더는 항상 default 훅(하이드레이션 불일치 방지), 마운트 후 개인화.
  const [comfort, setComfort] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  // 이 세션에서 직접 테스트를 마쳤는가 — false면 공유 링크로 온 방문자.
  // 방문자에겐 공유 버튼 대신 "나도 해보기"가 큰 버튼이어야 바이럴이 돈다.
  const [taken, setTaken] = useState(false);
  useEffect(() => {
    setPlatform(detectPlatform());
    try {
      setComfort(sessionStorage.getItem("tita_gyeol_comfort"));
      setGender(sessionStorage.getItem("tita_gyeol_gender"));
      setTaken(sessionStorage.getItem("tita_gyeol_taken") === "1");
    } catch {
      /* sessionStorage 막힘 — default 훅 유지 */
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
  }

  async function share() {
    logAnalyticsEvent("gyeol_share", { gyeol_type: code });
    recordGyeolEvent("share", code);
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
      {/* 개인화 훅 — comfort 답에 따라 헤드라인/본문이 바뀐다 */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: TITA.forestMid, margin: "0 0 6px" }}>
          이 테스트는 맛보기예요
        </p>
        <p style={{ fontSize: 14, fontWeight: 600, color: TITA.forestMid, margin: "0 0 6px" }}>
          {name}인 당신,
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
          {hook.head.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < hook.head.split("\n").length - 1 && <br />}
            </span>
          ))}
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: TITA.ink, margin: "0 0 20px" }}>
          {hook.body}
        </p>
      </div>

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

      {/* 2차 — 바이럴 버튼 (제대로 된 크기). 누가 보느냐로 갈린다:
          테스트 마친 사람 → "친구의 결도 물어보기" (공유가 곧 확산)
          공유 링크로 온 방문자 → "나도 해보기" (테스트 시작이 곧 확산) */}
      {taken ? (
        <button
          onClick={share}
          style={{
            ...linkBase,
            width: "100%",
            padding: "16px 22px",
            fontSize: 16,
            fontWeight: 700,
            color: TITA.forestDeep,
            background: TITA.white,
            border: `2px solid ${TITA.forestMid}`,
            borderRadius: 14,
            marginTop: 6,
          }}
        >
          🍵 친구의 결도 물어보세요
        </button>
      ) : (
        <Link
          href="/gyeol"
          onClick={() =>
            logAnalyticsEvent("gyeol_take_from_shared", { from_type: code })
          }
          style={{
            ...linkBase,
            width: "100%",
            padding: "16px 22px",
            fontSize: 16,
            fontWeight: 700,
            color: TITA.forestDeep,
            background: TITA.white,
            border: `2px solid ${TITA.forestMid}`,
            borderRadius: 14,
            marginTop: 6,
          }}
        >
          🍵 나는 어떤 결일까? 3분 테스트
        </Link>
      )}
      <p
        style={{
          textAlign: "center",
          fontSize: 13,
          color: TITA.muted,
          margin: "2px 0 0",
        }}
      >
        {taken
          ? "결이 맞는 친구인지, 서로의 유형으로 비교해 보세요"
          : "가입 없이 바로 — 나와 결이 맞는 친구 유형까지 알려드려요"}
      </p>

      {/* 3차 — 잔여 액션, 작게 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 6,
          fontSize: 14,
        }}
      >
        {taken ? (
          <Link
            href="/gyeol"
            style={{ color: TITA.muted, fontWeight: 600, textDecoration: "none", padding: 4 }}
          >
            다시 하기
          </Link>
        ) : (
          <button
            onClick={share}
            style={{
              background: "none",
              border: "none",
              color: TITA.muted,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: KOREAN_FONT_STACK,
              padding: 4,
            }}
          >
            이 결과 공유하기 🔗
          </button>
        )}
      </div>
    </div>
  );
}
