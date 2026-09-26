import type { Metadata } from "next";

// about/page.tsx는 "use client"라 metadata를 직접 export 못 한다.
// 이 레이아웃이 그 역할을 한다.
//  · alternates: 없으면 Google이 "사용자가 선택한 표준 없음"으로 색인에서 제외한다.
//    trailingSlash: true 라 끝 슬래시까지 적어야 301되는 주소를 정규 주소로
//    선언하는 사고를 피한다.
//  · title/description: 빼면 루트 레이아웃의 홈 값을 그대로 물어서, 검색엔진과
//    AI 답변 엔진 눈에 홈과 똑같은 문서가 된다. 페이지마다 자기 것을 선언한다.
//    (2026-09 GEO 점검에서 네 페이지가 홈과 완전히 같은 제목·설명을 쓰고 있었다)
export const metadata: Metadata = {
  alternates: { canonical: "/about/" },
  title: "티타 소개 — 45세 이상 또래 친구 앱, 안전 시스템 4단계 | 티타",
  description:
    "티타가 무엇을 만들었는지. NICE 본인인증·AI 위험 점수·적응형 화면·멤버 상호 보호 4단계와 추천 방식, 운영사 ㈜이프이프 정보까지.",
  openGraph: {
    title: "티타 소개 — 45세 이상 또래 친구 앱",
    description: "안전 시스템 4단계와 추천 방식, 우리가 만든 것.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
