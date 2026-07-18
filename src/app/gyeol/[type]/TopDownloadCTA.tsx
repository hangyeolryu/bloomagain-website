"use client";

// 결과 리빌 '직후' 다운로드 CTA — peak 순간용. 기존 ResultActions는 페이지
// 한참 아래(가치 결·잘 맞는 결·그리움 다음)라, 자기 결 확인하고 만족한 그
// 순간에 다운 버튼이 없어 이탈했다. 여기서 한 번(peak), 아래에서 또 한 번.
//
// 테스트를 방금 마친 사람(taken)에게만 보인다. 공유 링크 방문자(!taken)는
// 아직 자기 결을 모르니 상단 다운을 들이밀지 않는다(ResultActions와 동일 철학).
// 리다이렉트/인앱 처리는 /download 페이지가 담당 — 여기선 클릭 집계만.

import { useEffect, useState } from "react";
import { TITA, KOREAN_FONT_STACK } from "../../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import { recordGyeolEvent } from "../gyeol-events";

export function TopDownloadCTA({ code }: { code: string }) {
  const [taken, setTaken] = useState(false);
  const [comfort, setComfort] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  useEffect(() => {
    try {
      setTaken(sessionStorage.getItem("tita_gyeol_taken") === "1");
      setComfort(sessionStorage.getItem("tita_gyeol_comfort"));
      setGender(sessionStorage.getItem("tita_gyeol_gender"));
    } catch {
      /* sessionStorage 막힘 — 안 보임 */
    }
  }, []);

  if (!taken) return null;

  function onClick() {
    logAnalyticsEvent("app_download_click", {
      store: "auto",
      source: `gyeol_result_top_${code}`,
      gyeol_comfort: comfort ?? "",
      gyeol_gender: gender ?? "",
    });
    recordGyeolEvent("download", code, { gender, comfort });
    trackPixel("AppDownloadClick", { content_name: code, placement: "top" }, true);
  }

  return (
    <div style={{ marginTop: 16 }}>
      <a
        href="/download"
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: KOREAN_FONT_STACK,
          textDecoration: "none",
          width: "100%",
          padding: "18px 22px",
          fontSize: 17,
          fontWeight: 800,
          letterSpacing: "-0.3px",
          color: TITA.cream,
          background: TITA.forest,
          borderRadius: 16,
          boxShadow: "0 10px 26px rgba(31,78,61,0.26)",
          border: "none",
        }}
      >
        🍵 이 결로, 결친구 만나러 가기 →
      </a>
      <p
        style={{
          textAlign: "center",
          fontSize: 12.5,
          color: TITA.muted,
          fontWeight: 600,
          margin: "8px 0 0",
        }}
      >
        무료로 시작 · NICE 본인인증으로 안전하게
      </p>
    </div>
  );
}
