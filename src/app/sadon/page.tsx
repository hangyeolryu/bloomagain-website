/**
 * /sadon — 10월 31일 자리 초대장
 *
 * 공개 모집 공고가 아니다. **아는 분을 통해 전해지는 초대장**이고, 링크를
 * 받은 분만 여신다. 그래서 이 페이지는 자격을 늘어놓지 않는다.
 *
 * ⚠️ 2026-09-29에 통째로 다시 썼다. 전에는 「이런 분들을 모십니다」·「조건을
 * 어디까지 보나」로 우리가 무엇을 확인하는지 설명했는데, 초대를 받고 오시는
 * 분께 자격 심사를 먼저 읽히는 건 실례다. 조건은 **폼이 조용히 받고**,
 * 자리를 짜는 데만 쓴다.
 *
 * ⚠️ 돈 이야기는 한 줄도 없다. 참가비·회비·다과 실비 전부 안 받고,
 * **다음에 유료로 한다는 예고도 하지 않는다** — 그걸 쓰면 이 자리가 유료
 * 영업의 일부로 읽힌다(04 첫 줄). 의향은 그날 설문으로만 묻는다(docs 13).
 *
 * ⚠️ "사돈"을 쓰지 않는다. 무료여도 중개 광고로 읽힌다.
 */

import type { Metadata } from "next";
import { TitaFooter } from "../_components/TitaFooter";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { InviteForm } from "./InviteForm";
import { EVENT } from "./_sadon";

export const metadata: Metadata = {
  alternates: { canonical: "/sadon/" },
  robots: { index: false, follow: false },
  title: "10월 31일, 부모님들 모이는 자리 | 티타",
  description: "미혼 자녀를 두신 부모님들이 모여 이야기 나누는 자리입니다.",
};

/** 그날 흐름. 3시 30분부터 오시고, 4시에 시작해 한 시간 반. */
const FLOW: [string, string, string][] = [
  ["3:30", "오시는 대로", "다과와 음료를 내어드릴게요. 편하신 자리에 앉으시면 됩니다."],
  ["4:00", "다 같이", "가볍게 인사 나누고, 오늘 어떻게 흘러가는지 말씀드릴게요."],
  ["4:20", "네 분씩, 세 번", "스무 분씩 자리를 옮겨 앉습니다. 세 번이면 오신 분들을 두루 만나뵙게 돼요."],
  ["5:20", "자유롭게", "더 이야기 나누고 싶은 분과 편하게. 짧은 설문 한 장 부탁드립니다."],
  ["5:30", "마칩니다", "먼저 일어나셔도 되고, 더 계셔도 됩니다."],
];

function Line({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 18, lineHeight: 1.9, color: TITA.muted, margin: "0 0 18px", wordBreak: "keep-all" }}>
      {children}
    </p>
  );
}

export default function SadonInvitePage() {
  const wrap: React.CSSProperties = { maxWidth: 640, margin: "0 auto", padding: "0 26px", width: "100%" };

  return (
    <div style={{ background: TITA.cream, color: TITA.ink, fontFamily: KOREAN_FONT_STACK, minHeight: "100vh" }}>
      {/* ── 초대장 머리 ──────────────────────────────────────────────── */}
      <header style={{ background: TITA.forest, padding: "78px 0 64px" }}>
        <div style={{ ...wrap, textAlign: "center" }}>
          <p style={{ fontSize: 14, letterSpacing: "0.3em", color: TITA.camel, margin: "0 0 28px" }}>
            초 대 합 니 다
          </p>
          <h1
            style={{
              fontSize: "clamp(28px, 6vw, 38px)",
              fontWeight: 800,
              lineHeight: 1.5,
              letterSpacing: "-0.8px",
              color: TITA.cream,
              margin: "0 0 26px",
            }}
          >
            자식 이야기,
            <br />
            부모끼리 나누는 자리
          </h1>
          <div
            style={{
              display: "inline-block",
              borderTop: `1px solid ${TITA.sage}`,
              borderBottom: `1px solid ${TITA.sage}`,
              padding: "20px 8px",
              fontSize: 18,
              lineHeight: 2,
              color: TITA.cream,
            }}
          >
            {EVENT.date}
            <br />
            오후 3시 30분부터 · 서울 청담
          </div>
        </div>
      </header>

      {/* ── 여는 말 ──────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 0 10px" }}>
        <div style={wrap}>
          <Line>
            미혼 자녀를 두신 부모님들이 모여 두 시간 남짓 이야기 나누는
            자리입니다. 아는 분을 통해 이 글을 받으셨을 거예요.
          </Line>
          <Line>
            <b style={{ color: TITA.ink }}>오늘 무엇을 성사시키는 자리가 아닙니다.</b>{" "}
            같은 시기를 지나는 분들과 이야기 나누고 가시는 것만으로 충분한
            자리로 열려고 합니다.
          </Line>
          <Line>
            <b style={{ color: TITA.ink }}>참가비는 없습니다.</b> 자리와 간단한
            다과는 저희가 준비할게요. 오시는 길에{" "}
            <b style={{ color: TITA.ink }}>같이 나눌 와인이나 마실 것, 간식을 하나만
            들고 오시면</b> 더 좋겠습니다. 없이 오셔도 괜찮아요.
          </Line>
        </div>
      </section>

      {/* ── 그날 흐름 ────────────────────────────────────────────────── */}
      <section style={{ padding: "40px 0" }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 26px" }}>
            그날은 이렇게 흘러갑니다
          </h2>
          {FLOW.map(([time, title, desc], i) => (
            <div
              key={time}
              style={{
                display: "flex",
                gap: 18,
                padding: i === 0 ? "0 0 22px" : "22px 0",
                borderTop: i === 0 ? "none" : `1px solid ${TITA.sage}`,
              }}
            >
              <div
                style={{
                  flex: "0 0 62px",
                  fontSize: 17,
                  fontWeight: 800,
                  color: TITA.camel,
                  paddingTop: 2,
                }}
              >
                {time}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: TITA.ink, marginBottom: 5 }}>
                  {title}
                </div>
                <div style={{ fontSize: 16.5, lineHeight: 1.8, color: TITA.muted, wordBreak: "keep-all" }}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 미리 말씀드립니다 ────────────────────────────────────────── */}
      <section style={{ padding: "16px 0 40px" }}>
        <div style={wrap}>
          <div
            style={{
              background: TITA.surface,
              borderRadius: 16,
              padding: "24px 24px",
              fontSize: 16.5,
              lineHeight: 1.85,
              color: TITA.ink,
              wordBreak: "keep-all",
            }}
          >
            <b>미리 말씀드립니다.</b> 이 자리는 사진과 영상으로 남기려 합니다.
            원하지 않으시면 말씀만 해주세요 — 자리를 옮겨 앉으시면 됩니다.
            동의는 당일에 따로 받고, 얼굴이 나오지 않게 해달라는 선택도 있습니다.
          </div>
        </div>
      </section>

      {/* ── 신청 ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "10px 0 70px" }}>
        <div style={wrap}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 10px" }}>
            오시겠어요?
          </h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.8, color: TITA.muted, margin: "0 0 22px" }}>
            아래를 적어주시면 이틀 안에 전화드릴게요.
          </p>
          <InviteForm />
        </div>
      </section>

      <div style={{ ...wrap, paddingBottom: 8 }}>
        <TitaFooter />
      </div>
    </div>
  );
}
