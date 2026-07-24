"use client";

import { cloneElement, useMemo, useState } from "react";
import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ShieldCheck,
  Users,
  BarChart3,
  Crown,
  CheckCircle2,
  TrendingDown,
  Mail,
  Phone,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";

// 공유 TITA 팔레트에 매핑. 과거 navy/lavender 명칭은 유지하되(참조 18곳) 값만
// 포레스트 시스템으로 — gray lavender→따뜻한 surface, 파란 navySoft→forestMid.
const BRAND = {
  navy:      TITA.forest,      // #1F4E3D
  navyDeep:  TITA.forestDeep,  // #143329
  navySoft:  TITA.forestMid,   // #3A6B58 (기존 파랑 대체)
  lavender:  TITA.surface,     // #F2EDE3 (기존 회색 대체)
  ink:       TITA.ink,
  muted:     TITA.muted,
  cream:     TITA.cream,
  sage:      TITA.sage,
  camel:     TITA.camel,
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Volume pricing tiers — single source of truth. Calculator below + volume
// table both read from this. Tier resolution is "highest count ≤ N", so an
// org with 700 members lands in the 500+ tier.
// ────────────────────────────────────────────────────────────────────────────

type Tier = {
  minCount: number;
  pricePerMember: number;   // 원 / 명 / 월
  label: string;
  blurb: string;
};

const TIERS: Tier[] = [
  { minCount:   1, pricePerMember: 0,     label: "베타",    blurb: "1년 무료 베타 진행 중" },
  { minCount: 100, pricePerMember: 8000,  label: "스타터",  blurb: "복지관·소규모 재단" },
  { minCount: 500, pricePerMember: 6000,  label: "스탠다드", blurb: "중규모 실버타운" },
  { minCount: 1000, pricePerMember: 5000, label: "엔터프라이즈", blurb: "광역 재단·보험사 컨소시엄" },
];

function resolveTier(count: number): Tier {
  // Pick the highest tier whose minCount is ≤ count.
  let chosen = TIERS[0];
  for (const tier of TIERS) {
    if (count >= tier.minCount) chosen = tier;
  }
  return chosen;
}

const useCases = [
  {
    icon: Building2,
    title: "재단·복지관",
    description:
      "회원 디지털 친구 만들기 프로그램의 안전한 도구로 통합. 첫 1년 무료 베타로 도메인 데이터를 같이 쌓습니다.",
    pilotPeriod: "1년 무료",
  },
  {
    icon: HeartHandshake,
    title: "실버타운·시니어 레지던스",
    description:
      "입주민 커뮤니티 활성화 + 안전 모니터링. 화이트라벨로 운영사 브랜드와 결합 가능합니다.",
    pilotPeriod: "협의",
  },
  {
    icon: ShieldCheck,
    title: "보험사 시니어 케어팀",
    description:
      "고객 부가서비스로 티타 Plus 묶음 제공. 가입자 리텐션 + 안전사고 예방 효과.",
    pilotPeriod: "협의",
  },
  {
    icon: Sparkles,
    title: "통신사 시니어 디지털 케어",
    description:
      "AI Care / 시니어 패키지 결합 상품. 티타 안전 인프라를 통신사 채널로 보급.",
    pilotPeriod: "협의",
  },
];

const partnerBenefits = [
  "회원 일괄 Plus 권한 — AI 맞춤 매칭 인사이트·메시지 한도 없이",
  "운영 대시보드 — 활동·매칭·안전 인시던트 실시간 모니터링",
  "주간/월간 인사이트 리포트 — 회원 코호트 + 안전 통계",
  "전담 사업개발 매니저 배정 — 도입·교육·정착까지",
  "화이트라벨 또는 운영사 공동 브랜딩 옵션",
  "특허 출원 안전 기술 — 금융권 수준의 신원·콘텐츠 보호",
];

export default function BusinessPage() {
  // Calculator state
  const [members, setMembers] = useState<number>(300);
  const tier = useMemo(() => resolveTier(members), [members]);
  const monthlyCost = members * tier.pricePerMember;
  const annualCost = monthlyCost * 12;

  // Form state — submission opens mailto with everything pre-filled.
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `[티타 단체 라이선스 문의] ${orgName || "기관명 미기재"}`,
    );
    const body = encodeURIComponent(
      [
        `기관명: ${orgName}`,
        `담당자: ${contactName}`,
        `이메일: ${email}`,
        `전화: ${phone || "(미기재)"}`,
        ``,
        `예상 회원 수: ${members.toLocaleString()}명`,
        `예상 단가: ${tier.pricePerMember.toLocaleString()}원/명/월 (${tier.label})`,
        `예상 월 비용: ${monthlyCost.toLocaleString()}원`,
        ``,
        `문의 내용:`,
        message || "(비어 있음)",
        ``,
        `— 티타 비즈니스 페이지에서 발송`,
      ].join("\n"),
    );
    window.location.href = `mailto:ceo@effeffcorp.com?subject=${subject}&body=${body}`;
  }

  return (
    <div
      className="min-h-screen"
      style={{ color: BRAND.ink, backgroundColor: BRAND.cream, fontFamily: KOREAN_FONT_STACK }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{
          background: "rgba(255,255,255,0.95)",
          borderColor: "rgba(15,26,53,0.08)",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/app_icon.svg"
              alt="티타 로고"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl"
              priority
            />
            <span className="text-2xl font-bold" style={{ color: BRAND.navy }}>
              티타
            </span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="hidden sm:inline text-sm font-semibold"
              style={{ color: BRAND.muted }}
            >
              개인 고객
            </Link>
            <span
              className="text-xs font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full"
              style={{ background: BRAND.lavender, color: BRAND.navy }}
            >
              Business
            </span>
          </div>
        </nav>
      </header>

      <main>
        {/* ── Hero — 딥그린 밴드 ─────────────────────────────────────────
            기관이 원하는 '성과(어르신 활력·참여·고립 예방)'를 사람 언어로
            앞세우고, 그 아래 기관 신뢰 요소(안전·대시보드)를 받친다. */}
        <section style={{ backgroundColor: BRAND.navy }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              style={{ background: "rgba(251,247,240,0.12)", color: BRAND.camel }}
            >
              단체 라이선스
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight max-w-3xl"
              style={{ color: BRAND.cream }}
            >
              우리 기관 어르신에게,
              <br />
              <span style={{ color: BRAND.camel }}>매주 설레는 외출</span>을.
            </h1>
            <p
              className="text-lg lg:text-xl leading-relaxed mt-6 max-w-2xl"
              style={{ color: BRAND.sage }}
            >
              검증된 또래 매칭으로 어르신의 고립을 줄이고, 매일에 설렘을 더합니다.
              금융권 수준의 안전 인프라와 운영 대시보드까지 — 재단·복지관·실버타운·
              보험사·통신사를 위한 티타 단체 라이선스.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-bold transition shadow-lg"
                style={{ background: BRAND.cream, color: BRAND.navy }}
              >
                도입 상담 문의
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#calculator"
                className="inline-flex items-center gap-2 rounded-full border-2 px-7 py-4 text-base font-bold transition"
                style={{ borderColor: "rgba(251,247,240,0.5)", color: BRAND.cream }}
              >
                가격 계산기
              </a>
            </div>
          </div>
        </section>

        {/* ── Use Cases ─────────────────────────────────────────────────── */}
        <section
          className="py-16"
          style={{ background: BRAND.lavender }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: BRAND.navySoft }}
              >
                협력 대상
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: BRAND.ink }}
              >
                4가지 협력 모델
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {useCases.map((u) => {
                const Icon = u.icon;
                return (
                  <div
                    key={u.title}
                    className="rounded-2xl bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0"
                        style={{ background: BRAND.navy }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3
                            className="text-lg font-bold"
                            style={{ color: BRAND.ink }}
                          >
                            {u.title}
                          </h3>
                          <span
                            className="text-[10px] font-bold tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                            style={{
                              background: BRAND.lavender,
                              color: BRAND.navy,
                            }}
                          >
                            {u.pilotPeriod}
                          </span>
                        </div>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: BRAND.muted }}
                        >
                          {u.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── What's included ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: BRAND.navySoft }}
            >
              포함 기능
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: BRAND.ink }}
            >
              모든 회원에게 Plus 권한 + 운영 도구
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 max-w-3xl mx-auto">
            {partnerBenefits.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3 rounded-xl p-4"
                style={{ background: BRAND.lavender }}
              >
                <CheckCircle2
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: BRAND.navy }}
                />
                <span className="text-sm" style={{ color: BRAND.ink }}>
                  {b}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Pricing calculator ────────────────────────────────────────── */}
        <section
          id="calculator"
          className="py-16"
          style={{ background: BRAND.navy }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.3em] mb-3 text-white/60">
                가격 계산기
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                회원 수에 따라 자동 계산
              </h2>
              <p className="text-base md:text-lg text-white/85">
                회원 수가 많을수록 명당 단가가 낮아집니다.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 sm:p-8 space-y-6">
              {/* Member count input */}
              <div>
                <div className="flex items-end justify-between gap-3 mb-3">
                  <label
                    className="text-sm font-bold"
                    style={{ color: BRAND.ink }}
                  >
                    회원 수
                  </label>
                  <div className="flex items-baseline gap-2">
                    <input
                      type="number"
                      min={50}
                      max={5000}
                      step={50}
                      value={members}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!Number.isNaN(v)) {
                          setMembers(Math.min(5000, Math.max(50, v)));
                        }
                      }}
                      className="w-28 text-right text-2xl font-bold tabular-nums px-3 py-1 rounded-lg border focus:outline-none focus:ring-2"
                      style={{
                        color: BRAND.navy,
                        borderColor: "rgba(15,26,53,0.1)",
                      }}
                    />
                    <span
                      className="text-base font-medium"
                      style={{ color: BRAND.muted }}
                    >
                      명
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={50}
                  value={Math.min(2000, members)}
                  onChange={(e) => setMembers(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: BRAND.navy }}
                  aria-label="회원 수 슬라이더"
                />
                <div
                  className="flex justify-between text-xs mt-1"
                  style={{ color: BRAND.muted }}
                >
                  <span>50명</span>
                  <span>500명</span>
                  <span>1,000명</span>
                  <span>2,000명+</span>
                </div>
              </div>

              {/* Tier badge */}
              <div
                className="rounded-2xl p-4 flex items-center justify-between gap-3"
                style={{ background: BRAND.lavender }}
              >
                <div>
                  <span
                    className="text-[10px] font-bold tracking-[0.15em] uppercase block mb-1"
                    style={{ color: BRAND.navySoft }}
                  >
                    적용 구간
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Crown className="h-4 w-4" style={{ color: BRAND.navy }} />
                    <span
                      className="text-base font-bold"
                      style={{ color: BRAND.ink }}
                    >
                      {tier.label}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: BRAND.muted }}
                    >
                      · {tier.blurb}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: BRAND.navy }}
                  >
                    {tier.pricePerMember.toLocaleString()}
                  </span>
                  <span
                    className="text-xs ml-1"
                    style={{ color: BRAND.muted }}
                  >
                    원/명/월
                  </span>
                </div>
              </div>

              {/* Costs */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{ background: BRAND.lavender }}
                >
                  <span
                    className="text-[10px] font-bold tracking-[0.15em] uppercase block mb-1"
                    style={{ color: BRAND.muted }}
                  >
                    월 비용
                  </span>
                  <p
                    className="text-2xl sm:text-3xl font-bold tabular-nums"
                    style={{ color: BRAND.ink }}
                  >
                    {monthlyCost.toLocaleString()}
                  </p>
                  <span
                    className="text-xs"
                    style={{ color: BRAND.muted }}
                  >
                    원/월
                  </span>
                </div>
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{ background: BRAND.navy }}
                >
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase block mb-1 text-white/70">
                    연 비용
                  </span>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-white">
                    {annualCost.toLocaleString()}
                  </p>
                  <span className="text-xs text-white/70">원/년</span>
                </div>
              </div>

              {/* Beta banner — first year free */}
              {tier.pricePerMember === 0 && (
                <div
                  className="rounded-xl p-4 border-2"
                  style={{ borderColor: BRAND.navy }}
                >
                  <div className="flex items-start gap-3">
                    <TrendingDown
                      className="h-5 w-5 flex-shrink-0 mt-0.5"
                      style={{ color: BRAND.navy }}
                    />
                    <div className="text-sm" style={{ color: BRAND.ink }}>
                      <strong>1년 무료 베타 진행 중.</strong> 100명 미만 기관도
                      베타 조건으로 무료 운영 가능합니다. 1년 후 단가는 협의로
                      결정합니다.
                    </div>
                  </div>
                </div>
              )}

              <a
                href="#contact"
                className="block text-center w-full rounded-full px-7 py-4 text-base font-bold text-white transition"
                style={{ background: BRAND.navy }}
              >
                이 조건으로 상담 신청
              </a>
            </div>
          </div>
        </section>

        {/* ── Volume table ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: BRAND.navySoft }}
            >
              볼륨 단가표
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold"
              style={{ color: BRAND.ink }}
            >
              규모가 클수록 단가는 낮게
            </h2>
          </div>
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: "rgba(15,26,53,0.08)" }}
          >
            <table className="w-full">
              <thead>
                <tr style={{ background: BRAND.lavender }}>
                  <th
                    className="text-left px-5 py-3 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: BRAND.muted }}
                  >
                    회원 수
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: BRAND.muted }}
                  >
                    구간
                  </th>
                  <th
                    className="text-right px-5 py-3 text-xs font-bold uppercase tracking-[0.15em]"
                    style={{ color: BRAND.muted }}
                  >
                    명당 단가
                  </th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t, idx) => {
                  const next = TIERS[idx + 1];
                  const range = next
                    ? `${t.minCount.toLocaleString()} ~ ${(next.minCount - 1).toLocaleString()}명`
                    : `${t.minCount.toLocaleString()}명 이상`;
                  return (
                    <tr
                      key={t.label}
                      className="border-t"
                      style={{ borderColor: "rgba(15,26,53,0.06)" }}
                    >
                      <td
                        className="px-5 py-4 text-sm font-medium"
                        style={{ color: BRAND.ink }}
                      >
                        {range}
                      </td>
                      <td
                        className="px-5 py-4 text-sm"
                        style={{ color: BRAND.muted }}
                      >
                        <strong style={{ color: BRAND.navy }}>
                          {t.label}
                        </strong>
                        <span className="block text-xs mt-0.5">{t.blurb}</span>
                      </td>
                      <td
                        className="px-5 py-4 text-right text-base font-bold tabular-nums"
                        style={{ color: BRAND.navy }}
                      >
                        {t.pricePerMember === 0
                          ? "무료"
                          : `${t.pricePerMember.toLocaleString()}원`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p
            className="text-xs mt-4 text-center"
            style={{ color: BRAND.muted }}
          >
            계약 형태 (월 / 연), 화이트라벨 옵션, 데이터 인사이트 범위에 따라 협의 가능합니다.
          </p>
        </section>

        {/* ── Contact form ──────────────────────────────────────────────── */}
        <section
          id="contact"
          className="py-16"
          style={{ background: BRAND.lavender }}
        >
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: BRAND.navySoft }}
              >
                상담 신청
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: BRAND.ink }}
              >
                30분 미팅으로 적합성 진단
              </h2>
              <p className="text-base" style={{ color: BRAND.muted }}>
                필요한 정보만 적어주시면 영업일 기준 1~2일 내에 회신드립니다.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white p-6 sm:p-8 space-y-4"
            >
              <FormField label="기관명" required>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="예: 종로노인종합복지관"
                />
              </FormField>
              <FormField label="담당자 성함" required>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="예: 김철수 팀장"
                />
              </FormField>
              <FormField label="이메일" required>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.org"
                />
              </FormField>
              <FormField label="전화번호 (선택)">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="02-0000-0000"
                />
              </FormField>
              <FormField label="문의 내용 (선택)">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="도입 시점, 기관 운영 형태, 중점 검토 사항 등 자유롭게 적어주세요."
                />
              </FormField>

              <div
                className="rounded-xl p-3 text-xs flex items-start gap-2"
                style={{ background: BRAND.lavender, color: BRAND.muted }}
              >
                <BarChart3
                  className="h-4 w-4 flex-shrink-0 mt-0.5"
                  style={{ color: BRAND.navy }}
                />
                <span>
                  계산기에 입력하신 회원 수 ({members.toLocaleString()}명, {tier.pricePerMember.toLocaleString()}원/명/월) 정보가 함께 전송됩니다.
                </span>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold text-white transition"
                style={{ background: BRAND.navy }}
              >
                이메일로 보내기
                <Mail className="h-5 w-5" />
              </button>
              <p
                className="text-xs text-center"
                style={{ color: BRAND.muted }}
              >
                제출 시 이메일 클라이언트가 열립니다. 확인 후 발송해주세요.
              </p>
            </form>

            {/* Direct contact fallback */}
            <div className="mt-6 text-center text-sm" style={{ color: BRAND.muted }}>
              직접 연락이 편하시다면:
              <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
                <a
                  href="mailto:ceo@effeffcorp.com"
                  className="inline-flex items-center gap-1.5 font-semibold"
                  style={{ color: BRAND.navy }}
                >
                  <Mail className="h-4 w-4" />
                  ceo@effeffcorp.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust signals ─────────────────────────────────────────────── */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              {[
                {
                  icon: ShieldCheck,
                  title: "특허 출원",
                  description: "PA260003 · 청구항 14개",
                },
                {
                  icon: Users,
                  title: "안전 인프라",
                  description: "전 회원 동일 적용",
                },
                {
                  icon: Phone,
                  title: "전담 지원",
                  description: "도입·교육 1:1 매니저",
                },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.title}
                    className="rounded-2xl p-5"
                    style={{ background: BRAND.lavender }}
                  >
                    <Icon
                      className="h-7 w-7 mx-auto mb-2"
                      style={{ color: BRAND.navy }}
                    />
                    <p
                      className="text-base font-bold"
                      style={{ color: BRAND.ink }}
                    >
                      {t.title}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: BRAND.muted }}
                    >
                      {t.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t bg-white"
        style={{ borderColor: "rgba(15,26,53,0.1)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <p className="text-xs" style={{ color: BRAND.muted }}>
            © 2026 (주)이프이프 EFFEFF Co., Ltd · 사업자등록번호 466-81-04205 ·{" "}
            <a
              href="mailto:ceo@effeffcorp.com"
              className="hover:underline"
              style={{ color: BRAND.navy }}
            >
              ceo@effeffcorp.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

// Standard className/style for input/textarea inside FormField. Parent passes
// a bare `<input>` or `<textarea>` and we clone-with-merged-styling so each
// field is consistent without boilerplate at every call site.
type FieldStyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

const FIELD_BASE =
  "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition";
const FIELD_STYLE: React.CSSProperties = {
  borderColor: "rgba(15,26,53,0.1)",
  color: BRAND.ink,
};

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactElement<FieldStyleProps>;
}) {
  const merged = cloneElement(children, {
    className: [children.props.className, FIELD_BASE]
      .filter(Boolean)
      .join(" "),
    style: { ...FIELD_STYLE, ...(children.props.style ?? {}) },
  });

  return (
    <label className="block">
      <span
        className="block text-sm font-bold mb-1.5"
        style={{ color: BRAND.ink }}
      >
        {label}
        {required && (
          <span style={{ color: "#B91C1C" }} className="ml-1">
            *
          </span>
        )}
      </span>
      {merged}
    </label>
  );
}
