/**
 * /sadon — 이미 카톡으로 돌린 링크를 살려 두는 주소. 본문은 SalonPage.
 * 대표 주소는 /honors (2026-10-01, "링크가 너무 사돈이다").
 */

import type { Metadata } from "next";
import { SalonPage } from "./SalonPage";

export const metadata: Metadata = {
  alternates: { canonical: "/honors/" },
  robots: { index: false, follow: false },
  title: "티타 아너스 · 인연과 취향을 나누는 토요일 오후",
  description:
    "자녀의 인연과 삶을 고민하는 부모 세대의 프라이빗 티타임. 다음 모임 안내를 받아보세요.",
  openGraph: {
    title: "[티타 아너스] 인연과 취향을 나누는 토요일 오후",
    description:
      "토요일 오후, 강남권 프라이빗 공간. 열 분 남짓의 부모님이 모여 차와 이야기를 나누는 프라이빗 티타임입니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "티타",
  },
};

export default SalonPage;
