import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "../../_components/tita-brand";
import { TYPES, TEMPERAMENTS, ALL_ROUTE_CODES, parseCode } from "../types";
import { ResultActions } from "../ResultActions";
import { ValueResultCard } from "./ValueResultCard";
import { ValueModifier } from "./ValueModifier";
import { TopDownloadCTA } from "./TopDownloadCTA";
import { TeaTree } from "../TeaTree";

// 우리만의 찻잔 마크(밝은 배경용: 초록 잔 + 테라코타 찻물). 앱 스플래시
// tea_cup_icon.dart와 동일 도형. 결과 페이지 상단 브랜드 헤더로.
function TeaCupResult({ size = 52 }: { size?: number }) {
  const GREEN = "#1F4E3D";
  const body = "M18 40 L66 40 L60 66 Q42 82 24 66 Z";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      style={{ display: "inline-block" }}
    >
      <g stroke={GREEN} strokeWidth={4.5} strokeLinecap="round" opacity={0.4}>
        <path d="M34 36 C37 31 31 26 34 21" />
        <path d="M42 34 C45 29 39 24 42 18" />
        <path d="M50 36 C53 31 47 26 50 21" />
      </g>
      <path d={body} fill={GREEN} />
      <path d="M21.5 42 L62.5 42 L57.5 63 Q42 77 26.5 63 Z" fill="#D9694C" />
      <ellipse cx="42" cy="40" rx="24" ry="7" fill="#E8896F" />
      <path d={body} stroke={GREEN} strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx="42" cy="40" rx="24" ry="7" stroke={GREEN} strokeWidth={6} />
      <path
        d="M66 46 C86 45 87 66 59.5 63"
        stroke={GREEN}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </svg>
  );
}

// output: 'export' — 유형×온도 16개 + 레거시 8개를 빌드 타임에 정적 생성.
export function generateStaticParams() {
  return ALL_ROUTE_CODES.map((type) => ({ type }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ type: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { type } = await params;
  const { base, temp } = parseCode(type);
  if (!base) return { title: "결 유형 테스트 — 티타" };
  const t = TYPES[base];
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
  const { base, temp } = parseCode(type);
  if (!base) notFound();
  const t = TYPES[base];
  const temperament = temp ? TEMPERAMENTS[temp] : null;
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
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <TeaCupResult size={50} />
        </div>
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
          <div
            style={{
              width: 104,
              height: 104,
              borderRadius: 999,
              background: TITA.surface,
              border: `1px solid ${TITA.sage}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
              lineHeight: 1,
              margin: "0 auto 18px",
            }}
          >
            {t.emoji}
          </div>
          {/* 가치 수식어 — 유형 이름 위에 붙어 32조합으로 세분화(클라이언트) */}
          <ValueModifier />
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
              margin: temperament ? "0 0 14px" : "0 0 24px",
            }}
          >
            {t.tagline}
          </p>
          {temperament && (
            <div style={{ margin: "0 0 24px", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ color: TITA.forestMid, fontSize: 15 }}>·</span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: TITA.forestDeep,
                    letterSpacing: "-0.4px",
                  }}
                >
                  {temperament.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: TITA.muted,
                  margin: "5px 0 0",
                  lineHeight: 1.6,
                  paddingLeft: 17,
                }}
              >
                {temperament.blurb}
              </p>
            </div>
          )}
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
                  background: TITA.white,
                  border: `1px solid ${TITA.sage}`,
                  padding: "8px 14px",
                  borderRadius: 999,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* 리빌 직후 peak CTA — 테스트 마친 사람에게만(TopDownloadCTA 내부 분기).
            자기 결 확인하고 만족한 그 순간에 다운로드를 잡는다. */}
        <TopDownloadCTA code={type} matchName={match.name} />

        {/* 가치 결 — 8유형(어울림 방식) 위에 얹는 두 번째 층. 클라이언트에서
            ?v= 또는 sessionStorage로 읽어 렌더(없으면 안 그림). */}
        <ValueResultCard />

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

        {/* 유형에 붙은 '그리움' 한 줄 — pain을 공포가 아니라 아름다운 특성의
            갈망으로. hope 전환("결이 맞는 사람부터")은 ResultActions가 이어받음. */}
        <section
          style={{
            marginTop: 20,
            background: TITA.white,
            borderRadius: 16,
            padding: "20px 22px",
            border: `1px solid ${TITA.sage}`,
          }}
        >
          <p style={{ fontSize: 16, lineHeight: 1.7, color: TITA.ink, margin: 0 }}>
            {t.longing}
          </p>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: TITA.forestDeep,
              margin: "12px 0 0",
            }}
          >
            그래서 티타는, 아무나가 아니라 &lsquo;결이 맞는 사람&rsquo;부터 만나요.
          </p>
        </section>

        {/* 티타 연결 + CTA — 다운로드 훅은 ResultActions가 comfort 답에 따라
            개인화해서 렌더한다(정적 페이지라 클라이언트에서 sessionStorage로 읽음). */}
        <section style={{ marginTop: 20, textAlign: "center" }}>
          {/* code는 라우트 코드(4글자) — 공유 링크가 온도까지 실어 카드가 갈리게 */}
          <ResultActions code={type} name={t.name} matchName={match.name} />
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
