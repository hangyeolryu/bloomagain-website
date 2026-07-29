import type { Metadata } from "next";

// 니즈 설문 랜딩 — 5060 광고 전용 진입점. 결 테스트(/gyeol)와 별개 퍼널.
export const metadata: Metadata = {
  title: "요즘 나에게 필요한 것 — 1분 테스트 | 티타",
  description:
    "자녀 독립, 은퇴, 부쩍 많아진 나만의 시간 — 삶이 바뀌면 필요한 것도 바뀝니다. 가입 없이 1분, 지금 나에게 필요한 게 뭔지 알아보세요.",
  openGraph: {
    title: "요즘 나에게 필요한 것 — 1분 테스트",
    description:
      "삶이 바뀌면 필요한 것도 바뀝니다. 가입 없이 1분이면 알 수 있어요.",
  },
};

export default function NeedsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
