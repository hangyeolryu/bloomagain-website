/**
 * For Children — landing page targeted at adult children of seniors (40s/50s).
 *
 * Reached from:
 *   - QR on the senior printed brochure ("자녀와 함께 보세요" line)
 *   - Direct share via KakaoTalk by 부모/자녀
 *   - SEO: "부모님 디지털 친구 안전" / "티타 자녀"
 *
 * Goals (in order of importance):
 *   1. Reassure that 티타 is NOT a dating app.
 *   2. Make the safety stack legible to a non-technical 40대.
 *   3. Set up the "자녀가 부모님께 권하는" buying motion.
 *   4. Surface the Family Care feature as the differentiator parent apps don't have.
 *   5. Provide a one-tap path to install on parent's phone (QR).
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Heart,
  Lock,
  UserCheck,
  Bell,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Smartphone,
  Award,
  Mail,
} from "lucide-react";

// Brand tokens — keep in sync with /src/app/page.tsx and /invite/[code]/page.tsx
const BRAND = {
  navy:      "#1F4E3D",
  navyDeep:  "#143329",
  navySoft:  "#2D54A1",
  lavender:  "#EBEBEB",
  ink:       "#1A2E26",
  muted:     "#6B7D6E",
  success:   "#15803D",
  danger:    "#B91C1C",
} as const;

export default function ForChildrenPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: BRAND.lavender, color: BRAND.ink }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="border-b sticky top-0 z-10"
        style={{ background: "white", borderColor: "rgba(15,26,53,0.08)" }}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/app_icon.svg"
              alt="티타 로고"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-xl font-bold" style={{ color: BRAND.navy }}>
              티타
            </span>
          </Link>
          <span
            className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase"
            style={{ color: BRAND.muted }}
          >
            부모님께 권하는 분께
          </span>
        </nav>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center space-y-5">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mx-auto"
            style={{ background: BRAND.navy }}
          >
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold leading-tight"
            style={{ color: BRAND.ink }}
          >
            부모님께 안심하고
            <br />
            권할 수 있는 친구 앱
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: BRAND.muted }}
          >
            만남앱이 아닙니다. 신원 확인된 회원만 가입하는 친구 앱.
            <br className="hidden sm:inline" />
            보이스피싱·로맨스 스캠을 AI가 24시간 차단합니다.
          </p>
        </div>

        {/* Hero CTA — install on parent's phone */}
        <div
          className="mt-10 rounded-2xl bg-white p-5 sm:p-6 shadow-sm border"
          style={{ borderColor: "rgba(15,26,53,0.08)" }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div
              className="flex-shrink-0 w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{ background: `${BRAND.navy}10` }}
            >
              <Smartphone className="h-12 w-12" style={{ color: BRAND.navy }} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm font-bold mb-1" style={{ color: BRAND.muted }}>
                부모님 휴대폰으로 보내드리세요
              </p>
              <p className="text-base sm:text-lg font-bold" style={{ color: BRAND.ink }}>
                {"\"엄마, 이거 한 번 봐봐. 안전하대.\""}
              </p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: BRAND.muted }}>
                카카오톡으로 공유 → 부모님이 직접 다운로드
              </p>
            </div>
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white whitespace-nowrap"
              style={{ background: BRAND.navy }}
            >
              앱 보내기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 1: 데이팅 중심이 아닙니다 ──────────────────────────── */}
      <section
        className="py-14 sm:py-20"
        style={{ background: "white" }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle
              className="h-8 w-8 flex-shrink-0"
              style={{ color: BRAND.danger }}
            />
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: BRAND.ink }}
            >
              데이팅 중심이 아닙니다
            </h2>
          </div>
          <p className="text-base leading-relaxed" style={{ color: BRAND.muted }}>
            많은 분들이 가장 먼저 묻는 질문입니다. 티타은
            <strong style={{ color: BRAND.ink }}> 친구·모임 중심으로 설계된 앱</strong>입니다.
            가입하시면 기본 설정이 <strong style={{ color: BRAND.ink }}>{"'친구만 원해요'"}</strong>로 시작되며,
            원하시는 분만 설정에서 직접 인연 옵션을 열 수 있습니다.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <DesignChoice
              ok={false}
              title="다른 SNS"
              items={["좋아요·매칭 푸시", "1:1 데이트 추천", "외모 평가", "성별 필터"]}
            />
            <DesignChoice
              ok={true}
              title="티타"
              items={[
                "관심사 모임 (산책·책·텃밭)",
                "동네 친구 찾기",
                "그룹 채팅",
                "기본은 '친구만', 인연은 본인 선택",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Section 2: 안전 인프라 ──────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl mx-auto"
              style={{ background: `${BRAND.navy}12` }}
            >
              <ShieldCheck className="h-7 w-7" style={{ color: BRAND.navy }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: BRAND.ink }}
            >
              4계층 안전 인프라
            </h2>
            <p className="text-sm sm:text-base" style={{ color: BRAND.muted }}>
              3년간 자체 개발, 14개 청구항 특허 출원 완료
            </p>
          </div>

          <ul className="space-y-4">
            <SafetyLayer
              icon={UserCheck}
              title="① 본인인증"
              body="NICE 본인확인 서비스로 신원을 검증합니다. 중복 가입 차단, 부정 사용자 재가입 원천 봉쇄."
            />
            <SafetyLayer
              icon={Sparkles}
              title="② AI 위험 평가"
              body="대화 맥락(LLM) + 키워드 패턴 + 행동 분산 + 인지 지문 — 4가지 지표를 종합해 위험 점수를 24시간 계산합니다. 보이스피싱·로맨스 스캠·투자 사기를 사전 탐지."
            />
            <SafetyLayer
              icon={Smartphone}
              title="③ 적응형 화면"
              body="부모님의 시각·운동 능력에 맞춰 글자 크기, 버튼 간격, 반응 시간이 자동 조정됩니다. 같은 데이터로 본인 여부도 함께 확인 — 도용 시도 자동 차단."
            />
            <SafetyLayer
              icon={Lock}
              title="④ 단계적 대응"
              body="위험 점수가 올라가면 경고 → 메시지 발송 차단 → 계정 잠금 순으로 단계적 조치. 자녀에게 자동 알림이 갑니다."
            />
          </ul>

          <div
            className="rounded-2xl p-5 mt-6 border"
            style={{
              background: `${BRAND.navy}06`,
              borderColor: `${BRAND.navy}20`,
            }}
          >
            <div className="flex items-start gap-3">
              <Award
                className="h-5 w-5 flex-shrink-0 mt-0.5"
                style={{ color: BRAND.navy }}
              />
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: BRAND.ink }}>
                  특허 출원 PA260003
                </p>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: BRAND.muted }}>
                  보안·접근성 통합 시스템 (청구항 1~10), 하이브리드 매칭
                  알고리즘 (청구항 11~14). 변리사 검토를 거친 정식 출원입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Family Care ──────────────────────────────────────── */}
      <section
        className="py-14 sm:py-20"
        style={{ background: "white" }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-3">
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl mx-auto"
              style={{ background: `${BRAND.success}15` }}
            >
              <Heart className="h-7 w-7" style={{ color: BRAND.success }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: BRAND.ink }}
            >
              자녀와 함께 안심하세요
            </h2>
            <p className="text-sm sm:text-base" style={{ color: BRAND.muted }}>
              가족 공유 (Family Care) — 티타 플러스 회원 기능
            </p>
          </div>

          <div className="space-y-3">
            <FamilyBenefit
              icon={Bell}
              title="위험 신호 즉시 알림"
              body="부모님께 사기·스캠 의심 메시지가 감지되면 자녀에게 즉시 알림이 갑니다. 한 번 안부 전화 드리시면 됩니다."
            />
            <FamilyBenefit
              icon={MessageCircle}
              title="주간 활동 요약"
              body="부모님이 어떤 모임에서 활동하시는지 일주일에 한 번 요약을 받아봅니다."
            />
            <FamilyBenefit
              icon={Lock}
              title="프라이버시 보호"
              body="부모님의 채팅 내용·위험 점수·구체 사유는 자녀에게 절대 노출되지 않습니다. '안부 전화 한번 어떠세요' 정도의 안내만 갑니다."
            />
          </div>

          <div
            className="rounded-2xl p-5 sm:p-6 text-center"
            style={{ background: BRAND.lavender }}
          >
            <p className="text-sm sm:text-base font-bold mb-3" style={{ color: BRAND.ink }}>
              부모님께 가족 연결을 받으셨나요?
            </p>
            <p className="text-xs sm:text-sm mb-4" style={{ color: BRAND.muted }}>
              부모님이 티타 앱에서 초대 코드를 만드시면 자녀분께 보내드립니다.
              초대 코드 8자리를 받으셨다면 아래 버튼으로 들어와 주세요.
            </p>
            <Link
              href="/invite/0"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white"
              style={{ background: BRAND.navy }}
            >
              초대 코드 입력하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: 자주 묻는 질문 ───────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
          <h2
            className="text-2xl sm:text-3xl font-bold text-center"
            style={{ color: BRAND.ink }}
          >
            자녀분이 자주 묻는 질문
          </h2>

          <div className="space-y-3">
            <FAQ
              q="비용이 드나요?"
              a="가입·모임 가입·친구 매칭은 모두 무료입니다. 광고도 없습니다. 모임 만들기, 무제한 채팅, 음성 메시지, 가족 공유는 티타 플러스(월 19,900원, 30일 무료 체험) 회원 기능입니다."
            />
            <FAQ
              q="부모님이 디지털을 어려워하시는데..."
              a="부모님의 시각·운동 능력에 맞춰 화면이 자동 조정됩니다. 글자 크기, 버튼 간격이 사용자에 맞게 변합니다. 음성으로도 인사를 보내실 수 있어요."
            />
            <FAQ
              q="자녀도 가입해야 하나요?"
              a="아니요. 자녀는 가입하지 않습니다. 부모님이 가족 연결 초대 코드를 만들어 보내시면, 자녀분은 본인인증 한 번으로 위험 알림과 주간 요약만 받아보실 수 있습니다."
            />
            <FAQ
              q="자녀가 부모님 채팅을 볼 수 있나요?"
              a="아니요. 부모님 프라이버시는 보호됩니다. 자녀에게는 '안부 전화 어떠세요' 같은 일반적 알림만 갑니다. 메시지 내용·위험 점수·구체적 사유는 노출되지 않습니다."
            />
            <FAQ
              q="누가 만들었나요?"
              a={
                <>
                  주식회사 이프이프 (EFFEFF Co., Ltd.) · 사업자번호 466-81-04205. 대표 유한결이 3년간 직접 개발했습니다.
                  관련 기술은 14개 청구항 특허 출원 완료 (PA260003).
                  더 자세한 정보는 <Link href="/" className="underline" style={{ color: BRAND.navy }}>홈페이지</Link>에서 확인하실 수 있습니다.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: BRAND.navy }}
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center text-white space-y-5">
          <CheckCircle2 className="h-10 w-10 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            한 마디가 가장 큰 응원입니다
          </h2>
          <p className="text-base sm:text-lg opacity-90 leading-relaxed">
            {"\"엄마, 한번 봐봤는데 안전하더라."}
            <br />
            {"해보고 싶으면 해.\""}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold bg-white"
              style={{ color: BRAND.navy }}
            >
              부모님 폰에 설치하기
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="mailto:ceo@effeffcorp.com?subject=티타 자녀 문의"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-7 py-3 text-base font-bold text-white"
            >
              <Mail className="h-5 w-5" />
              궁금한 점 문의
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer
        className="border-t py-8 text-center text-xs"
        style={{
          background: "white",
          borderColor: "rgba(15,26,53,0.08)",
          color: BRAND.muted,
        }}
      >
        © 2026 EFFEFF Co., Ltd · 사업자번호 466-81-04205 ·{" "}
        <a
          href="mailto:ceo@effeffcorp.com"
          className="underline hover:no-underline"
        >
          ceo@effeffcorp.com
        </a>{" "}
        ·{" "}
        <Link href="/privacy" className="underline hover:no-underline">
          개인정보처리방침
        </Link>{" "}
        ·{" "}
        <Link href="/terms" className="underline hover:no-underline">
          이용약관
        </Link>
      </footer>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────────

function DesignChoice({
  ok,
  title,
  items,
}: {
  ok: boolean;
  title: string;
  items: string[];
}) {
  return (
    <div
      className="rounded-2xl p-5 border-2"
      style={{
        background: ok ? `${BRAND.success}08` : `${BRAND.danger}06`,
        borderColor: ok ? `${BRAND.success}40` : `${BRAND.danger}30`,
      }}
    >
      <p
        className="text-sm font-bold mb-3 uppercase tracking-wider"
        style={{ color: ok ? BRAND.success : BRAND.danger }}
      >
        {ok ? "✓ 티타" : "✗ 일반 SNS"}
      </p>
      <p className="text-base font-bold mb-3" style={{ color: BRAND.ink }}>
        {title}
      </p>
      <ul className="space-y-1.5 text-sm" style={{ color: BRAND.muted }}>
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function SafetyLayer({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  body: string;
}) {
  return (
    <li
      className="rounded-xl bg-white p-5 sm:p-6 border flex items-start gap-4"
      style={{ borderColor: "rgba(15,26,53,0.08)" }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
        style={{ background: `${BRAND.navy}12` }}
      >
        <Icon className="h-5 w-5" style={{ color: BRAND.navy }} />
      </div>
      <div>
        <p className="text-base font-bold mb-1" style={{ color: BRAND.ink }}>
          {title}
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: BRAND.muted }}
        >
          {body}
        </p>
      </div>
    </li>
  );
}

function FamilyBenefit({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-xl p-5 border bg-white flex items-start gap-4"
      style={{ borderColor: "rgba(15,26,53,0.08)" }}
    >
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0"
        style={{ background: `${BRAND.success}15` }}
      >
        <Icon className="h-5 w-5" style={{ color: BRAND.success }} />
      </div>
      <div>
        <p className="text-base font-bold mb-1" style={{ color: BRAND.ink }}>
          {title}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
          {body}
        </p>
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details
      className="rounded-xl bg-white p-4 sm:p-5 border group"
      style={{ borderColor: "rgba(15,26,53,0.08)" }}
    >
      <summary
        className="text-base font-bold cursor-pointer list-none flex items-center justify-between"
        style={{ color: BRAND.ink }}
      >
        <span>{q}</span>
        <Phone
          className="h-4 w-4 group-open:rotate-90 transition-transform flex-shrink-0 ml-3"
          style={{ color: BRAND.muted }}
        />
      </summary>
      <p
        className="text-sm leading-relaxed mt-3"
        style={{ color: BRAND.muted }}
      >
        {a}
      </p>
    </details>
  );
}
