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
  Sparkles,
  Lock,
  Coffee,
} from "lucide-react";
import {
  TITA,
  KOREAN_FONT_STACK,
} from "./_components/tita-brand";
import { TitaHeader } from "./_components/TitaHeader";
import { TitaFooter } from "./_components/TitaFooter";
import { PersonaStories } from "./_components/PersonaStories";
import { AppPreview } from "./_components/AppPreview";
import { PeopleWall } from "./_components/PeopleWall";
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

      {/* ── 1. Hero — 딥그린 풀블리드 밴드 ─────────────────────────
          첫인상을 브랜드 컬러(딥그린)로. 상단은 가볍게: 스토어 버튼 2개 →
          /download 한 버튼(기기 감지). 가격은 페이지 하단으로. 무가입 결
          테스트를 CTA 아래 배치. 텍스트는 크림/세이지, 버튼은 크림 반전. */}
      <section className="text-center" style={{ backgroundColor: TITA.forest }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-16">
          <div className="inline-flex items-center gap-2 mb-5">
            <Heart
              className="w-4 h-4"
              style={{ color: TITA.camel }}
              strokeWidth={2.5}
              fill={TITA.camel}
            />
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: TITA.camel }}
            >
              오후 한 잔의 안심 티타임
            </span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5"
            style={{ color: TITA.cream, letterSpacing: "-0.025em" }}
          >
            결이 맞는 친구를
            <br />
            천천히 만나요.
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed mb-8"
            style={{ color: TITA.sage }}
          >
            45세 이상, 검증된 또래끼리 친구가 되는 앱.
            <br />
            본인인증·AI 안전망으로 지켜드려요.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="/download/"
              onClick={() =>
                logAnalyticsEvent("app_download_click", {
                  store: "auto",
                  source: "home_hero",
                })
              }
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 w-full sm:w-auto"
              style={{ backgroundColor: TITA.cream, color: TITA.forest }}
            >
              <Download className="w-4 h-4" />
              앱 무료로 받기
            </a>
            {/* 무가입 훅 — 다운로드가 부담스러운 방문자에게 먼저 가치를 주는
                결 유형 테스트 진입. 차가운 방문자의 이탈을 잡는 낮은 문턱. */}
            {/* 2차 CTA — 메인(앱 받기)보다 얇고 작은 라인 보더 버튼. */}
            <Link
              href="/gyeol"
              onClick={() =>
                logAnalyticsEvent("gyeol_entry_click", { source: "home_hero" })
              }
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[13px] font-semibold transition-colors hover:opacity-80"
              style={{
                color: TITA.cream,
                border: "1px solid rgba(251, 247, 240, 0.5)",
              }}
            >
              가입 없이 3분, 내 결 유형 알아보기
              <span aria-hidden>→</span>
            </Link>
            {/* 실태형 훅 — "친구 찾는 중"인 사람만 걸리는 결큐와 달리, 모두가
                해당되는 질문(빈 시간)으로 그물을 넓힌다 → /needs 1분 설문. */}
            <Link
              href="/needs"
              onClick={() =>
                logAnalyticsEvent("needs_entry_click", { source: "home_hero" })
              }
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[13px] font-semibold transition-colors hover:opacity-80"
              style={{
                color: TITA.cream,
                border: "1px solid rgba(251, 247, 240, 0.5)",
              }}
            >
              부쩍 많아진 빈 시간, 어떻게 채우고 계세요? — 1분
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 1-A. 페르소나 스토리 ──────────────────────────────────
          히어로 다음, "혹시 내 얘기 같으세요?" 공감 구간. 1.5초마다
          찰칵 스냅으로 넘어가고, 가운데 카드만 크게, 스와이프 가능
          (PersonaStories 클라이언트 컴포넌트). 딥그린을 이어받아 상단을
          하나의 브랜드 존으로, 카드는 크림으로 띄운다. */}
      <section
        className="pt-4 pb-12 sm:pb-14"
        style={{ backgroundColor: TITA.forest }}
        aria-label="이런 마음, 혹시 익숙하세요"
      >
        <p
          className="text-center text-xs font-semibold tracking-wide mb-6"
          style={{ color: TITA.camel }}
        >
          혹시, 내 이야기 같으세요?
        </p>
        <PersonaStories />
      </section>

      {/* ── 앱 화면 미리보기 (결Q · 티타임 · 결친구) ─────────────── */}
      <AppPreview />

      {/* ── 이런 분들을 만나요 (또래 예시 프로필 벽) ─────────────── */}
      <PeopleWall />

      <main className="max-w-2xl mx-auto px-5 sm:px-6">
        {/* ── 1-B. 왜 티타 — 결을 어떻게 알아보나 (설득 핵심) ──
            대비(vs)가 아니라 우리 방식만 따뜻하게 설명. "결 맞는 친구를
            찾아준다"를 감이 아니라 '매일의 선택이 쌓여 그린 결'로 설득. */}
        <Section icon={Coffee} tag="왜 티타일까요" title="'결이 맞는다'는 걸, 이렇게 알아봐요">
          <p className="mb-5" style={{ color: TITA.muted }}>
            말이 잘 통하는 사람 있잖아요. 대화가 안 끊기고, 이상하게 편한 사람.
            <br className="hidden sm:block" />
            그게 <strong style={{ color: TITA.ink }}>결</strong>이에요. 티타는 그 결을
            감이 아니라, 당신이 매일 답한 <strong style={{ color: TITA.ink }}>선택들</strong>로
            알아봐요.
          </p>
          <ol className="space-y-3">
            <Step n="1" title="매일, 가벼운 한 질문">
              오늘 하나만 골라요. 답이 하나둘 쌓일수록 당신의 결이 또렷해져요.
            </Step>
            <Step n="2" title="자기소개보다 정확한 '결'">
              무엇을 좋아한다고 적는 것보다, 매일 무엇을 고르는지가 당신을 더
              정확히 말해주거든요.
            </Step>
            <Step n="3" title="결이 통하는 사람과 찻자리">
              수백 갈래의 결을 견주어, 겹치는 결이 많은 분부터. 감이 아니라
              당신의 답이 그 사람을 데려와요.
            </Step>
          </ol>
          <div
            className="rounded-xl p-4 mt-5"
            style={{ backgroundColor: TITA.surface, border: `1px solid ${TITA.sage}` }}
          >
            <p className="text-sm leading-relaxed" style={{ color: TITA.ink }}>
              그래서 티타는 <strong>쓸수록 정확해져요.</strong> 오래 함께한 사람일수록,
              결이 더 잘 통하는 친구를 만나요.
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/matching"
              onClick={() => logAnalyticsEvent("matching_detail_click", { source: "home" })}
              className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline"
              style={{ color: TITA.forest }}
            >
              결을 어떻게 정량화하는지 더 자세히 <span aria-hidden>→</span>
            </Link>
          </div>
        </Section>

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

        {/* ── 이런 분들께 (페르소나) ─────────────────────────── */}
        <Section icon={Users} tag="이런 분들께" title="이런 분이라면, 티타가 반가울 거예요">
          <div>
            {[
              {
                icon: Coffee,
                title: "바쁘게 사느라, 나를 못 챙겼던 분",
                body: "일에, 가족에 쫓기다 보면 내 시간은 늘 뒤로 밀리죠.",
              },
              {
                icon: Heart,
                title: "아이 키우며 쉼 없이 달려온 분",
                body: "'나'로 지낸 시간이 오래됐다면 — 다시, 나로 만나는 자리.",
              },
              {
                icon: Sparkles,
                title: "이제 새로운 걸 해보고 싶은 분",
                body: "안 가본 곳, 안 해본 것. 혼자라 미뤄뒀다면 결이 맞는 또래와.",
              },
              {
                icon: Users,
                title: "결이 맞는 새 친구가 반가운 분",
                body: "특별한 이유는 없어도 좋아요. 마음 편한 사이, 낮에 가볍게.",
              },
            ].map(({ icon: Icon, title, body }, i, arr) => (
              <div
                key={title}
                className="flex items-center gap-3.5 py-4"
                style={
                  i < arr.length - 1
                    ? { borderBottom: `1px solid ${TITA.sage}` }
                    : undefined
                }
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: TITA.sage }}
                >
                  <Icon className="w-4 h-4" style={{ color: TITA.forest }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-0.5" style={{ color: TITA.forestDeep }}>
                    {title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: TITA.muted }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-6" style={{ color: TITA.ink }}>
            <strong style={{ color: TITA.forest }}>결이 맞으면, 그걸로 충분해요.</strong>
          </p>
        </Section>

        {/* ── 5. 가격 — 페이지 하단으로 이동. 가치(왜 티타·안전·페르소나)를
            먼저 보여준 뒤, 결정 단계에서만 가격을 노출한다. 첫 화면에
            ₩19,900이 보이면 차가운 방문자가 이탈하던 문제를 막기 위함. ─── */}
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
              perks={[
                "메시지 한도 없이",
                "AI 매칭 깊은 이유까지",
                "언제든 해지",
              ]}
              highlight
            />
          </div>
          <p
            className="text-xs mt-4 text-center"
            style={{ color: TITA.muted }}
          >
            창립 멤버 500분께 <strong>플러스 6개월 무료</strong>
          </p>

          {/* WHY plus — 한 표 + 4 frame 압축.
              상세 비교는 /subscribe 에서 본격. 여기는 *결정의 씨앗*만. */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: Sparkles,
                title: "왜 맞는지 이유까지",
                body: "무료엔 \"결이 통해요\" 한 줄. 플러스엔 깊은 이유.",
              },
              {
                icon: Lock,
                title: "결친구와 끝까지 대화",
                body: "무료는 월 한도. 플러스는 깊어질 때까지 자유롭게.",
              },
              {
                icon: Coffee,
                title: "카페 4잔 한 달",
                body: "동호회 회비 대신 19,900원으로 결이 통하는 친구.",
              },
              {
                icon: Heart,
                title: "광고 안 받습니다",
                body: "솔로 파운더의 작은 모델. 사용자가 진짜 고객.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl p-4 flex items-start gap-3"
                style={{ background: TITA.white, border: `1px solid ${TITA.sage}` }}
              >
                <div
                  className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: TITA.sage }}
                >
                  <Icon className="w-4 h-4" style={{ color: TITA.forest }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-1" style={{ color: TITA.forestDeep }}>
                    {title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: TITA.muted }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs mt-4">
            <Link
              href="/subscribe"
              className="underline hover:no-underline"
              style={{ color: TITA.forest }}
            >
              플러스 자세히 보기 →
            </Link>
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
            href="/download/"
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
