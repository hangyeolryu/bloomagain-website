"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";

const BRAND = {
  navy: "#1F4E3D",
  lavender: "#EBEBEB",
  ink: "#1A2E26",
  muted: "#6B7D6E",
} as const;

const SESSION_KEY = "bloomagain_toss_pending";

interface Receipt {
  subscription_id: string;
  status: string;
  product_name: string;
  amount: number;
  order_id: string;
  payment_key?: string | null;
  card_company?: string | null;
  card_number_masked?: string | null;
  receipt_url?: string | null;
  next_charge_at?: string | null;
}

interface PendingState {
  customerKey: string;
  orderId: string;
  email: string;
  phone: string;
  firebaseUid?: string | null;
  fromApp?: boolean;
}

function SuccessInner() {
  const params = useSearchParams();
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fromApp, setFromApp] = useState(false);

  useEffect(() => {
    const authKey = params.get("authKey");
    const customerKeyFromUrl = params.get("customerKey");
    if (!authKey || !customerKeyFromUrl) {
      setState("error");
      setError("결제 정보가 누락되었습니다. 다시 시도해주세요.");
      return;
    }

    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      setState("error");
      setError(
        "결제 세션이 만료되었습니다. 처음부터 다시 시도해주세요. (브라우저 시크릿/쿠키 설정 영향)",
      );
      return;
    }

    let pending: PendingState;
    try {
      pending = JSON.parse(raw) as PendingState;
    } catch {
      setState("error");
      setError("결제 세션 정보를 읽을 수 없습니다.");
      return;
    }

    if (pending.customerKey !== customerKeyFromUrl) {
      setState("error");
      setError("결제 세션이 일치하지 않습니다. 다시 시도해주세요.");
      return;
    }

    if (pending.fromApp) setFromApp(true);

    const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
    if (!backendUrl) {
      setState("error");
      setError("결제 서버 주소가 설정되지 않았습니다.");
      return;
    }

    let cancelled = false;
    fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/payments/toss/billing/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authKey,
        customerKey: pending.customerKey,
        orderId: pending.orderId,
        customerEmail: pending.email,
        customerPhone: pending.phone,
        ...(pending.firebaseUid ? { firebaseUid: pending.firebaseUid } : {}),
      }),
    })
      .then(async (r) => {
        const body = await r.text();
        if (!r.ok) {
          let msg = "결제에 실패했습니다.";
          try {
            const parsed = JSON.parse(body) as { detail?: string };
            if (parsed.detail) msg = parsed.detail;
          } catch {
            /* not JSON */
          }
          throw new Error(msg);
        }
        return JSON.parse(body) as Receipt;
      })
      .then((data) => {
        if (cancelled) return;
        sessionStorage.removeItem(SESSION_KEY);
        setReceipt(data);
        setState("ok");
        // Signal completion to the Flutter WebView. The app watches for the
        // `app_done=1` query param on this page and closes the WebView when
        // it appears. Using history.replaceState keeps the visual URL clean
        // without triggering a navigation.
        if (pending.fromApp) {
          try {
            const u = new URL(window.location.href);
            u.searchParams.set("app_done", "1");
            window.history.replaceState({}, "", u.toString());
          } catch {
            /* harmless — fallback is user taps the "앱으로 돌아가기" button */
          }
        }
      })
      .catch((e) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
        setError(msg);
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [params]);

  if (state === "loading") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center" style={{ color: BRAND.ink }}>
        <Loader2 className="mx-auto h-10 w-10 animate-spin" style={{ color: BRAND.navy }} />
        <h1 className="mt-6 text-xl font-bold">결제를 확인하는 중입니다…</h1>
        <p className="mt-2 text-sm" style={{ color: BRAND.muted }}>
          창을 닫지 마세요. 보통 5초 안에 완료됩니다.
        </p>
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center" style={{ color: BRAND.ink }}>
        <h1 className="text-2xl font-bold">결제 확인에 실패했습니다</h1>
        <p className="mt-3 text-sm" style={{ color: BRAND.muted }}>
          {error ?? "잠시 후 다시 시도해주세요."}
        </p>
        <p className="mt-2 text-xs" style={{ color: BRAND.muted }}>
          중복 결제는 발생하지 않습니다. 카드사 명세서에 결제가 보이면 ceo@effeffcorp.com 으로 알려주세요.
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

  return (
    <main className="mx-auto max-w-2xl px-4 py-14" style={{ color: BRAND.ink }}>
      <div className="text-center mb-8">
        <CheckCircle2 className="mx-auto h-16 w-16" style={{ color: BRAND.navy }} />
        <h1 className="mt-4 text-3xl font-bold">결제가 완료되었습니다</h1>
        <p className="mt-3 text-sm" style={{ color: BRAND.muted }}>
          영수증은 입력하신 이메일로도 발송됩니다.
        </p>
      </div>

      <div
        className="rounded-2xl border p-6 space-y-3 text-sm"
        style={{ borderColor: "rgba(15,26,53,0.1)", background: BRAND.lavender }}
      >
        <Row label="상품" value={receipt?.product_name ?? "티타 플러스"} />
        <Row
          label="결제 금액"
          value={`${(receipt?.amount ?? 0).toLocaleString()}원`}
          bold
        />
        <Row label="주문번호" value={receipt?.order_id ?? "-"} mono />
        {receipt?.card_company && (
          <Row label="결제수단" value={`${receipt.card_company} ${receipt.card_number_masked ?? ""}`} />
        )}
        {receipt?.next_charge_at && (
          <Row
            label="다음 결제일"
            value={new Date(receipt.next_charge_at).toLocaleDateString("ko-KR")}
          />
        )}
      </div>

      {receipt?.receipt_url && (
        <a
          href={receipt.receipt_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block text-center text-sm font-semibold underline"
          style={{ color: BRAND.navy }}
        >
          토스페이먼츠 영수증 보기
        </a>
      )}

      <div
        className="mt-8 rounded-xl p-4 text-xs"
        style={{ background: "white", border: `1px solid ${BRAND.lavender}`, color: BRAND.muted }}
      >
        <strong style={{ color: BRAND.ink }}>앱에서 플러스 사용하기</strong>
        <p className="mt-2">
          앱에 로그인하시면 결제하신 이메일/휴대폰 기준으로 자동으로 플러스가 활성화됩니다.
          반영까지 최대 5분이 걸릴 수 있습니다. 문제가 있으면 ceo@effeffcorp.com 으로 알려주세요.
        </p>
      </div>

      <div className="mt-8 text-center">
        {fromApp ? (
          <button
            type="button"
            onClick={() => {
              const u = new URL(window.location.href);
              u.searchParams.set("app_done", "1");
              window.history.replaceState({}, "", u.toString());
            }}
            className="inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
            style={{ background: BRAND.navy }}
          >
            앱으로 돌아가기
          </button>
        ) : (
          <Link
            href="/"
            className="inline-block rounded-full px-6 py-3 text-sm font-bold text-white"
            style={{ background: BRAND.navy }}
          >
            홈으로
          </Link>
        )}
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  bold,
  mono,
}: {
  label: string;
  value: string;
  bold?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span style={{ color: BRAND.muted }}>{label}</span>
      <span
        className={`text-right ${mono ? "font-mono text-xs" : ""}`}
        style={{ color: BRAND.ink, fontWeight: bold ? 700 : 500 }}
      >
        {value}
      </span>
    </div>
  );
}

export default function SubscribeSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin" style={{ color: BRAND.navy }} />
        </main>
      }
    >
      <SuccessInner />
    </Suspense>
  );
}
