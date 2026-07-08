import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "../../_components/tita-brand";
import { TYPES, ALL_CODES, GyeolCode } from "../types";
import { ResultActions } from "../ResultActions";
import { TeaTree } from "../TeaTree";

// output: 'export' — 8개 유형을 빌드 타임에 정적 생성. 알 수 없는 코드는 404.
export function generateStaticParams() {
  return ALL_CODES.map((type) => ({ type }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ type: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { type } = await params;
  const t = TYPES[type as GyeolCode];
  if (!t) return { title: "결 유형 테스트 — 티타" };
  const title = `나의 결 유형: ${t.emoji} ${t.name} — 티타`;
  const description = `${t.tagline}. ${t.desc}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description: `${t.emoji} ${t.name} · ${t.tagline}`,
      siteName: "티타",
      locale: "ko_KR",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description: t.tagline },
  };
}

export default async function GyeolResultPage({ params }: Params) {
  const { type } = await params;
  const t = TYPES[type as GyeolCode];
  if (!t) notFound();
  const match = TYPES[t.match];

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(160deg, ${TITA.cream} 0%, ${TITA.surface} 100%)`,
        fontFamily: KOREAN_FONT_STACK,
        color: TITA.ink,
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px 56px",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%" }}>
        <p
          style={{
            textAlign: "center",
            color: TITA.forestMid,
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "-0.3px",
            margin: "0 0 20px",
          }}
        >
          나의 결 유형
        </p>

        {/* 유형 카드 */}
        <section
          style={{
            background: TITA.white,
            borderRadius: 24,
            padding: "40px 28px",
            textAlign: "center",
            boxShadow: "0 16px 40px rgba(20,51,41,0.12)",
            border: `1px solid ${TITA.sage}`,
          }}
        >
          <div style={{ fontSize: 72, lineHeight: 1, marginBottom: 12 }}>
            {t.emoji}
          </div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-1px",
              color: TITA.forestDeep,
              margin: "0 0 8px",
            }}
          >
            {t.name}
          </h1>
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: TITA.forestMid,
              margin: "0 0 24px",
            }}
          >
            {t.tagline}
          </p>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: TITA.ink,
              margin: "0 0 24px",
              textAlign: "left",
            }}
          >
            {t.desc}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {t.strengths.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: TITA.forestDeep,
                  background: TITA.surface,
                  padding: "8px 14px",
                  borderRadius: 999,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* 잘 맞는 결 */}
        <section
          style={{
            background: TITA.forest,
            borderRadius: 20,
            padding: "24px 24px",
            marginTop: 16,
            color: TITA.cream,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, opacity: 0.8, margin: "0 0 8px" }}>
            나와 결이 잘 맞는 유형
          </p>
          <p style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>
            {match.emoji} {match.name}
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.92, margin: 0 }}>
            {t.matchReason}
          </p>
        </section>

        {/* 티타 연결 + CTA — 다운로드 훅은 ResultActions가 comfort 답에 따라
            개인화해서 렌더한다(정적 페이지라 클라이언트에서 sessionStorage로 읽음). */}
        <section style={{ marginTop: 28, textAlign: "center" }}>
          <ResultActions code={t.code} name={t.name} matchName={match.name} />
        </section>

        {/* 차나무 티저 — 앱의 돌봄 서사를 결과 페이지에서 미리 보여준다.
            스크롤로 만나면 새싹→만개까지 자라는 애니메이션 (앱과 동일 드로잉). */}
        <section
          style={{
            marginTop: 24,
            background: TITA.white,
            borderRadius: 20,
            padding: "28px 24px 24px",
            textAlign: "center",
            border: `1px solid ${TITA.sage}`,
          }}
        >
          <TeaTree height={150} />
          <p
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: TITA.forestDeep,
              margin: "14px 0 8px",
              lineHeight: 1.4,
            }}
          >
            차나무를 키우며,
            <br />
            나의 결을 알아가 봐요
          </p>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: TITA.muted,
              margin: 0,
            }}
          >
            티타에선 하루 한 질문에 답할 때마다 나무가 자라요.
            <br />
            결이 또렷해지면 — <b style={{ color: TITA.ink }}>나와 맞는 결의 친구가 찾아와요.</b>
          </p>
        </section>

        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: 13,
            color: TITA.mutedSoft,
          }}
        >
          <Link href="/gyeol" style={{ color: TITA.muted }}>
            결 유형 테스트
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
