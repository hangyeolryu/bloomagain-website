import type { Metadata } from "next";

// download/page.tsx는 "use client"라 metadata를 직접 export 못 한다.
// 정규 URL 선언용 레이아웃 — 없으면 Google이 "사용자가 선택한 표준 없음"으로
// 색인에서 제외한다. trailingSlash: true 라 끝 슬래시까지 적어야
// 301되는 주소를 정규 주소로 선언하는 사고를 피한다.
export const metadata: Metadata = {
  alternates: { canonical: "/download/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
