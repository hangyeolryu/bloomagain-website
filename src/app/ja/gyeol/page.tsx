"use client";

// 波長タイプ診断（日本語版）— 無登録の最上部流入フック（日本市場テスト）。
// intro → 12問 → プロフィール2問 → 結果インライン + 先行案内(ウェイトリスト)。
// 目的: アプリ未ローンチの日本で「需要」を測る。完了 = Lead、先行案内 = 強い意向シグナル。

import { useState } from "react";
import { TITA } from "../../_components/tita-brand";
import { QUESTIONS, TYPES, scoreToCode, type GyeolCode } from "./data";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import { recordGyeolEvent } from "../../gyeol/gyeol-events";

// 日本の端末に標準搭載のフォントを使う（バンドル不要）。
const JP_SANS =
  "'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',YuGothic,'Noto Sans JP',Meiryo,sans-serif";
const JP_SERIF =
  "'Hiragino Mincho ProN','Yu Mincho',YuMincho,'Noto Serif JP',serif";

// 先行案内の登録先（Googleフォーム/Tally等）。未設定ならその場でお礼表示。
const WAITLIST_URL = process.env.NEXT_PUBLIC_JP_WAITLIST_URL || "";

const GENDERS = [
  { key: "f", label: "女性" },
  { key: "m", label: "男性" },
] as const;
const COMFORTS = [
  { key: "same", label: "同性の友だちが気楽" },
  { key: "any", label: "波長が合えば、どちらでも" },
  { key: "opp", label: "異性の友だちもいい" },
] as const;

export default function GyeolTestJaPage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<("a" | "b")[]>([]);
  const [stage, setStage] = useState<"quiz" | "profile" | "result">("quiz");
  const [gender, setGender] = useState<string | null>(null);
  const [comfort, setComfort] = useState<string | null>(null);
  const [code, setCode] = useState<GyeolCode | null>(null);
  const [joined, setJoined] = useState(false);

  const total = QUESTIONS.length;

  function begin() {
    logAnalyticsEvent("gyeol_test_start", { locale: "ja" });
    recordGyeolEvent("start");
    trackPixel("GyeolTestStart", { locale: "ja" }, true);
    setStarted(true);
  }

  function choose(pick: "a" | "b") {
    const next = [...answers];
    next[step] = pick;
    setAnswers(next);
    if (step + 1 < total) setStep(step + 1);
    else setStage("profile");
  }

  function finish() {
    const c = scoreToCode(answers);
    setCode(c);
    logAnalyticsEvent("gyeol_test_complete", {
      gyeol_type: c,
      gyeol_gender: gender ?? "",
      gyeol_comfort: comfort ?? "",
      locale: "ja",
    });
    recordGyeolEvent("complete", c, { gender, comfort });
    trackPixel("Lead", { content_name: c, content_category: "gyeol_test_ja" });
    setStage("result");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }

  function joinWaitlist() {
    logAnalyticsEvent("jp_waitlist_click", { gyeol_type: code ?? "" });
    recordGyeolEvent("download", code ?? undefined, { gender, comfort });
    trackPixel("CompleteRegistration", {
      content_name: code ?? "",
      content_category: "jp_waitlist",
    });
    if (WAITLIST_URL) {
      window.open(WAITLIST_URL, "_blank", "noopener");
    }
    setJoined(true);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  const primaryBtn: React.CSSProperties = {
    width: "100%",
    padding: "18px 24px",
    fontSize: 18,
    fontWeight: 700,
    color: TITA.cream,
    background: TITA.forest,
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    fontFamily: JP_SANS,
    boxShadow: "0 8px 24px rgba(31,78,61,0.24)",
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(160deg, ${TITA.cream} 0%, ${TITA.surface} 100%)`,
        fontFamily: JP_SANS,
        color: TITA.ink,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
      }}
    >
      {!started ? (
        // ── イントロ ──
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🍵</div>
          <p
            style={{
              color: TITA.forestMid,
              fontWeight: 700,
              letterSpacing: "-0.2px",
              fontSize: 15,
              margin: "0 0 12px",
            }}
          >
            45歳以上、波長の合う友だちを見つける
          </p>
          <h1
            style={{
              fontSize: 33,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              lineHeight: 1.35,
              margin: "0 0 16px",
              color: TITA.forestDeep,
              fontFamily: JP_SERIF,
            }}
          >
            あなたは
            <br />
            どんな波長の人？
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: TITA.muted, margin: "0 0 32px" }}>
            12の質問でわかる、あなたの<b style={{ color: TITA.ink }}>波長タイプ</b>。
            <br />
            3分で十分。登録なしで、すぐ。
          </p>
          <button onClick={begin} style={primaryBtn}>
            診断をはじめる
          </button>
          <p style={{ fontSize: 13, color: TITA.mutedSoft, marginTop: 16, lineHeight: 1.7 }}>
            波長が合う友だちのタイプまでお伝えします。
            <br />
            ティタでは、答えるほどくっきり——本当に合う人を見つけます。
          </p>
        </div>
      ) : stage === "quiz" ? (
        // ── 12問 ──
        <div style={{ maxWidth: 520, width: "100%" }}>
          <div style={{ marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: TITA.muted,
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              <span>
                {step + 1} / {total}
              </span>
              <button
                onClick={back}
                disabled={step === 0}
                style={{
                  background: "none",
                  border: "none",
                  color: step === 0 ? TITA.mutedSoft : TITA.forestMid,
                  cursor: step === 0 ? "default" : "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: JP_SANS,
                  padding: 0,
                }}
              >
                ← 戻る
              </button>
            </div>
            <div style={{ height: 6, background: TITA.sage, borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${((step + 1) / total) * 100}%`,
                  background: TITA.forest,
                  borderRadius: 999,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.3px",
              lineHeight: 1.45,
              color: TITA.forestDeep,
              margin: "0 0 28px",
              minHeight: 68,
              fontFamily: JP_SERIF,
            }}
          >
            {QUESTIONS[step].q}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(["a", "b"] as const).map((key) => {
              const opt = QUESTIONS[step][key];
              return (
                <button
                  key={key}
                  onClick={() => choose(key)}
                  style={{
                    padding: "22px 24px",
                    fontSize: 17,
                    fontWeight: 600,
                    textAlign: "left",
                    color: TITA.ink,
                    background: TITA.white,
                    border: `2px solid ${TITA.sage}`,
                    borderRadius: 16,
                    cursor: "pointer",
                    fontFamily: JP_SANS,
                    lineHeight: 1.5,
                    transition: "border-color 0.15s, transform 0.05s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = TITA.forestMid)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = TITA.sage)}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>
      ) : stage === "profile" ? (
        // ── プロフィール2問（任意・匿名） ──
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🍵</div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.3px",
              lineHeight: 1.4,
              color: TITA.forestDeep,
              margin: "0 0 8px",
              fontFamily: JP_SERIF,
            }}
          >
            最後に、ふたつだけ
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: TITA.muted, margin: "0 0 28px" }}>
            結果をより正確にお伝えします。（任意・匿名で集計します）
          </p>

          <p style={{ fontSize: 14, fontWeight: 700, color: TITA.forestMid, margin: "0 0 10px", textAlign: "left" }}>
            わたしは
          </p>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {GENDERS.map((g) => {
              const on = gender === g.key;
              return (
                <button
                  key={g.key}
                  onClick={() => setGender(on ? null : g.key)}
                  style={{
                    flex: 1,
                    padding: "16px 12px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: on ? TITA.cream : TITA.ink,
                    background: on ? TITA.forest : TITA.white,
                    border: `2px solid ${on ? TITA.forest : TITA.sage}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: JP_SANS,
                  }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: 14, fontWeight: 700, color: TITA.forestMid, margin: "0 0 4px", textAlign: "left" }}>
            どんな人と一緒だと、より心地よいですか？
          </p>
          <p style={{ fontSize: 12.5, color: TITA.mutedSoft, margin: "0 0 10px", textAlign: "left" }}>
            友だちとして 🙂
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {COMFORTS.map((c) => {
              const on = comfort === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setComfort(on ? null : c.key)}
                  style={{
                    padding: "16px 18px",
                    fontSize: 16,
                    fontWeight: 600,
                    textAlign: "left",
                    color: on ? TITA.cream : TITA.ink,
                    background: on ? TITA.forest : TITA.white,
                    border: `2px solid ${on ? TITA.forest : TITA.sage}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: JP_SANS,
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <button onClick={finish} style={primaryBtn}>
            結果を見る 🍵
          </button>
          <button
            onClick={finish}
            style={{
              background: "none",
              border: "none",
              color: TITA.mutedSoft,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: JP_SANS,
              marginTop: 14,
            }}
          >
            スキップして結果を見る
          </button>
        </div>
      ) : (
        // ── 結果（インライン）+ 先行案内 ──
        code && <ResultView
          type={TYPES[code]}
          matchType={TYPES[TYPES[code].match]}
          joined={joined}
          onJoin={joinWaitlist}
          serif={JP_SERIF}
          sans={JP_SANS}
        />
      )}
    </main>
  );
}

function ResultView({
  type,
  matchType,
  joined,
  onJoin,
  serif,
  sans,
}: {
  type: (typeof TYPES)[GyeolCode];
  matchType: (typeof TYPES)[GyeolCode];
  joined: boolean;
  onJoin: () => void;
  serif: string;
  sans: string;
}) {
  return (
    <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
      <div style={{ fontSize: 60, marginBottom: 6 }}>{type.emoji}</div>
      <p style={{ fontSize: 14, fontWeight: 700, color: TITA.forestMid, margin: "0 0 4px" }}>
        あなたの波長タイプは
      </p>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          lineHeight: 1.3,
          margin: "0 0 6px",
          color: TITA.forestDeep,
          fontFamily: serif,
        }}
      >
        {type.name}
      </h1>
      <p style={{ fontSize: 16, color: TITA.muted, fontWeight: 600, margin: "0 0 20px" }}>
        {type.tagline}
      </p>

      <div
        style={{
          background: TITA.white,
          border: `1px solid ${TITA.sage}`,
          borderRadius: 18,
          padding: "22px 22px",
          textAlign: "left",
          marginBottom: 16,
        }}
      >
        <p style={{ fontSize: 15.5, lineHeight: 1.75, color: TITA.ink, margin: 0 }}>{type.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {type.strengths.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: TITA.forestMid,
                background: TITA.cream,
                border: `1px solid ${TITA.sage}`,
                borderRadius: 999,
                padding: "6px 12px",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          background: TITA.white,
          border: `1px solid ${TITA.sage}`,
          borderRadius: 18,
          padding: "20px 22px",
          textAlign: "left",
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: TITA.forestMid, margin: "0 0 6px" }}>
          波長が合うのは
        </p>
        <p style={{ fontSize: 18, fontWeight: 700, color: TITA.forestDeep, margin: "0 0 8px" }}>
          {matchType.emoji} {matchType.name}
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.7, color: TITA.muted, margin: 0 }}>
          {type.matchReason}
        </p>
      </div>

      <p
        style={{
          fontSize: 15.5,
          lineHeight: 1.75,
          color: TITA.ink,
          fontStyle: "normal",
          fontFamily: serif,
          margin: "0 0 24px",
          padding: "0 4px",
        }}
      >
        {type.longing}
      </p>

      {joined ? (
        <div
          style={{
            background: TITA.white,
            border: `1px solid ${TITA.sage}`,
            borderRadius: 16,
            padding: "22px 20px",
          }}
        >
          <div style={{ fontSize: 34, marginBottom: 6 }}>🍵</div>
          <p style={{ fontSize: 17, fontWeight: 700, color: TITA.forestDeep, margin: "0 0 6px" }}>
            ありがとうございます
          </p>
          <p style={{ fontSize: 14.5, lineHeight: 1.7, color: TITA.muted, margin: 0 }}>
            日本での開始が決まりしだい、いちばんにご案内します。
          </p>
        </div>
      ) : (
        <>
          <button
            onClick={onJoin}
            style={{
              width: "100%",
              padding: "18px 24px",
              fontSize: 18,
              fontWeight: 700,
              color: TITA.cream,
              background: TITA.forest,
              border: "none",
              borderRadius: 16,
              cursor: "pointer",
              fontFamily: sans,
              boxShadow: "0 8px 24px rgba(31,78,61,0.24)",
            }}
          >
            先行案内を受け取る
          </button>
          <p style={{ fontSize: 13, color: TITA.mutedSoft, marginTop: 14, lineHeight: 1.7 }}>
            ティタは日本でまもなく。
            <br />
            45歳以上・恋愛／婚活ではありません。
          </p>
        </>
      )}
    </div>
  );
}
