import type { Metadata } from "next";
import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { TitatimeCTA } from "./TitatimeCTA";

// 티타임 모집 — 날짜 있는·동네·놓치면 아쉬운 이벤트로 상시 다운로드를 유발한다
// (Timeleft 모델). 친구 만들기의 낮은 긴급도를 "이번 주 우리 동네 자리"라는
// 희소성으로 끌어올린다. 밀도가 낮아도 시작할 수 있게 '모집중/편성예정'으로 운영.

export const metadata: Metadata = {
  title: "동네 티타임 — 결이 통하는 3~4명과 차 한 잔 | 티타",
  description:
    "만 45세 이상, 본인인증 된 우리 동네 이웃 3~4명과 낮에 카페에서 90분. 데이팅 앱이 아니라 결이 통하는 친구를 만나는 소규모 티타임. 이번 주 모집 중.",
  openGraph: {
    title: "이번 주, 우리 동네 티타임 🍵",
    description:
      "결이 통하는 3~4명과 낮에 차 한 잔. 본인인증 된 만 45세 이상만.",
    siteName: "티타",
    locale: "ko_KR",
    type: "website",
  },
};

// ── 매주 여기만 고치면 된다 ────────────────────────────────────────────
// 파운더가 주 1회 편성 후 이 배열을 갱신하고 재배포. 날짜는 사람이 읽는
// 문자열(예: "7월 10일 목") — Date 계산 없이 단순하게. status로 스캐폴딩.
type SessionStatus = "open" | "almost" | "closed" | "planning";
interface Session {
  district: string; // "송파구 잠실"
  dateLabel: string; // "7월 10일 (목) 오후 2시"
  spotsLabel: string; // "남은 자리 2 / 4"
  status: SessionStatus;
}
const SESSIONS: Session[] = [
  {
    district: "송파구 잠실",
    dateLabel: "이번 주 목요일 오후 2시",
    spotsLabel: "남은 자리 2 / 4",
    status: "almost",
  },
  {
    district: "다른 동네",
    dateLabel: "매주 새로 편성",
    spotsLabel: "관심 지역을 앱에서 알려주세요",
    status: "planning",
  },
];

const STATUS_STYLE: Record<
  SessionStatus,
  { label: string; bg: string; fg: string }
> = {
  open: { label: "모집 중", bg: "#E7F0EA", fg: TITA.forest },
  almost: { label: "마감 임박", bg: "#F6E9DA", fg: "#9A6B33" },
  closed: { label: "모집 마감", bg: "#ECECEC", fg: "#7A7A7A" },
  planning: { label: "편성 예정", bg: TITA.surface, fg: TITA.muted },
};

const HOW = [
  { n: "1", t: "본인인증", d: "앱에서 NICE 본인인증. 가짜 계정·사기꾼은 못 들어와요." },
  { n: "2", t: "결이 맞는 3~4명 편성", d: "결큐 답변이 통하는 같은 동네 이웃끼리 묶어드려요." },
  { n: "3", t: "낮에, 동네 카페에서 90분", d: "대로변 프랜차이즈 카페. 부담 없이 차 한 잔, 90분이면 끝." },
];

const SAFETY = [
  "본인인증 완료자만 참여",
  "여성 모임은 여성만 (혼성은 선택 시에만)",
  "밝은 시간대 · 공개된 장소",
  "불편하면 언제든 신고 · 재편성 제외",
];

export default function TitatimePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(170deg, ${TITA.cream} 0%, ${TITA.surface} 100%)`,
        fontFamily: KOREAN_FONT_STACK,
        color: TITA.ink,
        display: "flex",
        justifyContent: "center",
        padding: "44px 20px 64px",
      }}
    >
      <div style={{ maxWidth: 520, width: "100%" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🍵</div>
          <p
            style={{
              color: TITA.forestMid,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "-0.3px",
              margin: "0 0 10px",
            }}
          >
            만 45세 이상 · 본인인증 · 데이팅 앱 아님
          </p>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-1.2px",
              lineHeight: 1.3,
              color: TITA.forestDeep,
              margin: "0 0 14px",
            }}
          >
            이번 주, 우리 동네
            <br />
            티타임
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: TITA.muted, margin: 0 }}>
            결이 통하는 <b style={{ color: TITA.ink }}>3~4명</b>과
            <br />
            낮에 동네 카페에서 <b style={{ color: TITA.ink }}>차 한 잔, 90분.</b>
          </p>
        </div>

        {/* 이번 주 자리 */}
        <section style={{ marginBottom: 32 }}>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: TITA.muted,
              margin: "0 0 12px",
              letterSpacing: "-0.2px",
            }}
          >
            지금 모집 중인 자리
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SESSIONS.map((s, i) => {
              const st = STATUS_STYLE[s.status];
              return (
                <div
                  key={i}
                  style={{
                    background: TITA.white,
                    border: `1px solid ${TITA.sage}`,
                    borderRadius: 16,
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: TITA.forestDeep,
                        marginBottom: 4,
                      }}
                    >
                      {s.district}
                    </div>
                    <div style={{ fontSize: 15, color: TITA.ink, marginBottom: 2 }}>
                      {s.dateLabel}
                    </div>
                    <div style={{ fontSize: 13, color: TITA.muted }}>
                      {s.spotsLabel}
                    </div>
                  </div>
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: 13,
                      fontWeight: 700,
                      color: st.fg,
                      background: st.bg,
                      padding: "8px 14px",
                      borderRadius: 999,
                    }}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section style={{ marginBottom: 40 }}>
          <TitatimeCTA />
        </section>

        {/* 어떻게 진행되나 */}
        <section style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: TITA.forestDeep,
              margin: "0 0 18px",
              letterSpacing: "-0.5px",
            }}
          >
            어떻게 진행되나요?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {HOW.map((h) => (
              <div key={h.n} style={{ display: "flex", gap: 14 }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    background: TITA.forest,
                    color: TITA.cream,
                    fontSize: 16,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {h.n}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: TITA.ink,
                      marginBottom: 2,
                    }}
                  >
                    {h.t}
                  </div>
                  <div style={{ fontSize: 15, lineHeight: 1.6, color: TITA.muted }}>
                    {h.d}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 안심 */}
        <section
          style={{
            background: TITA.forest,
            borderRadius: 20,
            padding: "24px 24px",
            color: TITA.cream,
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>
            안심하고 오셔도 돼요
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SAFETY.map((s) => (
              <div key={s} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ color: TITA.sage, fontSize: 15 }}>✓</span>
                <span style={{ fontSize: 15, lineHeight: 1.5, opacity: 0.95 }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </section>

        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: 13,
            color: TITA.mutedSoft,
          }}
        >
          <Link href="/gyeol" style={{ color: TITA.muted }}>
            내 결 유형 알아보기
          </Link>
          {"  ·  "}
          <Link href="/" style={{ color: TITA.muted }}>
            티타 홈
          </Link>
        </p>
      </div>
    </main>
  );
}
