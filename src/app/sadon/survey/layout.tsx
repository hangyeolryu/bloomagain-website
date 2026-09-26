import type { Metadata } from "next";

// 사돈 수요조사. 색인하지 않는다 — robots.txt가 이미 /sadon 을 막고 있지만
// 주소를 직접 받은 사람만 들어오게 메타로도 못 박는다. 신고 전이라 검색에
// 뜨면 모집으로 읽힐 수 있다 (docs/sadon/08_신고_준비.md).
export const metadata: Metadata = {
  alternates: { canonical: "/sadon/survey/" },
  title: "부모님께 묻습니다 | 티타",
  description:
    "미혼 자녀를 두신 부모님께 드리는 조사입니다. 신청을 받거나 비용을 받는 화면이 아닙니다.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
