import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "../../_components/tita-brand";
import { TYPES, ALL_CODES, GyeolCode } from "../types";
import { ResultActions } from "../ResultActions";

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

        {/* 티타 연결 + CTA — 핵심 메시지: 답할수록 천천히 더 정확히 찾아준다 */}
        <section style={{ marginTop: 28, textAlign: "center" }}>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: TITA.forestMid,
              margin: "0 0 8px",
            }}
          >
            이 테스트는 12개였지만, 이건 맛보기예요.
          </p>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.75,
              color: TITA.ink,
              margin: "0 0 20px",
            }}
          >
            <b style={{ color: TITA.forestDeep }}>티타</b>에선 매일{" "}
            <b>하루 한 질문(결큐)</b>에 답할수록 당신의 결이 더 또렷해져요.
            <br />
            그렇게 쌓인 결로, 본인인증 된 우리 동네에서{" "}
            <b style={{ color: TITA.forestDeep }}>진짜 나와 결이 맞는 사람</b>을
            천천히 찾아드려요. 🍵
          </p>
          <ResultActions code={t.code} name={t.name} />
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
