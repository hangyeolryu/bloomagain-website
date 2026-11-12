"use client";

// "다시 꾸는 꿈" — 티타의 AI가 미뤄둔 꿈을 묻는 채팅 (45+ 광고 전용 퍼널).
//
// 앱 회원용 꿈 인터뷰(bloomagain-korea functions/dream_interview.js)의 웹판이다.
// 질문은 백엔드(POST /api/v1/dream/web-turn)가 정한다 — 여기서는 보여주고 보내기만.
// 끝나면 "같은 꿈 또래가 티타에 있다" 카드와 앱 받기 버튼을 띄운다.
//
// 화면 원칙(45+):
//  · 글씨 18px 이상, 진한 글자/밝은 바탕. 줄간격 넉넉히.
//  · 보내기 버튼은 크게. 엔터는 줄바꿈 — 모바일 자판에서 실수로 보내지 않게.
//  · 글자 수 표시를 두지 않는다. "얼마나 써야 하나"를 고민하게 만들지 않으려고.
//  · 에러는 탓하지 않는 말로, 같은 글을 다시 보낼 수 있게.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { StoreDownloadButton, type StoreKind } from "../_components/StoreDownloadButton";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import {
  getDreamSessionId,
  readUtm,
  sendDreamTurn,
  type DreamStatus,
} from "./dream-api";

type Msg = { role: "assistant" | "user"; text: string };
type Failure = { reason: "network" | "limited" | "server"; pending: string | null };

// 광고 문구 A/B. ?v=b 로 들어오면 B. 어느 쪽이 대화를 끝까지 이끄는지 utm.v로 남긴다.
const HEADLINE = {
  a: "요즘 해 보고 싶은데 미뤄둔 거, 있으세요?",
  b: "꿈이 끝난 나이는 없어요.",
} as const;

const LOG_KEY = "dream_log";

// 새로고침해도 대화가 사라지지 않게 본인 브라우저 탭에만 둔다. 탭을 닫으면 사라진다.
function loadLog(): Msg[] {
  try {
    const raw = window.sessionStorage.getItem(LOG_KEY);
    const parsed = raw ? (JSON.parse(raw) as Msg[]) : [];
    return Array.isArray(parsed) ? parsed.filter((m) => m && typeof m.text === "string") : [];
  } catch {
    return [];
  }
}

function saveLog(log: Msg[]) {
  try {
    window.sessionStorage.setItem(LOG_KEY, JSON.stringify(log.slice(-30)));
  } catch {
    /* 저장이 막혀도 대화는 이어진다 */
  }
}

const FAIL_TEXT: Record<Failure["reason"], string> = {
  network: "연결이 잠깐 끊겼어요. 써 주신 말은 그대로 있어요. 다시 보내 볼까요?",
  limited: "잠깐 이야기가 몰렸어요. 조금 뒤에 다시 보내 주세요.",
  server: "잠깐 문제가 생겼어요. 조금 뒤에 다시 보내 주세요.",
};

export default function DreamPage() {
  const [variant, setVariant] = useState<"a" | "b" | null>(null);
  const [log, setLog] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [status, setStatus] = useState<DreamStatus>("active");
  const [done, setDone] = useState(false);

  const sidRef = useRef<string>("");
  const utmRef = useRef<Record<string, string>>({});
  const hpRef = useRef<HTMLInputElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const doneLogged = useRef(false);
  const started = useRef(false);

  const finish = useCallback((st: DreamStatus, turn: number, fresh: boolean) => {
    setDone(true);
    setStatus(st);
    // 새로고침으로 이미 끝난 대화를 다시 열었을 때(fresh=false)는 두 번 세지 않는다.
    if (doneLogged.current || !fresh) return;
    doneLogged.current = true;
    // 위기로 끝난 대화는 광고 쪽(Meta)에 아무 신호도 보내지 않는다. 그 사람을
    // "완주자" 청중에 넣어 광고를 다시 띄우는 일은 없어야 한다. GA에도 끝난 방식만
    // 거칠게(완주/그만) 남기고 위기는 남기지 않는다 — 건강에 관한 신호라서.
    if (st === "crisis") return;
    logAnalyticsEvent("dream_done", { turn, ended: st === "stopped" ? "stopped" : "completed" });
    trackPixel("DreamDone", { turn }, true);
  }, []);

  const turnOnce = useCallback(
    async (message: string | null) => {
      setWaiting(true);
      setFailure(null);
      const res = await sendDreamTurn({
        sessionId: sidRef.current,
        message,
        utm: utmRef.current,
        hp: hpRef.current?.value ?? "",
      });
      setWaiting(false);
      if (!res.ok) {
        setFailure({ reason: res.reason, pending: message });
        return;
      }
      setLog((prev) => {
        const next: Msg[] = [...prev];
        if (message !== null) next.push({ role: "user", text: message });
        // 첫 말을 다시 받았을 때(새로고침) 같은 말을 두 번 쌓지 않는다.
        const last = next[next.length - 1];
        if (!(message === null && last?.role === "assistant" && last.text === res.reply)) {
          next.push({ role: "assistant", text: res.reply });
        }
        saveLog(next);
        return next;
      });
      if (message !== null) {
        // 몇 번째 답인지만. 글 내용은 절대 분석 도구로 보내지 않는다.
        logAnalyticsEvent("dream_turn", { turn: res.turn });
        trackPixel("DreamTurn", { turn: res.turn }, true);
      } else if (res.turn === 0 && !res.done) {
        logAnalyticsEvent("dream_start", { variant: utmRef.current.v ?? "a" });
        trackPixel("DreamStart", { variant: utmRef.current.v ?? "a" }, true);
      }
      if (res.done) finish(res.status, res.turn, message !== null);
    },
    [finish],
  );

  // 첫 말 받기. 정적 내보내기라 주소·세션은 마운트 뒤에야 읽을 수 있다.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const { variant: v, utm } = readUtm();
    utmRef.current = utm;
    sidRef.current = getDreamSessionId();
    const restored = loadLog();
    // 마운트 뒤 한 번 정하는 값들이라 이펙트 안에서 상태를 맞춘다.
    /* eslint-disable react-hooks/set-state-in-effect */
    setVariant(v);
    if (restored.length) setLog(restored);
    /* eslint-enable react-hooks/set-state-in-effect */
    void turnOnce(null);
  }, [turnOnce]);

  // 새 말이 오면 아래로. 큰 글씨라 화면 밖으로 밀리기 쉽다.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [log, waiting, failure, done]);

  // 쓰는 만큼 칸이 커진다(최대 6줄쯤). 길게 쓰는 분이 쓴 걸 다시 볼 수 있게.
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 220)}px`;
  }, [input]);

  function send() {
    const text = input.trim();
    if (!text || waiting || done) return;
    setInput("");
    void turnOnce(text);
  }

  function retry() {
    if (!failure) return;
    void turnOnce(failure.pending);
  }

  function onStoreClick(store: StoreKind) {
    logAnalyticsEvent("dream_download", { store });
    trackPixel("DreamDownload", { store }, true);
  }

  // ── 스타일 ────────────────────────────────────────────────────────────
  const bubbleBase: React.CSSProperties = {
    maxWidth: "88%",
    padding: "14px 18px",
    fontSize: 18,
    lineHeight: 1.75,
    letterSpacing: "-0.2px",
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
    overflowWrap: "anywhere",
    margin: 0,
  };
  const aiBubble: React.CSSProperties = {
    ...bubbleBase,
    alignSelf: "flex-start",
    background: TITA.white,
    color: TITA.ink,
    border: `1.5px solid ${TITA.sage}`,
    borderRadius: "6px 20px 20px 20px",
  };
  const userBubble: React.CSSProperties = {
    ...bubbleBase,
    alignSelf: "flex-end",
    background: TITA.forest,
    color: TITA.cream,
    borderRadius: "20px 6px 20px 20px",
  };
  const bigBtn: React.CSSProperties = {
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 18,
    fontWeight: 800,
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: TITA.cream,
        fontFamily: KOREAN_FONT_STACK,
        color: TITA.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        @keyframes dreamDot { 0%, 80%, 100% { opacity: .25; transform: translateY(0) }
                              40% { opacity: 1; transform: translateY(-4px) } }
        .dream-dot { width: 9px; height: 9px; border-radius: 50%; background: ${TITA.forestMid};
                     display: inline-block; animation: dreamDot 1.2s infinite ease-in-out; }
        .dream-ta:focus { outline: 3px solid ${TITA.camel}; outline-offset: 1px; }
        @media (prefers-reduced-motion: reduce) { .dream-dot { animation: none; opacity: .7 } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 560, padding: "24px 18px 0", flex: 1 }}>
        {/* 머리 — 광고 문구 */}
        <header style={{ marginBottom: 22 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              color: TITA.forest,
              fontSize: 17,
              fontWeight: 800,
            }}
          >
            <span
              style={{
                background: TITA.forest,
                color: TITA.cream,
                borderRadius: 10,
                padding: "4px 9px",
                fontSize: 15,
              }}
            >
              티타
            </span>
            다시 꾸는 꿈
          </Link>
          {/* 문구가 정해지기 전(마운트 전)엔 자리만 잡는다 — A가 B로 바뀌며 깜빡이지 않게. */}
          <h1
            style={{
              margin: "16px 0 8px",
              minHeight: 74,
              fontSize: 27,
              lineHeight: 1.4,
              letterSpacing: "-0.6px",
              fontWeight: 800,
              color: TITA.forestDeep,
              wordBreak: "keep-all",
            }}
          >
            {variant ? HEADLINE[variant] : ""}
          </h1>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: TITA.ink }}>
            티타의 AI와 편하게 이야기 나눠 보세요. 가입하지 않아도 돼요.
          </p>
        </header>

        {/* 대화 */}
        <section
          aria-label="티타의 AI와 나누는 대화"
          aria-live="polite"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {log.map((m, i) => (
            <p key={i} style={m.role === "assistant" ? aiBubble : userBubble}>
              {m.text}
            </p>
          ))}

          {waiting && (
            <div
              style={{ ...aiBubble, display: "flex", gap: 7, alignItems: "center", padding: "18px 20px" }}
              role="status"
            >
              <span className="dream-dot" />
              <span className="dream-dot" style={{ animationDelay: ".15s" }} />
              <span className="dream-dot" style={{ animationDelay: ".3s" }} />
              <span style={{ position: "absolute", left: -9999 }}>티타의 AI가 답을 쓰고 있어요</span>
            </div>
          )}

          {failure && (
            <div
              role="alert"
              style={{
                background: TITA.surface,
                border: `1.5px solid ${TITA.camel}`,
                borderRadius: 18,
                padding: "16px 18px",
              }}
            >
              <p style={{ margin: "0 0 12px", fontSize: 17, lineHeight: 1.7 }}>
                {FAIL_TEXT[failure.reason]}
              </p>
              <button
                type="button"
                onClick={retry}
                style={{ ...bigBtn, padding: "14px 26px", background: TITA.forest, color: TITA.cream }}
              >
                다시 보내기
              </button>
            </div>
          )}
        </section>

        {/* 끝 — 위기로 끝났으면 상담 전화만. 그 아래에 앱 홍보를 두지 않는다. */}
        {done && status === "crisis" && (
          <div
            style={{
              marginTop: 22,
              background: TITA.white,
              border: `2px solid ${TITA.forest}`,
              borderRadius: 20,
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <a href="tel:109" style={{ ...bigBtn, display: "block", textAlign: "center", padding: "16px", background: TITA.forest, color: TITA.cream, textDecoration: "none" }}>
              자살예방상담전화 109 걸기
            </a>
            <a href="tel:15770199" style={{ ...bigBtn, display: "block", textAlign: "center", padding: "16px", background: TITA.surface, color: TITA.forestDeep, textDecoration: "none", border: `1.5px solid ${TITA.forest}` }}>
              정신건강상담전화 1577-0199 걸기
            </a>
          </div>
        )}

        {done && status !== "crisis" && (
          <div
            style={{
              marginTop: 22,
              background: TITA.white,
              border: `2px solid ${TITA.forest}`,
              borderRadius: 22,
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 23,
                lineHeight: 1.45,
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: TITA.forestDeep,
                wordBreak: "keep-all",
              }}
            >
              이 꿈, 같이 할 또래가
              <br />
              티타에 있어요
            </p>
            <p style={{ margin: "0 0 18px", fontSize: 17, lineHeight: 1.7, color: TITA.ink }}>
              45세 이상, 본인인증을 마친 또래만 모여요.
              <br />
              같은 꿈을 가진 분과 천천히 시작해 보세요.
            </p>
            {/* /needs 등과 같은 다운로드 버튼 — 인앱 브라우저·기기 오감지 처리가 다 들어 있다. */}
            <StoreDownloadButton
              source="dream_result"
              label="티타에서 또래 찾기 (무료)"
              onStoreClick={onStoreClick}
              style={{ fontSize: 18, padding: "18px 28px", minWidth: 240, boxShadow: "0 10px 26px rgba(31,78,61,0.28)" }}
            />
          </div>
        )}

        <div ref={endRef} style={{ height: 8 }} />
      </div>

      {/* 입력 — 화면 아래에 붙여 둔다. 끝나면 치운다. */}
      {!done && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          style={{
            position: "sticky",
            bottom: 0,
            width: "100%",
            background: TITA.cream,
            borderTop: `1px solid ${TITA.sage}`,
            display: "flex",
            justifyContent: "center",
            padding: "12px 18px calc(12px + env(safe-area-inset-bottom))",
          }}
        >
          <div style={{ width: "100%", maxWidth: 560, display: "flex", gap: 10, alignItems: "flex-end" }}>
            {/* 숨은 칸 — 사람은 보지도 채우지도 않는다. 채워져 오면 백엔드가 봇으로 본다. */}
            <input
              ref={hpRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              defaultValue=""
              style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
            />
            <label htmlFor="dream-input" style={{ position: "absolute", left: -9999 }}>
              티타의 AI에게 보낼 말
            </label>
            <textarea
              id="dream-input"
              ref={taRef}
              className="dream-ta"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // 컴퓨터에서는 Ctrl/⌘+Enter로도 보낸다. 그냥 Enter는 줄바꿈.
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="편하게 적어 주세요"
              disabled={waiting && log.length === 0}
              style={{
                flex: 1,
                resize: "none",
                fontFamily: KOREAN_FONT_STACK,
                fontSize: 18,
                lineHeight: 1.6,
                color: TITA.ink,
                background: TITA.white,
                border: `2px solid ${TITA.forest}`,
                borderRadius: 18,
                padding: "13px 16px",
                minHeight: 58,
                maxHeight: 220,
              }}
            />
            <button
              type="submit"
              disabled={waiting || !input.trim()}
              style={{
                ...bigBtn,
                minWidth: 88,
                minHeight: 58,
                padding: "0 20px",
                background: waiting || !input.trim() ? TITA.mutedSoft : TITA.forest,
                color: TITA.cream,
                cursor: waiting || !input.trim() ? "default" : "pointer",
              }}
            >
              보내기
            </button>
          </div>
        </form>
      )}

      <p
        style={{
          width: "100%",
          maxWidth: 560,
          margin: 0,
          padding: "14px 18px 22px",
          fontSize: 17,
          lineHeight: 1.65,
          // muted(#6B7D6E)는 크림 바탕에서 대비가 4.5:1에 못 미친다. 45+ 화면이라 한 단계 진하게.
          color: TITA.forestMid,
        }}
      >
        티타의 AI가 답해요. 나눈 이야기는 이름 없이 서비스를 고치는 데만 쓰고, 90일 뒤 지워요.
      </p>
    </main>
  );
}
