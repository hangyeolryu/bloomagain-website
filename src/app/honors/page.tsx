/**
 * /honors — 티타 아너스 대표 주소. 본문은 ../sadon/SalonPage 와 같다.
 * 인스타 프로필 링크·새로 보내는 초대는 이 주소로.
 */

import type { Metadata } from "next";
import { SalonPage } from "../sadon/SalonPage";

export const metadata: Metadata = {
  alternates: { canonical: "/honors/" },
  robots: { index: false, follow: false },
  title: "티타 아너스 · 인연과 취향을 나누는 토요일 오후",
  description:
    "자녀의 인연과 삶을 고민하는 부모 세대의 프라이빗 티타임. 2026년 10월 31일 토요일 오후.",
  openGraph: {
    title: "[티타 아너스] 인연과 취향을 나누는 토요일 오후",
    description:
      "10월 31일 토요일 오후 3시, 강남권 프라이빗 공간. 열 분 남짓의 부모님이 모여 차와 이야기를 나누는 프라이빗 티타임입니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "티타",
  },
};

export default SalonPage;
