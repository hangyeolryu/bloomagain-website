"use client";

// 결과 리빌 '직후' 다운로드 CTA — peak 순간용. 기존 ResultActions는 페이지
// 한참 아래(가치 결·잘 맞는 결·그리움 다음)라, 자기 결 확인하고 만족한 그
// 순간에 다운 버튼이 없어 이탈했다. 여기서 한 번(peak), 아래에서 또 한 번.
//
// 테스트를 방금 마친 사람(taken)에게만 보인다. 공유 링크 방문자(!taken)는
// 아직 자기 결을 모르니 상단 다운을 들이밀지 않는다(ResultActions와 동일 철학).
// 설문 세션에서 이미 기기를 아니까(detectPlatform) 스토어를 고르라고 시키지
// 않고, 감지된 스토어로 보내는 단일 한글 버튼. store=감지값으로 집계 유지.

import { useEffect, useState } from "react";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
  PLAY_STORE_INTENT_URL,
} from "../../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import { recordGyeolEvent } from "../gyeol-events";

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

export function TopDownloadCTA({
  code,
  matchName,
}: {
  code: string;
  matchName: string;
}) {
  const [taken, setTaken] = useState(false);
  const [comfort, setComfort] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [platform, setPlatform] = useState<Platform>("other");

  useEffect(() => {
    setPlatform(detectPlatform());
    try {
      setTaken(sessionStorage.getItem("tita_gyeol_taken") === "1");
      setComfort(sessionStorage.getItem("tita_gyeol_comfort"));
      setGender(sessionStorage.getItem("tita_gyeol_gender"));
    } catch {
      /* sessionStorage 막힘 — 안 보임 */
    }
  }, []);

  if (!taken) return null;

  function download(store: "ios" | "android") {
    logAnalyticsEvent("app_download_click", {
      store,
      source: `gyeol_result_top_${code}`,
      gyeol_comfort: comfort ?? "",
      gyeol_gender: gender ?? "",
    });
    recordGyeolEvent("download", code, { gender, comfort, store });
    trackPixel("AppDownloadClick", { content_name: code, store, placement: "top" }, true);
  }

  const btn: React.CSSProperties = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
    padding: "17px 12px",
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: "-0.3px",
    color: TITA.cream,
    background: TITA.forest,
    borderRadius: 14,
    boxShadow: "0 10px 26px rgba(31,78,61,0.26)",
    border: "none",
  };

  return (
    // peak 순간을 놓치지 않게 '하이라이트 카드'로 시선을 잡는다. 흩어진
    // 버튼보다 카드가 훨씬 클릭을 끈다. 카피는 매치 유형을 넣어 "저 사람을
    // 만나고 싶다"는 욕구를 만든다.
    <div
      style={{
        marginTop: 18,
        background: TITA.white,
        border: `1.5px solid ${TITA.forest}`,
        borderRadius: 20,
        padding: "22px 20px",
        boxShadow: "0 14px 34px rgba(31,78,61,0.15)",
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontSize: 12.5,
          fontWeight: 800,
          letterSpacing: "-0.2px",
          color: TITA.forestMid,
          margin: "0 0 8px",
        }}
      >
        결은 알았으니, 이제 만날 차례
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.5,
          letterSpacing: "-0.5px",
          color: TITA.forestDeep,
          margin: "0 0 16px",
        }}
      >
        당신과 결이 잘 맞는{" "}
        <span style={{ color: TITA.forest }}>&lsquo;{matchName}&rsquo;</span>,
        <br />
        지금 티타에 있어요.
      </p>
      {platform === "other" ? (
        <div style={{ display: "flex", gap: 10 }}>
          <a href={APP_STORE_URL} onClick={() => download("ios")} style={btn}>
            아이폰 (App Store)
          </a>
          <a href={PLAY_STORE_URL} onClick={() => download("android")} style={btn}>
            안드로이드 (Play)
          </a>
        </div>
      ) : (
        <a
          href={platform === "android" ? PLAY_STORE_URL : APP_STORE_URL}
          onClick={(e) => {
            download(platform === "android" ? "android" : "ios");
            if (platform === "android") {
              e.preventDefault();
              window.location.href = PLAY_STORE_INTENT_URL;
            }
          }}
          style={{ ...btn, flex: "unset", width: "100%" }}
        >
          결 맞는 친구 만나러 가기 (무료)
        </a>
      )}
      <p
        style={{
          textAlign: "center",
          fontSize: 12.5,
          color: TITA.muted,
          fontWeight: 600,
          margin: "10px 0 0",
        }}
      >
        가입 없이 결과 봤죠? 앱에선 진짜 맞는 사람을 찾아줘요
        <br />
        무료 · NICE 본인인증으로 안전하게
      </p>
    </div>
  );
}
