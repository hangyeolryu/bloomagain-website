/**
 * /sadon — [티타 아너스] 제1회 부모 사교 살롱 (2026-10-31)
 *
 * ⚠️ 2026-09-30에 통째로 다시 썼다. 10/31은 무료 초대장이었다가 **참가비
 * 30만 원 유료 살롱**으로 바뀌었다 — 대표님 결정. 신고 없이, 부모 세대의
 * 사교·취향 교류 모임으로 연다.
 *
 * 그래서 이 페이지는 "중개"로 읽힐 말을 스스로 쓰지 않는다.
 *   · "사돈"·"매칭"·"성사"·"연결"을 쓰지 않는다.
 *   · 자녀 조건(직군·희망 조건)을 받지 않는다. 자녀분은 성별·나이대까지만.
 *     편성에 조건을 쓰는 순간 알선의 모양이 된다.
 *   · 자녀 사진·이름·직장을 받지 않고, 당일에도 요구하지 않는다고 적는다.
 *   · 면책 문구는 대표님이 주신 원문 그대로다. 바꾸지 말 것 — 하단과
 *     신청서 제출 직전 두 곳에 **똑같이** 들어가야 한다(DISCLAIMER 한 곳에서 읽는다).
 *
 * 성비: 이번엔 아드님 측 모시기가 더 어렵다(2026-09-30). 그래서 성비 안내를
 * "한쪽이 넘치면 대기"로 쓰되 어느 쪽인지 특정하지 않는다.
 */

import type { Metadata } from "next";
import { TitaFooter } from "../_components/TitaFooter";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { InviteForm } from "./InviteForm";
import { DISCLAIMER, EVENT } from "./_sadon";

export const metadata: Metadata = {
  alternates: { canonical: "/sadon/" },
  robots: { index: false, follow: false },
  title: "티타 아너스 · 인연과 취향을 나누는 토요일 오후",
  description:
    "자녀의 인연과 삶을 고민하는 부모 세대의 프라이빗 사교 살롱. 2026년 10월 31일 토요일 오후.",
  openGraph: {
    title: "[티타 아너스] 인연과 취향을 나누는 토요일 오후",
    description:
      "10월 31일 토요일 오후 3시, 강남권 프라이빗 공간. 열 분 남짓의 부모님이 모여 차와 이야기를 나누는 살롱입니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "티타",
  },
};

const FLOW: [string, string, string][] = [
  ["3:00", "웰컴 티", "도착하시는 대로 차 한 잔을 내어드려요. 서두르지 않으셔도 됩니다."],
  [
    "3:10",
    "여는 이야기",
    "진행자가 이 모임이 어떤 자리인지 먼저 분명히 밝히고, 요즘 자녀 세대의 연애·결혼 흐름과 부모로서의 고민을 가볍게 나눕니다.",
  ],
  [
    "3:40",
    "자유 대화와 다과",
    "모임의 중심이 되는 시간이에요. 와인과 차, 다과를 곁들여 마음 가는 분과 편하게 이야기 나누세요.",
  ],
  ["5:10", "마무리", "오늘 자리의 소감을 적는 짧은 설문지를 드려요."],
  ["5:25", "여유 있게 퇴장", "이야기가 길어지면 자연스럽게 조금 더 머무셔도 됩니다."],
];

const VALUES: [string, string][] = [
  [
    "요즘 세대를 이해하는 시간",
    "자녀 세대는 연애와 결혼을 어떻게 생각할까요. 부모가 한마디 거들어도 되는 선은 어디일까요. 집에서는 꺼내기 어려운 이야기를 같은 자리에 선 분들과 나눕니다.",
  ],
  [
    "자녀를 키워낸 부모들의 교류",
    "살아온 이야기와 가치관, 요즘의 취향까지. 자녀 이야기로 시작해 자연스럽게 서로를 알아가는 대화가 됩니다.",
  ],
  [
    "주말 오후의 품격 있는 외출",
    "조용한 공간, 정성껏 고른 차와 다과. 두 시간 반 동안 온전히 나를 위한 오후를 보내세요.",
  ],
];

const NOT_THIS = [
  "자녀분을 소개하거나 만남을 성사시키는 자리가 아닙니다.",
  "자녀분의 사진·이름·직장 같은 프로필을 요구하지 않습니다. 말씀하지 않으셔도 괜찮아요.",
  "그날 무엇을 권하거나 판매하는 일은 없습니다.",
];

const H2: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: TITA.forestDeep,
  margin: "0 0 22px",
  letterSpacing: "-0.4px",
};

const BOX: React.CSSProperties = {
  background: TITA.surface,
  borderRadius: 16,
  padding: "24px 24px",
  fontSize: 16.5,
  lineHeight: 1.85,
  color: TITA.ink,
  wordBreak: "keep-all",
};

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, padding: "14px 0", borderTop: `1px solid ${TITA.sage}` }}>
      <div style={{ flex: "0 0 76px", fontSize: 16, fontWeight: 700, color: TITA.camel }}>{k}</div>
      <div style={{ fontSize: 16.5, lineHeight: 1.75, color: TITA.ink, wordBreak: "keep-all" }}>{v}</div>
    </div>
  );
}

export default function SadonSalonPage() {
  const wrap: React.CSSProperties = { maxWidth: 640, margin: "0 auto", padding: "0 24px", width: "100%" };

  return (
    <div style={{ background: TITA.cream, color: TITA.ink, fontFamily: KOREAN_FONT_STACK, minHeight: "100vh" }}>
      {/* ── 머리 ─────────────────────────────────────────────────────── */}
      <header style={{ background: TITA.forest, padding: "78px 0 64px" }}>
        <div style={{ ...wrap, textAlign: "center" }}>
          <p style={{ fontSize: 13.5, letterSpacing: "0.32em", color: TITA.camel, margin: "0 0 26px" }}>
            TITA HONORS · 제1회 살롱
          </p>
          <h1
            style={{
              fontSize: "clamp(26px, 5.6vw, 36px)",
              fontWeight: 800,
              lineHeight: 1.5,
              letterSpacing: "-0.8px",
              color: TITA.cream,
              margin: "0 0 20px",
            }}
          >
            인연과 취향을 나누는
            <br />
            토요일 오후
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: TITA.sage, margin: "0 0 30px", wordBreak: "keep-all" }}>
            자녀의 인연과 삶을 고민하는 부모 세대가
            <br />
            차 한 잔을 두고 마주 앉는 프라이빗 살롱
          </p>
          <div
            style={{
              display: "inline-block",
              borderTop: `1px solid ${TITA.sage}`,
              borderBottom: `1px solid ${TITA.sage}`,
              padding: "18px 8px",
              fontSize: 17.5,
              lineHeight: 2,
              color: TITA.cream,
            }}
          >
            {EVENT.date}
            <br />
            {EVENT.time}
          </div>
        </div>
      </header>

      {/* ── 여는 말 ──────────────────────────────────────────────────── */}
      <section style={{ padding: "60px 0 20px" }}>
        <div style={wrap}>
          <p
            style={{
              fontSize: 19,
              lineHeight: 1.9,
              color: TITA.forestDeep,
              fontWeight: 700,
              margin: "0 0 22px",
              wordBreak: "keep-all",
            }}
          >
            조건표로는 알 수 없는 것들이 있습니다.
          </p>
          {[
            "자녀를 반듯하게 키워낸 부모라면 한 번쯤 생각하게 됩니다. 요즘 아이들은 인연을 어떻게 만나는지, 부모는 어디까지 곁을 지켜야 하는지.",
            "티타 아너스는 그 고민을 같은 자리에 선 분들과 나누는 사교 모임입니다. 누군가를 소개받는 자리가 아니라, 서로의 교양과 가치관, 취향을 나누는 토요일 오후입니다.",
          ].map((t) => (
            <p
              key={t}
              style={{ fontSize: 17.5, lineHeight: 1.9, color: TITA.muted, margin: "0 0 18px", wordBreak: "keep-all" }}
            >
              {t}
            </p>
          ))}
        </div>
      </section>

      {/* ── 이 자리에서 얻으시는 것 ──────────────────────────────────── */}
      <section style={{ padding: "30px 0 10px" }}>
        <div style={wrap}>
          <h2 style={H2}>이 자리에서 나누는 것</h2>
          {VALUES.map(([title, desc], i) => (
            <div key={title} style={{ padding: "18px 0", borderTop: i === 0 ? "none" : `1px solid ${TITA.sage}` }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: TITA.ink, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 16.5, lineHeight: 1.8, color: TITA.muted, wordBreak: "keep-all" }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 이런 자리는 아닙니다 ─────────────────────────────────────── */}
      <section style={{ padding: "30px 0 10px" }}>
        <div style={wrap}>
          <div style={BOX}>
            <b style={{ display: "block", marginBottom: 10, fontSize: 17.5 }}>이런 자리는 아닙니다</b>
            {NOT_THIS.map((t) => (
              <div key={t} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                <span style={{ color: TITA.camel, fontWeight: 800, flex: "none" }}>·</span>
                <span>{t}</span>
              </div>
            ))}
            <p style={{ margin: "12px 0 0", color: TITA.muted }}>
              진행자가 여는 이야기에서 이 세 가지를 먼저 분명히 밝히고 시작합니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 그날 흐름 ────────────────────────────────────────────────── */}
      <section style={{ padding: "44px 0 20px" }}>
        <div style={wrap}>
          <h2 style={H2}>그날 오후의 흐름</h2>
          {FLOW.map(([time, title, desc], i) => (
            <div
              key={time}
              style={{
                display: "flex",
                gap: 18,
                padding: i === 0 ? "0 0 20px" : "20px 0",
                borderTop: i === 0 ? "none" : `1px solid ${TITA.sage}`,
              }}
            >
              <div style={{ flex: "0 0 56px", fontSize: 17, fontWeight: 800, color: TITA.camel, paddingTop: 2 }}>
                {time}
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: TITA.ink, marginBottom: 5 }}>{title}</div>
                <div style={{ fontSize: 16.5, lineHeight: 1.8, color: TITA.muted, wordBreak: "keep-all" }}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 모임 안내 ────────────────────────────────────────────────── */}
      <section style={{ padding: "30px 0 10px" }}>
        <div style={wrap}>
          <h2 style={H2}>모임 안내</h2>
          <div style={{ borderBottom: `1px solid ${TITA.sage}` }}>
            <Row k="일시" v={`${EVENT.date} ${EVENT.time}`} />
            <Row k="장소" v={EVENT.place} />
            <Row k="인원" v={EVENT.seats} />
            <Row
              k="참가비"
              v={
                <>
                  <b>{EVENT.fee}</b>
                  <br />
                  <span style={{ color: TITA.muted }}>
                    공간 대관, 블렌디드 티, 디저트와 케이터링, 모임 진행이 포함됩니다.
                  </span>
                </>
              }
            />
            <Row k="대상" v="자녀를 두신 45세 이상 부모님" />
          </div>
          <p style={{ fontSize: 15.5, lineHeight: 1.8, color: TITA.muted, margin: "16px 0 0", wordBreak: "keep-all" }}>
            아드님을 두신 분과 따님을 두신 분이 고르게 모일 수 있도록 자리를 꾸립니다. 한쪽 신청이 많으면 이번에는
            모시지 못하고 다음 모임에 먼저 안내해 드릴 수 있습니다.
          </p>
        </div>
      </section>

      {/* ── 참가비와 신청 절차 ───────────────────────────────────────── */}
      <section style={{ padding: "44px 0 10px" }}>
        <div style={wrap}>
          <h2 style={H2}>신청과 참가비 안내</h2>
          {[
            ["신청서 작성", "아래 신청서를 작성해 주세요. 3분이면 충분합니다."],
            ["확인 전화", "이틀 안에 티타에서 짧게 전화를 드립니다. 모임 성격을 한 번 더 안내하고 인사를 나누는 통화입니다."],
            ["참가 확정과 입금", "확정 안내 문자로 입금 계좌를 보내드립니다. 문자를 받으신 날로부터 3일 안에 입금해 주시면 자리가 확정됩니다."],
            ["장소 안내", "입금이 확인되면 장소 상세 주소와 당일 안내를 개별로 보내드립니다."],
          ].map(([t, d], i) => (
            <div key={t} style={{ display: "flex", gap: 16, marginBottom: 18 }}>
              <div
                style={{
                  flex: "none",
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: TITA.forest,
                  color: TITA.cream,
                  fontSize: 15,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 17.5, fontWeight: 700, color: TITA.ink, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 16.5, lineHeight: 1.8, color: TITA.muted, wordBreak: "keep-all" }}>{d}</div>
              </div>
            </div>
          ))}

          <div style={{ ...BOX, marginTop: 10 }}>
            <b style={{ display: "block", marginBottom: 8 }}>참가비 환불 안내</b>
            {EVENT.refund.map((t) => (
              <div key={t} style={{ display: "flex", gap: 10, marginBottom: 4 }}>
                <span style={{ color: TITA.camel, fontWeight: 800, flex: "none" }}>·</span>
                <span>{t}</span>
              </div>
            ))}
          </div>

          <div style={{ ...BOX, marginTop: 14 }}>
            <b>사진 촬영 안내.</b> 모임 분위기를 기록으로 남기려 합니다. 원하지 않으시면 현장에서 말씀해 주세요. 얼굴이
            나오지 않도록 하겠습니다. 동의는 당일 따로 받습니다.
          </div>
        </div>
      </section>

      {/* ── 신청 ─────────────────────────────────────────────────────── */}
      <section style={{ padding: "50px 0 30px" }}>
        <div style={wrap}>
          <h2 style={{ ...H2, marginBottom: 10 }}>참가 신청</h2>
          <p style={{ fontSize: 16.5, lineHeight: 1.8, color: TITA.muted, margin: "0 0 22px" }}>
            작성해 주시면 이틀 안에 전화를 드립니다.
          </p>
          <InviteForm />
        </div>
      </section>

      {/* ── 하단 고지 ────────────────────────────────────────────────── */}
      <section style={{ padding: "10px 0 20px" }}>
        <div style={wrap}>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.85,
              color: TITA.mutedSoft,
              margin: 0,
              wordBreak: "keep-all",
              borderTop: `1px solid ${TITA.sage}`,
              paddingTop: 22,
            }}
          >
            {DISCLAIMER}
          </p>
        </div>
      </section>

      <div style={{ ...wrap, paddingBottom: 8 }}>
        <TitaFooter />
      </div>
    </div>
  );
}
