/**
 * For Children — 50·60·70대 엄마를 둔 딸·아들을 겨냥한 랜딩.
 *
 * 포지셔닝(2026-07): "엄마도 소녀, 아빠도 소년" — 깎아내리지 않고 헌사하는 톤.
 * 부모 안엔 여전히 소녀·소년의 마음이 살아있고(가끔 웃을 때 그 표정이 스친다),
 * 백세 시대에 앞으로 가장 즐거울 30~40년이 남았다. 그 시간을 함께 설렐 또래
 * 친구는 지금부터 만드는 것. '심심/외로움' 같은 연민 프레임을 피하고, 자식도
 * 부모도 읽고 기분 좋게 시도하게. 구매자=딸·아들(인스타·카톡), 사용자=엄마·아빠.
 *
 * 도달 경로:
 *   - 인스타/카톡 광고(딸·아들 타겟) → 이 페이지
 *   - 시니어 브로슈어 QR("자녀와 함께 보세요")
 *
 * 목표(중요도 순):
 *   1. "만남앱 아님" 즉시 안심 (딸의 첫 걱정).
 *   2. 안전 스택을 비개발자 40대가 읽히게.
 *   3. "엄마 폰에 보내는" 구매 동선(카톡 공유).
 */
"use client";

import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  Lock,
  UserCheck,
  Sparkles,
  ArrowRight,
  Smartphone,
  Award,
  Coffee,
  ChevronRight,
} from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { TitaHeader } from "../_components/TitaHeader";
import { TitaFooter } from "../_components/TitaFooter";
import { logAnalyticsEvent } from "@/lib/firebase";

export default function ForChildrenPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: TITA.cream, fontFamily: KOREAN_FONT_STACK }}
    >
      <TitaHeader />

      {/* ── 1. Hero — 딥그린 밴드. "딸이 못 해주는 게 하나 있어요" ───────── */}
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
              엄마·아빠를 둔 딸·아들에게
            </span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-extrabold leading-tight mb-5"
            style={{ color: TITA.cream, letterSpacing: "-0.025em" }}
          >
            엄마 안엔 소녀의 마음,
            <br />
            아빠 안엔 소년의 마음.
          </h1>
          <p
            className="text-base sm:text-lg leading-relaxed mb-8"
            style={{ color: TITA.sage }}
          >
            엄마도 소녀였고, 아빠도 소년이었어요.
            <br />
            그리고 그 마음은, <strong style={{ color: TITA.cream }}>지금도 그대로예요.</strong>
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="/download"
              onClick={() =>
                logAnalyticsEvent("app_download_click", {
                  store: "auto",
                  source: "for_children_hero",
                })
              }
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 w-full sm:w-auto"
              style={{ backgroundColor: TITA.cream, color: TITA.forest }}
            >
              <Smartphone className="w-4 h-4" />
              부모님 폰에 보내기
            </a>
            <span className="text-[13px]" style={{ color: TITA.sage }}>
              카카오톡으로 공유 → 부모님이 직접 설치해요
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. 공감 — 여전히 살아있는 소녀·소년 + 남은 시간 ──────────────
          깎아내리는 말(늙음·무게·심심) 없이. 웃을 때 스치는 그 반짝임은
          여전히 살아있고, 앞으로 가장 즐거울 수십 년이 남았다는 긍정 밴드.
          딥그린을 이어받아 상단을 하나의 브랜드 존으로. */}
      <section style={{ backgroundColor: TITA.forestDeep }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6 py-14">
          <p
            className="text-center text-lg sm:text-xl leading-relaxed"
            style={{ color: TITA.cream }}
          >
            웃을 때, 문득 소녀가 보여요.
          </p>
          <p
            className="text-center text-lg sm:text-xl leading-relaxed mt-4"
            style={{ color: TITA.sage }}
          >
            엄마 안의 그 소녀는, <strong style={{ color: TITA.cream }}>여전히 살아 있어요.</strong>
          </p>

          <div
            className="mx-auto my-8 h-px w-16"
            style={{ backgroundColor: TITA.camel }}
          />

          <p
            className="text-center text-lg sm:text-xl leading-relaxed"
            style={{ color: TITA.cream }}
          >
            백세 시대, 엄마 아빠 앞엔
            <br />
            <strong>가장 즐거울 30년, 40년</strong>이 아직 남았어요.
          </p>
          <p
            className="text-center text-base sm:text-lg leading-relaxed mt-6"
            style={{ color: TITA.sage }}
          >
            그 시간을 더 설레게 채워줄 또래 친구는, <strong style={{ color: TITA.cream }}>지금부터.</strong>
          </p>
        </div>
      </section>

      <main className="max-w-2xl mx-auto px-5 sm:px-6">
        {/* ── 3. 딸의 첫 걱정 — 만남앱 아님 ───────────────────────── */}
        <Section icon={Heart} tag="딸이 가장 먼저 걱정하는 것" title="만남앱이 아니에요">
          <p className="mb-5" style={{ color: TITA.muted }}>
            제일 먼저 드는 걱정이죠. 티타는{" "}
            <strong style={{ color: TITA.ink }}>친구·모임 중심으로 설계된 앱</strong>
            이에요. 가입하면 기본이{" "}
            <strong style={{ color: TITA.ink }}>{"'친구만 원해요'"}</strong>로 시작해요.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <CompareCard
              ok={false}
              items={["좋아요·매칭 푸시", "1:1 데이트 추천", "외모 평가", "성별 필터"]}
            />
            <CompareCard
              ok={true}
              items={[
                "관심사 모임 (산책·책·텃밭)",
                "동네 또래 친구 찾기",
                "셋넷이 만나는 찻자리",
                "기본은 '친구만'",
              ]}
            />
          </div>
          <div
            className="rounded-xl p-4 mt-5"
            style={{ backgroundColor: TITA.surface, border: `1px solid ${TITA.sage}` }}
          >
            <p className="text-sm leading-relaxed" style={{ color: TITA.ink }}>
              <strong>만남앱은 아니에요. 하지만—</strong>
              <br />
              사별·이혼으로 혼자가 되신 부모님이 새로운 인연을 바라실 수도 있죠.
              티타는 <strong>같은 마음인 분들끼리만</strong> 이어드려요. 친구를 원하는
              분과 인연을 원하는 분이 <strong>섞이지 않게</strong>, 언제나 본인
              선택으로.
            </p>
          </div>
        </Section>

        {/* ── 4. 안심 — 안전 4계층 ───────────────────────────────── */}
        <Section icon={ShieldCheck} tag="안전 시스템" title="4계층으로 부모님을 지켜요">
          <p className="mb-5" style={{ color: TITA.muted }}>
            직접 개발한 안전 시스템. 보이스피싱·로맨스 스캠·투자 사기를 AI가
            24시간 살펴요.
          </p>
          <ul className="space-y-3">
            <SafetyLayer
              icon={UserCheck}
              title="① 본인인증"
              body="NICE 본인확인으로 신원을 검증해요. 검증된 또래만 가입 — 중복·재가입 원천 차단."
            />
            <SafetyLayer
              icon={Sparkles}
              title="② AI 위험 평가"
              body="대화 맥락(LLM)·키워드·행동 패턴을 종합해 위험 점수를 24시간 계산. 사기 메시지를 사전 탐지해요."
            />
            <SafetyLayer
              icon={Smartphone}
              title="③ 적응형 화면"
              body="부모님의 시력·손떨림에 맞춰 글자 크기·버튼 간격이 자동 조정. 같은 데이터로 도용 시도도 함께 차단."
            />
            <SafetyLayer
              icon={Lock}
              title="④ 단계적 대응"
              body="위험 점수가 오르면 경고 → 메시지 차단 → 계정 잠금 순으로 조치해요."
            />
          </ul>
          <div
            className="rounded-xl p-4 mt-5 flex items-start gap-3"
            style={{ backgroundColor: TITA.surface, border: `1px solid ${TITA.sage}` }}
          >
            <span
              className="text-[10px] font-extrabold px-1.5 py-0.5 rounded mt-0.5"
              style={{ backgroundColor: TITA.forest, color: "white", letterSpacing: "0.05em" }}
            >
              특허
            </span>
            <div>
              <p className="text-sm font-bold mb-0.5" style={{ color: TITA.ink }}>
                특허 출원 PA260003
              </p>
              <p className="text-xs leading-relaxed" style={{ color: TITA.muted }}>
                보안·접근성 통합 시스템(청구항 1~10), 하이브리드 매칭
                알고리즘(청구항 11~14). 변리사 검토를 거친 정식 출원이에요.
              </p>
            </div>
          </div>
        </Section>

        {/* ── 4-B. 만든 사람의 약속 — 창업자 육성(신뢰) ──────────────
            효녀·효자에게 "만든 사람도 제 부모 생각하며 만들었다"는 게 신뢰의
            쐐기. 사실인 것만: NICE 본인인증으로 신원이 묶여 재가입 불가. */}
        <section className="py-12 border-t" style={{ borderColor: TITA.sage }}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4" style={{ color: TITA.forest }} />
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: TITA.forest }}
            >
              만든 사람의 약속
            </span>
          </div>
          <div className="rounded-2xl p-6 sm:p-7" style={{ backgroundColor: TITA.forest }}>
            <p
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: TITA.cream }}
            >
              티타를 만든 저도, <strong>제 부모님을 생각하며</strong> 시작했어요. 내
              엄마 아빠가 쓰신다면 — 그 마음으로 안전을 설계했습니다.
            </p>
            <p
              className="text-sm sm:text-base leading-relaxed mt-4"
              style={{ color: TITA.sage }}
            >
              그래서 나쁜 마음을 먹은 사람은 끝까지 걸러내요. 그리고 한 번 걸러진
              사람은,{" "}
              <strong style={{ color: TITA.cream }}>
                본인인증(NICE)으로 신원이 묶여 다시는 들어오지 못합니다.
              </strong>{" "}
              이름만 바꿔 재가입하는 게 불가능하거든요.
            </p>
            <p
              className="text-sm sm:text-base leading-relaxed mt-4"
              style={{ color: TITA.sage }}
            >
              부모님이 안심하고 지내실 수 있게, 제가 계속 지킬게요.
            </p>
            <p className="text-sm font-semibold mt-5" style={{ color: TITA.camel }}>
              — 티타를 만든 사람, 유한결 드림
            </p>
          </div>
        </section>

        {/* ── 5. 구매 동선 — 부모님 폰에 보내는 법 ─────────────────── */}
        <Section icon={Coffee} tag="이렇게 시작해요" title="부모님 폰에 보내는 법">
          <ol className="space-y-3 mt-1">
            <Step n="1" title="카카오톡으로 링크 보내기">
              아래 버튼을 눌러 부모님께 앱 링크를 보내요.
            </Step>
            <Step n="2" title='"엄마, 이거 재밌겠다. 친구도 사귀고"'>
              딸의 한마디가 가장 큰 시작이에요.
            </Step>
            <Step n="3" title="부모님이 직접 본인인증 후 시작">
              30초 본인인증이면 준비 끝. 곁에서 한 번만 도와드리면 돼요.
            </Step>
          </ol>
          <div className="mt-5">
            <a
              href="/download"
              onClick={() =>
                logAnalyticsEvent("app_download_click", {
                  store: "auto",
                  source: "for_children_howto",
                })
              }
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105"
              style={{ backgroundColor: TITA.forest, color: "white" }}
            >
              부모님 폰에 보내기 <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Section>

        {/* ── 6. FAQ ─────────────────────────────────────────────── */}
        <Section tag="자녀분이 자주 묻는 질문" title="궁금한 점">
          <div className="space-y-2.5 mt-1">
            <FAQ
              q="비용이 드나요?"
              a="가입·친구 매칭·모임·채팅은 모두 무료예요. 광고도 없고요. 티타 플러스(월 19,900원, 30일 무료 체험)는 메시지를 한도 없이 쓰고 매칭 인사이트를 더 깊이 보는 선택 기능이에요."
            />
            <FAQ
              q="부모님이 디지털을 어려워하시는데…"
              a="부모님의 시력·손떨림에 맞춰 화면이 자동으로 조정돼요. 글자 크기·버튼 간격이 사용자에 맞게 변하고, 음성으로도 인사를 보낼 수 있어요."
            />
            <FAQ
              q="자녀도 가입해야 하나요?"
              a="아니요. 티타는 엄마가 직접 쓰는 앱이에요. 자녀는 가입하지 않아도 되고, 안전장치는 앱 안에 모두 내장돼 있어요."
            />
            <FAQ
              q="자녀가 부모님 대화를 볼 수 있나요?"
              a="아니요. 부모님의 대화는 부모님만의 것이에요. 프라이버시는 철저히 보호돼요."
            />
            <FAQ
              q="누가 만들었나요?"
              a={
                <>
                  주식회사 이프이프(EFFEFF Co., Ltd.) · 사업자번호 466-81-04205.
                  대표 유한결이 직접 개발했어요. 관련 기술은 14개 청구항 특허
                  출원 완료(PA260003).{" "}
                  <Link href="/" className="underline" style={{ color: TITA.forest }}>
                    홈페이지
                  </Link>
                  에서 더 볼 수 있어요.
                </>
              }
            />
          </div>
        </Section>
      </main>

      {/* ── 7. Final CTA — 딥그린 ──────────────────────────────── */}
      <section className="text-center mt-4" style={{ backgroundColor: TITA.forest }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6 py-16">
          <h2
            className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4"
            style={{ color: TITA.cream, letterSpacing: "-0.02em" }}
          >
            엄마 안의 소녀가,
            <br />
            마음껏 웃을 수 있게.
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: TITA.sage }}>
            딸의 한마디가, 그 시작이 돼요.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href="/download"
              onClick={() =>
                logAnalyticsEvent("app_download_click", {
                  store: "auto",
                  source: "for_children_cta",
                })
              }
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-transform hover:scale-105 w-full sm:w-auto"
              style={{ backgroundColor: TITA.cream, color: TITA.forest }}
            >
              <Smartphone className="w-4 h-4" />
              부모님 폰에 보내기
            </a>
            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-[13px] font-semibold transition-colors hover:opacity-80"
              style={{ color: TITA.cream, border: "1px solid rgba(251, 247, 240, 0.5)" }}
            >
              궁금한 점 문의하기 <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <TitaFooter />
    </div>
  );
}

/* ── Subcomponents ─────────────────────────────────────────────────────── */

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

function CompareCard({ ok, items }: { ok: boolean; items: string[] }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: ok ? TITA.surface : TITA.white,
        border: `1px solid ${ok ? TITA.forest : TITA.sage}`,
      }}
    >
      <p
        className="text-xs font-extrabold mb-2.5 tracking-wide"
        style={{ color: ok ? TITA.forest : TITA.mutedSoft }}
      >
        {ok ? "✓ 티타" : "✗ 일반 SNS"}
      </p>
      <ul className="space-y-1.5 text-sm" style={{ color: ok ? TITA.ink : TITA.muted }}>
        {items.map((item) => (
          <li key={item}>· {item}</li>
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
      className="rounded-xl p-4 flex items-start gap-3.5"
      style={{ backgroundColor: TITA.white, border: `1px solid ${TITA.sage}` }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
        style={{ backgroundColor: TITA.surface }}
      >
        <Icon className="h-4 w-4" style={{ color: TITA.forest }} />
      </div>
      <div>
        <p className="text-[15px] font-bold mb-0.5" style={{ color: TITA.ink }}>
          {title}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: TITA.muted }}>
          {body}
        </p>
      </div>
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

function FAQ({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <details
      className="rounded-xl p-4 group"
      style={{ backgroundColor: TITA.white, border: `1px solid ${TITA.sage}` }}
    >
      <summary
        className="text-[15px] font-bold cursor-pointer list-none flex items-center justify-between"
        style={{ color: TITA.ink }}
      >
        <span>{q}</span>
        <ChevronRight
          className="h-4 w-4 group-open:rotate-90 transition-transform flex-shrink-0 ml-3"
          style={{ color: TITA.muted }}
        />
      </summary>
      <p className="text-sm leading-relaxed mt-3" style={{ color: TITA.muted }}>
        {a}
      </p>
    </details>
  );
}
