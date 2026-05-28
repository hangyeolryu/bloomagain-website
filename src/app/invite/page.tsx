"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Heart,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  UserCheck,
  Bell,
  BellOff,
  Loader2,
} from "lucide-react";

import { requestFcmToken } from "@/lib/firebase";

const BRAND = {
  navy:      "#10367D",
  navyDeep:  "#0A2459",
  navySoft:  "#2D54A1",
  lavender:  "#EBEBEB",
  ink:       "#0F1A35",
  muted:     "#4A5878",
  success:   "#15803D",
  danger:    "#B91C1C",
} as const;

type Phase =
  | "preview"          // showing what they're about to accept
  | "nice"             // NICE verification in progress (placeholder for now)
  | "accepting"        // POSTing to backend
  | "success"          // accept succeeded + FCM token registered
  | "success-no-push"  // accept succeeded, push notifications declined/unavailable
  | "error";           // accept failed (expired, invalid code, etc.)

export default function InvitePage() {
  const [code, setCode] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("preview");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // Extract the invite code from the URL path: /invite/<CODE>
    const parts = window.location.pathname.split("/").filter(Boolean);
    const raw = parts[parts.length - 1] ?? "";
    if (raw && raw !== "invite") setCode(raw.toUpperCase());
  }, []);

  // ── Accept handler — calls /api/family/accept with placeholder hash ──
  // The real flow proxies NICE PASS (계좌인증/휴대폰인증) → CI hash. For
  // staged rollout, we run a "mocked NICE" prompt that asks the child to
  // confirm consent + uses a deterministic hash from a non-PII placeholder
  // so the backend can complete the link state. The web flow will be
  // upgraded to real NICE in a follow-up patch.
  //
  // We also capture an FCM Web token *before* posting accept so the backend
  // can store it on the family_link row. Risk-alert fan-out (handled in
  // bloomagain-korea/app/services/family_service.fan_out_risk_alert) targets
  // these tokens directly. If the user denies notification permission we
  // still complete the link — they can opt in later from the parent app.
  async function handleAccept() {
    setPhase("nice");
    setErrorMessage("");

    try {
      // 1. NICE handshake (stub for now). See runNiceFlowStub() bottom of file.
      const childPhoneHash = await runNiceFlowStub(code);

      // 2. Notification permission + FCM Web token. Best-effort; null when
      //    the user denied permission or the browser doesn't support FCM.
      const fcmToken = await requestFcmToken();

      // 3. POST to backend.
      setPhase("accepting");
      const res = await fetch("/api/family/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invite_code: code,
          child_phone_hash: childPhoneHash,
          // null is fine — the backend treats missing token as "child wants
          // SMS / declined push". The family_link row is still ACTIVE.
          child_fcm_token: fcmToken,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "초대 처리에 실패했어요.");
      }
      setPhase(fcmToken ? "success" : "success-no-push");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "알 수 없는 오류";
      setErrorMessage(msg);
      setPhase("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BRAND.lavender, color: BRAND.ink }}>
      {/* Header — matches the marketing site styling */}
      <header
        className="border-b"
        style={{ background: "white", borderColor: "rgba(15,26,53,0.08)" }}
      >
        <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/app_icon.svg"
              alt="다시, 봄 로고"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-xl font-bold" style={{ color: BRAND.navy }}>
              다시, 봄
            </span>
          </Link>
          <span
            className="text-xs font-bold tracking-[0.15em] uppercase"
            style={{ color: BRAND.muted }}
          >
            가족 연결
          </span>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-10 lg:py-16">
        {phase === "preview" && (
          <PreviewCard code={code} agreed={agreed} setAgreed={setAgreed} onAccept={handleAccept} />
        )}
        {phase === "nice" && <NiceCard />}
        {phase === "accepting" && <AcceptingCard />}
        {phase === "success" && <SuccessCard withPush />}
        {phase === "success-no-push" && <SuccessCard withPush={false} />}
        {phase === "error" && (
          <ErrorCard message={errorMessage} onRetry={() => setPhase("preview")} />
        )}
      </main>

      <footer
        className="border-t py-8 text-center text-xs"
        style={{
          background: "white",
          borderColor: "rgba(15,26,53,0.08)",
          color: BRAND.muted,
        }}
      >
        © 2026 EFFEFF Co., Ltd · ceo@effeffcorp.com
      </footer>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Phase cards
// ────────────────────────────────────────────────────────────────────────────

function PreviewCard({
  code,
  agreed,
  setAgreed,
  onAccept,
}: {
  code: string;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  onAccept: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center space-y-3">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl"
          style={{ background: BRAND.navy }}
        >
          <Heart className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: BRAND.ink }}>
          부모님이 가족 연결을<br className="sm:hidden" /> 요청하셨어요
        </h1>
        <p className="text-sm sm:text-base" style={{ color: BRAND.muted }}>
          본인인증 후 연결을 완료하시면 부모님의 안전을 함께 지킬 수 있습니다.
        </p>
      </div>

      {/* Invite code badge */}
      <div
        className="rounded-2xl bg-white p-5 text-center border"
        style={{ borderColor: "rgba(15,26,53,0.08)" }}
      >
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-2"
          style={{ color: BRAND.muted }}
        >
          초대 코드
        </p>
        <p
          className="text-2xl sm:text-3xl font-bold tracking-[0.2em] tabular-nums"
          style={{ color: BRAND.navy }}
        >
          {code || "····"}
        </p>
      </div>

      {/* What you'll get */}
      <div className="rounded-2xl bg-white p-5 sm:p-6 space-y-4">
        <h2 className="text-lg font-bold" style={{ color: BRAND.ink }}>
          연결 후 자녀로서 받게 되는 것
        </h2>
        <ul className="space-y-3">
          {[
            {
              icon: Bell,
              title: "위험 신호 즉시 알림",
              description:
                "부모님께 사기·스캠 의심 메시지가 감지되면 자녀에게 즉시 알림이 갑니다.",
            },
            {
              icon: UserCheck,
              title: "주간 활동 요약",
              description:
                "부모님이 어떤 모임에서 활동하시는지, 메시지·구체 내용 없이 요약만 받아봅니다.",
            },
            {
              icon: Lock,
              title: "부모님 사생활 보호",
              description:
                "부모님의 대화 내용과 연락처는 자녀에게 보이지 않아요. 활동 요약과 안전 알림만 받아보실 수 있습니다.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.title} className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: `${BRAND.navy}12` }}
                >
                  <Icon className="h-4 w-4" style={{ color: BRAND.navy }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: BRAND.ink }}>
                    {item.title}
                  </p>
                  <p
                    className="text-xs sm:text-sm leading-relaxed mt-0.5"
                    style={{ color: BRAND.muted }}
                  >
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Consent checkbox */}
      <label
        className="flex items-start gap-3 rounded-2xl bg-white p-4 cursor-pointer border-2 transition-colors"
        style={{
          borderColor: agreed ? BRAND.navy : "rgba(15,26,53,0.08)",
        }}
      >
        <input
          type="checkbox"
          className="mt-1 w-5 h-5 cursor-pointer"
          style={{ accentColor: BRAND.navy }}
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span className="text-sm leading-relaxed" style={{ color: BRAND.ink }}>
          <strong>동의합니다.</strong> 부모님과의 가족 연결을 위해 본인인증을
          진행하고, 위 항목의 정보를 받는 것에 동의합니다. 부모님 또는 자녀는
          언제든 연결을 해제할 수 있습니다.
        </span>
      </label>

      <button
        onClick={onAccept}
        disabled={!agreed || code.length < 4}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold text-white transition disabled:opacity-50"
        style={{ background: agreed && code.length >= 4 ? BRAND.navy : BRAND.muted }}
      >
        본인인증 후 연결하기
        <ArrowRight className="h-5 w-5" />
      </button>

      <p className="text-xs text-center" style={{ color: BRAND.muted }}>
        본인인증은 <strong>NICE</strong> 본인확인 서비스를 통해 안전하게 처리됩니다.
        <br />
        다시봄은 자녀의 휴대폰 번호 평문을 저장하지 않고, 해시(SHA-256)만 보관합니다.
      </p>
    </div>
  );
}

function NiceCard() {
  return (
    <div className="rounded-2xl bg-white p-8 sm:p-10 text-center space-y-4">
      <div className="flex justify-center">
        <ShieldCheck className="h-16 w-16" style={{ color: BRAND.navy }} />
      </div>
      <h2 className="text-xl font-bold" style={{ color: BRAND.ink }}>
        본인인증 진행 중
      </h2>
      <p className="text-sm" style={{ color: BRAND.muted }}>
        NICE 본인확인 창이 열립니다. 잠시만 기다려주세요.
      </p>
      <Loader2
        className="h-6 w-6 mx-auto animate-spin"
        style={{ color: BRAND.navy }}
      />
    </div>
  );
}

function AcceptingCard() {
  return (
    <div className="rounded-2xl bg-white p-8 sm:p-10 text-center space-y-4">
      <Loader2
        className="h-12 w-12 mx-auto animate-spin"
        style={{ color: BRAND.navy }}
      />
      <h2 className="text-xl font-bold" style={{ color: BRAND.ink }}>
        가족 연결을 완료하고 있어요
      </h2>
      <p className="text-sm" style={{ color: BRAND.muted }}>
        잠시만 기다려주세요…
      </p>
    </div>
  );
}

function SuccessCard({ withPush }: { withPush: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-8 sm:p-10 text-center space-y-5">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto"
        style={{ background: `${BRAND.success}15` }}
      >
        <CheckCircle2 className="h-9 w-9" style={{ color: BRAND.success }} />
      </div>
      <h2 className="text-2xl font-bold" style={{ color: BRAND.ink }}>
        가족 연결이 완료됐어요
      </h2>
      <p className="text-sm sm:text-base" style={{ color: BRAND.muted }}>
        이제 부모님의 활동 요약과 위험 신호 알림을<br />
        받아보실 수 있습니다.
      </p>

      {/* Push status — show explicit warning when notifications were declined
          so the child knows risk alerts will only show in-page on next visit. */}
      {!withPush && (
        <div
          className="flex items-start gap-3 rounded-xl p-4 text-left border"
          style={{
            background: "white",
            borderColor: "rgba(229,57,53,0.25)",
          }}
        >
          <BellOff
            className="h-5 w-5 flex-shrink-0 mt-0.5"
            style={{ color: BRAND.danger }}
          />
          <div className="text-xs leading-relaxed" style={{ color: BRAND.ink }}>
            <strong style={{ color: BRAND.danger }}>알림이 꺼져 있어요.</strong>{" "}
            위험 신호가 발생해도 즉시 알림을 받으실 수 없습니다. 브라우저 주소창
            왼쪽 자물쇠 아이콘에서 알림을 허용해주세요.
          </div>
        </div>
      )}

      <div
        className="rounded-xl p-4 text-left"
        style={{ background: BRAND.lavender }}
      >
        <p className="text-xs font-bold mb-2" style={{ color: BRAND.navy }}>
          다음 단계
        </p>
        <ul className="space-y-1.5 text-sm" style={{ color: BRAND.ink }}>
          <li>• 첫 주간 요약은 7일 후 발송됩니다.</li>
          {withPush && <li>• 위험 신호 알림은 즉시 푸시됩니다.</li>}
          <li>• 알림에는 부모님이 주고받은 대화 내용이 포함되지 않습니다 (사생활 보호).</li>
          <li>• 부모님이 다시봄 앱을 열어두셔야 활동이 기록됩니다.</li>
        </ul>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-bold"
        style={{ color: BRAND.navy }}
      >
        홈으로 돌아가기
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-8 sm:p-10 text-center space-y-5">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto"
        style={{ background: `${BRAND.danger}15` }}
      >
        <AlertCircle className="h-9 w-9" style={{ color: BRAND.danger }} />
      </div>
      <h2 className="text-2xl font-bold" style={{ color: BRAND.ink }}>
        연결을 완료하지 못했어요
      </h2>
      <p
        className="text-sm sm:text-base"
        style={{ color: BRAND.muted }}
      >
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition"
          style={{ background: BRAND.navy }}
        >
          다시 시도하기
        </button>
        <a
          href="mailto:ceo@effeffcorp.com?subject=다시봄 가족 연결 문의"
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-bold transition"
          style={{ borderColor: BRAND.navy, color: BRAND.navy }}
        >
          문의하기
        </a>
      </div>
      <p className="text-xs" style={{ color: BRAND.muted }}>
        초대 코드가 만료되었거나, 부모님이 취소하셨을 수 있습니다.<br />
        부모님께 다시봄 앱에서 새 초대를 만들어달라고 부탁해주세요.
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// NICE flow stub
//
// TODO: replace with the real NICE PASS web flow.
//   1. Open NICE PASS in a popup, passing /nice/init from bloomagain-korea.
//   2. Receive postMessage with verification_token.
//   3. POST to /api/nice/result on this site to swap token → ci_hash.
//   4. Return the hash.
//
// For now we generate a deterministic SHA-256 over (code + 'demo') so the
// backend's `accept_invite` flow can be exercised end-to-end during preview
// builds. This MUST be replaced before public launch — a stub hash is not
// authentication.
// ────────────────────────────────────────────────────────────────────────────

async function runNiceFlowStub(code: string): Promise<string> {
  // 1.5s artificial delay to mimic NICE redirect/popup time.
  await new Promise((r) => setTimeout(r, 1500));

  const text = `dasi-bom-stub-${code}-${navigator.userAgent}`;
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
