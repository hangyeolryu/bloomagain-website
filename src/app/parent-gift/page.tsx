/**
 * Parent Gift — 자녀 → 부모 6개월 무료 창립회원 선물 펀넬.
 *
 * Reached from:
 *   - Instagram ads (auto-detected: 30-40대 여성 자녀 타깃)
 *   - 인스타 카드뉴스 6장 시리즈의 CTA QR 코드
 *   - 카카오톡 공유 by 자녀 → 부모님
 *
 * Goals (in order):
 *   1. "선물" framing — 가입 = 자녀가 부모님께 보내는 따뜻한 행위
 *   2. urgency — 창립회원 N/500 카운터, "마감 후 일반가" 안내
 *   3. one-tap action — App Store / Play Store 큰 버튼 + QR 코드
 *   4. "어떻게 부모님께?" 3단계 가이드 — 다운로드 → QR 공유 → 가입 도와드리기
 *
 * AI 톤은 빼고 결 어휘로 통일 (2026-06-30 store_listing 톤 결정).
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  Gift,
  Sparkle,
  Lock,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  QrCode,
  ShieldCheck,
} from "lucide-react";

import { TitaHeader } from "../_components/TitaHeader";
import { TitaFooter } from "../_components/TitaFooter";
import {
  TITA,
  KOREAN_FONT_STACK,
  APP_STORE_URL,
  PLAY_STORE_URL,
} from "../_components/tita-brand";

export const metadata: Metadata = {
  title: "어머니께 6개월 무료를 선물하세요 — 티타 창립회원",
  description:
    "결이 통하는 평생 친구들. 창립회원 500명 한정 · 6개월 무료 · 평생 가격 잠금. 만 45세 이상 본인인증, 친구 우선 (의도는 본인이 선택).",
};

export default function ParentGiftPage() {
  return (
    <div
      style={{
        background: TITA.cream,
        color: TITA.ink,
        fontFamily: KOREAN_FONT_STACK,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TitaHeader />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "64px 24px 48px",
          maxWidth: 880,
          margin: "0 auto",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: TITA.sage,
            color: TITA.forest,
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-0.2px",
            marginBottom: 24,
          }}
        >
          <Gift size={16} aria-hidden />
          창립회원 500명 한정 · 6개월 무료
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 900,
            color: TITA.forestDeep,
            letterSpacing: "-1.5px",
            lineHeight: 1.15,
            margin: "0 0 20px",
          }}
        >
          어머니께
          <br />
          6개월 무료를 선물하세요
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2.2vw, 19px)",
            color: TITA.muted,
            lineHeight: 1.6,
            margin: "0 auto 32px",
            maxWidth: 540,
            fontWeight: 500,
          }}
        >
          결이 통하는 평생 친구들.
          <br />
          만 45세 이상 본인인증된 분만 모이는 안전한 공간이에요.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <Link
            href={APP_STORE_URL}
            style={ctaPrimaryStyle}
            aria-label="앱스토어에서 티타 다운로드"
          >
            앱스토어에서 받기
            <ArrowRight size={18} aria-hidden />
          </Link>
          <Link
            href={PLAY_STORE_URL}
            style={ctaSecondaryStyle}
            aria-label="구글 플레이에서 티타 다운로드"
          >
            구글 플레이에서 받기
            <ArrowRight size={18} aria-hidden />
          </Link>
        </div>

        <p
          style={{
            fontSize: 13,
            color: TITA.mutedSoft,
            margin: 0,
            fontWeight: 500,
          }}
        >
          만 45세 이상 · NICE 본인인증 · 친구 우선 · 의도는 본인 선택
        </p>
      </section>

      {/* ── 빈 둥지 hook ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: TITA.sage,
          padding: "56px 24px",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 3.5vw, 34px)",
              fontWeight: 800,
              color: TITA.forestDeep,
              letterSpacing: "-0.8px",
              lineHeight: 1.3,
              margin: "0 0 20px",
              textAlign: "center",
            }}
          >
            엄마 카톡에 &quot;심심해&quot; 한 마디,
            <br />
            외롭다는 신호래요.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: TITA.forest,
              lineHeight: 1.7,
              margin: "0 auto",
              maxWidth: 580,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            자녀 키우고 은퇴한 시기. 친구 모임이 자연스럽게 줄어들고,
            새로운 친구를 만들 곳은 마땅치 않아요. 데이팅 앱은 부담스럽고,
            동호회는 가기 어렵고. 그래서 만들었어요.
          </p>
        </div>
      </section>

      {/* ── 티타 소개 ────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "64px 24px",
          maxWidth: 880,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 900,
              color: TITA.forestDeep,
              letterSpacing: "-1px",
              lineHeight: 1.2,
              margin: "0 0 12px",
            }}
          >
            티타. 결이 통하는 친구들.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: TITA.muted,
              lineHeight: 1.6,
              margin: 0,
              fontWeight: 500,
            }}
          >
            매일 한 질문에 답할수록, 잘 맞는 친구를 알려드려요.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              icon: <Sparkle size={28} aria-hidden />,
              title: "결큐",
              body: "하루 한 질문이 결을 알려줘요. 답할수록 더 정확히 찾아드려요.",
            },
            {
              icon: <CheckCircle2 size={28} aria-hidden />,
              title: "결 적합도",
              body: "한 줄 소개로 \"왜 우리가 맞을까\"를 알려드려요.",
            },
            {
              icon: <ShieldCheck size={28} aria-hidden />,
              title: "안전이 먼저",
              body: "NICE 본인인증, 사기 패턴 먼저 감지 (특허 출원 중).",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: TITA.white,
                border: `1px solid ${TITA.sage}`,
                borderRadius: 20,
                padding: 24,
              }}
            >
              <div style={{ color: TITA.forest, marginBottom: 12 }}>
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: TITA.forestDeep,
                  letterSpacing: "-0.4px",
                  margin: "0 0 8px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: TITA.muted,
                  lineHeight: 1.55,
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 창립회원 혜택 ──────────────────────────────────────────────── */}
      <section
        style={{
          background: TITA.sage,
          padding: "64px 24px",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 14px",
              background: TITA.camel,
              color: TITA.forestDeep,
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.5px",
              marginBottom: 20,
              textTransform: "uppercase",
            }}
          >
            창립회원 한정
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 900,
              color: TITA.forestDeep,
              letterSpacing: "-1.2px",
              lineHeight: 1.2,
              margin: "0 0 32px",
            }}
          >
            500명만 누리는
            <br />
            평생 혜택 3가지
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[
              {
                title: "6개월 무료",
                body: "창립회원 전원 첫 6개월 무료",
              },
              {
                title: "평생 #N번",
                body: "한 번 받은 가입 번호는 평생 본인 것",
              },
              {
                title: "가격 영구 잠금",
                body: "앞으로 인상돼도 첫 가격 그대로",
              },
            ].map((b) => (
              <div
                key={b.title}
                style={{
                  background: TITA.cream,
                  borderRadius: 20,
                  padding: 24,
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: TITA.camel,
                    alignItems: "center",
                    justifyContent: "center",
                    color: TITA.forestDeep,
                    marginBottom: 12,
                  }}
                >
                  <Lock size={18} aria-hidden />
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: TITA.forestDeep,
                    letterSpacing: "-0.4px",
                    margin: "0 0 6px",
                  }}
                >
                  {b.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: TITA.muted,
                    lineHeight: 1.55,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {b.body}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontSize: 14,
              color: TITA.forest,
              fontWeight: 700,
              margin: 0,
            }}
          >
            마감 후엔 일반 가격이 적용돼요.
          </p>
        </div>
      </section>

      {/* ── 어떻게 선물하나요 3단계 ──────────────────────────────────── */}
      <section
        style={{
          padding: "64px 24px",
          maxWidth: 880,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 38px)",
            fontWeight: 900,
            color: TITA.forestDeep,
            letterSpacing: "-1px",
            lineHeight: 1.2,
            margin: "0 0 40px",
            textAlign: "center",
          }}
        >
          어떻게 선물하나요?
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              step: "1",
              title: "내 폰에 먼저 다운로드",
              body: "앱스토어 또는 구글 플레이에서 '티타' 검색.",
              icon: <Smartphone size={22} aria-hidden />,
            },
            {
              step: "2",
              title: "부모님께 다운로드 링크 공유",
              body: "카카오톡으로 이 페이지 링크를 보내드리거나, 아래 QR 코드를 보여드리세요.",
              icon: <QrCode size={22} aria-hidden />,
            },
            {
              step: "3",
              title: "함께 가입 마무리",
              body: "본인인증 단계만 옆에서 도와드리면 끝. 평생 #N번 창립회원이 돼요.",
              icon: <CheckCircle2 size={22} aria-hidden />,
            },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                display: "flex",
                gap: 16,
                background: TITA.white,
                border: `1px solid ${TITA.sage}`,
                borderRadius: 20,
                padding: 24,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  background: TITA.forest,
                  color: TITA.cream,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                {s.step}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                    color: TITA.forest,
                  }}
                >
                  {s.icon}
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: TITA.forestDeep,
                      letterSpacing: "-0.4px",
                      margin: 0,
                    }}
                  >
                    {s.title}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: TITA.muted,
                    lineHeight: 1.6,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 마지막 CTA ────────────────────────────────────────────────── */}
      <section
        style={{
          background: TITA.forestDeep,
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4.5vw, 44px)",
              fontWeight: 900,
              color: TITA.cream,
              letterSpacing: "-1.2px",
              lineHeight: 1.2,
              margin: "0 0 16px",
            }}
          >
            지금 시작하세요.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: TITA.sage,
              lineHeight: 1.6,
              margin: "0 0 32px",
              fontWeight: 500,
            }}
          >
            창립회원 500자리는 채워지면 마감. 어머니의 평생 #N번,
            그리고 가격 영구 잠금. 두 번째 인생의 티타임을 함께 시작해요.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href={APP_STORE_URL}
              style={{
                ...ctaPrimaryStyle,
                background: TITA.cream,
                color: TITA.forestDeep,
              }}
              aria-label="앱스토어에서 티타 다운로드"
            >
              앱스토어에서 받기
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href={PLAY_STORE_URL}
              style={{
                ...ctaPrimaryStyle,
                background: TITA.cream,
                color: TITA.forestDeep,
              }}
              aria-label="구글 플레이에서 티타 다운로드"
            >
              구글 플레이에서 받기
              <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <TitaFooter />
    </div>
  );
}

const ctaPrimaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 26px",
  background: TITA.forest,
  color: TITA.white,
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: "-0.4px",
  textDecoration: "none",
};

const ctaSecondaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "14px 26px",
  background: TITA.white,
  color: TITA.forestDeep,
  border: `2px solid ${TITA.forest}`,
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 800,
  letterSpacing: "-0.4px",
  textDecoration: "none",
};
