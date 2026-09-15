/**
 * /for-children/ask/{token} — 부모님이 보내신 '의견 묻기' 카드가 도착하는 곳.
 *
 * 이 페이지가 지키는 것 셋
 * ------------------------
 * 1. **결혼중개 사이트로 보이면 안 된다.** 자녀가 도착해서 처음 읽는 문장은
 *    "부모님이 또래 친구를 만나시는 앱"이다. 여기가 어디인지부터 말한다.
 * 2. **상대 집안의 사진과 상세는 없다.** 그쪽은 자녀에게 공개하는 데 동의한
 *    적이 없다. 분위기 태그와 나이대·직군·지역까지가 전부다.
 * 3. **누르기 전에 결과를 알려준다.** 세 선택지 각각에 "이걸 누르면 누구에게
 *    무엇이 가는지"를 붙였다. 특히 '지금은 아니에요'가 상대 집안에 가지
 *    않는다는 사실은 누르기 전에 읽혀야 한다.
 *
 * 정적 익스포트(output: 'export')라 토큰을 동적 라우트로 못 받는다.
 * firebase.json의 `/for-children/ask/**` 리라이트가 이 정적 셸을 내려주고,
 * 토큰은 경로에서 읽는다(/invite 와 같은 방식). 덕분에 OG 태그가 물리적으로
 * 중립이라 집안 정보가 카톡 미리보기로 샐 경로가 구조에서 막힌다.
 */
"use client";

import { useCallback, useEffect, useState } from "react";
import { TITA, KOREAN_FONT_STACK } from "../../_components/tita-brand";

type Answer = "interested" | "no" | "offline";

type Household = {
  tags?: string[];
  child_lines?: string[];
};

type AskPayload = {
  state: string;
  answer: Answer | null;
  child_label: string;
  household: Household | null;
};

type Screen = "loading" | "ready" | "answered" | "expired" | "error";

const API = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL ?? "";

const CHOICES: { key: Answer; label: string; hint: string }[] = [
  {
    key: "interested",
    label: "관심이 갑니다",
    hint: "부모님께 전해드리고, 다음에 뭘 하면 되는지 안내해 드릴게요",
  },
  {
    key: "offline",
    label: "부모님께 직접 말할게요",
    hint: "부모님께는 '직접 이야기 나누시겠답니다'라고만 전해집니다",
  },
  {
    key: "no",
    label: "지금은 아니에요",
    hint: "부모님께만 조용히 전해집니다. 상대 집안에는 아무것도 가지 않습니다",
  },
];

function tokenFromPath(): string | null {
  try {
    // /for-children/ask/{token}/ → 마지막 비어있지 않은 조각
    const parts = window.location.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    return last && last !== "ask" ? last : null;
  } catch {
    return null;
  }
}

export default function AskPage() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [data, setData] = useState<AskPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [chosen, setChosen] = useState<Answer | null>(null);

  useEffect(() => {
    const t = tokenFromPath();
    if (!t || !API) {
      setScreen("error");
      return;
    }
    setToken(t);
    fetch(`${API}/api/v1/public/sadon/asks/${encodeURIComponent(t)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: AskPayload) => {
        setData(d);
        setChosen(d.answer);
        setScreen(d.state === "answered" ? "answered" : "ready");
      })
      .catch((s) => setScreen(s === 410 ? "expired" : "error"));
  }, []);

  const answer = useCallback(
    async (choice: Answer) => {
      if (!token || sending) return;
      setSending(true);
      try {
        const res = await fetch(
          `${API}/api/v1/public/sadon/asks/${encodeURIComponent(token)}/answer`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answer: choice }),
          },
        );
        if (res.status === 410) {
          setScreen("expired");
          return;
        }
        if (!res.ok && res.status !== 409) throw new Error(String(res.status));
        setChosen(choice);
        setScreen("answered");
      } catch {
        setScreen("error");
      } finally {
        setSending(false);
      }
    },
    [token, sending],
  );

  if (screen === "loading") return <Shell />;

  if (screen === "expired") {
    return (
      <Shell>
        <Notice
          title="링크가 만료되었어요"
          body="보내주신 지 7일이 지났습니다. 부모님께 다시 보내달라고 말씀해 주세요."
        />
      </Shell>
    );
  }

  if (screen === "error") {
    return (
      <Shell>
        <Notice
          title="잠시 뒤에 다시 열어주세요"
          body="링크를 여는 중에 문제가 있었어요."
        />
      </Shell>
    );
  }

  if (screen === "answered") {
    const c = CHOICES.find((x) => x.key === chosen);
    return (
      <Shell>
        <Notice
          title="전해드렸어요"
          body={c ? c.hint : "부모님께 전해드렸습니다."}
        />
      </Shell>
    );
  }

  const household = data?.household ?? null;

  return (
    <Shell>
      {/* 1. 여기가 어디인지 먼저 */}
      <p className="text-[15px] font-semibold tracking-wide" style={{ color: TITA.camel }}>
        티타
      </p>
      <h1
        className="mt-2 text-[24px] font-bold leading-snug"
        style={{ color: TITA.ink }}
      >
        {household ? "부모님이 보신 집안이에요" : "부모님이 보내신 카드예요"}
      </h1>
      <p className="mt-3 text-[16px] leading-relaxed" style={{ color: TITA.muted }}>
        티타는 부모님이 또래 친구를 만나시는 앱이에요. 여기서 보고 계신 걸
        한 번 보여드리고 싶어 하셨습니다.
      </p>

      {/* 2. 요약 — 사진 없음, 이름 없음 */}
      <section
        className="mt-8 rounded-[20px] bg-white p-6"
        style={{ boxShadow: "0 8px 28px rgba(31,78,61,0.08)" }}
      >
        {household ? (
          <>
            <div className="flex flex-wrap gap-2">
              {(household.tags ?? []).map((t) => (
                <span
                  key={t}
                  className="rounded-full px-3.5 py-2 text-[15px]"
                  style={{ backgroundColor: TITA.surface, color: TITA.ink }}
                >
                  {t}
                </span>
              ))}
            </div>
            {(household.child_lines ?? []).length > 0 && (
              <>
                <div className="my-5 h-px" style={{ backgroundColor: TITA.sage }} />
                <p className="text-[17px] leading-relaxed" style={{ color: TITA.ink }}>
                  {(household.child_lines ?? []).join("  ·  ")}
                </p>
              </>
            )}
          </>
        ) : (
          <p className="text-[17px] leading-relaxed" style={{ color: TITA.ink }}>
            부모님이 사돈 찻자리를 알아보고 계세요. 자녀분 의견을 먼저 여쭙고
            싶으시다고 하셨습니다.
          </p>
        )}
      </section>

      {/* 3. 세 갈래. '아니오'의 부담을 세 번째가 받아준다 */}
      <div className="mt-8 space-y-3">
        {CHOICES.map((c, i) => (
          <button
            key={c.key}
            onClick={() => answer(c.key)}
            disabled={sending}
            // 터치 타겟을 넉넉히 — 읽는 사람은 자녀지만 40~50대도 적지 않다.
            className="w-full rounded-[16px] px-5 py-4 text-left transition disabled:opacity-60"
            style={
              i === 0
                ? { backgroundColor: TITA.forest, color: TITA.white }
                : {
                    backgroundColor: TITA.white,
                    color: TITA.ink,
                    border: `1px solid ${TITA.sage}`,
                  }
            }
          >
            <span className="block text-[18px] font-semibold">{c.label}</span>
            <span
              className="mt-1 block text-[14px] leading-relaxed"
              style={{ color: i === 0 ? "rgba(255,255,255,0.82)" : TITA.muted }}
            >
              {c.hint}
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 text-[13px] leading-relaxed" style={{ color: TITA.mutedSoft }}>
        이 링크는 7일 뒤 만료됩니다. 답하신 내용은 부모님께만 전해집니다.
      </p>
    </Shell>
  );
}

function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <main
      className="min-h-screen px-5 py-10 sm:px-6"
      style={{ backgroundColor: TITA.cream, fontFamily: KOREAN_FONT_STACK }}
    >
      <div className="mx-auto w-full max-w-md">{children}</div>
    </main>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="pt-6">
      <h1 className="text-[22px] font-bold leading-snug" style={{ color: TITA.ink }}>
        {title}
      </h1>
      <p className="mt-3 text-[16px] leading-relaxed" style={{ color: TITA.muted }}>
        {body}
      </p>
    </div>
  );
}
