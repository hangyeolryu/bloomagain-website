import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { StoreDownloadButton } from "../_components/StoreDownloadButton";

// /enjoy — "506070, 이제 즐길 때. 근데 누구랑?" 캠페인 랜딩.
//
// 광고(인스타 카드·딥그린 광고)에서 바로 떨어지는 페이지라 목표는 하나,
// 앱 설치다. 그래서 헤더/네비 없이 단일 열로 가고, 다운로드 CTA를 위·아래
// 두 번 둔다.
//
// 다운로드 버튼은 반드시 <StoreDownloadButton/>을 쓴다. 페이지마다 CTA를
// 새로 짜다가 iOS에서 "눌러도 아무 일 없는" 사고가 반복돼서 만든 컴포넌트다
// (항상 진짜 <a href>, 집계는 try/catch, intent://는 안드로이드 전용).

const BASE = "https://tita-app.com";

export const metadata: Metadata = {
  title: "이제 좀 즐기려는데, 누구랑 가죠? — 결이 맞는 친구 찾기 | 티타",
  description:
    "시간도 여유도 생겼는데 같이 갈 사람이 없습니다. 친구가 없어서가 아니라 취향이 맞는 친구가 없어서입니다. 만 45세 이상, 결이 맞는 또래를 가까운 동네에서 만나세요.",
  keywords: [
    "5060 친구",
    "506070",
    "중년 친구 만들기",
    "취미 친구",
    "동네 친구",
    "여행 같이 갈 사람",
    "티타",
  ],
  alternates: { canonical: `${BASE}/enjoy/` },
  openGraph: {
    title: "506070, 이제 즐길 때 — 근데, 누구랑 가죠?",
    description:
      "하고 싶던 걸 같이 할, 결이 맞는 친구부터 찾아요. 만 45세 이상 · NICE 본인인증.",
    url: `${BASE}/enjoy/`,
    siteName: "티타",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: `${BASE}/marketing/ad-who-to-enjoy-with.png`,
        width: 1080,
        height: 1350,
        alt: "506070 이제 즐길 때 — 근데, 누구랑 가죠?",
      },
    ],
  },
};

// 인사이트 #10 카드 — 광고에서 본 그림을 랜딩에서 다시 만나게 해 이어붙인다.
const CARDS = [
  { src: "/blog/insight-10/card-1.png", alt: "이제 좀 즐기려는데, 누구랑 가죠?" },
  { src: "/blog/insight-10/card-2.png", alt: "친구가 없는 게 아니라 취향이 맞는 친구가 없는 것" },
  { src: "/blog/insight-10/card-3.png", alt: "우리 친구는 대부분 우연히 정해졌다" },
  { src: "/blog/insight-10/card-4.png", alt: "이제는 고를 때예요" },
  { src: "/blog/insight-10/card-5.png", alt: "하고 싶던 걸, 결이 맞는 사람과" },
];

const WANTS = [
  "여행",
  "전시·공연",
  "등산·둘레길",
  "7080 통기타",
  "사진",
  "악기 배우기",
  "맛집",
  "골프·탁구",
];

const SAFETY = [
  "만 45세 이상 · NICE 본인인증 완료자만",
  "처음엔 1:1이 아니라 여럿이 모여요",
  "위험한 접근은 AI가 실시간으로 감지해요",
  "연애가 아니라 친구가 먼저예요",
];

const FAQ = [
  {
    q: "왜 오래된 친구와는 취향이 안 맞을까요?",
    a: "대부분의 친구 관계가 ‘근접성’으로 만들어졌기 때문입니다. 1950년 MIT 웨스트게이트 연구에서 친구의 약 65%가 다섯 집 이내 사람이었습니다. 같은 동네·학교·직장이라 가까워진 것이지, 취향이 맞아 고른 관계가 아니었습니다.",
  },
  {
    q: "이 나이에 친구를 가려 사귀는 게 이기적인가요?",
    a: "아닙니다. 스탠퍼드대 카스텐슨의 사회정서적 선택이론에 따르면 나이가 들수록 사람은 관계를 더 선별하고 정서적으로 의미 있는 관계에 집중합니다. 아는 사람 수는 줄지만 가까운 관계의 밀도는 높아지는, 자연스러운 발달 변화입니다.",
  },
  {
    q: "취향이 맞는 또래는 어디서 만나나요?",
    a: "티타는 관심사와 삶의 결을 기준으로 가까운 동네의 또래를 이어 줍니다. 전시·등산·공연처럼 하고 싶은 일을 적어 두면 비슷한 시기를 지나는 분들과 연결되고, NICE 본인인증과 AI 안전망으로 안심하고 시작할 수 있습니다.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const card: React.CSSProperties = {
  background: TITA.white,
  borderRadius: 20,
  padding: "26px 24px",
  border: `1px solid ${TITA.sage}`,
};

const h2: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  lineHeight: 1.38,
  letterSpacing: "-0.02em",
  margin: "0 0 12px",
  color: TITA.ink,
};

const body: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.72,
  color: TITA.ink,
  margin: 0,
  opacity: 0.86,
};

const srcLine: React.CSSProperties = {
  fontSize: 12.5,
  color: TITA.mutedSoft,
  margin: "12px 0 0",
  lineHeight: 1.5,
};

export default function EnjoyPage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(170deg, ${TITA.cream} 0%, ${TITA.surface} 100%)`,
        fontFamily: KOREAN_FONT_STACK,
        color: TITA.ink,
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px 64px",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div
        style={{
          maxWidth: 520,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Hero */}
        <header style={{ textAlign: "center", padding: "8px 0 4px" }}>
          <p
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.02em",
              color: TITA.camel,
              margin: "0 0 12px",
            }}
          >
            506070, 이제 즐길 때
          </p>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.28,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
              color: TITA.ink,
            }}
          >
            근데,
            <br />
            <span style={{ color: TITA.forest }}>누구랑</span> 가죠?
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: TITA.muted,
              margin: 0,
            }}
          >
            시간도 생기고 여유도 생겼는데,
            <br />
            막상 달력을 펴면 여기서 멈춥니다.
          </p>
        </header>

        <StoreDownloadButton
          source="enjoy_hero"
          label="티타 앱 받기 (무료)"
          style={{ width: "100%", padding: "18px 22px", fontSize: 17 }}
        />

        {/* 데이터 */}
        <section style={card}>
          <h2 style={h2}>가장 외로운 순간은 아플 때가 아니었어요</h2>
          <p style={body}>
            티타에 답해 주신 300여 분께 언제 가장 혼자라고 느끼시는지
            여쭤봤습니다.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              margin: "18px 0 0",
            }}
          >
            {[
              { label: "여행 가고 싶을 때", pct: 28.0, on: true },
              { label: "얘기하고 싶을 때", pct: 24.4, on: true },
              { label: "아플 때", pct: 6.8, on: false },
            ].map((r) => (
              <div key={r.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 14.5,
                    fontWeight: 700,
                    marginBottom: 6,
                    color: r.on ? TITA.ink : TITA.muted,
                  }}
                >
                  <span>{r.label}</span>
                  <span>{r.pct}%</span>
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    background: TITA.surface,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(r.pct / 28) * 100}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: r.on ? TITA.forest : TITA.mutedSoft,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...body, marginTop: 18 }}>
            비어 있는 자리는 <b>도와줄 사람이 없는 자리</b>가 아니라,{" "}
            <b>좋은 걸 함께 나눌 사람이 없는 자리</b>였습니다. 즐길 준비는 이미
            되어 있는 겁니다.
          </p>
          <p style={srcLine}>
            출처 · 티타 니즈 설문 (2026-07~08, 300여 명). 광고 유입 자발적
            응답이라 전국 대표성은 없습니다.
          </p>
        </section>

        {/* 진짜 이유 */}
        <section style={card}>
          <h2 style={h2}>
            친구가 없는 게 아니에요.
            <br />
            <span style={{ color: TITA.forest }}>취향이 맞는</span> 친구가 없는
            거죠.
          </h2>
          <p style={body}>
            고향 친구, 전 직장 동료, 동네 이웃. 오래 알았고 편한 사이입니다.
            그런데 전시를 같이 보러 가자고, 통기타 공연을 같이 가자고는 말이 잘
            안 떨어집니다. <b>오래 알았다는 것과 결이 맞는다는 건 다른 문제</b>
            니까요.
          </p>
        </section>

        {/* 근접성 효과 */}
        <section style={card}>
          <h2 style={h2}>
            우리 친구는 대부분 <span style={{ color: TITA.forest }}>우연히</span>{" "}
            정해졌어요
          </h2>
          <p style={body}>
            1950년 심리학자 레온 페스팅거 연구팀이 MIT 기혼 학생 기숙단지에서
            누가 누구와 친해지는지 조사했습니다. 결과는 단순했습니다.{" "}
            <b>친구의 약 65%가 다섯 집 이내</b>에 사는 사람이었습니다.
          </p>
          <p style={{ ...body, marginTop: 14 }}>
            심리학은 이걸 <b>근접성 효과</b>라고 부릅니다. 같은 동네여서, 같은
            반이어서, 같은 부서여서 친해진 겁니다.{" "}
            <b>좋은 친구들이지만, 내가 고른 사람들은 아니었습니다.</b>
          </p>
          <p
            style={{
              margin: "18px 0 0",
              padding: "16px 18px",
              borderRadius: 14,
              background: TITA.surface,
              fontSize: 15.5,
              lineHeight: 1.65,
              fontWeight: 700,
              color: TITA.forestDeep,
            }}
          >
            그러니 취향 맞는 친구가 없는 건 까다로워서가 아닙니다. 애초에 고를
            기회가 없었을 뿐입니다.
          </p>
          <p style={srcLine}>
            출처 · Festinger, Schachter &amp; Back, 「Social Pressures in
            Informal Groups」 (1950)
          </p>
        </section>

        {/* 카스텐슨 */}
        <section style={card}>
          <h2 style={h2}>
            그리고 이제는, <span style={{ color: TITA.forest }}>고를 때</span>가
            됐어요
          </h2>
          <p style={body}>
            스탠퍼드대 로라 카스텐슨의 <b>사회정서적 선택이론</b>에 따르면,
            남은 시간이 유한하게 느껴질수록 사람은 관계에서 더 <b>선별적</b>이
            됩니다. 아는 사람 수는 줄지만 가까운 관계의 밀도는 오히려{" "}
            <b>높아집니다.</b>
          </p>
          <p style={{ ...body, marginTop: 14 }}>
            “아무나 말고, 나와 맞는 사람과 시간을 보내고 싶다”는 마음은
            까탈스러워진 게 아니라 <b>발달심리학이 예측하는 자연스러운 변화</b>
            입니다. 젊을 땐 넓히는 게 과제였다면, 지금은 <b>고르는 게 과제</b>
            입니다.
          </p>
          <p style={srcLine}>
            출처 · Laura L. Carstensen, Socioemotional Selectivity Theory
          </p>
        </section>

        {/* 카드 스트립 */}
        <section>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: TITA.muted,
              margin: "0 0 10px",
              paddingLeft: 2,
            }}
          >
            티타 인사이트 · 관계수업 #10
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              paddingBottom: 6,
              WebkitOverflowScrolling: "touch",
            }}
          >
            {CARDS.map((c) => (
              <Image
                key={c.src}
                src={c.src}
                alt={c.alt}
                width={216}
                height={270}
                style={{
                  borderRadius: 14,
                  border: `1px solid ${TITA.sage}`,
                  flex: "0 0 auto",
                  height: "auto",
                }}
              />
            ))}
          </div>
        </section>

        {/* 하고 싶던 것 */}
        <section style={card}>
          <h2 style={h2}>
            하고 싶던 걸,{" "}
            <span style={{ color: TITA.forest }}>결이 맞는 사람</span>과
          </h2>
          <p style={body}>
            관심사를 적어 두면 비슷한 시기를 지나는 또래와 가까운 동네에서
            이어집니다. 오래 알아서가 아니라 <b>취향이 맞아서</b> 만나는
            관계입니다.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 18,
            }}
          >
            {WANTS.map((w) => (
              <span
                key={w}
                style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: TITA.forestDeep,
                  background: TITA.surface,
                  border: `1px solid ${TITA.sage}`,
                  borderRadius: 999,
                  padding: "9px 15px",
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </section>

        {/* 안심 */}
        <section
          style={{
            background: TITA.forest,
            borderRadius: 20,
            padding: "26px 24px",
            color: TITA.cream,
          }}
        >
          <p style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px" }}>
            안심하고 시작하셔도 돼요
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SAFETY.map((s) => (
              <div key={s} style={{ display: "flex", gap: 10 }}>
                <span style={{ color: TITA.camel, fontSize: 15 }}>✓</span>
                <span style={{ fontSize: 15.5, lineHeight: 1.55, opacity: 0.95 }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", padding: "8px 0 0" }}>
          <p
            style={{
              fontSize: 19,
              fontWeight: 800,
              lineHeight: 1.5,
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            젊을 땐 우연이 친구를 정했습니다.
            <br />
            이제는 <span style={{ color: TITA.forest }}>당신이 정할 차례</span>
            입니다.
          </p>
          <StoreDownloadButton
            source="enjoy_bottom"
            label="티타 앱 받기 (무료)"
            style={{ width: "100%", padding: "18px 22px", fontSize: 17 }}
          />
        </section>

        {/* FAQ */}
        <section style={card}>
          <h2 style={h2}>자주 묻는 질문</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {FAQ.map((f) => (
              <div key={f.q}>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    margin: "0 0 6px",
                    color: TITA.forestDeep,
                  }}
                >
                  {f.q}
                </p>
                <p style={{ ...body, fontSize: 15.5 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p
          style={{
            textAlign: "center",
            marginTop: 4,
            fontSize: 13.5,
            lineHeight: 2,
            color: TITA.mutedSoft,
          }}
        >
          <Link href="/blog/who-to-enjoy-it-with/" style={{ color: TITA.muted }}>
            더 자세한 글 읽기
          </Link>
          {"  ·  "}
          <Link href="/gyeol/" style={{ color: TITA.muted }}>
            내 결 유형 알아보기
          </Link>
          {"  ·  "}
          <Link href="/" style={{ color: TITA.muted }}>
            티타 홈
          </Link>
        </p>
      </div>
    </main>
  );
}
