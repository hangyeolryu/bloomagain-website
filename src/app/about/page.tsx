"use client";

// 티타 알아보기 — public-facing "about us" page.
// Linked from the in-app onboarding modal, app settings menu, and home
// app bar (all open in WebView so updates land instantly without a
// release). 2026-06: rewritten to match the new minimal onboarding tone
// + Monotone Forest palette. Sections were merged and trimmed hard —
// the page used to take 8 dense sections; it's now 5 short ones.

import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Brain,
  MessageCircle,
  Download,
} from "lucide-react";

// Monotone Forest palette — matches the Flutter app (lib/core/theme/
// app_theme.dart). Keep these tokens in sync with the app side; visual
// continuity between the WebView and the app surfaces is the whole
// point of hosting this page externally.
const BRAND = {
  forest: "#1F4E3D",     // primary
  forestDeep: "#143329", // pressed / emphasis
  ink: "#1A2E26",        // body text (deep forest black)
  muted: "#6B7D6E",      // secondary text (muted sage)
  sage: "#D6E2D8",       // soft sage border / surface
  cream: "#FBF7F0",      // page background
  surface: "#F2EDE3",    // warm secondary surface
  camel: "#D4B895",      // warm accent (quiet luxury)
} as const;

// Inline Korean font stack — Geist (body default) ships Latin only, so
// without this fallback Korean characters render as ☐ inside the
// WebView when the global stylesheet hasn't loaded yet.
const KOREAN_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans CJK KR", "Noto Sans KR", "Malgun Gothic", Pretendard, sans-serif';

export default function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: KOREAN_FONT_STACK,
        backgroundColor: BRAND.cream,
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "rgba(251, 247, 240, 0.92)",
          backdropFilter: "blur(8px)",
          borderColor: BRAND.sage,
        }}
      >
        <nav className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-baseline gap-2">
              <span
                className="text-xl font-bold tracking-tight"
                style={{ color: BRAND.ink }}
              >
                티타
              </span>
              <span className="text-xs" style={{ color: BRAND.muted }}>
                Tita
              </span>
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: BRAND.forest, color: "white" }}
            >
              앱 받기 <Download className="w-3 h-3" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        {/* ── 1. Hero ───────────────────────────────────────────────── */}
        <section className="mb-14">
          <div className="flex items-center gap-2 mb-4">
            <Heart
              className="w-4 h-4"
              style={{ color: BRAND.camel }}
              strokeWidth={2.5}
              fill={BRAND.camel}
            />
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: BRAND.forest }}
            >
              티타 알아보기
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4"
            style={{ color: BRAND.ink, letterSpacing: "-0.02em" }}
          >
            결이 맞는 40+ 친구를
            <br />
            천천히 만나요.
          </h1>
          <p
            className="text-sm sm:text-base leading-relaxed"
            style={{ color: BRAND.muted }}
          >
            인생 후반의 새로운 시작 — 안심하고 만날 수 있는 동네 친구를
            찾아드립니다.
          </p>
        </section>

        {/* ── 2. 무엇을 만들었나 (mission + product combined) ───────── */}
        <Section tag="우리가 만든 것" title="40+ 결동무 커뮤니티">
          <ul className="space-y-2.5">
            <Bullet>
              <strong>결동무 우선, 데이팅 아님.</strong> 같은 동네·관심사로
              만나는 친구 중심
            </Bullet>
            <Bullet>
              <strong>40+ 회원만.</strong> NICE 본인인증을 통과해야 함께해요
            </Bullet>
            <Bullet>
              <strong>AI가 위험을 차단.</strong> 로맨스 스캠·보이스 피싱 패턴
              실시간 감지
            </Bullet>
          </ul>
        </Section>

        {/* ── 3. 안전 — 4단계 시스템 + 특허 (compact) ───────────────── */}
        <Section
          icon={ShieldCheck}
          tag="안전 시스템"
          title="4단계로 지켜드려요"
        >
          <ul className="space-y-2">
            <NumBullet n="1">
              <strong>NICE 본인인증</strong> — 신원 확인, 차단된 사람은 영구
              차단
            </NumBullet>
            <NumBullet n="2">
              <strong>AI 위험 점수</strong> — 메시지 맥락 분석, 사기 패턴 자동
              감지
            </NumBullet>
            <NumBullet n="3">
              <strong>적응형 UI</strong> — 시력·손떨림에 따라 글자·버튼 자동
              조정
            </NumBullet>
            <NumBullet n="4">
              <strong>멤버 상호 보호</strong> — 의심스러운 행동을 다른 멤버가
              차단
            </NumBullet>
          </ul>
          <div
            className="rounded-xl p-3 mt-4 flex items-start gap-2.5"
            style={{
              backgroundColor: BRAND.surface,
              border: `1px solid ${BRAND.sage}`,
            }}
          >
            <span
              className="text-[10px] font-extrabold px-1.5 py-0.5 rounded mt-0.5"
              style={{
                backgroundColor: BRAND.forest,
                color: "white",
                letterSpacing: "0.05em",
              }}
            >
              특허
            </span>
            <p className="text-xs leading-relaxed" style={{ color: BRAND.muted }}>
              4단계 안전 시스템 통합 특허 출원 (PA260003, 우선심사 진행 중).
              추가 4건 준비 중.
            </p>
          </div>
        </Section>

        {/* ── 4. 매칭 (compact) ────────────────────────────────────── */}
        <Section icon={Brain} tag="추천 알고리즘" title="진짜 잘 맞는 분만">
          <ul className="space-y-2">
            <Bullet>
              <strong>관심사 일치</strong> — 등산·텃밭·글쓰기 같은 결이 통하는
              분
            </Bullet>
            <Bullet>
              <strong>같은 세대</strong> — ±10세 안쪽 빈 둥지 또래 우선
            </Bullet>
            <Bullet>
              <strong>동네 우선</strong> — 실제로 만날 수 있는 거리부터
            </Bullet>
            <Bullet>
              <strong>한 줄 소개</strong> — AI가 두 분이 어떻게 통하실지 짚어
              드려요
            </Bullet>
          </ul>
        </Section>

        {/* ── 5. 창업자 메시지 ────────────────────────────────────── */}
        <section
          className="rounded-2xl p-6 sm:p-8 mb-12"
          style={{
            background: `linear-gradient(135deg, ${BRAND.forest} 0%, ${BRAND.forestDeep} 100%)`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle
              className="w-4 h-4"
              style={{ color: BRAND.camel }}
            />
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: BRAND.camel }}
            >
              창업자의 인사
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
            창립 멤버 500분께
          </h2>
          <div className="text-white/90 leading-relaxed space-y-3 text-sm sm:text-base">
            <p>
              첫 500회원분들께{" "}
              <strong className="text-white">
                프리미엄 6개월 무료
              </strong>
              로 함께해요.
            </p>
            <p>
              불편한 점 무엇이든 말씀해 주세요. 직접 듣고 고치겠습니다.
            </p>
            <p className="pt-1 text-white/70 text-xs sm:text-sm">
              — 류한결, 티타 창업자 / ㈜이프이프 대표
            </p>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <section className="text-center pb-6">
          <p
            className="text-sm mb-5"
            style={{ color: BRAND.muted }}
          >
            창립 멤버 500명 한정 · 6개월 무료
          </p>
          <Link
            href="/download"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: BRAND.forest, color: "white" }}
          >
            <Download className="w-4 h-4" />앱 다운로드
          </Link>
        </section>

        {/* ── Footer mini ──────────────────────────────────────────── */}
        <footer
          className="pt-10 mt-10 border-t text-center text-[11px]"
          style={{ color: BRAND.muted, borderColor: BRAND.sage }}
        >
          <p>㈜이프이프 (EFFEFF Co., Ltd.) · 사업자등록 466-81-04205</p>
          <p className="mt-1.5">
            <Link
              href="/privacy"
              className="hover:underline"
              style={{ color: BRAND.forest }}
            >
              개인정보 처리방침
            </Link>
            {" · "}
            <Link
              href="/terms"
              className="hover:underline"
              style={{ color: BRAND.forest }}
            >
              이용약관
            </Link>
            {" · "}
            <a
              href="mailto:ceo@effeffcorp.com"
              className="hover:underline"
              style={{ color: BRAND.forest }}
            >
              연락처
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

// ─── Reusable section + bullet helpers ──────────────────────────────

function Section({
  icon: Icon,
  tag,
  title,
  children,
}: {
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-2.5">
        {Icon && <Icon className="w-4 h-4" style={{ color: BRAND.forest }} />}
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: BRAND.forest }}
        >
          {tag}
        </span>
      </div>
      <h2
        className="text-lg sm:text-xl font-bold mb-4 leading-snug"
        style={{ color: BRAND.ink, letterSpacing: "-0.01em" }}
      >
        {title}
      </h2>
      <div
        className="text-sm leading-relaxed"
        style={{ color: BRAND.muted }}
      >
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span
        className="inline-block w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
        style={{ backgroundColor: BRAND.forest }}
      />
      <span style={{ color: BRAND.muted }}>{children}</span>
    </li>
  );
}

function NumBullet({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="inline-flex w-5 h-5 items-center justify-center rounded-full text-[10px] font-bold flex-shrink-0 mt-0.5"
        style={{ backgroundColor: BRAND.forest, color: "white" }}
      >
        {n}
      </span>
      <span style={{ color: BRAND.muted }}>{children}</span>
    </li>
  );
}
