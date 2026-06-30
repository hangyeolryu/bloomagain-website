// 티타 플러스 구독 안내 (랜딩) — /subscribe
//
// 토스페이먼츠 빌링(정기결제, MID bill_wdasibrz5) 카드사 심사용 "구독 상품 페이지".
// 상품명·금액·상세설명·정기결제 고지·서비스 제공기간·환불 규정을 한 화면에 보여주고,
// "결제하기"는 실제 토스 결제창을 띄우는 /subscribe/plus 로 연결한다.
// 헤더/푸터는 공용 컴포넌트를 써서 사업자정보(푸터 6항목)가 모든 페이지와 동일하게 노출된다.

import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { TitaHeader } from "../_components/TitaHeader";
import { TitaFooter } from "../_components/TitaFooter";

const PLUS_AMOUNT = 19_900;

const FEATURES = [
  "AI 맞춤 매칭 — 관심사·매일의 짧은 답을 분석해 결이 맞는 또래를 추천하고, 왜 잘 맞는지 이유까지 알려드려요",
  "특허 출원 4계층 안전(PA260003) — 로맨스 스캠·보이스피싱·투자유도를 행동 분석으로 사전 차단",
  "적응형 화면 — 사용 습관에 맞춰 글자·버튼 크기를 편하게 자동 조정 (특허 기술)",
  "언제든 해지 · 약정·위약금 없음",
];

// 결제 전 필수 고지 — 카드사 심사 핵심 항목.
const NOTICE: [string, React.ReactNode][] = [
  ["판매 상품", "티타 플러스 (디지털 콘텐츠·온라인 서비스 이용권)"],
  ["결제 금액", "월 19,900원 (부가세 포함)"],
  ["결제 방식", "신용·체크카드 정기결제(빌링) — 등록한 카드로 매월 자동 결제"],
  [
    "서비스 제공기간",
    "1개월 단위. 해지 전까지 매월 자동 갱신되며, 최대 제공기간은 12개월을 넘지 않습니다.",
  ],
  ["이용 개시", "결제 즉시 플러스 기능이 활성화됩니다."],
  [
    "자동 갱신·해지",
    "해지하지 않으면 다음 결제일에 자동 결제됩니다. 앱 마이페이지 또는 고객센터(ceo@effeffcorp.com)로 언제든 해지할 수 있습니다.",
  ],
];

export default function SubscribePage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: TITA.cream, color: TITA.ink, fontFamily: KOREAN_FONT_STACK }}
    >
      <TitaHeader />

      <main className="flex-1 w-full max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        {/* Hero */}
        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
            style={{ color: TITA.forestMid }}
          >
            티타 플러스 정기결제
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4" style={{ color: TITA.ink }}>
            매달 19,900원으로
            <br />
            플러스 기능을 모두
          </h1>
          <p className="text-base leading-relaxed" style={{ color: TITA.muted }}>
            카드 등록 즉시 결제되며, 매월 같은 날짜에 자동으로 갱신됩니다. 언제든지 해지하실 수 있어요.
          </p>
        </div>

        {/* 상품 카드 */}
        <section
          className="rounded-2xl border p-6 mb-8"
          style={{ borderColor: TITA.sage, background: TITA.white }}
        >
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <p className="text-sm font-semibold" style={{ color: TITA.muted }}>
                상품
              </p>
              <p className="text-lg font-bold" style={{ color: TITA.ink }}>
                티타 플러스 (월간)
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold tabular-nums" style={{ color: TITA.forest }}>
                {PLUS_AMOUNT.toLocaleString()}원
              </p>
              <p className="text-xs" style={{ color: TITA.muted }}>
                / 월 · 부가세 포함 · 매월 자동결제
              </p>
            </div>
          </div>
          <ul className="space-y-2.5">
            {FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: TITA.ink }}>
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: TITA.forest }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 결제하기 CTA → 실제 토스 결제창 */}
        <Link
          href="/subscribe/plus"
          className="block w-full text-center rounded-full px-6 py-4 text-base font-bold text-white shadow-lg transition-transform hover:scale-[1.01]"
          style={{ background: TITA.forest }}
        >
          {PLUS_AMOUNT.toLocaleString()}원 결제하기
        </Link>
        <p className="mt-3 text-center text-xs" style={{ color: TITA.muted }}>
          결제하기를 누르면 토스페이먼츠 안전 결제창에서 카드를 등록합니다.
        </p>

        {/* 결제 전 필수 고지 */}
        <section
          className="mt-10 rounded-2xl border overflow-hidden"
          style={{ borderColor: TITA.sage, background: TITA.white }}
        >
          <h2 className="px-6 pt-6 pb-2 text-lg font-bold" style={{ color: TITA.forestDeep }}>
            결제 전 꼭 확인하세요
          </h2>
          <dl className="px-6 pb-4">
            {NOTICE.map(([k, v]) => (
              <div
                key={k}
                className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3 border-t text-sm"
                style={{ borderColor: TITA.sage }}
              >
                <dt className="sm:w-32 flex-shrink-0 font-semibold" style={{ color: TITA.muted }}>
                  {k}
                </dt>
                <dd style={{ color: TITA.ink }}>{v}</dd>
              </div>
            ))}
            <div
              className="flex flex-col sm:flex-row gap-1 sm:gap-4 py-3 border-t text-sm"
              style={{ borderColor: TITA.sage }}
            >
              <dt className="sm:w-32 flex-shrink-0 font-semibold" style={{ color: TITA.muted }}>
                환불 규정
              </dt>
              <dd style={{ color: TITA.ink }}>
                결제 후 7일 이내 미사용 시 전액 환불, 정기결제 이용 중 해지 시 잔여기간 일할 계산 환불.{" "}
                <Link href="/terms" className="underline" style={{ color: TITA.forest }}>
                  환불 규정 전문 보기
                </Link>
              </dd>
            </div>
          </dl>
        </section>

        {/* 안내 */}
        <div
          className="mt-8 rounded-xl p-4 text-xs flex items-start gap-2"
          style={{ background: TITA.surface, color: TITA.muted }}
        >
          <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: TITA.forest }} />
          <p>
            결제는 토스페이먼츠 PG가 처리하며, 카드 정보는 토스페이먼츠 서버에만 저장됩니다. 티타는 카드
            마지막 4자리와 카드사 정보만 받습니다. 본 서비스는 만 45세 이상 전용이며, 「전자상거래 등에서의
            소비자보호에 관한 법률」에 따른 청약철회·환불 규정이 적용됩니다.
          </p>
        </div>
      </main>

      <div className="w-full max-w-2xl mx-auto px-5 sm:px-6">
        <TitaFooter />
      </div>
    </div>
  );
}
