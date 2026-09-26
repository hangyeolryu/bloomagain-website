import type { Metadata } from "next";

// matching/page.tsx는 "use client"라 metadata를 직접 export 못 한다.
// 이 레이아웃이 그 역할을 한다.
//  · alternates: 없으면 Google이 "사용자가 선택한 표준 없음"으로 색인에서 제외한다.
//    trailingSlash: true 라 끝 슬래시까지 적어야 301되는 주소를 정규 주소로
//    선언하는 사고를 피한다.
//  · title/description: 빼면 루트 레이아웃의 홈 값을 그대로 물어서, 검색엔진과
//    AI 답변 엔진 눈에 홈과 똑같은 문서가 된다. 페이지마다 자기 것을 선언한다.
//    (2026-09 GEO 점검에서 네 페이지가 홈과 완전히 같은 제목·설명을 쓰고 있었다)
export const metadata: Metadata = {
  alternates: { canonical: "/matching/" },
  title: "'결이 맞는다'를 정량화하는 방법 — 티타 매칭 | 티타",
  description:
    "대화 결·취향 결·관심 겹침을 어떻게 점수로 만드는지. 관심사, ±10세 또래, 실제로 만날 수 있는 동네까지 함께 보는 티타의 추천 방식.",
  openGraph: {
    title: "'결이 맞는다'를 우리는 이렇게 정량화합니다",
    description: "대화 결·취향 결·관심 겹침 — 티타가 또래를 추천하는 기준.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
