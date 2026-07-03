"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import { ArrowLeft, ShieldCheck, CheckCircle2, Smartphone } from "lucide-react";

const BRAND = {
  navy: "#1F4E3D",
  navyDeep: "#143329",
  navySoft: "#2D54A1",
  lavender: "#EBEBEB",
  ink: "#1A2E26",
  muted: "#6B7D6E",
} as const;

const PLUS_AMOUNT = 19_900;
const PLUS_PRODUCT_NAME = "티타 플러스 (월간)";

const SESSION_KEY = "bloomagain_toss_pending";

const PHONE_RE = /^01[016789][-\s]?\d{3,4}[-\s]?\d{4}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function genId(prefix: string): string {
  // RFC4122-ish; the prefix keeps Toss's logs grep-friendly.
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}_${rand}`.slice(0, 60);
}

export default function SubscribePlusPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // App passthrough: when launched from inside the Flutter app's WebView,
  // URL carries firebase_uid (+ optional email/phone) so the user doesn't
  // re-enter what we already know.
  const [fromApp, setFromApp] = useState(false);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") === "app") {
      setFromApp(true);
      const uid = params.get("firebase_uid");
      if (uid) setFirebaseUid(uid);
      const e = params.get("email");
      if (e) setEmail(e);
      const p = params.get("phone");
      if (p) setPhone(p);
    }
  }, []);

  const handleSubscribe = async () => {
    setError(null);
    if (!EMAIL_RE.test(email)) {
      setError("이메일 형식을 다시 확인해주세요.");
      return;
    }
    if (!PHONE_RE.test(phone)) {
      setError("휴대폰 번호 형식을 다시 확인해주세요. (예: 010-1234-5678)");
      return;
    }
    if (!agree) {
      setError("결제 진행을 위해 약관에 동의해주세요.");
      return;
    }

    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      setError("결제 시스템 설정이 완료되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(true);
    try {
      const customerKey = genId("cust");
      const orderId = genId("ord");

      // Stash the bits Toss won't echo back so /subscribe/success can
      // forward them to the backend after the card-auth redirect.
      // `firebaseUid` and `fromApp` are persisted too so the success page
      // can link the payment to the in-app user and signal completion to
      // the WebView.
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          customerKey,
          orderId,
          email,
          phone,
          firebaseUid,
          fromApp,
        }),
      );

      const tossPayments = await loadTossPayments(clientKey);
      const origin = window.location.origin;
      await tossPayments.requestBillingAuth("카드", {
        customerKey,
        successUrl: `${origin}/subscribe/success`,
        failUrl: `${origin}/subscribe/fail`,
      });
      // requestBillingAuth navigates the page; nothing after this runs in the
      // success path.
    } catch (e) {
      setLoading(false);
      const msg = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ color: BRAND.ink }}>
      <header
        className="sticky top-0 z-50 border-b backdrop-blur"
        style={{
          background: "rgba(255,255,255,0.95)",
          borderColor: "rgba(15,26,53,0.08)",
        }}
      >
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          {fromApp ? (
            <span
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: BRAND.navy }}
            >
              <Smartphone className="h-4 w-4" />
              티타 앱 결제
            </span>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: BRAND.navy }}
            >
              <ArrowLeft className="h-4 w-4" />
              티타 홈
            </Link>
          )}
          <span className="text-xs" style={{ color: BRAND.muted }}>
            안전한 결제 · 토스페이먼츠
          </span>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 lg:py-14">
        <div className="mb-8">
          <p
            className="text-xs font-bold uppercase tracking-[0.3em] mb-2"
            style={{ color: BRAND.navySoft }}
          >
            티타 플러스 정기결제
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight mb-3"
            style={{ color: BRAND.ink }}
          >
            매달 19,900원으로
            <br />
            플러스 기능을 모두 사용하세요
          </h1>
          <p className="text-base" style={{ color: BRAND.muted }}>
            결제는 카드 등록 즉시 진행되며, 매월 같은 날짜에 자동으로 갱신됩니다.
            언제든지 해지하실 수 있어요.
          </p>
        </div>

        <section
          className="rounded-2xl border p-6 mb-8"
          style={{
            borderColor: "rgba(15,26,53,0.1)",
            background: BRAND.lavender,
          }}
        >
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: BRAND.muted }}>
                상품
              </p>
              <p className="text-lg font-bold" style={{ color: BRAND.ink }}>
                {PLUS_PRODUCT_NAME}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: BRAND.muted }}>
                결제 금액
              </p>
              <p className="text-2xl font-bold tabular-nums" style={{ color: BRAND.navy }}>
                {PLUS_AMOUNT.toLocaleString()}원
              </p>
              <p className="text-xs" style={{ color: BRAND.muted }}>
                매월 자동결제
              </p>
            </div>
          </div>
          <ul className="space-y-2">
            {[
              "메시지·인사 한도 없이 — 무료는 월 메시지·하루 인사 한도, 플러스는 결친구와 끝까지·마음껏",
              "AI 맞춤 매칭 인사이트 — \"결이 통해요\" 한 줄에서 \"왜 맞는지\" 깊은 이유까지",
              "외부앱 유도·연락처 스캠 실시간 차단 · 본인인증 · 특허 4계층 적응형 안전 — 무료 회원도 동일하게 보호받습니다",
              "언제든 해지 · 약정·위약금 없음",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm"
                style={{ color: BRAND.ink }}
              >
                <CheckCircle2
                  className="h-4 w-4 mt-0.5 flex-shrink-0"
                  style={{ color: BRAND.navy }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-5 mb-8">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2"
              style={{ color: BRAND.ink }}
            >
              이메일 (영수증 받을 주소)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
              className="w-full rounded-xl border px-4 py-3 text-base"
              style={{ borderColor: "rgba(15,26,53,0.2)" }}
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold mb-2"
              style={{ color: BRAND.ink }}
            >
              휴대폰 번호 (앱 계정과 연결됩니다)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              autoComplete="tel"
              className="w-full rounded-xl border px-4 py-3 text-base"
              style={{ borderColor: "rgba(15,26,53,0.2)" }}
            />
          </div>
          <label className="flex items-start gap-2 text-sm" style={{ color: BRAND.muted }}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-1"
            />
            <span>
              <Link href="/terms" className="underline">
                이용약관
              </Link>
              ,{" "}
              <Link href="/privacy" className="underline">
                개인정보처리방침
              </Link>
              , 정기결제 진행에 동의합니다. 결제는 토스페이먼츠를 통해 안전하게 처리되며,
              카드 정보는 티타 서버에 저장되지 않습니다.
            </span>
          </label>
        </section>

        {error && (
          <div
            className="rounded-xl border-2 p-4 mb-6 text-sm"
            style={{ borderColor: "#E53935", color: "#E53935", background: "#FFF5F5" }}
          >
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full rounded-full px-6 py-4 text-base font-bold text-white shadow-lg transition disabled:opacity-60"
          style={{ background: BRAND.navy }}
        >
          {loading ? "결제창을 여는 중…" : `${PLUS_AMOUNT.toLocaleString()}원 결제하기`}
        </button>

        <div
          className="mt-8 rounded-xl p-4 text-xs flex items-start gap-2"
          style={{ background: BRAND.lavender, color: BRAND.muted }}
        >
          <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.navy }} />
          <p>
            결제는 토스페이먼츠 PG가 처리합니다. 카드 정보는 토스페이먼츠 서버에만 저장되며,
            티타은 마지막 4자리와 카드사 정보만 받습니다. 매월 결제 1일 전 이메일로 안내드립니다.
            해지는 고객지원으로 요청하시면 즉시 처리해드립니다.
          </p>
        </div>
      </main>
    </div>
  );
}
