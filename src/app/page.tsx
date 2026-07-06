"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Heart,
  Users,
  ShieldCheck,
  Eye,
  MessageCircle,
  Sparkles,
  Download,
  CheckCircle2,
  Mail,
  Mic,
  UserCheck,
  Lock,
  CalendarClock,
  Crown,
  Flower2,
  Bot,
} from "lucide-react";

// Brand tokens — defined in globals.css. Use these constants in `style` props
// so the navy/lavender contrast is consistent across the site.
const BRAND = {
  navy:      "#10367D",
  navyDeep:  "#0A2459",
  navySoft:  "#2D54A1",
  lavender:  "#EBEBEB",
  ink:       "#0F1A35",
  muted:     "#4A5878",
} as const;

// ────────────────────────────────────────────────────────────────────────────
// Content — current state of the product, kept in one place so updates are
// trivial. Each feature reflects what is actually shipping (or imminently
// shipping). "Coming up" features are clearly labeled to set expectations.
// ────────────────────────────────────────────────────────────────────────────

type Feature = {
  icon: typeof Sparkles;
  title: string;
  description: string;
  status?: "shipping" | "coming";
};

const safetyFeatures: Feature[] = [
  {
    icon: UserCheck,
    title: "NICE 본인인증 (전원 무료)",
    description:
      "만 45세 이상만 가입 가능. NICE 인증으로 신원이 확인된 회원과만 만나니 안심하고 시작하실 수 있습니다.",
    status: "shipping",
  },
  {
    icon: ShieldCheck,
    title: "AI 4계층 안전 보호 (전원 무료)",
    description:
      "특허 출원 기술. 맥락(LLM)·패턴(정규식)·행동·인지 지문을 결합한 통합 위험 점수로 로맨스 스캠·보이스피싱·투자 사기를 자동 차단합니다.",
    status: "shipping",
  },
  {
    icon: Eye,
    title: "적응형 화면 (전원 무료)",
    description:
      "터치 오타·반응 속도를 학습해 글자 크기·버튼 간격을 자동 조정. 시력·손떨림 등 신체 변화에 맞춰 매일 진화하는 인터페이스입니다.",
    status: "shipping",
  },
];

const communityFeatures: Feature[] = [
  {
    icon: Users,
    title: "모임 (서클) — 가입 무제한 무료",
    description:
      "같은 동네, 같은 관심사로 모이는 작은 그룹. 산책·등산·글쓰기·텃밭 — 무엇이든 모임이 됩니다. 가입은 누구나 무제한 무료입니다.",
    status: "shipping",
  },
  {
    icon: Sparkles,
    title: "관심사 매칭 (전원 무료)",
    description:
      "프로필·관심사·동네를 분석하는 하이브리드 매칭(코사인+자카드 유사도)으로 진짜 잘 맞는 친구만 추천드립니다. 매칭 자체는 모두 무료입니다.",
    status: "shipping",
  },
  {
    icon: MessageCircle,
    title: "안전한 채팅 (모든 회원)",
    description:
      "친구와 1:1 대화도, 모임 채팅도 모두 AI가 24시간 살펴봅니다. 무료로 한 달에 300통까지 메시지를 주고받으실 수 있어요.",
    status: "shipping",
  },
];

const plusFeatures: Feature[] = [
  {
    icon: Crown,
    title: "꽃 표시 — 활동 회원",
    description:
      "꾸준히 활동하시는 회원이라는 작은 표시입니다. 이름 옆에 꽃 모양이 함께 보여, 다른 분들도 활동 중인 분임을 자연스럽게 알아봅니다.",
    status: "shipping",
  },
  {
    icon: Mic,
    title: "음성 메시지",
    description:
      "글자 입력이 불편하신 분들도 목소리로 마음을 전하실 수 있어요. 하루 50분까지 보내실 수 있습니다.",
    status: "shipping",
  },
  {
    icon: Users,
    title: "모임 만들기 무제한",
    description:
      "내가 직접 모임을 만들고 운영합니다. 무료는 1개, 플러스는 무제한.",
    status: "shipping",
  },
  {
    icon: MessageCircle,
    title: "채팅 무제한",
    description:
      "한 달 메시지 수 제한 없이, 친구들과 마음껏 이야기하실 수 있어요.",
    status: "shipping",
  },
  {
    icon: Sparkles,
    title: "AI 맞춤 코멘트 — 매일의 질문",
    description:
      "매일의 가벼운 질문에 답하면, 그 마음에 따뜻하게 반응하는 AI 한마디가 더해집니다. 혼자가 아니라는 작은 인사예요.",
    status: "shipping",
  },
  {
    icon: Sparkles,
    title: "AI 모임 추천 이유",
    description:
      "추천 모임마다 '왜 나에게 잘 맞는지' 이유를 한 줄로 알려드려요. 고를 때 망설임이 줄어듭니다.",
    status: "shipping",
  },
  {
    icon: Flower2,
    title: "내가 만들면 좋을 모임 제안",
    description:
      "내 관심사와 비슷한 분들을 살펴, 직접 만들기 좋은 모임을 AI가 하루 하나 제안합니다. 만들기 버튼만 누르면 바로 시작돼요.",
    status: "shipping",
  },
  {
    icon: Heart,
    title: "자녀와 함께 안심",
    description:
      "자녀가 부모님 활동 요약을 일주일에 한 번 받아봅니다. 의심스러운 일이 생기면 자녀에게 바로 알려드려요. 곧 만나보실 수 있어요.",
    status: "coming",
  },
  {
    icon: Bot,
    title: "말동무 — 24시간 대화 친구",
    description:
      "외로운 밤에도 24시간 따뜻하게 이야기를 들어주는 대화 친구입니다. 곧 만나보실 수 있어요.",
    status: "coming",
  },
];

const benefits = [
  "글씨 크기·버튼 간격이 자동으로 편하게 맞춰집니다",
  "NICE 본인인증으로 신원 확인된 회원만 가입",
  "특허 출원 AI 안전 시스템 — 24시간 사기·스캠 차단",
  "모든 회원에게 동일한 안전 인프라 적용 (Plus 차별 없음)",
  "광고 없는 깨끗한 환경 — 무료에서도 방해 요소 없음",
];

const mainPatent = {
  title: "시니어 특화 소셜 플랫폼 시스템",
  titleEn: "Senior-Specific Social Platform System",
  description:
    "시니어 사용자를 위한 온라인 소셜 플랫폼에서 보안성·신뢰성을 향상시키는 통합 시스템. CI 기반 본인 인증, 다층적 위험 평가(LLM·정규식·행동·인지지문), 보안-접근성 양방향 루프, 하이브리드 매칭 알고리즘을 통합 제공합니다. 청구항 14개·도면 5건.",
  applicationNumber: "PA260003",
  showApplicationNumber: false,
  applicationDate: "2026년 1월 16일",
  status: "출원완료",
  claims: [
    {
      title: "CI 기반 본인 인증 + 부정 사용자 차단",
      description: "동일인의 재가입 원천 차단. UUID 블랙리스트 결합.",
    },
    {
      title: "다층 위험 평가 통합 점수",
      description: "S_AI·ΣP·V_beh·C_cog·C_auth 5변수 가중합 + 동적 가중치 제어.",
    },
    {
      title: "보안-접근성 양방향 루프",
      description: "터치·반응 데이터를 UI 조정과 보안 식별에 동시 활용.",
    },
    {
      title: "하이브리드 매칭",
      description: "코사인+자카드 유사도, 데이터 완결성 기반 자동 가중치.",
    },
  ],
};

// 가격표
const pricingPlans = [
  {
    name: "무료",
    price: "0",
    priceUnit: "원",
    headline: "안전 기능은 모두에게 무료",
    color: BRAND.muted,
    bgColor: "white",
    borderColor: BRAND.lavender,
    items: [
      "모임 가입·참여 무제한",
      "친구 매칭·추천 무제한",
      "한 달에 300통 메시지",
      "모임 만들기 1개",
      "NICE 본인인증",
      "AI 4계층 안전 보호",
      "적응형 화면",
    ],
    badge: null,
  },
  {
    name: "티타 플러스",
    price: "19,900",
    priceUnit: "원/월",
    yearly: "연 199,000원 (2개월 무료)",
    headline: "더 활발하게, 더 자유롭게",
    color: BRAND.navy,
    bgColor: BRAND.navy,
    borderColor: BRAND.navy,
    invertedText: true,
    items: [
      "이름 옆 꽃 표시 (활동 회원)",
      "음성 메시지 (하루 50분)",
      "모임 만들기 무제한",
      "채팅 무제한",
      "매칭·모임 우선 노출",
      "AI 맞춤 코멘트 (매일의 질문)",
      "AI 추천 이유 · 만들면 좋을 모임 제안",
      "자녀와 함께 안심 (곧 만나보실 수 있어요)",
      "우선 고객 지원",
    ],
    badge: "추천",
    cta: "지금 결제하기",
    ctaHref: "/subscribe/plus",
  },
  {
    name: "단체 라이선스",
    price: "5,000~",
    priceUnit: "원/명/월",
    headline: "복지관·실버타운·재단",
    color: BRAND.navySoft,
    bgColor: BRAND.lavender,
    borderColor: BRAND.lavender,
    items: [
      "회원 일괄 Plus 권한",
      "화이트라벨 또는 브랜드 결합",
      "운영 대시보드 + 인사이트",
      "전담 매니저 배정",
      "1년 무료 베타 진행 중",
    ],
    badge: "B2B",
    cta: "문의하기",
    ctaHref: "mailto:ceo@effeffcorp.com?subject=티타 단체 라이선스 문의",
  },
];

// App Store URLs
const APP_STORE_URL = "https://apps.apple.com/app/id6751523550";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.bloomagain.bloomagain";

const handleAppDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  if (typeof window === "undefined") return;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isIOS = /iphone|ipad|ipod|macintosh/.test(userAgent);
  if (isIOS) {
    window.open(APP_STORE_URL, "_blank", "noopener,noreferrer");
  } else {
    window.open(PLAY_STORE_URL, "_blank", "noopener,noreferrer");
  }
};

// ────────────────────────────────────────────────────────────────────────────
// Founding-member counter — fetches from the bloomagain-korea backend via
// the local Next.js proxy. Hides on error (graceful) and switches to the
// "마감" state when the cohort is full.
// ────────────────────────────────────────────────────────────────────────────

interface FoundingStats {
  cap: number;
  assigned: number;
  remaining: number;
}

function FoundingCounter() {
  const [stats, setStats] = useState<FoundingStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
    if (!backendUrl) { setLoaded(true); return; }
    fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/user/founding-stats`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setStats(data as FoundingStats);
      })
      .catch(() => { /* graceful */ })
      .finally(() => !cancelled && setLoaded(true));
    return () => { cancelled = true; };
  }, []);

  if (!loaded || !stats) return null;
  const { cap, assigned, remaining } = stats;
  const progress = Math.min(1, assigned / cap);
  const urgent = remaining <= 50;

  if (remaining <= 0) {
    return (
      <div
        className="rounded-2xl px-5 py-4 border"
        style={{ background: BRAND.lavender, borderColor: "rgba(16,54,125,0.15)" }}
      >
        <p className="text-sm font-semibold" style={{ color: BRAND.navy }}>
          ✓ 창립 회원 500명 모집이 끝났어요. 30일 무료로 먼저 사용해보시고 결정하세요.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl px-5 py-4 border-2"
      style={{
        background: "white",
        borderColor: urgent ? "#E53935" : BRAND.navy,
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Flower2 size={18} style={{ color: urgent ? "#E53935" : BRAND.navy }} />
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: urgent ? "#E53935" : BRAND.navy }}
          >
            {urgent ? `창립 멤버 단 ${remaining}자리 남았어요` : "창립 멤버 모집 중"}
          </span>
        </div>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: BRAND.ink }}
        >
          {assigned} / {cap}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(15,26,53,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${progress * 100}%`,
            background: urgent ? "#E53935" : BRAND.navy,
          }}
        />
      </div>
      <p className="text-xs mt-2" style={{ color: BRAND.muted }}>
        ✓ 6개월 동안 무료로 이용  ·  ✓ 평생 유지되는 창립 회원 표시
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

export default function Home() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-animate='fade']");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ color: BRAND.ink }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{
          background: "rgba(255,255,255,0.95)",
          borderColor: "rgba(15,26,53,0.08)",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/app_icon.svg"
              alt="티타 로고"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl"
              priority
            />
            <Link
              href="/"
              className="text-2xl font-bold"
              style={{ color: BRAND.navy }}
            >
              티타
            </Link>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#pricing"
              className="hidden sm:inline text-sm font-semibold transition-colors"
              style={{ color: BRAND.muted }}
            >
              가격
            </a>
            <a
              href="#features"
              className="hidden sm:inline text-sm font-semibold transition-colors"
              style={{ color: BRAND.muted }}
            >
              기능
            </a>
            <a
              href="https://effeffcorp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs transition-colors"
              style={{ color: BRAND.muted }}
            >
              Made by <span className="font-bold">EFFEFF</span>
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="grid gap-10 lg:gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-7 text-center lg:text-left">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    background: BRAND.lavender,
                    color: BRAND.navy,
                  }}
                >
                  45+ 세대를 위한
                </div>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight"
                  style={{ color: BRAND.ink }}
                >
                  다시,
                  <br />
                  <span style={{ color: BRAND.navy }}>같은 마음의 친구</span>
                  <br />
                  를 만나는 시간
                </h1>
                <p
                  className="text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0"
                  style={{ color: BRAND.muted }}
                >
                  같은 동네, 같은 관심사, 비슷한 인생을 살아온 친구들과
                  <br className="hidden sm:block" />
                  모임을 만들고 마음을 나누세요.
                </p>
                <div
                  className="text-sm rounded-lg px-4 py-3 max-w-xl mx-auto lg:mx-0"
                  style={{
                    background: BRAND.lavender,
                    color: BRAND.navy,
                  }}
                >
                  <strong>※ 티타은 만남앱이 아닙니다.</strong> 친구·모임 중심 플랫폼입니다.
                </div>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <a
                    href="#"
                    onClick={handleAppDownload}
                    className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-white shadow-lg transition hover:shadow-xl"
                    style={{ background: BRAND.navy }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = BRAND.navyDeep; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = BRAND.navy; }}
                  >
                    앱 다운로드
                    <Download className="h-5 w-5" />
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center gap-2 rounded-full border-2 px-7 py-4 text-base font-semibold transition"
                    style={{ borderColor: BRAND.navy, color: BRAND.navy }}
                  >
                    주요 기능 보기
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </div>
                <div className="pt-2 max-w-xl mx-auto lg:mx-0">
                  <FoundingCounter />
                </div>
              </div>
              <div className="relative flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Image
                  src="/apppreview1.png"
                  alt="티타 앱 미리보기 1"
                  width={300}
                  height={533}
                  className="w-full object-contain max-w-[280px] sm:max-w-[300px] md:max-w-[320px]"
                  priority
                />
                <Image
                  src="/apppreview2.png"
                  alt="티타 앱 미리보기 2"
                  width={300}
                  height={533}
                  className="w-full object-contain max-w-[280px] sm:max-w-[300px] md:max-w-[320px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Trust Banner — 4 things that are FREE for everyone ─────────── */}
        <section
          className="fade-in-section py-16"
          data-animate="fade"
          style={{ background: BRAND.lavender }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: BRAND.navySoft }}
              >
                티타 원칙
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: BRAND.ink }}
              >
                안전 기능은 모든 회원에게 똑같이
              </h2>
              <p className="text-base md:text-lg" style={{ color: BRAND.muted }}>
                무료든 유료든 차별 없이, 첫 메시지부터 마지막 메시지까지 같은 보호를 받습니다.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {safetyFeatures.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                      style={{ background: `${BRAND.navy}12` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: BRAND.navy }} />
                    </div>
                    <h3
                      className="text-lg font-bold mb-2"
                      style={{ color: BRAND.ink }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: BRAND.muted }}
                    >
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>
            {/* 안심용 한 줄 — 검증된 통계(경찰청)를 "그래서 안전 무료"로 프레이밍 */}
            <p
              className="mx-auto max-w-3xl text-center text-sm md:text-base mt-8 leading-relaxed"
              style={{ color: BRAND.muted }}
            >
              경찰청 집계 로맨스 스캠 신고가 1년 새{" "}
              <strong style={{ color: BRAND.navy }}>
                +73% (2024년 1,265건 → 2025년 2,192건)
              </strong>{" "}
              늘었습니다. 그래서 티타은 NICE 본인인증과 AI 안전 보호를{" "}
              <strong style={{ color: BRAND.navy }}>모든 회원에게 무료</strong>로
              제공합니다.
            </p>
          </div>
        </section>

        {/* ── Community Features ───────────────────────────────────────── */}
        <section
          id="features"
          className="fade-in-section mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
          data-animate="fade"
        >
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: BRAND.navySoft }}
            >
              커뮤니티
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: BRAND.ink }}
            >
              친구와 모임, 무제한 무료
            </h2>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: BRAND.muted }}
            >
              가입은 누구나 무제한 무료. 핵심 가치는 절대 페이월에 두지 않습니다.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {communityFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border bg-white p-6 transition-shadow hover:shadow-md"
                  style={{ borderColor: "rgba(15,26,53,0.08)" }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl mb-4"
                    style={{ background: `${BRAND.navy}12` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: BRAND.navy }} />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: BRAND.ink }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Plus Features ─────────────────────────────────────────────── */}
        <section
          className="fade-in-section py-20"
          data-animate="fade"
          style={{ background: BRAND.lavender }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: BRAND.navySoft }}
              >
                티타 플러스
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: BRAND.ink }}
              >
                더 활발하게 활동하는 회원을 위한 기능
              </h2>
              <p
                className="text-base md:text-lg max-w-2xl mx-auto"
                style={{ color: BRAND.muted }}
              >
                안전 기능은 모두 똑같이 받으세요. 더 활발한 활동·우선 추천·가족 연결이 플러스의 가치입니다.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {plusFeatures.map((f) => {
                const Icon = f.icon;
                const coming = f.status === "coming";
                return (
                  <div
                    key={f.title}
                    className="rounded-2xl bg-white p-6 transition-shadow hover:shadow-md relative"
                  >
                    {coming && (
                      <span
                        className="absolute top-4 right-4 text-[10px] font-bold tracking-[0.15em] px-2 py-1 rounded-full uppercase"
                        style={{
                          background: `${BRAND.navy}15`,
                          color: BRAND.navy,
                        }}
                      >
                        Coming Soon
                      </span>
                    )}
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl mb-3"
                      style={{ background: BRAND.navy }}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3
                      className="text-base font-bold mb-2"
                      style={{ color: BRAND.ink }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: BRAND.muted }}
                    >
                      {f.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────────── */}
        <section
          id="pricing"
          className="fade-in-section mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
          data-animate="fade"
        >
          <div className="text-center mb-14">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: BRAND.navySoft }}
            >
              가격
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: BRAND.ink }}
            >
              명확하고 정직한 요금제
            </h2>
            <p
              className="text-base md:text-lg max-w-2xl mx-auto"
              style={{ color: BRAND.muted }}
            >
              안전 기능은 모든 회원이 무료로 사용하세요. 더 편리한 활동 기능에만 요금이 있습니다.
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-8">
            <FoundingCounter />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => {
              const inverted = plan.invertedText === true;
              const textColor = inverted ? "white" : BRAND.ink;
              const mutedColor = inverted
                ? "rgba(255,255,255,0.75)"
                : BRAND.muted;
              return (
                <div
                  key={plan.name}
                  className="rounded-3xl border-2 p-7 relative flex flex-col"
                  style={{
                    background: plan.bgColor,
                    borderColor: plan.borderColor,
                    transform: plan.badge === "추천" ? "scale(1.02)" : "none",
                  }}
                >
                  {plan.badge && (
                    <span
                      className="absolute -top-3 right-7 text-[11px] font-bold tracking-[0.15em] px-3 py-1 rounded-full uppercase"
                      style={{
                        background: inverted ? "white" : BRAND.navy,
                        color: inverted ? BRAND.navy : "white",
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <div className="mb-5">
                    <p
                      className="text-xs font-bold tracking-[0.15em] uppercase mb-1"
                      style={{ color: mutedColor }}
                    >
                      {plan.headline}
                    </p>
                    <h3
                      className="text-2xl font-bold mb-3"
                      style={{ color: textColor }}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className="text-4xl font-bold tabular-nums"
                        style={{ color: textColor }}
                      >
                        {plan.price}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: mutedColor }}
                      >
                        {plan.priceUnit}
                      </span>
                    </div>
                    {plan.yearly && (
                      <p
                        className="text-xs mt-2"
                        style={{ color: mutedColor }}
                      >
                        {plan.yearly}
                      </p>
                    )}
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2
                          className="h-4 w-4 flex-shrink-0 mt-0.5"
                          style={{
                            color: inverted ? "white" : BRAND.navy,
                          }}
                        />
                        <span style={{ color: textColor }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.cta ? (
                    <a
                      href={plan.ctaHref}
                      className="block text-center rounded-full px-5 py-3 text-sm font-bold transition"
                      style={{
                        background: inverted ? "white" : BRAND.navy,
                        color: inverted ? BRAND.navy : "white",
                      }}
                    >
                      {plan.cta}
                    </a>
                  ) : (
                    <a
                      href="#"
                      onClick={handleAppDownload}
                      className="block text-center rounded-full px-5 py-3 text-sm font-bold transition"
                      style={{
                        background: inverted ? "white" : BRAND.navy,
                        color: inverted ? BRAND.navy : "white",
                      }}
                    >
                      앱 다운로드
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <p
            className="text-xs text-center mt-8"
            style={{ color: BRAND.muted }}
          >
            창립 회원 1~500번째까지 6개월 동안 무료로 이용하시고, 이후 월 19,900원 · 평생 유지되는 창립 회원 표시
            <br />
            처음 가입하시면 30일 동안 무료로 사용해보실 수 있어요 · 언제든 그만두실 수 있고, 자동으로 결제되지 않습니다
          </p>
        </section>

        {/* ── Why 티타 — Benefits ──────────────────────────────────── */}
        <section
          className="fade-in-section py-20"
          data-animate="fade"
          style={{ background: BRAND.navy }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:gap-14 lg:grid-cols-2 items-center">
              <div className="space-y-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                  왜 티타인가요
                </p>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  복잡한 기술 대신,
                  <br />
                  사람과의 따뜻한 연결
                </h2>
                <p className="text-base md:text-lg text-white/85 leading-relaxed">
                  3년 동안 45세 이상 분들의 안전만 생각하며 만들었습니다.
                  특허 14개 출원으로 인정받은 기술이에요.
                  복잡한 기능보다, 안심하고 마음을 여실 수 있는 환경에 집중했습니다.
                </p>
              </div>
              <div className="space-y-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 text-white">
                    <CheckCircle2
                      className="h-6 w-6 flex-shrink-0 mt-0.5"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    />
                    <p className="text-base text-white/95">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Patent ──────────────────────────────────────────────────── */}
        <section
          id="patents"
          className="fade-in-section py-20"
          data-animate="fade"
          style={{ background: "white" }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: BRAND.navySoft }}
              >
                특허 출원 기술
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: BRAND.ink }}
              >
                금융권 수준의 보안 아키텍처
              </h2>
              <p
                className="text-base md:text-lg max-w-3xl mx-auto"
                style={{ color: BRAND.muted }}
              >
                다층 위험 평가 + 보안-접근성 양방향 루프 + 하이브리드 매칭의 통합 시스템.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div
                className="rounded-3xl border-2 p-8 md:p-10 shadow-lg"
                style={{ borderColor: BRAND.navy }}
              >
                <div className="flex flex-wrap items-start gap-4 mb-5">
                  <span
                    className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold text-white"
                    style={{ background: BRAND.navy }}
                  >
                    Patent Pending
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold"
                    style={{
                      background: BRAND.lavender,
                      color: BRAND.navy,
                    }}
                  >
                    {mainPatent.status}
                  </span>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-1"
                  style={{ color: BRAND.ink }}
                >
                  {mainPatent.title}
                </h3>
                <p
                  className="text-sm italic mb-4"
                  style={{ color: BRAND.muted }}
                >
                  {mainPatent.titleEn}
                </p>
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{ color: BRAND.ink }}
                >
                  {mainPatent.description}
                </p>
                <div
                  className="flex flex-wrap gap-x-6 gap-y-3 pb-6 mb-6 border-b"
                  style={{ borderColor: "rgba(15,26,53,0.1)" }}
                >
                  <div>
                    <span
                      className="text-xs font-medium block mb-0.5"
                      style={{ color: BRAND.muted }}
                    >
                      출원일
                    </span>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: BRAND.ink }}
                    >
                      {mainPatent.applicationDate}
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-xs font-medium block mb-0.5"
                      style={{ color: BRAND.muted }}
                    >
                      청구항
                    </span>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: BRAND.ink }}
                    >
                      14개 (독립항 2)
                    </p>
                  </div>
                  <div>
                    <span
                      className="text-xs font-medium block mb-0.5"
                      style={{ color: BRAND.muted }}
                    >
                      도면
                    </span>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: BRAND.ink }}
                    >
                      5건
                    </p>
                  </div>
                </div>
                <h4
                  className="text-base font-bold mb-4"
                  style={{ color: BRAND.ink }}
                >
                  핵심 청구항
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {mainPatent.claims.map((claim, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl p-4"
                      style={{ background: BRAND.lavender }}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 text-white"
                          style={{ background: BRAND.navy }}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <h5
                            className="text-sm font-bold mb-1"
                            style={{ color: BRAND.ink }}
                          >
                            {claim.title}
                          </h5>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: BRAND.muted }}
                          >
                            {claim.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Coming Soon roadmap ──────────────────────────────────────── */}
        <section
          className="fade-in-section py-20"
          data-animate="fade"
          style={{ background: BRAND.lavender }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: BRAND.navySoft }}
              >
                로드맵
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-3"
                style={{ color: BRAND.ink }}
              >
                곧 만나보실 기능
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  icon: Heart,
                  title: "자녀와 함께 안심",
                  description:
                    "자녀가 부모님 활동 요약을 일주일에 한 번 받아보고, 의심스러운 일이 생기면 자녀에게 바로 알려드려요.",
                  eta: "2026 Q3",
                },
                {
                  icon: Bot,
                  title: "AI 친구 (말동무)",
                  description:
                    "외로움이 깊을 때, 24시간 따뜻하게 대화해주는 45+ 한국어 특화 AI 친구.",
                  eta: "2026 Q4",
                },
                {
                  icon: CalendarClock,
                  title: "이벤트 / 오프라인 모임 안전성 평가",
                  description:
                    "오프라인 만남 직전 자동 안전 점검 + 안전 가이드. 별도 특허 출원 진행 중.",
                  eta: "2027 Q1",
                },
                {
                  icon: Lock,
                  title: "단체 라이선스 운영 대시보드",
                  description:
                    "복지관·실버타운 운영자를 위한 회원 관리 + 활동 인사이트 + 안전 리포트.",
                  eta: "2026 Q4",
                },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="rounded-2xl bg-white p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0"
                        style={{ background: `${BRAND.navy}15` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: BRAND.navy }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3
                            className="text-base font-bold"
                            style={{ color: BRAND.ink }}
                          >
                            {f.title}
                          </h3>
                          <span
                            className="text-[10px] font-bold tracking-[0.15em] px-2 py-0.5 rounded-full uppercase"
                            style={{
                              background: BRAND.lavender,
                              color: BRAND.navy,
                            }}
                          >
                            {f.eta}
                          </span>
                        </div>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: BRAND.muted }}
                        >
                          {f.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Download CTA ─────────────────────────────────────────────── */}
        <section
          id="download"
          className="fade-in-section mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20"
          data-animate="fade"
        >
          <div
            className="rounded-3xl p-10 md:p-14 text-center"
            style={{ background: BRAND.navy }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              지금 시작하세요
            </h2>
            <p className="text-base md:text-lg text-white/85 mb-8 max-w-xl mx-auto">
              30일 동안 무료로 사용해보세요. 자동으로 결제되지 않습니다.
              <br />
              창립 회원은 6개월 동안 무료로 이용하시고, 평생 유지되는 작은 표시를 드립니다.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="#"
                onClick={handleAppDownload}
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-bold shadow-lg transition"
                style={{ background: "white", color: BRAND.navy }}
              >
                <Download className="h-5 w-5" />
                앱 다운로드
              </a>
              <a
                href="mailto:ceo@effeffcorp.com?subject=티타 단체 라이선스 문의"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white px-7 py-4 text-base font-bold text-white transition"
              >
                단체 라이선스 문의
              </a>
            </div>
          </div>
        </section>

        {/* ── Contact ────────────────────────────────────────────────── */}
        <section className="py-16" style={{ background: BRAND.lavender }}>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: BRAND.ink }}
            >
              문의하기
            </h2>
            <div
              className="flex items-center justify-center gap-3 text-base"
              style={{ color: BRAND.navy }}
            >
              <Mail className="h-5 w-5" />
              <a
                href="mailto:ceo@effeffcorp.com"
                className="font-semibold underline-offset-2 hover:underline"
              >
                ceo@effeffcorp.com
              </a>
            </div>
            <p className="text-sm mt-3" style={{ color: BRAND.muted }}>
              계정 삭제·개인정보·단체 라이선스 등 모든 문의는 위 이메일로
              연락주시면 빠르게 답변드립니다.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer
        className="border-t bg-white"
        style={{ borderColor: "rgba(15,26,53,0.1)" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/app_icon.svg"
                  alt="티타 로고"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-lg"
                />
                <span
                  className="text-lg font-bold"
                  style={{ color: BRAND.navy }}
                >
                  티타
                </span>
              </div>
              <a
                href="https://effeffcorp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-base font-bold transition-colors"
                style={{ color: BRAND.ink }}
              >
                EFFEFF Co., Ltd
              </a>
              <p
                className="text-sm italic"
                style={{ color: BRAND.muted }}
              >
                Driven by Efficiency, Proven by Effect.
              </p>
            </div>
            <div className="space-y-1.5 text-sm" style={{ color: BRAND.muted }}>
              <p className="font-bold" style={{ color: BRAND.ink }}>
                (주)이프이프
              </p>
              <p>대표이사: RYU HAN GYEOL (유한결)</p>
              <p>사업자등록번호: 466-81-04205</p>
              <p>
                사업장 주소: 서울특별시 영등포구 국회대로50길 20,
                101동 803호 (영등포동7가, 포레나 영등포 센트럴)
              </p>
              <p>연락처: 010-5647-1196</p>
              <p>이메일: ceo@effeffcorp.com</p>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm md:justify-end">
              {[
                { label: "고객지원", href: "/support" },
                { label: "개인정보처리방침", href: "/privacy" },
                { label: "이용약관", href: "/terms" },
                { label: "보안·행동 데이터 처리", href: "/security-processing" },
                { label: "계정삭제", href: "/delete-account" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-colors"
                  style={{ color: BRAND.muted }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div
            className="border-t pt-6 text-center"
            style={{ borderColor: "rgba(15,26,53,0.08)" }}
          >
            <p className="text-xs" style={{ color: BRAND.muted }}>
              © 2026{" "}
              <a
                href="https://effeffcorp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                EFFEFF Co., Ltd
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
