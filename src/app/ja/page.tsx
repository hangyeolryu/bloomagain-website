import type { Metadata } from "next";
import Link from "next/link";
import { TITA } from "../_components/tita-brand";

// 日本向けブランドホーム (tita-app.com/ja)。
// アプリは日本未ローンチのため、ダウンロードではなく「波長診断 → 先行案内」へ誘導。
// /ja/gyeol からロゴ/ホームで戻る先としても機能する。

export const metadata: Metadata = {
  title: "ティタ — 波長の合う同世代と、昼にゆるやかに",
  description:
    "本人確認を済ませた、波長の合う同世代と昼にゆるやかに集まる、安心のティータイム。45歳以上・恋愛／婚活ではありません。日本の各都市で順次オープン予定。",
  openGraph: {
    title: "ティタ — 波長の合う同世代と、昼にゆるやかに",
    description:
      "本人確認を済ませた、波長の合う同世代と。安心して集える大人のティータイム。45歳以上・恋愛／婚活ではありません。",
    siteName: "ティタ",
    locale: "ja_JP",
    type: "website",
  },
};

const JP_SANS =
  "'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',YuGothic,'Noto Sans JP',Meiryo,sans-serif";
const JP_SERIF =
  "'Hiragino Mincho ProN','Yu Mincho',YuMincho,'Noto Serif JP',serif";

const POINTS = [
  {
    icon: "🪪",
    title: "本人確認を済ませた方だけ",
    body: "はじめて会う相手でも、安心して。本人確認を済ませた方だけが集まります。",
  },
  {
    icon: "🍵",
    title: "波長の合う同世代と",
    body: "「誰でも」ではなく、波長の合う人と。だから、はじめてでも肩の力が抜けます。",
  },
  {
    icon: "☀️",
    title: "昼に、ゆるやかに",
    body: "大きな集まりが苦手でも大丈夫。少人数で、昼に、気軽なティータイムから。",
  },
];

export default function TitaJaHome() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(170deg, ${TITA.cream} 0%, ${TITA.surface} 100%)`,
        fontFamily: JP_SANS,
        color: TITA.ink,
      }}
    >
      {/* ── ヒーロー ── */}
      <section
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "72px 24px 40px",
          textAlign: "center",
        }}
      >
        <Link
          href="/ja"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            marginBottom: 40,
          }}
        >
          <span style={{ position: "relative", width: 34, height: 34, display: "inline-block" }}>
            <span
              style={{
                position: "absolute", left: 0, top: 5, width: 24, height: 24,
                borderRadius: "50%", background: "#D9694C",
              }}
            />
            <span
              style={{
                position: "absolute", right: 0, top: 5, width: 24, height: 24,
                borderRadius: "50%", background: TITA.forest,
              }}
            />
          </span>
          <span style={{ fontWeight: 800, fontSize: 24, color: TITA.forest, letterSpacing: 0.5 }}>
            ティタ
          </span>
        </Link>

        <p
          style={{
            color: TITA.forestMid,
            fontWeight: 700,
            fontSize: 15,
            margin: "0 0 14px",
            letterSpacing: 0.2,
          }}
        >
          45歳以上、安心して集えるティータイム
        </p>
        <h1
          style={{
            fontFamily: JP_SERIF,
            fontSize: 38,
            fontWeight: 700,
            lineHeight: 1.4,
            letterSpacing: "-0.5px",
            color: TITA.forestDeep,
            margin: "0 0 20px",
          }}
        >
          波長の合う同世代と、
          <br />
          昼にゆるやかに。
        </h1>
        <p style={{ fontSize: 17, lineHeight: 1.85, color: TITA.muted, margin: "0 0 36px" }}>
          本人確認を済ませた、波長の合う同世代と。
          <br />
          展覧会も、カフェも、また一緒に。
        </p>

        <Link
          href="/ja/gyeol"
          style={{
            display: "inline-block",
            padding: "18px 44px",
            fontSize: 18,
            fontWeight: 700,
            color: TITA.cream,
            background: TITA.forest,
            borderRadius: 16,
            textDecoration: "none",
            boxShadow: "0 8px 24px rgba(31,78,61,0.24)",
          }}
        >
          無料で波長診断
        </Link>
        <p style={{ fontSize: 13.5, color: TITA.mutedSoft, marginTop: 16 }}>
          登録なし・3分。あなたの波長タイプがわかります。
        </p>
      </section>

      {/* ── 3つのポイント ── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "12px 24px 8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {POINTS.map((p) => (
            <div
              key={p.title}
              style={{
                background: TITA.white,
                border: `1px solid ${TITA.sage}`,
                borderRadius: 18,
                padding: "22px 22px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 8 }}>{p.icon}</div>
              <p style={{ fontSize: 17, fontWeight: 700, color: TITA.forestDeep, margin: "0 0 6px" }}>
                {p.title}
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: TITA.muted, margin: 0 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── まもなく・先行案内 ── */}
      <section style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 24px", textAlign: "center" }}>
        <div
          style={{
            background: TITA.white,
            border: `1px solid ${TITA.sage}`,
            borderRadius: 20,
            padding: "36px 26px",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 10 }}>🍵</div>
          <h2
            style={{
              fontFamily: JP_SERIF,
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.5,
              color: TITA.forestDeep,
              margin: "0 0 12px",
            }}
          >
            ティタは、日本の各都市で
            <br />
            順次オープン予定です。
          </h2>
          <p style={{ fontSize: 15.5, lineHeight: 1.8, color: TITA.muted, margin: "0 0 26px" }}>
            まずは波長診断から。あなたの街でオープンした時に、
            <br />
            招待リンクをいちばんにお届けします。
          </p>
          <Link
            href="/ja/gyeol"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              fontSize: 17,
              fontWeight: 700,
              color: TITA.cream,
              background: TITA.forest,
              borderRadius: 14,
              textDecoration: "none",
            }}
          >
            診断して先行案内を受け取る
          </Link>
        </div>
      </section>

      {/* ── フッター ── */}
      <footer
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "24px 24px 56px",
          textAlign: "center",
          fontSize: 13,
          color: TITA.mutedSoft,
          lineHeight: 1.9,
        }}
      >
        tita-app.com　·　45歳以上　·　恋愛／婚活ではありません
      </footer>
    </main>
  );
}
