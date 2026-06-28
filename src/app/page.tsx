"use client";

// 티타 홈페이지 — 2026-06 rebrand 후 미니멀 재작성.
//
// 디자인 원칙
// - 한 화면에 한 메시지. 스크롤마다 의미 있는 한 가지.
// - 모든 문장은 시니어 톤 (짧고 구체적).
// - 팔레트는 Monotone Forest (앱과 동일).
// - 헤더/푸터는 _components/Tita* 공유.

import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Brain,
  Users,
  Download,
  Apple,
  Smartphone,
  Sparkles,
} from "lucide-react";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "./_components/tita-brand";
import { TitaHeader } from "./_components/TitaHeader";
import { TitaFooter } from "./_components/TitaFooter";
import { logAnalyticsEvent } from "@/lib/firebase";

export default function Home() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: TITA.cream,
        fontFamily: KOREAN_FONT_STACK,
      }}
    >
      <TitaHeader />

      <main className="max-w-2xl mx-auto px-5 sm:px-6">
        {/* ── 1. Hero ───────────────────────────────────────────── */}
        <section className="pt-16 sm:pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-5">
            <Heart
              className="w-4 h-4"
              style={{ color: TITA.camel }}
              strokeWidth={2.5}
              fill={TITA.camel}
            />
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: TITA.forest }}
            >
              오후 한 잔의 안심 티타임
            </span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5"
            style={{ color: TITA.ink, letterSpacing: "-0.025em" }}
          >
            결이 맞는 친구를
            <br />
            천천히 만나요.
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed mb-8"
            style={{ color: TITA.muted }}
          >
            툭 던져도 착 받아주는 우리의 티키타카.
            <br className="hidden sm:block" />
            본인인증·AI 안전망으로 보호받는 친구 매칭.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                logAnalyticsEvent("app_download_click", {
                  store: "ios",
                  source: "home_hero",
                })
              }
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105 w-full sm:w-auto"
              style={{ backgroundColor: TITA.forest, color: "white" }}
            >
              <Apple className="w-4 h-4" />
              App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                logAnalyticsEvent("app_download_click", {
                  store: "android",
                  source: "home_hero",
                })
              }
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border-2 transition-colors w-full sm:w-auto"
              style={{
                borderColor: TITA.forest,
                color: TITA.forest,
                backgroundColor: TITA.white,
              }}
            >
              <Smartphone className="w-4 h-4" />
              Google Play
            </a>
          </div>
        </section>

        {/* ── 2. 어떻게 작동하나 (3단계) ─────────────────────── */}
        <Section tag="시작하기" title="3분이면 준비 완료">
          <ol className="space-y-3 mt-2">
            <Step n="1" title="본인인증">
              NICE 인증으로 신원 확인. 30초.
            </Step>
            <Step n="2" title="관심사 선택">
              산책·책·등산·요리 등 결이 통하는 키워드.
            </Step>
            <Step n="3" title="결친구 추천">
              AI가 결이 맞는 분을 매일 찾아드려요.
            </Step>
          </ol>
        </Section>

        {/* ── 3. 안심 ──────────────────────────────────────── */}
        <Section
          icon={ShieldCheck}
          tag="안전 시스템"
          title="4단계로 지켜드려요"
        >
          <ul className="space-y-2.5">
            <Bullet>
              <strong>NICE 본인인증</strong> · 신원 확인된 회원만 가입
            </Bullet>
            <Bullet>
              <strong>AI 위험 감지</strong> · 사기 메시지 패턴 24시간
              모니터링
            </Bullet>
            <Bullet>
              <strong>적응형 화면</strong> · 시력·손떨림에 맞춰 자동 조정
            </Bullet>
            <Bullet>
              <strong>신고·차단 즉시</strong> · 24시간 내 검토
            </Bullet>
          </ul>
          <div
            className="rounded-xl p-3 mt-4 flex items-start gap-2.5"
            style={{
              backgroundColor: TITA.surface,
              border: `1px solid ${TITA.sage}`,
            }}
          >
            <span
              className="text-[10px] font-extrabold px-1.5 py-0.5 rounded mt-0.5"
              style={{
                backgroundColor: TITA.forest,
                color: "white",
                letterSpacing: "0.05em",
              }}
            >
              특허
            </span>
            <p
              className="text-xs leading-relaxed"
              style={{ color: TITA.muted }}
            >
              4단계 안전 시스템 통합 특허 출원 진행 중 (PA260003, 우선심사).
            </p>
          </div>
        </Section>

        {/* ── 4. AI 매칭 ──────────────────────────────────── */}
        <Section icon={Brain} tag="AI 매칭" title="진짜 잘 맞는 분만">
          <ul className="space-y-2.5">
            <Bullet>
              <strong>관심사 일치</strong> · 등산·책·여행 같은 결이 통하는 분
            </Bullet>
            <Bullet>
              <strong>같은 세대</strong> · ±10세 안쪽 빈 둥지 또래 우선
            </Bullet>
            <Bullet>
              <strong>동네 우선</strong> · 실제로 만날 수 있는 거리부터
            </Bullet>
            <Bullet>
              <strong>한 줄 소개</strong> · AI가 두 분이 어떻게 통하실지 짚어
              드려요
            </Bullet>
          </ul>
        </Section>

        {/* ── 5. 가격 ──────────────────────────────────────── */}
        <Section icon={Sparkles} tag="가격" title="기본 기능 모두 무료">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <PlanCard
              name="무료"
              price="₩0"
              perks={["친구 매칭", "동네 글", "그룹 채팅"]}
              highlight={false}
            />
            <PlanCard
              name="플러스"
              price="₩19,900/월"
              perks={["AI 맞춤 매칭", "특허 출원 4계층 안전", "적응형 화면"]}
              highlight
            />
          </div>
          <p
            className="text-xs mt-4 text-center"
            style={{ color: TITA.muted }}
          >
            창립 멤버 500분께 <strong>플러스 6개월 무료</strong>
          </p>
        </Section>

        {/* ── 6. CTA ──────────────────────────────────────── */}
        <section className="text-center py-16 mb-4">
          <h3
            className="text-xl sm:text-2xl font-extrabold mb-3"
            style={{ color: TITA.ink, letterSpacing: "-0.02em" }}
          >
            두 번째 인생의 티타임,
            <br />
            지금 시작하세요
          </h3>
          <p className="text-sm mb-6" style={{ color: TITA.muted }}>
            창립 멤버 한정 · 플러스 6개월 무료
          </p>
          <Link
            href="/download"
            onClick={() =>
              logAnalyticsEvent("download_cta_click", {
                source: "home_footer",
              })
            }
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold transition-transform hover:scale-105"
            style={{ backgroundColor: TITA.forest, color: "white" }}
          >
            <Download className="w-4 h-4" />앱 다운로드
          </Link>
          <div className="mt-6 flex justify-center gap-4 text-xs flex-wrap">
            <Link
              href="/about"
              className="hover:underline"
              style={{ color: TITA.forest }}
            >
              티타 알아보기
            </Link>
            <Link
              href="/business"
              className="hover:underline"
              style={{ color: TITA.forest }}
            >
              기관 협력
            </Link>
            <Link
              href="/for-children"
              className="hover:underline"
              style={{ color: TITA.forest }}
            >
              부모님께 권하기
            </Link>
          </div>
        </section>

        <TitaFooter />
      </main>
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────

function Section({
  icon: Icon,
  tag,
  title,
  children,
}: {
  icon?: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-12 border-t" style={{ borderColor: TITA.sage }}>
      <div className="flex items-center gap-2 mb-2.5">
        {Icon && <Icon className="w-4 h-4" style={{ color: TITA.forest }} />}
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ color: TITA.forest }}
        >
          {tag}
        </span>
      </div>
      <h2
        className="text-xl sm:text-2xl font-bold mb-4 leading-snug"
        style={{ color: TITA.ink, letterSpacing: "-0.015em" }}
      >
        {title}
      </h2>
      <div className="text-sm leading-relaxed" style={{ color: TITA.muted }}>
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
        style={{ backgroundColor: TITA.forest }}
      />
      <span style={{ color: TITA.muted }}>{children}</span>
    </li>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="inline-flex w-7 h-7 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 mt-0.5"
        style={{ backgroundColor: TITA.forest, color: "white" }}
      >
        {n}
      </span>
      <div className="flex-1">
        <p className="font-semibold mb-0.5" style={{ color: TITA.ink }}>
          {title}
        </p>
        <p className="text-sm" style={{ color: TITA.muted }}>
          {children}
        </p>
      </div>
    </li>
  );
}

function PlanCard({
  name,
  price,
  perks,
  highlight,
}: {
  name: string;
  price: string;
  perks: string[];
  highlight: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        backgroundColor: highlight ? TITA.surface : TITA.white,
        borderColor: highlight ? TITA.forest : TITA.sage,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Users
          className="w-4 h-4"
          style={{ color: highlight ? TITA.forest : TITA.muted }}
        />
        <span
          className="text-sm font-bold"
          style={{ color: highlight ? TITA.forest : TITA.ink }}
        >
          {name}
        </span>
      </div>
      <p
        className="text-2xl font-extrabold mb-3"
        style={{ color: TITA.ink, letterSpacing: "-0.02em" }}
      >
        {price}
      </p>
      <ul className="space-y-1.5 text-xs" style={{ color: TITA.muted }}>
        {perks.map((p) => (
          <li key={p}>· {p}</li>
        ))}
      </ul>
    </div>
  );
}
