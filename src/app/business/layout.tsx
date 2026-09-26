import type { Metadata } from "next";

// business/page.tsx는 "use client"라 metadata를 직접 export 못 한다.
// 이 레이아웃이 그 역할을 한다.
//  · alternates: 없으면 Google이 "사용자가 선택한 표준 없음"으로 색인에서 제외한다.
//    trailingSlash: true 라 끝 슬래시까지 적어야 301되는 주소를 정규 주소로
//    선언하는 사고를 피한다.
//  · title/description: 빼면 루트 레이아웃의 홈 값을 그대로 물어서, 검색엔진과
//    AI 답변 엔진 눈에 홈과 똑같은 문서가 된다. 페이지마다 자기 것을 선언한다.
//    (2026-09 GEO 점검에서 네 페이지가 홈과 완전히 같은 제목·설명을 쓰고 있었다)
export const metadata: Metadata = {
  alternates: { canonical: "/business/" },
  title: "기관·기업 협력 — 45세 이상 관계 형성 프로그램 | 티타",
  description:
    "복지관·지자체·기업과 함께하는 45세 이상 관계 형성 프로그램. 티타의 매칭·안전 시스템을 기관 사업에 붙이는 방식과 협력 문의.",
  openGraph: {
    title: "기관·기업과 함께하는 티타",
    description: "45세 이상 관계 형성 프로그램 협력 문의.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
