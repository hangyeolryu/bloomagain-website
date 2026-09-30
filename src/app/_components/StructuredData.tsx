// 사이트 전역 구조화 데이터 (JSON-LD).
//
// 왜 필요한가 — 사람은 홈 문장을 읽고 "45세 이상 친구 앱"이라고 이해하지만,
// 검색엔진과 AI 답변 엔진은 그걸 추측으로 처리한다. 누가 만들었고, 앱이
// 어느 스토어에 있고, 몇 살부터 쓰는지, 데이팅 앱이 아닌지를 기계가 읽을
// 수 있는 형태로 한 번 못박아 두면, AI가 티타를 인용할 때 "중년 만남 앱"
// 같은 오분류를 덜 한다. (2026-09 GEO 점검: 홈에 JSON-LD가 0개였다)
//
// @id를 붙여 노드를 재사용한다 — MobileApplication의 publisher가 Organization을
// 다시 통째로 적지 않고 #organization을 가리킨다.

import { APP_STORE_URL, PLAY_STORE_URL } from "./tita-brand";

const BASE = "https://tita-app.com";

export const ORG_ID = `${BASE}/#organization`;
export const SITE_ID = `${BASE}/#website`;
export const APP_ID = `${BASE}/#app`;

// 인스타·스레드 핸들은 저장소 안(블로그 카드 캡션)에 @titakorea로 적혀 있는
// 값을 그대로 쓴다. 계정 주소가 바뀌면 sameAs가 엉뚱한 엔티티를 가리키게
// 되므로 여기만 고치면 된다.
const INSTAGRAM_URL = "https://www.instagram.com/titakorea/";
const THREADS_URL = "https://www.threads.com/@titakorea";

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "티타",
  alternateName: ["Tita", "TITA", "티타 (Tita)"],
  legalName: "㈜이프이프",
  url: `${BASE}/`,
  logo: {
    "@type": "ImageObject",
    url: `${BASE}/icon-512.png`,
    width: 512,
    height: 512,
  },
  email: "ceo@effeffcorp.com",
  telephone: "+82-10-5647-1196",
  address: {
    "@type": "PostalAddress",
    streetAddress: "국회대로50길 20",
    addressLocality: "영등포구",
    addressRegion: "서울특별시",
    postalCode: "07271",
    addressCountry: "KR",
  },
  founder: { "@type": "Person", name: "유한결" },
  identifier: {
    "@type": "PropertyValue",
    name: "사업자등록번호",
    value: "466-81-04205",
  },
  sameAs: [APP_STORE_URL, PLAY_STORE_URL, INSTAGRAM_URL, THREADS_URL],
};

const website = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: `${BASE}/`,
  name: "티타 (Tita)",
  description:
    "45세 이상만 가입하는 또래 친구 앱. 데이팅 앱이 아니라 결이 통하는 친구를 만나는 곳.",
  inLanguage: "ko-KR",
  publisher: { "@id": ORG_ID },
};

// 앱 자체. GEO에서 제일 중요한 건 audience.suggestedMinAge(45)와
// "데이팅 앱이 아니다"를 description에 박아두는 것 — AI가 카테고리를
// 추측하지 않고 읽어가게 만든다.
const mobileApplication = {
  "@type": "MobileApplication",
  "@id": APP_ID,
  name: "티타 (Tita)",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "iOS, Android",
  url: `${BASE}/`,
  installUrl: `${BASE}/download/`,
  downloadUrl: APP_STORE_URL,
  inLanguage: "ko-KR",
  description:
    "45세 이상, NICE 본인인증을 통과한 또래끼리 친구가 되는 앱. 데이팅·소개팅 앱이 아닙니다. 하루 한 가지 질문에 답하면 결이 통하는 또래를 추천하고, 낮에 동네에서 3~4명이 만나는 티타임으로 이어집니다. AI 안전망이 로맨스 스캠·보이스피싱·외부 앱 유도를 실시간으로 걸러냅니다.",
  featureList: [
    "하루 한 가지 질문(결Q)으로 쌓는 성향 매칭",
    "낮에 동네에서 3~4명이 만나는 티타임",
    "NICE 본인인증 필수",
    "AI 안전망 — 로맨스 스캠·보이스피싱·외부 앱 유도 탐지",
    "시력·손떨림에 맞춰 글자와 버튼이 조정되는 적응형 화면",
  ],
  audience: {
    "@type": "PeopleAudience",
    suggestedMinAge: 45,
    geographicArea: { "@type": "Country", name: "대한민국" },
  },
  offers: [
    {
      "@type": "Offer",
      name: "기본 (무료)",
      price: 0,
      priceCurrency: "KRW",
      description: "친구 매칭, 동네 글, 그룹 대화, 안전 기능 모두 포함",
    },
    {
      "@type": "Offer",
      name: "티타 플러스 (월간)",
      price: 19900,
      priceCurrency: "KRW",
      url: `${BASE}/subscribe/plus/`,
      description: "메시지·인사 한도 해제, 매칭 인사이트 확대",
    },
  ],
  publisher: { "@id": ORG_ID },
};

function Ld({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 결과에 </script>가 들어갈 수 없는 데이터라 안전하다.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** 사이트 전역 — 루트 레이아웃에서 한 번. 모든 페이지에 운영사·사이트 정체가 붙는다. */
export function SiteStructuredData() {
  return (
    <Ld
      data={{
        "@context": "https://schema.org",
        "@graph": [organization, website],
      }}
    />
  );
}

/** 앱 소개가 본문인 페이지(홈·다운로드)에만. */
export function AppStructuredData() {
  return (
    <Ld data={{ "@context": "https://schema.org", ...mobileApplication }} />
  );
}
