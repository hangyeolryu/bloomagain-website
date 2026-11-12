import type { Metadata } from "next";

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
  return children;
}
