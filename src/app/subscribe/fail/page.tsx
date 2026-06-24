"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

const BRAND = {
  navy: "#1F4E3D",
  lavender: "#EBEBEB",
  ink: "#1A2E26",
  muted: "#6B7D6E",
} as const;

const FRIENDLY_BY_CODE: Record<string, string> = {
  PAY_PROCESS_CANCELED: "결제를 취소하셨습니다.",
  PAY_PROCESS_ABORTED: "결제 처리 중 중단되었습니다.",
  USER_CANCEL: "결제 창을 닫으셨습니다.",
  REJECT_CARD_COMPANY: "카드사에서 결제를 거절했습니다.",
};

function FailInner() {
  const params = useSearchParams();
  const code = params.get("code") ?? "";
  const message = params.get("message") ?? "결제가 진행되지 않았습니다.";
  const friendly = FRIENDLY_BY_CODE[code] ?? message;

  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center" style={{ color: BRAND.ink }}>
      <XCircle className="mx-auto h-16 w-16" style={{ color: "#E53935" }} />
      <h1 className="mt-4 text-2xl font-bold">결제가 완료되지 않았어요</h1>
      <p className="mt-3 text-sm" style={{ color: BRAND.muted }}>
        {friendly}
      </p>
      {code && (
        <p className="mt-1 text-xs font-mono" style={{ color: BRAND.muted }}>
          오류 코드: {code}
        </p>
      )}
      <p className="mt-6 text-xs" style={{ color: BRAND.muted }}>
        결제 정보가 카드사에서 처리되지 않았으니 안심하셔도 됩니다.
        다른 카드로 다시 시도하시거나 ceo@effeffcorp.com 으로 문의해주세요.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/subscribe/plus"
          className="rounded-full px-6 py-3 text-sm font-bold text-white"
          style={{ background: BRAND.navy }}
        >
          다시 시도하기
        </Link>
        <Link
          href="/"
          className="rounded-full border-2 px-6 py-3 text-sm font-bold"
          style={{ borderColor: BRAND.navy, color: BRAND.navy }}
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}

export default function SubscribeFailPage() {
  return (
    <Suspense fallback={<main className="py-20" />}>
      <FailInner />
    </Suspense>
  );
}
