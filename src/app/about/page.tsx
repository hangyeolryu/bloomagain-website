"use client";

// 티타 알아보기 — public-facing "about us" page.
// Linked from app onboarding modal, app settings menu, and home app bar.
// All three entry points open this URL in a WebView so updates land instantly
// across iOS / Android without requiring an app release.
//
// Sections (스크롤 순):
//   1. Hero — 인사말 (창업자 톤)
//   2. 왜 만들었나 (mission)
//   3. 무엇을 만들었나 (product overview, links to /privacy /terms)
//   4. 어떻게 안전한가 (4-layer safety + 특허)
//   5. 무엇으로 추천하나 (matching + LSIS-6 NMHSK alignment)
//   6. 어디로 가나 (vision)
//   7. 창업자 메시지
//   8. CTA

import Link from "next/link";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  Users,
  Brain,
  Award,
  Target,
  MessageCircle,
  CheckCircle2,
  Download,
} from "lucide-react";

const BRAND = {
  navy: "#10367D",
  navyDeep: "#0A2459",
  ink: "#0F1A35",
  muted: "#4A5878",
  bloom: "#FF6B9D",
  accent: "#BFE38A",
} as const;

// Inline Korean font stack so this page renders correctly inside the
// in-app WebView even when the global stylesheet is still cached from
// a previous deploy. Geist (the body default) only ships Latin glyphs,
// so without this fallback Korean text shows as ☐ boxes.
const KOREAN_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans CJK KR", "Noto Sans KR", "Malgun Gothic", Pretendard, sans-serif';

export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white via-[#FAFBFF] to-[#F0EBFD]"
      style={{ fontFamily: KOREAN_FONT_STACK }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold" style={{ color: BRAND.ink }}>
                티타
              </span>
              <span className="text-sm text-gray-500">Dasi, Bom</span>
            </Link>
            <Link
              href="/download"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium"
              style={{ backgroundColor: BRAND.navy, color: "white" }}
            >
              앱 받기 <Download className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* ── 1. Hero — 인사말 ──────────────────────────────────────────── */}
        <section className="mb-16 sm:mb-24">
          <div className="flex items-center gap-2 mb-6">
            <Heart
              className="w-5 h-5"
              style={{ color: BRAND.bloom }}
              strokeWidth={2.5}
              fill={BRAND.bloom}
            />
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: BRAND.navy }}
            >
              티타에 대해서
            </span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold leading-tight mb-6"
            style={{ color: BRAND.ink }}
          >
            여러분들을 생각하며
            <br />
            만든 앱입니다.
          </h1>
          <div
            className="text-lg sm:text-xl leading-relaxed space-y-4"
            style={{ color: BRAND.muted }}
          >
            <p>
              부담스럽다, 어렵다, 걱정된다, 의심스럽다, 복잡하다 —{" "}
              <strong style={{ color: BRAND.ink }}>
                이 모든 걸 해결해보려 했습니다.
              </strong>
            </p>
            <p>
              젊은 나이에 열심히 인생 달려오신 분들, 이제 걱정은 최소화 하시고
              편하고 즐거운 날들 보내세요.{" "}
              <strong style={{ color: BRAND.navy }}>티타이 함께 할게요.</strong>
            </p>
          </div>
        </section>

        {/* ── 2. 왜 만들었나 (mission) ──────────────────────────────────── */}
        <Section
          icon={Target}
          tag="우리 미션"
          title="45세 이상의 외로움을, 안전한 모임으로 풀어드립니다."
        >
          <p>
            한국은 OECD 국가 중 사회적 고립 정도가 가장 높습니다. 45세 이후엔
            관계가 줄고, 새 친구 만나기는 점점 어려워집니다.
          </p>
          <p>
            기존 모임 앱·소셜 앱은 너무 복잡하고, 사기 위험이 크고, 결국 데이팅
            중심입니다.{" "}
            <strong style={{ color: BRAND.ink }}>
              티타은 그 빈자리를 채우려고 만들어졌습니다.
            </strong>
          </p>
          <p className="pt-2">
            국립정신건강센터의 2021년 국가 정신건강조사(NMHSK)에 따르면, 한국
            성인 11.79%가 외로움을 느끼고 있습니다. 티타은 이 데이터와 같은
            척도(LSIS-6)로 사용자의 마음 건강 변화를 측정해, 정말로 의미있게
            연결되는지 함께 확인합니다.
          </p>
        </Section>

        {/* ── 3. 무엇을 만들었나 (product) ───────────────────────────────── */}
        <Section
          icon={Users}
          tag="우리가 만든 것"
          title="모임 중심의 45+ 안전 커뮤니티"
        >
          <p>티타은 다음 세 가지가 다릅니다:</p>
          <ul className="space-y-3 pl-1">
            <Bullet>
              <strong>모임 우선, 데이팅 아님.</strong> 같은 동네, 같은 관심사로
              모이는 작은 그룹이 중심입니다.
            </Bullet>
            <Bullet>
              <strong>45세 이상만.</strong> NICE 본인인증으로 신원이 확인된
              회원만 만납니다.
            </Bullet>
            <Bullet>
              <strong>AI가 위험을 자동 차단.</strong> 로맨스 스캠·보이스
              피싱·투자 사기 패턴을 실시간 감지합니다.
            </Bullet>
          </ul>
          <p className="pt-3 text-sm" style={{ color: BRAND.muted }}>
            자세한 기능은{" "}
            <Link
              href="/"
              className="underline"
              style={{ color: BRAND.navy }}
            >
              홈페이지
            </Link>
            에서, 데이터 처리는{" "}
            <Link
              href="/privacy"
              className="underline"
              style={{ color: BRAND.navy }}
            >
              개인정보 처리방침
            </Link>
            에서 확인하실 수 있어요.
          </p>
        </Section>

        {/* ── 4. 어떻게 안전한가 — 기술 + 특허 ───────────────────────────── */}
        <Section
          icon={ShieldCheck}
          tag="기술과 특허"
          title="4단계 안전 시스템 — 특허 출원 중"
        >
          <p>
            티타의 안전 시스템은 한 가지 기술에 의존하지 않습니다. 4개의 다른
            층이 동시에 작동합니다:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 my-4">
            <Tech
              num="1"
              title="NICE 본인인증"
              desc="실명+CI/DI 해시. 45세 이상만 통과. 한 번 차단된 사람은 영구 차단."
            />
            <Tech
              num="2"
              title="AI 위험 점수"
              desc="Vertex AI Gemini로 메시지 맥락을 분석. 사기 패턴 자동 감지·차단."
            />
            <Tech
              num="3"
              title="적응형 UI"
              desc="터치·반응속도를 학습해 시력·손떨림에 따라 글자·버튼이 자동 조정됨."
            />
            <Tech
              num="4"
              title="멤버 상호 보호"
              desc="모임 단위의 신뢰 그래프. 의심스러운 행동을 모임 내 다른 멤버가 자연 차단."
            />
          </div>
          <div
            className="rounded-2xl p-5 border-2 mt-6"
            style={{
              borderColor: BRAND.navy + "30",
              backgroundColor: BRAND.navy + "08",
            }}
          >
            <div className="flex items-start gap-3">
              <Award
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: BRAND.navy }}
              />
              <div>
                <p className="font-semibold mb-1" style={{ color: BRAND.ink }}>
                  특허 출원 PA260003 (우선심사 진행 중)
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: BRAND.muted }}
                >
                  4단계 안전 시스템 통합 특허. 추가 4건 특허 준비 중 — 45+
                  세대를 위한 디지털 안전 솔루션을 진지하게 보호하는 회사가 되겠습니다.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 5. 무엇으로 추천하나 — matching + LSIS-6 ─────────────────── */}
        <Section
          icon={Brain}
          tag="추천 알고리즘"
          title="성향과 동네로 진짜 잘 맞는 친구만"
        >
          <p>
            티타은 사용자의 답변과 행동을 분석해 비슷한 분들끼리 연결합니다.
          </p>
          <ul className="space-y-2.5 pl-1">
            <Bullet>
              <strong>관심사 일치</strong>: 등산·텃밭·글쓰기 등 동일 관심사
              가산점
            </Bullet>
            <Bullet>
              <strong>성향 매칭</strong>: 일일 질문 답변을 누적해 Big Five 성향
              + 한국 5060 문화 코드(정·눈치·흥) + 2026 트렌드(욜드·셀프케어)로
              종합
            </Bullet>
            <Bullet>
              <strong>안녕감 신호</strong>: NMHSK 표준 척도 LSIS-6 등으로 외로움
              ·사회 연결도를 정량 측정. 비슷한 마음 상태의 분들끼리 연결되면
              관계가 자연스럽습니다.
            </Bullet>
            <Bullet>
              <strong>동네 우선</strong>: 멀리 사는 사람보다 실제로 만날 수 있는
              동네 친구를 먼저 추천
            </Bullet>
          </ul>
          <p className="pt-3 text-sm" style={{ color: BRAND.muted }}>
            그리고 새로운 사람 만나는 게 부담스러우신 분도 환영합니다. 티타의
            글·모임 활동만 둘러보셔도 충분히 의미있게 사용하실 수 있어요.
          </p>
        </Section>

        {/* ── 6. 어디로 가나 — vision ──────────────────────────────────── */}
        <Section
          icon={Sparkles}
          tag="우리 비전"
          title="45세 이상이 인생 후반을 의미있게 보낼 수 있는 한국의 첫 디지털 동반자"
        >
          <p>
            티타은 단순한 모임 앱이 아닙니다. 우리는{" "}
            <strong style={{ color: BRAND.ink }}>
              한국 45+ 세대를 위한 첫 정량 측정형 사회 연결 플랫폼
            </strong>
            을 만들고 있습니다.
          </p>
          <p>다음 5년 안에:</p>
          <ul className="space-y-2.5 pl-1">
            <Bullet>
              한국 45+ 활동 세대(50-67세) 50만 명 이상이 일상적으로 사용
            </Bullet>
            <Bullet>
              서울시50플러스재단, 노인복지관 등 공공 기관과의 정식 협력
            </Bullet>
            <Bullet>
              한국 최초의 45+ 디지털 적응 곡선 종단 데이터셋 구축 (학술
              기여)
            </Bullet>
            <Bullet>
              해외 진출 — 일본, 대만 등 유사한 노년 사회 구조 국가
            </Bullet>
          </ul>
        </Section>

        {/* ── 7. 창업자 메시지 ──────────────────────────────────────────── */}
        <section
          className="rounded-3xl p-6 sm:p-10 mb-16"
          style={{
            background: `linear-gradient(135deg, ${BRAND.navy} 0%, ${BRAND.navyDeep} 100%)`,
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle
              className="w-5 h-5"
              style={{ color: BRAND.accent }}
            />
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: BRAND.accent }}
            >
              창업자의 인사
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            창립 멤버 500분께
          </h2>
          <div className="text-white/90 leading-relaxed space-y-4 text-base sm:text-lg">
            <p>
              첫 500회원분들께{" "}
              <strong className="text-white">
                프리미엄 멤버쉽을 6개월간 무료로 드립니다.
              </strong>
            </p>
            <p>
              창립 멤버이신 만큼, 모든 피드백을 직접 받겠습니다.{" "}
              <strong className="text-white">
                내 자식이 만들어준 앱이다 생각하시고
              </strong>{" "}
              고쳐줬으면 좋겠다, 얼마였으면 좋겠다, 이런 게 있었으면/없었으면
              좋겠다 — 무엇이든 알려주세요.
            </p>
            <p>
              여러분의 의견을 들으며 더 많은 분들이 편하게 쓰실 수 있는 앱으로
              키우겠습니다.
            </p>
            <p className="pt-2 text-white/80 text-sm sm:text-base">
              — 류한결, 티타 창업자 / ㈜이프이프 대표
            </p>
          </div>
        </section>

        {/* ── 8. CTA ───────────────────────────────────────────────────── */}
        <section className="text-center pb-8">
          <h3
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ color: BRAND.ink }}
          >
            지금 티타과 함께 시작하세요
          </h3>
          <p className="mb-8" style={{ color: BRAND.muted }}>
            창립 멤버 500명 한정 — 6개월 무료
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-transform hover:scale-105"
              style={{ backgroundColor: BRAND.navy, color: "white" }}
            >
              <Download className="w-4 h-4" />앱 다운로드
            </Link>
            <Link
              href="/business"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold border-2 transition-colors hover:bg-gray-50"
              style={{ borderColor: BRAND.navy, color: BRAND.navy }}
            >
              <Users className="w-4 h-4" />
              기관 협력 문의
            </Link>
          </div>
        </section>

        {/* ── Footer mini ──────────────────────────────────────────────── */}
        <footer
          className="pt-12 mt-12 border-t text-center text-xs"
          style={{ color: BRAND.muted }}
        >
          <p>
            ㈜이프이프 (EFFEFF Co., Ltd.) · 사업자등록 466-81-04205
          </p>
          <p className="mt-1">
            <Link
              href="/privacy"
              className="hover:underline"
              style={{ color: BRAND.navy }}
            >
              개인정보 처리방침
            </Link>
            {" · "}
            <Link
              href="/terms"
              className="hover:underline"
              style={{ color: BRAND.navy }}
            >
              이용약관
            </Link>
            {" · "}
            <a
              href="mailto:ceo@effeffcorp.com"
              className="hover:underline"
              style={{ color: BRAND.navy }}
            >
              연락처
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

// ─── Reusable section + bullet + tech card ────────────────────────────────

function Section({
  icon: Icon,
  tag,
  title,
  children,
}: {
  icon: typeof Sparkles;
  tag: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14 sm:mb-20">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" style={{ color: BRAND.navy }} />
        <span
          className="text-sm font-semibold tracking-wide"
          style={{ color: BRAND.navy }}
        >
          {tag}
        </span>
      </div>
      <h2
        className="text-2xl sm:text-3xl font-bold mb-5 leading-tight"
        style={{ color: BRAND.ink }}
      >
        {title}
      </h2>
      <div
        className="text-base sm:text-lg leading-relaxed space-y-3"
        style={{ color: BRAND.muted }}
      >
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <CheckCircle2
        className="w-5 h-5 mt-0.5 flex-shrink-0"
        style={{ color: BRAND.navy }}
      />
      <span style={{ color: BRAND.muted }}>{children}</span>
    </li>
  );
}

function Tech({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-4 bg-white">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: BRAND.navy, color: "white" }}
        >
          {num}
        </span>
        <h4 className="font-semibold" style={{ color: BRAND.ink }}>
          {title}
        </h4>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
        {desc}
      </p>
    </div>
  );
}
