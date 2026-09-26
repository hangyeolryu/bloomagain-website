import type { Metadata } from "next";

// 니즈 설문 랜딩 — 5060 광고 전용 진입점. 결 테스트(/gyeol)와 별개 퍼널.
export const metadata: Metadata = {
  // 정규 URL. trailingSlash: true 라 반드시 끝 슬래시까지 적는다 —
  // 빠뜨리면 301되는 주소를 정규 주소로 선언하는 꼴이 된다.
  alternates: { canonical: "/needs/" },
  // 2026-08-06 종료된 퍼널. 라이브 랜딩은 /enjoy 이고 내용이 겹친다.
  // 아직 돌아다니는 광고 링크가 있을 수 있어 페이지는 살려두되 색인에서는
  // 뺀다(follow는 남겨 내부 링크는 그대로 따라가게).
  robots: { index: false, follow: true },
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
