import Link from "next/link";
import { Mail, MessageCircle, Shield, HelpCircle, ChevronRight } from "lucide-react";

const faqs = [
  {
    category: "계정 및 가입",
    items: [
      {
        question: "다시, 봄은 누가 사용할 수 있나요?",
        answer: "다시, 봄은 50세 이상의 분들을 위한 소셜 네트워킹 앱입니다. 가입 시 나이 확인 절차를 거칩니다.",
      },
      {
        question: "비밀번호를 잊어버렸어요. 어떻게 재설정하나요?",
        answer: "로그인 화면에서 '비밀번호 찾기'를 눌러 등록하신 이메일 또는 전화번호로 재설정 링크를 받으실 수 있습니다.",
      },
      {
        question: "계정을 삭제하고 싶어요.",
        answer: "계정 삭제는 앱 내 마이페이지 → 설정 → 개인정보 → 계정 삭제에서 직접 하실 수 있습니다. 자세한 내용은 계정 삭제 안내 페이지를 참고해 주세요.",
      },
    ],
  },
  {
    category: "앱 사용 방법",
    items: [
      {
        question: "글자가 너무 작아서 보기 어려워요.",
        answer: "다시, 봄은 시력 수준에 따라 글자 크기와 레이아웃을 자동으로 조정합니다. 마이페이지 → 설정 → 접근성에서 글자 크기를 직접 조정하실 수도 있습니다.",
      },
      {
        question: "새로운 인연을 어떻게 추천받나요?",
        answer: "AI 기반 인연 추천 시스템이 회원님의 프로필, 관심사, 가치관을 분석하여 잘 맞는 분들을 자동으로 추천해 드립니다. 프로필을 상세하게 작성할수록 더 좋은 추천을 받으실 수 있습니다.",
      },
      {
        question: "서클이 무엇인가요?",
        answer: "서클은 공통의 관심사를 가진 분들이 모여 소통하는 그룹 커뮤니티입니다. 기존 서클에 참여하거나 직접 서클을 만들어 운영하실 수 있습니다.",
      },
    ],
  },
  {
    category: "안전 및 보안",
    items: [
      {
        question: "의심스러운 사용자를 신고하고 싶어요.",
        answer: "해당 사용자의 프로필 또는 메시지에서 '신고하기' 버튼을 눌러 신고해 주세요. 신고 내용은 신속하게 검토하여 조치합니다.",
      },
      {
        question: "스캠(사기) 메시지를 받았어요.",
        answer: "다시, 봄의 특허 출원 AI 보안 시스템이 의심스러운 메시지를 자동으로 감지하고 경고합니다. 의심스러운 메시지를 받으셨다면 즉시 신고해 주시고, 개인정보나 금전 요구에는 절대 응하지 마세요.",
      },
      {
        question: "개인정보는 어떻게 보호되나요?",
        answer: "다시, 봄은 금융권 수준의 암호화 기술과 특허 출원된 보안 시스템으로 회원님의 개인정보를 보호합니다. 자세한 내용은 개인정보처리방침을 참고해 주세요.",
      },
    ],
  },
  {
    category: "기술 지원",
    items: [
      {
        question: "앱이 실행되지 않아요.",
        answer: "앱을 완전히 종료 후 다시 실행해 보세요. 문제가 지속되면 앱을 삭제 후 재설치하거나, 고객 지원 이메일로 기기 모델과 운영체제 버전을 알려주시면 도와드리겠습니다.",
      },
      {
        question: "알림이 오지 않아요.",
        answer: "기기의 설정 → 앱 → 다시, 봄에서 알림 권한이 허용되어 있는지 확인해 주세요. 앱 내에서도 마이페이지 → 설정 → 알림에서 알림 설정을 확인하실 수 있습니다.",
      },
    ],
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl font-bold text-[#0F1A35]">
                다시, 봄
              </Link>
              <span className="text-sm text-gray-500">Dasi, Bom</span>
            </div>
            <div className="hidden md:flex items-baseline space-x-4">
              <Link href="/" className="text-gray-500 hover:text-[#10367D] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                홈
              </Link>
              <Link href="/support" className="text-[#0F1A35] font-semibold px-3 py-2 rounded-md text-sm transition-colors">
                고객지원
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-[#10367D] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-[#10367D] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                이용약관
              </Link>
              <Link href="/delete-account" className="text-gray-500 hover:text-[#10367D] px-3 py-2 rounded-md text-sm font-medium transition-colors">
                계정삭제
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0F1A35] to-[#0A2459] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="h-12 w-12 text-[#10367D] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-3">고객 지원</h1>
          <p className="text-lg text-white/80">
            다시, 봄 사용에 어려움이 있으신가요? 도와드리겠습니다.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Contact Cards */}
        <section>
          <h2 className="text-2xl font-bold text-[#0F1A35] mb-6">문의 방법</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10367D]/10">
                <Mail className="h-6 w-6 text-[#10367D]" />
              </div>
              <h3 className="font-semibold text-[#0F1A35]">이메일 문의</h3>
              <p className="text-sm text-slate-500">영업일 기준 1–3일 내 답변 드립니다.</p>
              <a
                href="mailto:ceo@effeffcorp.com"
                className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[#10367D] hover:underline"
              >
                ceo@effeffcorp.com
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

<div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10367D]/10">
                <Shield className="h-6 w-6 text-[#10367D]" />
              </div>
              <h3 className="font-semibold text-[#0F1A35]">신고 및 안전</h3>
              <p className="text-sm text-slate-500">스캠·불법 콘텐츠는 즉시 신고해 주세요. 24시간 처리합니다.</p>
              <a
                href="mailto:ceo@effeffcorp.com?subject=신고"
                className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[#10367D] hover:underline"
              >
                신고 이메일 보내기
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-[#0F1A35] mb-6">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-8">
            {faqs.map((section) => (
              <div key={section.category}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-[#10367D] mb-4">
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <div
                      key={item.question}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
                    >
                      <div className="flex gap-3">
                        <MessageCircle className="h-5 w-5 text-[#10367D] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#0F1A35] mb-1">{item.question}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{item.answer}</p>
                          {item.question.includes("계정을 삭제") && (
                            <Link
                              href="/delete-account"
                              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[#10367D] hover:underline"
                            >
                              계정 삭제 안내 보기
                              <ChevronRight className="h-3 w-3" />
                            </Link>
                          )}
                          {item.question.includes("개인정보") && (
                            <Link
                              href="/privacy"
                              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[#10367D] hover:underline"
                            >
                              개인정보처리방침 보기
                              <ChevronRight className="h-3 w-3" />
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
        <section className="bg-gradient-to-br from-[#10367D]/10 to-[#0F1A35]/5 border-2 border-[#10367D]/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-[#0F1A35] mb-2">
            찾으시는 답변이 없으신가요?
          </h2>
          <p className="text-slate-600 mb-6">
            고객 지원팀이 도와드리겠습니다. 언제든지 이메일로 문의해 주세요.
          </p>
          <a
            href="mailto:ceo@effeffcorp.com"
            className="inline-flex items-center gap-2 rounded-full bg-[#10367D] px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#0A2459]"
          >
            <Mail className="h-5 w-5" />
            이메일 문의하기
          </a>
        </section>

        {/* Footer nav */}
        <div className="border-t pt-6 flex flex-wrap gap-4 justify-center text-sm text-slate-500">
          <Link href="/" className="hover:text-[#10367D] transition-colors">홈</Link>
          <Link href="/privacy" className="hover:text-[#10367D] transition-colors">개인정보처리방침</Link>
          <Link href="/terms" className="hover:text-[#10367D] transition-colors">이용약관</Link>
          <Link href="/security-processing" className="hover:text-[#10367D] transition-colors">보안·행동 데이터 처리</Link>
          <Link href="/delete-account" className="hover:text-[#10367D] transition-colors">계정삭제</Link>
        </div>
      </main>
    </div>
  );
}
