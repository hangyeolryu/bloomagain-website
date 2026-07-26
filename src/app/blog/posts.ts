// 티타 블로그 — 글 데이터 (단일 소스 오브 트루스)
// ──────────────────────────────────────────────────────────────────────────
// output:'export' 정적 사이트라 글은 이 파일의 데이터로 빌드 타임에 정적
// 생성된다. 새 글을 추가하려면 POSTS 배열에 항목 하나만 추가하면 됨
//   · /blog          (목록)          ← 자동 반영
//   · /blog/[slug]   (본문 + JSON-LD) ← generateStaticParams가 이 배열을 읽음
//   · sitemap.xml                     ← sitemap.ts가 이 배열을 읽음
//
// SEO 원칙
//   · title/description은 검색 스니펫에 그대로 나간다 — 키워드를 앞쪽에.
//   · body는 실제 텍스트(이미지 alt 포함)라 구글이 색인한다. 카드 이미지만
//     넣지 말고 반드시 문단으로 풀어쓸 것.
//   · sources는 신뢰(E-E-A-T) 신호. 연도·기관 정직 표기.
//   · faq는 FAQPage 구조화데이터로 나가 리치 결과(펼침 Q&A) 후보가 된다.

export interface BlogSource {
  label: string;
  url?: string;
}

export type Block =
  | { type: "p"; text: string } // 문단 (인라인 **굵게** 지원)
  | { type: "h2"; text: string } // 소제목
  | { type: "image"; src: string; alt: string; caption?: string } // 본문 이미지
  | { type: "callout"; text: string } // 강조 박스
  | { type: "quote"; text: string; cite?: string }; // 인용

export interface BlogPost {
  slug: string;
  title: string; // <h1> + <title> (검색 제목)
  description: string; // meta description + 목록 발췌
  date: string; // 발행일 (ISO, YYYY-MM-DD)
  updated?: string; // 수정일 (있으면 dateModified)
  category: string;
  tags: string[];
  cover: string; // 목록 썸네일 + OG 폴백 (public 경로)
  readingMinutes: number;
  body: Block[];
  sources: BlogSource[];
  faq?: { q: string; a: string }[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "5060-loneliness-social-prescribing",
    title: "50·60대, 10명 중 4명이 외롭다 — 외로움은 개인 탓이 아닙니다",
    description:
      "통계청 2025년 사회조사가 드러낸 중장년 외로움의 실체와, 영국이 국가 과제로 찾은 해법 ‘사회적 처방’. 관계는 의지가 아니라 연결의 문제입니다.",
    date: "2026-07-26",
    category: "관계 인사이트",
    tags: [
      "외로움",
      "5060",
      "중장년",
      "1인가구",
      "사회적 처방",
      "통계청 사회조사",
      "사회적 고립",
    ],
    cover: "/blog/insight-03/card-1.png",
    readingMinutes: 4,
    body: [
      {
        type: "p",
        text: "“나이 들면 원래 외롭지.” 흔히들 그렇게 넘깁니다. 그런데 최근 통계는 조금 다른 이야기를 합니다. 외로움이 가장 먼저, 그리고 조용히 찾아오는 시기는 노년이 아니라 **한창때인 50·60대**라는 것입니다.",
      },
      { type: "h2", text: "50·60대, 10명 중 4명이 외롭다" },
      {
        type: "image",
        src: "/blog/insight-03/card-1.png",
        alt: "50·60대 10명 중 4명이 외롭다 — 은퇴·자녀 독립·이혼·사별로 관계가 자연스럽게 끊긴다는 티타 인사이트 카드",
        caption: "티타 인사이트 · 관계수업 #03",
      },
      {
        type: "p",
        text: "통계청이 발표한 **2025년 사회조사**에서 “평소 외로움을 느낀다”고 답한 비율은 전체 38.2%였습니다. 연령별로 보면 **50대 41.7%, 60세 이상 42.2%** 로, 전체 평균보다 높았습니다. 외로움은 특정 세대만의 문제가 아니라, 인생 후반으로 접어드는 길목에서 뚜렷해집니다.",
      },
      {
        type: "p",
        text: "더 눈여겨볼 숫자가 있습니다. 도움이 필요할 때 부탁할 사람도, 평소 함께 시간을 보낼 사람도 없는 **‘관계 단절’ 상태가 국민의 5.8%** 에 이릅니다. 이들 중 절반 이상이 외로움을 호소했습니다. 은퇴, 자녀의 독립, 이혼과 사별을 거치며 관계는 어느 순간 소리 없이 하나둘 끊깁니다.",
      },
      { type: "h2", text: "외로움은 ‘개인 탓’이 아니다" },
      {
        type: "image",
        src: "/blog/insight-03/card-2.png",
        alt: "외로움은 개인 탓이 아니에요 — 영국이 국가 과제로 삼으며 내린 결론이라는 티타 인사이트 카드",
        caption: "의지가 아니라 ‘연결’의 문제",
      },
      {
        type: "p",
        text: "외로움을 “의지가 약해서”, “성격 탓에” 생기는 개인의 문제로 보면 해결은 늘 개인의 몫으로 남습니다. 하지만 영국은 다른 결론에 도달했습니다. 2018년 세계 최초로 **‘외로움부(Minister for Loneliness)’** 를 두고, 국가 전략 「연결된 사회(A Connected Society)」를 발표하며 외로움을 **사회가 함께 풀어야 할 공중보건 과제**로 규정했습니다.",
      },
      {
        type: "callout",
        text: "핵심은 관점의 전환입니다. 외로움은 마음가짐의 문제가 아니라, ‘연결이 끊긴 구조’의 문제라는 것.",
      },
      { type: "h2", text: "세계의 해법: 약 대신 ‘관계’를 처방한다" },
      {
        type: "image",
        src: "/blog/insight-03/card-3.png",
        alt: "그래서 세계는 약 대신 관계를 처방해요 — 사회적 처방, 서울시 서울연결처방 2025 시작이라는 티타 인사이트 카드",
        caption: "사회적 처방(Social Prescribing)",
      },
      {
        type: "p",
        text: "그 관점에서 나온 처방이 **‘사회적 처방(Social Prescribing)’** 입니다. 의사가 약을 처방하듯, 외로움과 고립을 겪는 사람에게 **지역 모임·활동·관계**를 연결해 주는 방식입니다. 우울과 불안의 뿌리에 ‘고립’이 있다면, 약만으로는 닿지 않는 곳을 관계가 채웁니다.",
      },
      {
        type: "p",
        text: "이 흐름은 한국에도 도착했습니다. **서울시는 2025년 ‘서울연결처방’** 을 시작하며, 고립을 겪는 시민을 지역의 관계와 활동으로 잇는 실험에 나섰습니다. 외로움을 개인에게 떠넘기지 않고, 만날 자리를 사회가 만들어 주는 방향입니다.",
      },
      { type: "h2", text: "티타가 하는 일" },
      {
        type: "image",
        src: "/blog/insight-03/card-4.png",
        alt: "티타가 하는 일이 바로 그거예요 — 결이 맞는 사람과 가까운 동네에서 차 한 잔, 끊긴 관계를 다시 연결한다는 티타 인사이트 카드",
        caption: "my.tita.app",
      },
      {
        type: "p",
        text: "**티타가 하려는 일이 바로 그것**입니다. 결(관심사·삶의 결)이 맞는 사람을 **가까운 동네**에서 만나 차 한 잔 나누도록 잇는 것. 끊긴 관계를 다시 연결하는, 말하자면 개인이 실천하는 사회적 처방입니다.",
      },
      {
        type: "p",
        text: "다만 중장년이 새로운 만남에서 가장 걱정하는 건 ‘안전’입니다. 그래서 티타는 **NICE 본인인증**을 통과한 사람만 함께하고, 로맨스 스캠·보이스피싱 같은 위험 패턴을 **AI가 실시간으로 감지**합니다. 데이팅이 아니라, 안심하고 만나는 **친구 중심**의 연결입니다.",
      },
      {
        type: "quote",
        text: "친구가 없는 게 아닙니다. 편하게 만날 자리가 없었을 뿐입니다.",
      },
    ],
    sources: [
      {
        label:
          "통계청 「2025년 사회조사 결과」 — 외로움 체감 38.2%(50대 41.7%·60세 이상 42.2%), 관계 단절 5.8% (2026 발표)",
        url: "https://www.kostat.go.kr/board.es?mid=a10301010000&bid=219&act=view&list_no=439196",
      },
      {
        label:
          "영국 「A Connected Society: a strategy for tackling loneliness」 (2018) — 세계 최초 외로움 국가전략·외로움부",
      },
      {
        label:
          "서울시 ‘서울연결처방’ (2025) — 사회적 처방 기반 고립·외로움 대응",
      },
    ],
    faq: [
      {
        q: "중장년(50·60대)이 정말 더 외로운가요?",
        a: "통계청 2025년 사회조사에서 ‘평소 외롭다’는 응답은 전체 38.2%였고, 50대 41.7%·60세 이상 42.2%로 평균보다 높았습니다. 은퇴·자녀 독립·이혼·사별로 관계가 끊기는 시기와 겹치기 때문입니다.",
      },
      {
        q: "‘사회적 처방(Social Prescribing)’이 무엇인가요?",
        a: "약을 처방하듯 외로움·고립을 겪는 사람에게 지역의 모임·활동·관계를 연결해 주는 접근입니다. 영국이 외로움 국가전략의 핵심으로 도입했고, 서울시도 2025년 ‘서울연결처방’으로 시작했습니다.",
      },
      {
        q: "티타는 데이팅 앱인가요?",
        a: "아닙니다. 티타는 결(관심사·삶의 결)이 맞는 사람을 가까운 동네에서 만나는 친구 중심 서비스입니다. NICE 본인인증과 AI 안전망으로 안심하고 만날 수 있게 설계했습니다.",
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  // 최신 글이 위로.
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
