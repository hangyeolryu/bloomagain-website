import type { Metadata } from "next";

// 정규 URL만 선언한다. title/description은 루트 레이아웃 것을 그대로 상속.
// 이게 없으면 Google이 "사용자가 선택한 표준 없음"으로 색인에서 제외한다.
// trailingSlash: true 라 끝 슬래시까지 적어야 301을 가리키지 않는다.
export const metadata: Metadata = {
  alternates: { canonical: "/subscribe/" },
};

// 티타 플러스 구독 안내 (랜딩) — /subscribe
//
// 토스페이먼츠 빌링(정기결제, MID bill_wdasibrz5) 카드사 심사용 "구독 상품 페이지".
// 상품명·금액·상세설명·정기결제 고지·서비스 제공기간·환불 규정을 한 화면에 보여주고,
// "결제하기"는 실제 토스 결제창을 띄우는 /subscribe/plus 로 연결한다.
// 헤더/푸터는 공용 컴포넌트를 써서 사업자정보(푸터 6항목)가 모든 페이지와 동일하게 노출된다.

import Link from "next/link";
import { ShieldCheck, CheckCircle2, Sparkles, Lock, Coffee, Heart } from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { TitaHeader } from "../_components/TitaHeader";
import { TitaFooter } from "../_components/TitaFooter";

const PLUS_AMOUNT = 19_900;

// Plus 실제 차이 — 실제 코드에 구현된 것만. 안전·적응형·NICE 같은 *기본*
// 기능은 무료에도 동일하게 제공됨을 명시 (App Store 3.1.2 + 한국 표시광고법).
const FEATURES = [
  "메시지·인사 한도 없이 — 무료는 월 메시지·하루 인사 한도, 플러스는 결친구와 끝까지·마음껏",
  "AI 맞춤 매칭 인사이트 — 무료는 \"결이 통해요\" 한 줄, 플러스는 \"왜 맞는지\" 깊은 이유까지",
  "외부앱 유도·연락처 스캠 실시간 차단 · 본인인증 · 4계층 적응형 안전(특허 출원 중) — 무료 회원도 동일하게 보호받습니다",
  "언제든 해지 · 약정·위약금 없음",
];

// Free vs Plus 비교 — *실제 코드에 구현된* 차이만.
// 무료에도 제공되는 기본 기능은 동일하게 표시 (포지셔닝 정직).
const COMPARE_ROWS: { label: string; free: string; plus: string }[] = [
  { label: "본인인증 가입", free: "포함", plus: "포함" },
  { label: "4계층 안전 (특허 출원 중)", free: "포함 (모두에게)", plus: "포함 (모두에게)" },
  { label: "적응형 화면 (특허 출원 중)", free: "포함 (모두에게)", plus: "포함 (모두에게)" },
  { label: "스캠·외부앱 유도 차단", free: "포함 (모두에게)", plus: "포함 (모두에게)" },
  { label: "결친구 매칭", free: "기본 매칭", plus: "AI 맞춤 — 왜 맞는지 이유까지" },
  { label: "채팅 메시지", free: "월 한도", plus: "무제한" },
  { label: "인사(웨이브)", free: "하루 5개", plus: "무제한" },
  { label: "약정 / 위약금", free: "없음", plus: "없음 · 언제든 해지" },
];

// "왜 Plus를 내야 하나?" — 4가지 정직한 이유.
// 안전을 가격 뒤에 가두지 않음 (윤리). Plus는 *대화 깊이* + *대화 양*.
const WHY_FRAMES: {
  icon: typeof Sparkles;
  title: string;
  body: string;
}[] = [
  {
    icon: Sparkles,
    title: "왜 잘 맞는지 이유까지",
    body:
      "무료는 '결이 통해요' 한 줄. 플러스는 결큐 답변을 분석해 \"산책과 차 한 잔의 여유를 아는 분 — 대화 리듬이 잘 통할 것 같아요\"처럼 깊은 이유를 보여드립니다.",
  },
  {
    icon: Lock,
    title: "결친구와 끝까지 대화",
    body:
      "무료에는 월 메시지 한도와 하루 인사 한도가 있어요. 플러스는 둘 다 한도 없이, 결이 통하는 분과 깊어질 때까지 자유롭게 대화하고 마음껏 인사하실 수 있습니다.",
  },
  {
    icon: Coffee,
    title: "한 달 19,900원 = 카페 4잔",
    body:
      "동호회 입회비·회비·교통비를 다 합쳐도 한 달 수십만 원. 결이 통하는 친구들을 만나는 비용으로 환산하면 거의 무료에 가깝습니다.",
  },
  {
    icon: Heart,
    title: "광고 안 받습니다. 데이터 안 팝니다.",
    body:
      "솔로 파운더가 만든 작은 모델이에요. 사용자의 구독료가 우리가 돌아가는 유일한 방법. 사용자가 진짜 고객인 앱.",
  },
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

        {/* Free vs Plus 비교 표 — "내가 왜 돈을 내야 하지?" 한 표로 답 */}
        <section
          className="rounded-2xl border overflow-hidden mb-8"
          style={{ borderColor: TITA.sage, background: TITA.white }}
        >
          <h2 className="px-6 pt-6 pb-2 text-lg font-bold" style={{ color: TITA.forestDeep }}>
            무료 회원과 플러스, 어떻게 다른가요?
          </h2>
          <div className="overflow-x-auto px-2 sm:px-4 pb-4">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: TITA.muted }}>
                  <th className="text-left font-semibold px-3 py-2"></th>
                  <th className="font-semibold px-3 py-2">무료</th>
                  <th className="font-semibold px-3 py-2" style={{ color: TITA.forest }}>
                    플러스
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      borderTop: i === 0 ? undefined : `1px solid ${TITA.sage}`,
                      color: TITA.ink,
                    }}
                  >
                    <td className="text-left font-semibold px-3 py-3" style={{ color: TITA.forestDeep }}>
                      {row.label}
                    </td>
                    <td className="text-center px-3 py-3" style={{ color: TITA.muted }}>
                      {row.free}
                    </td>
                    <td
                      className="text-center px-3 py-3 font-semibold"
                      style={{ color: TITA.forest }}
                    >
                      {row.plus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 과금 서사 — 기능 제한이 아니라 '대화를 지키는 비용'.
            (원본: bloomagain-korea/docs/product/in_app_safety_narrative_2026_07.md §3)
            ⚠️ 공포 마케팅 금지 — 선택지 제시로만. */}
        <section
          className="rounded-2xl border p-6 mb-8"
          style={{ borderColor: TITA.sage, background: TITA.surface }}
        >
          <h2 className="text-lg font-bold mb-3" style={{ color: TITA.forestDeep }}>
            대화를 지키는 데 드는 비용이에요
          </h2>
          <p className="text-[15px] leading-relaxed mb-3" style={{ color: TITA.ink }}>
            티타는 대화가 오갈 때마다 AI가 사기·유인 신호를 확인합니다.
            돈 이야기, 카톡·문자로 데려가려는 시도를 그때그때 잡아내요.
            그 확인에 비용이 듭니다.
          </p>
          <p className="text-[15px] leading-relaxed mb-3 font-bold" style={{ color: TITA.forestDeep }}>
            하루 660원 — 여기서 나누는 모든 이야기를 지키는 값이에요.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: TITA.muted }}>
            만나서 차 마시고 산책하는 건 저희가 바라는 일이에요.
            다만 <b>연락은 티타 안에서</b> 하세요 — 아끼려고 밖에서 이야기하는
            순간, 지켜드릴 방법이 없어집니다.
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: TITA.muted }}>
            무료로도 계속 쓰실 수 있어요. 본인인증·사기 차단 같은 안전 기능은
            <b> 요금과 상관없이 모두에게</b> 동일하게 제공합니다.
          </p>
        </section>

        {/* WHY pay — 4가지 frame */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: TITA.forestDeep }}>
            왜 플러스를 결제하시나요?
          </h2>
          <ul className="space-y-3">
            {WHY_FRAMES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-2xl border p-5"
                style={{ borderColor: TITA.sage, background: TITA.white }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: TITA.sage }}
                  >
                    <Icon className="w-5 h-5" style={{ color: TITA.forest }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: TITA.forestDeep }}>
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: TITA.muted }}>
                      {body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

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
