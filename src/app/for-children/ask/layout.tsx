import type { Metadata } from "next";

// 토큰 페이지다. **색인되면 안 된다** — 링크 하나가 검색에 뜨는 순간
// 그 집의 사정이 공개된다. 루트 layout이 canonical:"/"를 기본값으로 깔아두므로
// 여기서 덮되(trailingSlash: true라 끝 슬래시까지), robots로 색인은 막는다.
export const metadata: Metadata = {
  title: "티타",
  alternates: { canonical: "/for-children/ask/" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
