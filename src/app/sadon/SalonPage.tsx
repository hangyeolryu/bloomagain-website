/**
 * 티타 아너스 랜딩 본문 — /honors(대표 주소)와 /sadon(이미 돌린 링크)이 함께 쓴다.
 *
 * 2026-10-01 다크 럭셔리로 다시 입혔다 — 인스타 카드와 같은 블랙 그린
 * (#0C1612 / #12211B) + 카멜 + 명조. 모티프는 카드의 **얇은 카멜 테두리**.
 * 신청서만 크림 카드로 띄운다(초대장을 펼친 느낌 + 45+ 가독성).
 *
 * 대외 명칭은 '프라이빗 티타임'(고급 결에서는 '초대석'). '사교 살롱' 안 씀.
 *
 * 이 페이지는 "중개"로 읽힐 말을 스스로 쓰지 않는다.
 *   · "사돈"·"매칭"·"성사"·"연결"을 쓰지 않는다. "맞춘다"도 쓰지 않는다.
 *   · 자녀 조건(직군·희망 조건)을 받지 않는다. 자녀분은 성별·나이대까지만.
 *   · 면책 문구는 _sadon.ts DISCLAIMER 하나를 하단·제출 직전 두 곳이 읽는다.
 *
 * 성비: 이번엔 아드님 측 모시기가 더 어렵다(2026-09-30). 안내에서는 어느
 * 쪽인지 특정하지 않는다.
 */

import { Nanum_Myeongjo } from "next/font/google";
import { TitaFooter } from "../_components/TitaFooter";
import { KOREAN_FONT_STACK } from "../_components/tita-brand";
import { InviteForm } from "./InviteForm";
import { DISCLAIMER, EVENT } from "./_sadon";
import { RingMark, TTMark } from "../_components/TitaMarks";

// 한글 서브셋은 타입에 없어서 preload 를 끄고 유니코드 구간별로 받게 한다.
const serif = Nanum_Myeongjo({ weight: ["400", "700", "800"], preload: false, display: "swap" });

const C = {
  bg: "#0C1612",
  bg2: "#12211B",
  cream: "#F4EEE3",
  text: "#C9D2CB",
  muted: "#93A198",
  camel: "#D4B895",
  line: "rgba(212, 184, 149, 0.32)",
  lineSoft: "rgba(212, 184, 149, 0.16)",
  paper: "#FBF7F0",
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

const VALUES: [string, string, string][] = [
  [
    "I",
    "요즘 세대를 이해하는 시간",
    "자녀 세대는 연애와 결혼을 어떻게 생각할까요. 부모가 한마디 거들어도 되는 선은 어디일까요. 집에서는 꺼내기 어려운 이야기를 같은 자리에 선 분들과 나눕니다.",
  ],
  [
    "II",
    "자녀를 키워낸 부모들의 교류",
    "살아온 이야기와 가치관, 요즘의 취향까지. 자녀 이야기로 시작해 자연스럽게 서로를 알아가는 대화가 됩니다.",
  ],
  [
    "III",
    "주말 오후의 품격 있는 외출",
    "조용한 공간, 정성껏 고른 차·와인과 다과. 두 시간 반 동안 온전히 나를 위한 오후를 보내세요.",
  ],
];

const NOT_THIS = [
  "자녀분을 소개하거나 만남을 성사시키는 자리가 아닙니다.",
  "자녀분의 사진·이름·직장 같은 프로필을 요구하지 않습니다. 말씀하지 않으셔도 괜찮아요.",
  "그날 무엇을 권하거나 판매하는 일은 없습니다.",
];

const STEPS: [string, string][] = [
  ["신청서 작성", "아래 신청서를 작성해 주세요. 3분이면 충분합니다."],
  ["확인 전화", "이틀 안에 티타에서 짧게 전화를 드립니다. 모임 성격을 한 번 더 안내하고 인사를 나누는 통화입니다."],
  ["참가 확정과 입금", "확정 안내 문자로 입금 계좌를 보내드립니다. 문자를 받으신 날로부터 3일 안에 입금해 주시면 자리가 확정됩니다."],
  ["장소 안내", "입금이 확인되면 장소 상세 주소와 당일 안내를 개별로 보내드립니다."],
];

const WRAP: React.CSSProperties = { maxWidth: 640, margin: "0 auto", padding: "0 24px", width: "100%" };

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, letterSpacing: "0.34em", color: C.camel, margin: "0 0 18px", textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className={serif.className}
      style={{ fontSize: "clamp(23px, 5vw, 28px)", fontWeight: 800, color: C.cream, margin: "0 0 28px", lineHeight: 1.45, wordBreak: "keep-all" }}
    >
      {children}
    </h2>
  );
}

function Section({ children, alt, pad = "84px 0" }: { children: React.ReactNode; alt?: boolean; pad?: string }) {
  return (
    <section style={{ background: alt ? C.bg2 : C.bg, padding: pad }}>
      <div style={WRAP}>{children}</div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 18, padding: "18px 0", borderTop: `1px solid ${C.lineSoft}` }}>
      <div style={{ flex: "0 0 72px", fontSize: 14, letterSpacing: "0.12em", color: C.camel, paddingTop: 2 }}>{k}</div>
      <div style={{ fontSize: 16.5, lineHeight: 1.75, color: C.cream, wordBreak: "keep-all" }}>{v}</div>
    </div>
  );
}

export function SalonPage() {
  const body: React.CSSProperties = { fontSize: 17, lineHeight: 1.95, color: C.text, margin: "0 0 18px", wordBreak: "keep-all" };

  return (
    <div style={{ background: C.bg, color: C.cream, fontFamily: KOREAN_FONT_STACK, minHeight: "100vh" }}>
      {/* ── 머리 — 카드처럼 얇은 카멜 테두리 안에 ─────────────────────── */}
      <header style={{ background: C.bg, padding: "18px 14px" }}>
        <div
          style={{
            border: `1px solid ${C.line}`,
            minHeight: "min(88vh, 760px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "72px 22px",
          }}
        >
          <div style={{ marginBottom: 22 }}>
            <TTMark size={92} />
          </div>
          <p style={{ fontSize: 12.5, letterSpacing: "0.42em", color: C.camel, margin: "0 0 44px" }}>TITA HONORS</p>
          <h1
            className={serif.className}
            style={{
              fontSize: "clamp(30px, 7vw, 46px)",
              fontWeight: 800,
              lineHeight: 1.45,
              color: C.cream,
              margin: "0 0 26px",
            }}
          >
            인연과 취향을 나누는
            <br />
            토요일 오후
          </h1>
          <p style={{ fontSize: 16.5, lineHeight: 1.9, color: C.text, margin: "0 0 52px", wordBreak: "keep-all" }}>
            자녀의 인연과 삶을 고민하는
            <br />
            부모님들을 위한 제1회 프라이빗 티타임
          </p>
          <div
            className={serif.className}
            style={{
              borderTop: `1px solid ${C.line}`,
              borderBottom: `1px solid ${C.line}`,
              padding: "18px 26px",
              fontSize: 17,
              lineHeight: 2,
              color: C.camel,
            }}
          >
            {EVENT.date}
            <br />
            {EVENT.time}
          </div>
          <a
            href="#apply"
            style={{
              marginTop: 48,
              display: "inline-block",
              padding: "15px 38px",
              border: `1px solid ${C.camel}`,
              color: C.camel,
              fontSize: 15.5,
              letterSpacing: "0.12em",
              textDecoration: "none",
            }}
          >
            참가 신청
          </a>
        </div>
      </header>

      {/* ── 여는 말 ──────────────────────────────────────────────────── */}
      <Section>
        <Label>Prologue</Label>
        <p
          className={serif.className}
          style={{ fontSize: "clamp(22px, 5vw, 27px)", fontWeight: 800, lineHeight: 1.55, color: C.cream, margin: "0 0 10px", wordBreak: "keep-all" }}
        >
          조건만으로는 알 수 없는 것들을 나눕니다.
        </p>
        {/* "맞춘다"고 쓰지 않는다 — 우리가 짝지어 주는 자리로 읽힌다. */}
        <p className={serif.className} style={{ fontSize: 17, color: C.camel, margin: "0 0 36px" }}>
          가치관, 집안의 분위기, 살아온 결.
        </p>
        <p style={body}>
          자녀를 반듯하게 키워낸 부모라면 한 번쯤 생각하게 됩니다. 요즘 아이들은 인연을 어떻게 만나는지, 부모는
          어디까지 곁을 지켜야 하는지.
        </p>
        <p style={body}>
          티타 아너스는 그 고민을 같은 자리에 선 분들과 나누는 프라이빗 티타임입니다. 누군가를 소개받는 자리가
          아니라, 서로의 교양과 가치관, 취향을 나누는 토요일 오후입니다.
        </p>
      </Section>

      {/* ── 나누는 것 ────────────────────────────────────────────────── */}
      <Section alt>
        <Label>The Afternoon</Label>
        <H2>이 자리에서 나누는 것</H2>
        {VALUES.map(([n, title, desc]) => (
          <div key={title} style={{ display: "flex", gap: 20, padding: "24px 0", borderTop: `1px solid ${C.lineSoft}` }}>
            <div className={serif.className} style={{ flex: "0 0 34px", fontSize: 17, color: C.camel, paddingTop: 1 }}>
              {n}
            </div>
            <div>
              <div className={serif.className} style={{ fontSize: 19, fontWeight: 700, color: C.cream, marginBottom: 8 }}>
                {title}
              </div>
              <div style={{ fontSize: 16.5, lineHeight: 1.85, color: C.text, wordBreak: "keep-all" }}>{desc}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── 이런 자리는 아닙니다 ─────────────────────────────────────── */}
      <Section pad="72px 0">
        <div style={{ border: `1px solid ${C.line}`, padding: "34px 26px" }}>
          <p className={serif.className} style={{ fontSize: 19, fontWeight: 700, color: C.cream, margin: "0 0 18px" }}>
            이런 자리는 아닙니다
          </p>
          {NOT_THIS.map((t) => (
            <div key={t} style={{ display: "flex", gap: 12, marginBottom: 10, fontSize: 16, lineHeight: 1.8, color: C.text }}>
              <span style={{ color: C.camel, flex: "none" }}>—</span>
              <span style={{ wordBreak: "keep-all" }}>{t}</span>
            </div>
          ))}
          <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.8, color: C.muted, wordBreak: "keep-all" }}>
            진행자가 여는 이야기에서 이 세 가지를 먼저 분명히 밝히고 시작합니다.
          </p>
        </div>
      </Section>

      {/* ── 그날 흐름 ────────────────────────────────────────────────── */}
      <Section alt>
        <Label>Programme</Label>
        <H2>그날 오후의 흐름</H2>
        {FLOW.map(([time, title, desc]) => (
          <div key={time} style={{ display: "flex", gap: 20, padding: "22px 0", borderTop: `1px solid ${C.lineSoft}` }}>
            <div className={serif.className} style={{ flex: "0 0 56px", fontSize: 18, color: C.camel, paddingTop: 1 }}>
              {time}
            </div>
            <div>
              <div style={{ fontSize: 17.5, fontWeight: 700, color: C.cream, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 16, lineHeight: 1.8, color: C.text, wordBreak: "keep-all" }}>{desc}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* ── 모임 안내 ────────────────────────────────────────────────── */}
      <Section>
        <Label>Information</Label>
        <H2>모임 안내</H2>
        <div style={{ borderBottom: `1px solid ${C.lineSoft}` }}>
          <Row k="일시" v={`${EVENT.date} ${EVENT.time}`} />
          <Row k="장소" v={EVENT.place} />
          <Row k="인원" v={EVENT.seats} />
          <Row
            k="참가비"
            v={
              <>
                <s style={{ color: C.muted }}>{EVENT.fee}</s>
                <br />
                <span className={serif.className} style={{ fontSize: 20, fontWeight: 700, color: C.camel }}>
                  {EVENT.feeFirst}
                </span>
                <br />
                <span style={{ fontSize: 15, color: C.text }}>공간 대관, 차·와인과 다과, 모임 진행이 포함됩니다.</span>
              </>
            }
          />
          <Row k="대상" v="자녀를 두신 45세 이상 부모님" />
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.85, color: C.muted, margin: "20px 0 0", wordBreak: "keep-all" }}>
          아드님을 두신 분과 따님을 두신 분이 고르게 모일 수 있도록 자리를 꾸립니다. 한쪽 신청이 많으면 이번에는
          모시지 못하고 다음 모임에 먼저 안내해 드릴 수 있습니다.
        </p>
      </Section>

      {/* ── 신청과 참가비 ────────────────────────────────────────────── */}
      <Section alt>
        <Label>How to Join</Label>
        <H2>신청과 참가비 안내</H2>
        {STEPS.map(([t, d], i) => (
          <div key={t} style={{ display: "flex", gap: 18, marginBottom: 24 }}>
            <div
              className={serif.className}
              style={{
                flex: "none",
                width: 34,
                height: 34,
                borderRadius: 999,
                border: `1px solid ${C.camel}`,
                color: C.camel,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 17.5, fontWeight: 700, color: C.cream, marginBottom: 5 }}>{t}</div>
              <div style={{ fontSize: 16, lineHeight: 1.8, color: C.text, wordBreak: "keep-all" }}>{d}</div>
            </div>
          </div>
        ))}

        <div style={{ borderTop: `1px solid ${C.lineSoft}`, marginTop: 12, paddingTop: 26 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.cream, margin: "0 0 10px" }}>참가비 환불 안내</p>
          {EVENT.refund.map((t) => (
            <div key={t} style={{ display: "flex", gap: 10, marginBottom: 6, fontSize: 15.5, lineHeight: 1.75, color: C.text }}>
              <span style={{ color: C.camel, flex: "none" }}>—</span>
              <span style={{ wordBreak: "keep-all" }}>{t}</span>
            </div>
          ))}
          <p style={{ fontSize: 15, lineHeight: 1.8, color: C.muted, margin: "20px 0 0", wordBreak: "keep-all" }}>
            사진 촬영 안내. 모임 분위기를 기록으로 남기려 합니다. 원하지 않으시면 현장에서 말씀해 주세요. 얼굴이
            나오지 않도록 하겠습니다. 동의는 당일 따로 받습니다.
          </p>
        </div>
      </Section>

      {/* ── 신청 — 크림 카드로 띄운다 ────────────────────────────────── */}
      <section id="apply" style={{ background: C.bg, padding: "90px 0 40px" }}>
        <div style={WRAP}>
          <div style={{ textAlign: "center", marginBottom: 34 }}>
            <Label>Invitation</Label>
            <H2>참가 신청</H2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: C.text, margin: "-12px 0 0" }}>
              작성해 주시면 이틀 안에 전화를 드립니다.
            </p>
          </div>
          <div style={{ border: `1px solid ${C.line}`, padding: 8 }}>
            <InviteForm />
          </div>
        </div>
      </section>

      {/* ── 하단 고지 ────────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "30px 0 60px" }}>
        <div style={WRAP}>
          <p
            style={{
              fontSize: 13.5,
              lineHeight: 1.9,
              color: C.muted,
              margin: 0,
              wordBreak: "keep-all",
              borderTop: `1px solid ${C.lineSoft}`,
              paddingTop: 24,
            }}
          >
            {DISCLAIMER}
          </p>
          {/* 맺음 서명 — 첫 화면은 TT, 끝은 티타 원형. 아너스가 티타 안의 자리라는 걸 보여준다. */}
          <div style={{ display: "flex", justifyContent: "center", margin: "48px 0 14px" }}>
            <RingMark size={58} />
          </div>
          <p style={{ fontSize: 11.5, letterSpacing: "0.42em", color: C.camel, textAlign: "center", margin: 0 }}>
            TITA HONORS
          </p>
        </div>
      </section>

      <div style={{ background: C.paper }}>
        <div style={{ ...WRAP, paddingBottom: 8 }}>
          <TitaFooter />
        </div>
      </div>
    </div>
  );
}
