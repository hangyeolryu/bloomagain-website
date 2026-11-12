import type { Metadata } from "next";
import localFont from "next/font/local";

// 마루부리 — /dream 전용(2026-11-12 대표 선택). 붓 기운이 살짝 있는 부드러운
// 명조라 "다시 꾸는 꿈"의 따뜻한 결에 맞는다. 나눔스퀘어라운드를 먼저 써 봤는데
// 가볍고 어려 보여 바꿨다. 네이버 마루부리(OFL-1.1, @kfonts/maruburi).
// 원본 굵기당 약 850KB라, KS X 1001 완성형 2,350자 + 영문·기호만 남겨 굵기당
// 약 210KB로 줄였다. 드문 글자는 사이트 기본 글꼴로 대신 그려진다.
const maruBuri = localFont({
  src: [
    { path: "./_fonts/MaruBuri-Regular-subset.woff2", weight: "400" },
    { path: "./_fonts/MaruBuri-Bold-subset.woff2", weight: "700" },
  ],
  variable: "--font-maruburi",
  display: "swap",
});

// 꿈 인터뷰 — "다시 꾸는 꿈" 광고 전용 진입점. 티타AI가 미뤄둔 꿈을 묻고,
// 끝나면 같은 꿈 또래가 있는 앱으로 잇는다. /needs와 같은 광고 퍼널 틀이다.
export const metadata: Metadata = {
  // trailingSlash: true 라 끝 슬래시까지 적는다(/needs와 같은 이유).
  alternates: { canonical: "/dream/" },
  title: "미뤄둔 꿈, 티타AI와 이야기해 보세요 | 티타",
  description:
    "요즘 해 보고 싶은데 미뤄둔 거, 있으세요? 가입 없이 티타AI와 편하게 이야기 나눠 보세요. 같은 꿈을 가진 또래가 티타에 있어요.",
  openGraph: {
    title: "요즘 해 보고 싶은데 미뤄둔 거, 있으세요?",
    description: "꿈이 끝난 나이는 없어요. 가입 없이, 티타AI와 편하게 이야기해 보세요.",
  },
};

export default function DreamLayout({ children }: { children: React.ReactNode }) {
  return <div className={maruBuri.variable}>{children}</div>;
}
