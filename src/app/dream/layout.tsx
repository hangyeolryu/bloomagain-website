import type { Metadata } from "next";
import localFont from "next/font/local";

// 나눔스퀘어라운드 — /dream 전용(2026-11-12 대표 요청: "좀 더 부드러운 폰트").
// 모서리가 둥근 고딕이라 사이트 기본 고운돋움보다 또렷하면서도 딱딱하지 않다.
// OFL-1.1(@kfonts/nanum-square-round). 본문 400, 제목 700/800.
const nanumSquareRound = localFont({
  src: [
    { path: "./_fonts/NanumSquareRoundR.woff2", weight: "400" },
    { path: "./_fonts/NanumSquareRoundB.woff2", weight: "700" },
    { path: "./_fonts/NanumSquareRoundEB.woff2", weight: "800" },
  ],
  variable: "--font-nsr",
  display: "swap",
});

// 꿈 인터뷰 — "다시 꾸는 꿈" 광고 전용 진입점. 티타의 AI가 미뤄둔 꿈을 묻고,
// 끝나면 같은 꿈 또래가 있는 앱으로 잇는다. /needs와 같은 광고 퍼널 틀이다.
export const metadata: Metadata = {
  // trailingSlash: true 라 끝 슬래시까지 적는다(/needs와 같은 이유).
  alternates: { canonical: "/dream/" },
  title: "미뤄둔 꿈, 티타의 AI와 이야기해 보세요 | 티타",
  description:
    "요즘 해 보고 싶은데 미뤄둔 거, 있으세요? 가입 없이 티타의 AI와 편하게 이야기 나눠 보세요. 같은 꿈을 가진 또래가 티타에 있어요.",
  openGraph: {
    title: "요즘 해 보고 싶은데 미뤄둔 거, 있으세요?",
    description: "꿈이 끝난 나이는 없어요. 가입 없이, 티타의 AI와 편하게 이야기해 보세요.",
  },
};

export default function DreamLayout({ children }: { children: React.ReactNode }) {
  return <div className={nanumSquareRound.variable}>{children}</div>;
}
