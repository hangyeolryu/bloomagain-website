import type { Metadata } from "next";

// /enjoy — 밝은판 3문항 랜딩. "506070, 이제 즐길 때" 광고의 전용 착지점.
//
// /needs(9문항)와 나란히 둔다. 그쪽은 도착의 80%가 첫 질문에서 빠졌는데,
// 첫 화면이 "요즘 그 시간을 어떻게 보내세요?"라 답하려면 자기 고백을 해야
// 했다. 여기는 반대로 연다 — "뭐가 제일 하고 싶으세요?"
export const metadata: Metadata = {
  // 이걸 빼면 루트 layout의 기본값(alternates: { canonical: "/" })이 그대로
  // 상속돼, 광고 착지 페이지가 스스로 "나는 홈의 중복"이라고 선언한다.
  // 사이트맵에 priority 0.8로 제출해 놓고 색인은 절대 안 되는 상태가 된다.
  // (Search Console: "대체 페이지(적절한 표준 태그 있음)")
  alternates: { canonical: "/enjoy/" },
  title: "506070, 이제 즐길 때 — 뭐가 제일 하고 싶으세요? | 티타",
  description:
    "전시, 연극, 뮤지컬, 여행. 하고 싶은 걸 고르시면 결이 맞는 서넛을 모아드립니다. 만 45세 이상, 가입 없이 30초.",
  openGraph: {
    title: "506070, 이제 즐길 때 — 뭐가 제일 하고 싶으세요?",
    description:
      "하고 싶은 걸 고르시면 결이 맞는 서넛을 모아드립니다. 가입 없이 30초.",
  },
};

export default function EnjoyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
