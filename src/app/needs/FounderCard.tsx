"use client";

// 만든 사람 — 결과 페이지 마지막 카드. 회사가 아니라 사람이 지킨다는 약속을
// 얼굴·이름과 함께 두고, 그 자리에서 바로 연락할 수 있는 폼을 붙인다.
// 사진(public/needs/founder.jpg)이 없어도 깨지지 않게 onError로 숨긴다.
// ?v=1 — 사진 배포 전에 방문한 브라우저가 404를 캐시해 계속 안 뜨던 문제 우회.

import { useState } from "react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";

export function FounderCard({ source }: { source?: string }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [photoOk, setPhotoOk] = useState(true);

  async function submit() {
    if (sending) return;
    if (contact.trim().length < 4 || message.trim().length < 2) {
      setErr("연락받으실 곳과 내용을 적어주세요.");
      return;
    }
    setSending(true);
    setErr(null);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
      if (!backendUrl) throw new Error("no backend");
      const res = await fetch(
        `${backendUrl.replace(/\/$/, "")}/api/v1/gyeol/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim() || null,
            contact: contact.trim(),
            message: message.trim(),
            source: source ?? "needs_result",
            referrer:
              typeof document !== "undefined" ? document.referrer || null : null,
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!data.ok) throw new Error("write failed");
      setSent(true);
      logAnalyticsEvent("web_contact_sent", { source: source ?? "needs_result" });
    } catch {
      setErr("잠시 후 다시 시도해 주세요. 계속 안 되면 hello@tita-app.com으로 보내주세요.");
    } finally {
      setSending(false);
    }
  }

  const input: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 15,
    color: TITA.ink,
    background: TITA.white,
    border: `1px solid ${TITA.sage}`,
    borderRadius: 12,
    padding: "13px 14px",
    marginBottom: 8,
    outline: "none",
  };

  return (
    <div
      style={{
        marginTop: 32,
        background: TITA.white,
        border: `1px solid ${TITA.sage}`,
        borderRadius: 20,
        padding: "24px 20px",
      }}
    >
      {/* 얼굴 + 이름 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 18,
        }}
      >
        {photoOk && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/needs/founder.jpg?v=1"
            alt="티타를 만든 유한결"
            onError={() => setPhotoOk(false)}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              objectFit: "cover",
              objectPosition: "center",
              flexShrink: 0,
              border: `1px solid ${TITA.sage}`,
            }}
          />
        )}
        <div>
          <p
            style={{
              fontSize: 12.5,
              fontWeight: 800,
              color: TITA.forestMid,
              margin: "0 0 3px",
            }}
          >
            티타를 만든 사람
          </p>
          <p
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: TITA.forestDeep,
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            유한결
          </p>
        </div>
      </div>

      {/* 이야기 */}
      <p
        style={{
          fontSize: 14.5,
          lineHeight: 1.85,
          color: TITA.ink,
          margin: "0 0 14px",
        }}
      >
        미국 실리콘밸리에서 개발자로 일하다, 가족과 함께 지내려고 한국에
        들어왔어요. 그런데 이사하고 나서 부모님 곁에 아는 사람이 한 명도 없더라고요.
        평생 자식 키우고 일하느라 정작 당신들의 친구는 남아 있지 않았던 거예요.
      </p>
      <p
        style={{
          fontSize: 14.5,
          lineHeight: 1.85,
          color: TITA.ink,
          margin: "0 0 14px",
        }}
      >
        엄마가 안심하고 쓸 수 있는 곳이 없어서, 직접 만들었습니다. 그래서
        티타에는 제가 엄마에게 권하지 못할 기능은 넣지 않아요.
      </p>
      <p
        style={{
          fontSize: 14.5,
          lineHeight: 1.85,
          color: TITA.forestDeep,
          fontWeight: 700,
          margin: "0 0 18px",
        }}
      >
        티타를 쓰시는 모든 분을 제 어머니라고 생각하고 지키겠습니다.
        조금이라도 수상한 일이 있으면 무조건, 바로 알려주세요.
        앱 안에서 나눈 이야기는 끝까지 지켜드릴게요.
      </p>

      {/* 문의 폼 */}
      <div
        style={{
          background: TITA.surface,
          borderRadius: 16,
          padding: "18px 16px",
        }}
      >
        {sent ? (
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.7,
              color: TITA.forestDeep,
              fontWeight: 700,
              margin: 0,
              textAlign: "center",
            }}
          >
            잘 받았어요. 제가 직접 읽고 답신드릴게요.
            <br />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: TITA.muted }}>
              감사합니다.
            </span>
          </p>
        ) : (
          <>
            <p
              style={{
                fontSize: 14.5,
                fontWeight: 800,
                color: TITA.forestDeep,
                margin: "0 0 4px",
              }}
            >
              궁금하거나 불편한 점, 언제든 적어주세요
            </p>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.6,
                color: TITA.muted,
                margin: "0 0 12px",
              }}
            >
              제가 직접 읽고 답신드립니다. 가입하지 않으셔도 괜찮아요.
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="성함 (선택)"
              style={input}
            />
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="답신받으실 이메일 또는 휴대폰"
              style={input}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="어떤 이야기든 편하게 적어주세요"
              style={{ ...input, resize: "vertical" }}
            />
            {err && (
              <p style={{ fontSize: 13, color: "#B4413C", margin: "0 0 8px" }}>
                {err}
              </p>
            )}
            <button
              onClick={submit}
              disabled={sending}
              style={{
                width: "100%",
                fontFamily: KOREAN_FONT_STACK,
                fontSize: 15.5,
                fontWeight: 800,
                color: TITA.cream,
                background: TITA.forest,
                border: "none",
                borderRadius: 999,
                padding: "14px 20px",
                cursor: sending ? "default" : "pointer",
                opacity: sending ? 0.6 : 1,
              }}
            >
              {sending ? "보내는 중" : "보내기"}
            </button>
            <p
              style={{
                fontSize: 11.5,
                lineHeight: 1.6,
                color: TITA.muted,
                margin: "10px 0 0",
                textAlign: "center",
              }}
            >
              답신 목적으로만 사용하고, 처리 후 지웁니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
