import type { Metadata } from "next";

// /gyeol/page.tsx는 "use client"라 metadata를 직접 export 못 한다.
// 이 서버 layout이 테스트 입구의 제목·설명·OG 텍스트를 담당한다.
// (결과 페이지 /gyeol/[type]는 자체 generateMetadata로 이 값을 덮어쓴다.)
export const metadata: Metadata = {
  title: "결 유형 테스트 — 나는 어떤 결일까? | 티타",
  description:
    "MBTI 말고, 사람과 사람 사이의 결. 14개 질문 3분으로 나의 결 유형과 잘 맞는 친구를 알아봐요. 가입 없이 바로.",
  openGraph: {
    title: "나는 어떤 결일까? 🍵 — 3분 결 유형 테스트",
    description: "MBTI 말고, 사람 사이의 결. 가입 없이 3분, 나의 결 유형과 잘 맞는 친구까지.",
    siteName: "티타",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "나는 어떤 결일까? 🍵 — 3분 결 유형 테스트",
    description: "MBTI 말고, 사람 사이의 결. 가입 없이 3분.",
  },
};

export default function GyeolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
