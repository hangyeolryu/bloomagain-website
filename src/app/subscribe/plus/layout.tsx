import type { Metadata } from "next";

// subscribe/plus/page.tsx는 "use client"라 metadata를 직접 export 못 한다.
// 이 레이아웃이 그 역할을 한다.
//  · alternates: 없으면 Google이 "사용자가 선택한 표준 없음"으로 색인에서 제외한다.
//    trailingSlash: true 라 끝 슬래시까지 적어야 301되는 주소를 정규 주소로
//    선언하는 사고를 피한다.
//  · title/description: 빼면 루트 레이아웃의 홈 값을 그대로 물어서, 검색엔진과
//    AI 답변 엔진 눈에 홈과 똑같은 문서가 된다. 페이지마다 자기 것을 선언한다.
//    (2026-09 GEO 점검에서 네 페이지가 홈과 완전히 같은 제목·설명을 쓰고 있었다)
export const metadata: Metadata = {
  alternates: { canonical: "/subscribe/plus/" },
  title: "티타 플러스 — 월 19,900원 정기결제 | 티타",
  description:
    "메시지·인사 한도 없이, 매칭 인사이트까지. 티타 플러스 월 19,900원. 안전 기능은 무료 회원도 동일하게 적용됩니다. 언제든 해지 · 약정 없음.",
  openGraph: {
    title: "티타 플러스 — 월 19,900원",
    description: "메시지·인사 한도 없이, 매칭 인사이트까지. 언제든 해지.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
