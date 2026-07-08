"use client";

// /matching — "결이 맞는다는 걸 어떻게 정량화하나" 상세 설명 페이지.
//
// 대상: 투자자 + 더 자세히 알고 싶은 사용자. 홈의 짧은 설득 섹션(1-B)의
// "더 자세히" 목적지. 원칙:
//  - 방법론의 엄밀함은 보이되, 영업비밀(정확한 가중치·임계값 상수)은 안 쓴다.
//  - 성사 보장 문구 금지(환불 레드라인). 진단·치료 뉘앙스 금지.
//  - 초기 표본이 적다는 걸 정직하게 — "완성된 알고리즘이 아니라 쌓일수록
//    정확해지는 구조"가 오히려 설득 포인트.

import Link from "next/link";
import { Sparkles, Users, RefreshCw, ShieldCheck, TrendingUp } from "lucide-react";
import { TITA, KOREAN_FONT_STACK, APP_STORE_URL, PLAY_STORE_URL } from "../_components/tita-brand";
import { TitaHeader } from "../_components/TitaHeader";
import { TitaFooter } from "../_components/TitaFooter";
import { logAnalyticsEvent } from "@/lib/firebase";

export default function MatchingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: TITA.cream, fontFamily: KOREAN_FONT_STACK }}>
      <TitaHeader />

      <main className="max-w-2xl mx-auto px-5 sm:px-6">
        {/* Hero */}
        <section className="pt-14 sm:pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: TITA.camel }} />
            <span className="text-xs font-semibold tracking-wide" style={{ color: TITA.forest }}>
              결 매칭 방법론
            </span>
          </div>
          <h1
            className="text-2xl sm:text-4xl font-extrabold leading-tight mb-4"
            style={{ color: TITA.ink, letterSpacing: "-0.025em" }}
          >
            &lsquo;결이 맞는다&rsquo;는 걸,
            <br />
            우리는 이렇게 정량화합니다
          </h1>
          <p className="text-base leading-relaxed" style={{ color: TITA.muted }}>
            감이 아니라, 매일 쌓인 선택의 데이터로.
            <br className="hidden sm:block" />
            투자자와 더 궁금한 분들을 위한 자세한 이야기예요.
          </p>
        </section>

        {/* 1. 결 = 벡터 */}
        <Block icon={Sparkles} tag="개념" title="결은 형용사가 아니라, 좌표예요">
          <p className="mb-3">
            &lsquo;성격이 잘 맞는다&rsquo;는 말은 보통 감입니다. 티타는 그 감을 <b style={{ color: TITA.ink }}>좌표</b>로 바꿔요.
          </p>
          <p className="mb-3">
            매일 하나씩 던지는 가벼운 질문(<b style={{ color: TITA.ink }}>결큐</b>)에 답할 때마다,
            당신의 성향이 하나의 <b style={{ color: TITA.ink }}>벡터</b>로 그려집니다. 한 번 쓰고 마는
            자기소개가 아니라, <b style={{ color: TITA.ink }}>매일의 선택이 쌓여</b> 만들어지는 좌표라
            답할수록 또렷해져요.
          </p>
          <Callout>
            무엇을 좋아한다고 <b>적는 것</b>보다, 매일 무엇을 <b>고르는지</b>가 사람을 더 정확히
            말해줍니다. 그래서 프로필이 아니라 행동을 봅니다.
          </Callout>
        </Block>

        {/* 2. 두 사람 적합도 */}
        <Block icon={Users} tag="두 사람" title="적합도는 하나의 점수로 나와요">
          <p className="mb-3">
            두 사람의 결 적합도는 <b style={{ color: TITA.ink }}>두 가지 신호</b>를 합쳐 0에서 1 사이
            점수 하나로 계산됩니다.
          </p>
          <div
            className="rounded-xl p-4 my-4 text-center"
            style={{ backgroundColor: TITA.surface, border: `1px solid ${TITA.sage}` }}
          >
            <p className="text-sm font-semibold" style={{ color: TITA.forestDeep }}>
              결 적합도 &nbsp;=&nbsp; 결의 유사도 &nbsp;+&nbsp; 관심사의 겹침
            </p>
            <p className="text-xs mt-2" style={{ color: TITA.muted }}>
              (데이터가 적은 초기엔 &lsquo;결의 유사도&rsquo;를 더 크게, 답이 쌓일수록 균형을 자동 조정)
            </p>
          </div>
          <ul className="space-y-2.5">
            <Bullet>
              <b style={{ color: TITA.ink }}>결의 유사도</b> — 두 사람이 그동안 고른 답이 얼마나 비슷한
              방향인지. &ldquo;말이 통하는&rdquo; 그 느낌의 수치 버전이에요.
            </Bullet>
            <Bullet>
              <b style={{ color: TITA.ink }}>관심사의 겹침</b> — 여행·산책·요리처럼 실제로 함께할 거리가
              얼마나 겹치는지.
            </Bullet>
          </ul>
          <p className="mt-3 text-xs" style={{ color: TITA.muted }}>
            신규 회원은 데이터가 적어 &lsquo;결의 유사도&rsquo;에 더 기대고, 답이 쌓이면 관심사 신호를
            함께 반영합니다. 새로 온 사람도 0점이 되지 않게 하는 장치예요.
          </p>
        </Block>

        {/* 3. 그룹 조립 */}
        <Block icon={Users} tag="찻자리" title="3~4명 자리는, 평균이 아니라 &lsquo;가장 약한 고리&rsquo;로">
          <p className="mb-3">
            결모임(찻자리)은 두 명이 아니라 여럿이 모여요. 이때 <b style={{ color: TITA.ink }}>평균</b>이
            높은 조합을 고르면 &lsquo;셋은 친한데 한 명만 겉도는 자리&rsquo;가 생깁니다.
          </p>
          <p className="mb-3">
            그래서 티타는 조합 안에서 <b style={{ color: TITA.ink }}>가장 안 맞는 두 사람의 점수</b>가
            가장 높아지도록 자리를 짭니다. 누구 하나 소외되지 않는 자리를 만드는 방식이에요.
          </p>
          <Callout>
            여기에 <b>서로가 서로를 상위로 여기는지</b>(한쪽만 좋아하는 자리 방지)와, 본인인증·안전
            조건 같은 <b>양보 불가 기준</b>을 먼저 통과한 사람들만 후보가 됩니다.
          </Callout>
        </Block>

        {/* 4. 검증 폐루프 */}
        <Block icon={RefreshCw} tag="검증" title="&lsquo;진짜 맞았는지&rsquo;는 결과로 확인해요">
          <p className="mb-3">
            점수를 내는 데서 멈추지 않습니다. 모든 자리 제안에 <b style={{ color: TITA.ink }}>예측
            점수를 기록</b>해두고, 그 자리가 실제로 어떻게 됐는지를 추적해요.
          </p>
          <div className="my-4 flex flex-col gap-2">
            <LoopStep n="예측">이 조합의 결 점수는 이만큼</LoopStep>
            <LoopStep n="관찰">초대를 수락했나 → 방이 됐나 → <b>7일 뒤에도 대화가 살아있나</b></LoopStep>
            <LoopStep n="보정">예측이 잘 맞았다면 기준 유지, 어긋났다면 조정</LoopStep>
          </div>
          <p className="text-sm" style={{ color: TITA.muted }}>
            <b style={{ color: TITA.ink }}>예측하고, 재고, 보정한다</b> — 이 되먹임이 매칭의 핵심이에요.
            &lsquo;7일 뒤에도 대화가 살아있는 자리의 비율&rsquo;을 가장 중요한 지표로 봅니다.
          </p>
        </Block>

        {/* 5. 정직 + 해자 */}
        <Block icon={TrendingUp} tag="왜 쌓일수록 정확한가" title="쓸수록 정확해지는 구조">
          <p className="mb-3">
            솔직히 지금은 초기라, 통계적 상관을 말하기엔 표본이 쌓이는 중입니다. 그래서 저희가 파는
            건 &lsquo;이미 완벽한 알고리즘&rsquo;이 아니라 <b style={{ color: TITA.ink }}>답이 쌓일수록,
            사람이 쌓일수록 정확해지는 구조</b>예요.
          </p>
          <p>
            수식은 누구나 베낄 수 있지만, <b style={{ color: TITA.ink }}>매일의 선택이 쌓인 데이터는
            시간으로만 만들어집니다.</b> 오래 함께한 회원일수록 더 잘 맞는 사람을 만나는 이유예요.
          </p>
        </Block>

        {/* 6. 안전 */}
        <Block icon={ShieldCheck} tag="안전" title="매칭과 안전은 한 몸입니다">
          <p>
            결이 맞아도 안전하지 않으면 의미가 없죠. 본인인증과 <b style={{ color: TITA.ink }}>4단계 안전
            시스템</b>(특허 출원 중)이 매칭과 <b style={{ color: TITA.ink }}>같은 데이터 흐름</b> 안에서
            돌아갑니다. 위험 신호가 감지되면 추천과 자리 구성에 곧바로 반영돼요.
          </p>
        </Block>

        {/* CTA */}
        <section className="py-12 border-t text-center" style={{ borderColor: TITA.sage }}>
          <p className="text-lg font-bold mb-1" style={{ color: TITA.ink }}>
            내 결은 어떤 좌표일까요?
          </p>
          <p className="text-sm mb-6" style={{ color: TITA.muted }}>
            가입 없이 3분이면, 나와 결이 맞는 친구 유형까지 나와요.
          </p>
          <Link
            href="/gyeol"
            onClick={() => logAnalyticsEvent("gyeol_entry_click", { source: "matching_page" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-transform hover:scale-105"
            style={{ backgroundColor: TITA.forest, color: "white" }}
          >
            🍵 3분, 내 결 유형 알아보기 <span aria-hidden>→</span>
          </Link>
          <div className="mt-5 flex items-center justify-center gap-4 text-xs" style={{ color: TITA.muted }}>
            <a
              href={APP_STORE_URL}
              onClick={() => logAnalyticsEvent("app_download_click", { store: "ios", source: "matching_page" })}
              className="underline underline-offset-4"
            >
              App Store
            </a>
            <a
              href={PLAY_STORE_URL}
              onClick={() => logAnalyticsEvent("app_download_click", { store: "android", source: "matching_page" })}
              className="underline underline-offset-4"
            >
              Google Play
            </a>
          </div>
        </section>
      </main>

      <TitaFooter />
    </div>
  );
}

function Block({
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
    <section className="py-11 border-t" style={{ borderColor: TITA.sage }}>
      <div className="flex items-center gap-2 mb-2.5">
        {Icon && <Icon className="w-4 h-4" style={{ color: TITA.forest }} />}
        <span className="text-xs font-semibold tracking-wide" style={{ color: TITA.forest }}>
          {tag}
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-snug" style={{ color: TITA.ink, letterSpacing: "-0.015em" }}>
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
      <span className="inline-block w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: TITA.forest }} />
      <span style={{ color: TITA.muted }}>{children}</span>
    </li>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3.5 mt-3" style={{ backgroundColor: TITA.surface, border: `1px solid ${TITA.sage}` }}>
      <p className="text-sm leading-relaxed" style={{ color: TITA.ink }}>
        {children}
      </p>
    </div>
  );
}

function LoopStep({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-flex items-center justify-center rounded-lg text-xs font-bold px-2.5 py-1.5 flex-shrink-0"
        style={{ backgroundColor: TITA.forest, color: "white", minWidth: 52 }}
      >
        {n}
      </span>
      <span className="text-sm" style={{ color: TITA.muted }}>
        {children}
      </span>
    </div>
  );
}
