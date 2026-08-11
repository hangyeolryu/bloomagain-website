import type { Metadata } from "next";

// 정규 URL만 선언한다. title/description은 루트 레이아웃 것을 그대로 상속.
// 이게 없으면 Google이 "사용자가 선택한 표준 없음"으로 색인에서 제외한다.
// trailingSlash: true 라 끝 슬래시까지 적어야 301을 가리키지 않는다.
export const metadata: Metadata = {
  alternates: { canonical: "/support/" },
};

// 티타 고객지원 페이지. FAQ + 문의 채널. App Store 리뷰가 자주 이 URL을
// 요구해서 항상 살아있어야 함. 2026-06: 브랜드/팔레트만 갱신, 컨텐츠는
// 시니어 톤에 맞춰 약간 다듬음.

import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { TitaHeader } from "../_components/TitaHeader";
import { TitaFooter } from "../_components/TitaFooter";

const faqs = [
  {
    category: "계정 및 가입",
    items: [
      {
        question: "티타는 누가 사용할 수 있나요?",
        answer:
          "신원이 확인된 한국 거주 회원만 가입할 수 있어요. NICE 본인인증을 거칩니다.",
      },
      {
        question: "비밀번호를 잊었어요. 어떻게 재설정하나요?",
        answer:
          "로그인 화면에서 '비밀번호 찾기'를 눌러 등록 이메일·전화번호로 재설정 링크를 받아주세요.",
      },
      {
        question: "계정을 삭제하고 싶어요.",
        answer:
          "앱 마이페이지 → 설정 → 계정 삭제에서 직접 가능합니다. 자세한 안내는 계정 삭제 페이지를 참고해 주세요.",
      },
    ],
  },
  {
    category: "앱 사용",
    items: [
      {
        question: "글자가 너무 작아요.",
        answer:
          "마이페이지 → 설정 → 접근성에서 글자 크기를 조정할 수 있어요. 시력에 맞춰 자동 조정도 지원합니다.",
      },
      {
        question: "친구는 어떻게 추천되나요?",
        answer:
          "AI가 관심사, 동네, 연령대를 종합해 결이 맞는 분을 매일 찾아드려요. 프로필이 자세할수록 정확해집니다.",
      },
      {
        question: "그룹 채팅은 몇 명까지 가능한가요?",
        answer: "친한 결친구 최대 8명까지 한 그룹에서 함께할 수 있어요.",
      },
    ],
  },
  {
    category: "안전",
    items: [
      {
        question: "의심스러운 사용자를 신고하고 싶어요.",
        answer:
          "상대방 프로필이나 메시지에서 '신고하기' 버튼을 눌러주세요. 24시간 내 검토합니다.",
      },
      {
        question: "사기 메시지를 받았어요.",
        answer:
          "AI 안전 시스템이 의심 메시지를 자동 감지하지만, 개인정보·금전 요구에는 절대 응하지 마시고 즉시 신고해 주세요.",
      },
      {
        question: "개인정보는 안전한가요?",
        answer:
          "금융권 수준의 암호화로 보호합니다. 자세한 내용은 개인정보 처리방침을 참고해 주세요.",
      },
    ],
  },
  {
    category: "기술",
    items: [
      {
        question: "앱이 실행되지 않아요.",
        answer:
          "앱을 완전히 종료 후 다시 실행해 보세요. 문제가 계속되면 재설치하시거나 기기 모델과 OS 버전을 이메일로 알려주시면 도와드릴게요.",
      },
      {
        question: "알림이 오지 않아요.",
        answer:
          "기기 설정 → 앱 → 티타에서 알림 권한을 확인해 주세요. 앱 안에서도 마이페이지 → 설정 → 알림에서 조정할 수 있어요.",
      },
    ],
  },
];

export default function SupportPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: TITA.cream,
        fontFamily: KOREAN_FONT_STACK,
      }}
    >
      <TitaHeader />

      {/* Hero */}
      <div className="border-b" style={{ borderColor: TITA.sage }}>
        <div className="max-w-2xl mx-auto px-5 sm:px-6 py-12 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
            style={{ backgroundColor: TITA.surface }}
          >
            <HelpCircle className="w-6 h-6" style={{ color: TITA.forest }} />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold mb-2"
            style={{ color: TITA.ink, letterSpacing: "-0.02em" }}
          >
            고객 지원
          </h1>
          <p className="text-sm" style={{ color: TITA.muted }}>
            티타 사용에 어려움이 있으신가요? 도와드릴게요.
          </p>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-5 sm:px-6 py-10 space-y-10">
        {/* Contact */}
        <section>
          <h2
            className="text-base font-bold mb-3"
            style={{ color: TITA.ink }}
          >
            문의 방법
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <ContactCard
              icon={Mail}
              title="이메일"
              note="영업일 기준 1–3일 답변"
              cta="ceo@effeffcorp.com"
              href="mailto:ceo@effeffcorp.com"
            />
            <ContactCard
              icon={Shield}
              title="신고"
              note="스캠·불법 콘텐츠 24시간 처리"
              cta="신고 메일"
              href="mailto:ceo@effeffcorp.com?subject=신고"
            />
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2
            className="text-base font-bold mb-4"
            style={{ color: TITA.ink }}
          >
            자주 묻는 질문
          </h2>
          <div className="space-y-6">
            {faqs.map((section) => (
              <div key={section.category}>
                <h3
                  className="text-[11px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: TITA.forest }}
                >
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div
                      key={item.question}
                      className="rounded-xl p-4 border"
                      style={{
                        backgroundColor: TITA.white,
                        borderColor: TITA.sage,
                      }}
                    >
                      <div className="flex gap-2.5">
                        <MessageCircle
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: TITA.forest }}
                        />
                        <div>
                          <p
                            className="text-sm font-semibold mb-1"
                            style={{ color: TITA.ink }}
                          >
                            {item.question}
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: TITA.muted }}
                          >
                            {item.answer}
                          </p>
                          {item.question.includes("계정을 삭제") && (
                            <Link
                              href="/delete-account"
                              className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium hover:underline"
                              style={{ color: TITA.forest }}
                            >
                              계정 삭제 안내
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                          {item.question.includes("개인정보") && (
                            <Link
                              href="/privacy"
                              className="inline-flex items-center gap-1 mt-2 text-[11px] font-medium hover:underline"
                              style={{ color: TITA.forest }}
                            >
                              개인정보 처리방침
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="rounded-2xl p-6 text-center"
          style={{
            backgroundColor: TITA.surface,
            border: `1px solid ${TITA.sage}`,
          }}
        >
          <h2
            className="text-base font-bold mb-1"
            style={{ color: TITA.ink }}
          >
            찾는 답변이 없으신가요?
          </h2>
          <p className="text-xs mb-4" style={{ color: TITA.muted }}>
            언제든지 이메일로 문의해 주세요.
          </p>
          <a
            href="mailto:ceo@effeffcorp.com"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-transform hover:scale-105"
            style={{ backgroundColor: TITA.forest, color: "white" }}
          >
            <Mail className="w-4 h-4" />
            이메일 문의
          </a>
        </section>

        <TitaFooter />
      </main>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  note,
  cta,
  href,
}: {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  title: string;
  note: string;
  cta: string;
  href: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border flex flex-col gap-2"
      style={{
        backgroundColor: TITA.white,
        borderColor: TITA.sage,
      }}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" style={{ color: TITA.forest }} />
        <h3 className="text-sm font-bold" style={{ color: TITA.ink }}>
          {title}
        </h3>
      </div>
      <p className="text-xs" style={{ color: TITA.muted }}>
        {note}
      </p>
      <a
        href={href}
        className="text-xs font-semibold hover:underline inline-flex items-center gap-1 mt-1"
        style={{ color: TITA.forest }}
      >
        {cta}
        <ChevronRight className="w-3 h-3" />
      </a>
    </div>
  );
}
