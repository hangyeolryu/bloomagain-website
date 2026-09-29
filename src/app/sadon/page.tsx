/**
 * /sadon — 10월 31일 무료 자리 모집
 *
 * 참가비를 한 푼도 받지 않는다. 수요를 보고, 촬영하고, 의견을 듣는 자리다.
 * 유료 찻자리는 신고필증이 나온 뒤의 이야기라 /sadon/chatjari 로 옮겼다.
 *
 * ⚠️ 이 페이지가 하는 말의 선 (bloomagain-korea docs/sadon/)
 *   · 돈 이야기를 하지 않는다 — 참가비·회비·다과 실비 전부 안 받는다.
 *     한 푼이라도 오가면 결혼중개업의 요건 하나가 채워진다(04 첫 줄).
 *   · **다음에 유료로 한다는 말도 여기서 하지 않는다.** 모집 글에서 유료를
 *     예고하면 이 자리가 유료 영업의 일부로 읽힌다. 의향은 그날 설문으로만.
 *   · "사돈"을 제목·설명에 쓰지 않는다. 무료여도 중개 광고로 읽힌다.
 *
 * ⚠️ 조건을 앞에 세운다 (2026-09-29).
 * "조건표가 없습니다"는 **등급·연봉·학벌을 안 본다**는 뜻이지 아무것도 안
 * 본다는 뜻이 아니다. 자식 일인데 아무것도 안 궁금한 부모는 없다. 01 3장의
 * 3단계 게이트도 1단계에서 이미 "나이대·직군 대분류·지역"을 허용한다.
 * 그 선을 이 페이지가 분명히 말한다 — 안 보는 척하는 것이 더 불성실하다.
 *
 * 그리고 이것이 무료로 열리는 다른 모임과 갈리는 지점이기도 하다.
 * 선착순으로 받지 않고 **아드님 측 여섯 · 따님 측 여섯으로 편성한다.**
 *
 * ⚠️ 다만 선을 우리가 정한 것이 아니다. 여기 적은 범위는 01 3장의 3단계
 * 게이트 1단계가 이미 허용한 것(나이대·직군 대분류·지역)까지다. 그보다
 * 넓힐지 좁힐지는 /sadon/survey 가 답을 가져온 뒤에 정한다 —
 * 14_수요조사_문항.md: "거르는 선을 어디에 둘지는 우리가 정할 일이 아니다.
 * 부모님들이 원하시는 선이 따로 있다." 그 조사는 아직 돌리지 않았다.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { TitaHeader } from "../_components/TitaHeader";
import { TitaFooter } from "../_components/TitaFooter";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import {
  Section,
  H2,
  Body,
  Features,
  Steps,
  ChildNotice,
  SadonLegal,
} from "./_ui";
import { ApplyForm, type Field } from "./ApplyForm";
import {
  EVENT,
  EVENT_OPEN,
  EVENT_CHILD_AGES,
  EVENT_CHILD_JOBS,
  EVENT_MATCH_PREFS,
  CHILD_NATIONALITY,
  CHILD_SIDE,
  TOLD_OPTIONS,
} from "./_sadon";

export const metadata: Metadata = {
  alternates: { canonical: "/sadon/" },
  robots: { index: false, follow: false },
  title: "10월 31일, 부모님들 모이는 자리 | 티타",
  description:
    "미혼 자녀를 두신 부모님 열두 분이 모여 두 시간 이야기 나누는 자리입니다. 참가비는 없습니다.",
};

const FEATURES = [
  {
    t: "참가비가 없습니다",
    d: "장소와 다과, 음료는 저희가 냅니다. 참가비도 회비도 받지 않습니다. 오시는 길에 와인이나 간식 한 가지만 들고 오시면 됩니다 — 그것도 자율입니다.",
  },
  {
    t: "두 시간입니다",
    d: "네 분씩 한 테이블에 앉아 스무 분씩 세 바퀴 돌면, 상대 측 여섯 분을 모두 만나뵙게 됩니다. 길게 붙잡지 않습니다.",
  },
  {
    t: "자녀분 사진은 가져오지 않으셔도 됩니다",
    d: "앞에 놓이는 것은 부모님 본인 사진입니다. 얼굴이 아니라 집안으로 만나보자는 것이 저희 생각입니다.",
  },
  {
    t: "오늘 성사시키는 자리가 아닙니다",
    d: "마음이 가는 분이 안 계셔도 괜찮습니다. 같은 시기를 지나는 분들과 이야기 나누고 가시는 것만으로 충분한 자리입니다.",
  },
];

const STEPS = [
  { t: "신청", d: "아래 양식으로 신청해 주십시오. 본인 확인을 함께 진행합니다." },
  { t: "통화", d: "담당자가 전화로 십 분 정도 이야기를 나눕니다. 자녀분 이야기와 어떤 자리를 바라시는지 물어봅니다." },
  { t: "확인", d: "신분증과 가족관계증명서 두 가지만 받습니다. 확인 후 곧바로 파기하고, 파기 완료를 문자로 알려드립니다." },
  { t: "편성", d: "아드님 측 여섯 · 따님 측 여섯이 되도록 자리를 짭니다. 선착순이 아니라 이 비율이 먼저입니다." },
  { t: "안내", d: "자리가 편성되면 장소와 시간을 문자로 알려드립니다." },
];

const FIELDS: Field[] = [
  { kind: "text", id: "e-name", label: "성함", placeholder: "성함을 적어주십시오" },
  { kind: "text", id: "e-tel", label: "연락처", type: "tel", placeholder: "010-0000-0000" },
  { kind: "choice", id: "e-side", label: "자녀분은", options: CHILD_SIDE },
  { kind: "choice", id: "e-age", label: "자녀분 연세", options: EVENT_CHILD_AGES },
  { kind: "choice", id: "e-job", label: "자녀분이 하시는 일", options: EVENT_CHILD_JOBS },
  { kind: "choice", id: "e-nat", label: "자녀분 국적", options: CHILD_NATIONALITY },
  {
    kind: "select",
    id: "e-zone",
    label: "자녀분이 주로 생활하시는 곳",
    options: ["강남·서초·송파", "서울 그 밖의 지역", "경기·인천", "그 밖의 지역"],
  },
  {
    // 본인이 선을 긋는 문항. 답은 편성에만 쓰고 상대에게 보여주지 않는다.
    kind: "choice",
    id: "e-match",
    label: "어떤 점이 비슷했으면 하세요",
    options: EVENT_MATCH_PREFS,
  },
  { kind: "choice", id: "e-told", label: "자녀분께 알리셨습니까", options: TOLD_OPTIONS },
  { kind: "text", id: "e-ref", label: "알게 되신 경로", placeholder: "예: 지인 소개" },
];

export default function SadonEventPage() {
  return (
    <div
      style={{
        background: TITA.cream,
        color: TITA.ink,
        fontFamily: KOREAN_FONT_STACK,
        minHeight: "100vh",
      }}
    >
      {!EVENT_OPEN && (
        <div
          style={{
            background: TITA.forestDeep,
            color: TITA.cream,
            textAlign: "center",
            padding: "12px 16px",
            fontSize: 15,
            lineHeight: 1.6,
          }}
        >
          준비 중입니다 · <b>곧 신청을 받습니다</b>
        </div>
      )}
      <TitaHeader />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header
        style={{ padding: "76px 24px 60px", maxWidth: 720, margin: "0 auto", textAlign: "center" }}
      >
        <p style={{ fontSize: 15, letterSpacing: "0.2em", color: TITA.muted, margin: "0 0 22px" }}>
          부 모 님 들 의 자 리
        </p>
        <h1
          style={{
            fontSize: "clamp(30px, 6vw, 40px)",
            fontWeight: 800,
            lineHeight: 1.45,
            letterSpacing: "-1px",
            color: TITA.forestDeep,
            margin: "0 0 22px",
          }}
        >
          자식 이야기,
          <br />
          부모끼리 나누는 자리
        </h1>
        <p style={{ fontSize: 19, lineHeight: 1.75, color: TITA.muted, margin: "0 0 32px" }}>
          열두 분만 모십니다.
          <br />
          확인을 거쳐 모신 분들입니다.
        </p>
        <div
          style={{
            display: "inline-block",
            border: `1px solid ${TITA.sage}`,
            background: TITA.white,
            borderRadius: 16,
            padding: "20px 28px",
            fontSize: 17,
            lineHeight: 2,
            color: TITA.ink,
          }}
        >
          {EVENT.date}
          <br />
          {EVENT.time} · {EVENT.place}
          <br />
          <b style={{ color: TITA.forestDeep }}>참가비 없음</b>
        </div>
      </header>

      {/* ── 조건 — 이 페이지에서 제일 먼저 말한다 ───────────────────── */}
      <Section>
        <H2>이런 분들을 모십니다</H2>
        <div
          style={{
            background: TITA.white,
            border: `1px solid ${TITA.sage}`,
            borderRadius: 16,
            padding: "26px 24px",
            marginBottom: 22,
          }}
        >
          {[
            // 「45세 이상」은 뺐다 (2026-09-29). 자녀분이 28세를 넘으면 부모님은
            // 자동으로 45세를 넘는다 — 당연한 걸 조건이라고 적으면 문턱이
            // 하나 더 있는 것처럼 보인다.
            // 본인 확인은 히어로("확인을 거쳐 모신 분들입니다")·진행 1·3단계·
            // 「봅니다」 목록에 이미 있어서 이 줄을 빼도 사라지지 않는다.
            ["미혼 자녀를 두신 분", "한 분이라도 미혼이시면 됩니다."],
            ["자녀분이 28세 이상", "스물다섯과 서른여덟은 다른 이야기라, 이 선을 둡니다."],
            ["가정마다 한 분", "두 분이 오시면 네 사람의 마음이 다 맞아야 합니다. 첫 자리의 문턱을 낮췄습니다."],
          ].map(([t, d], i) => (
            <div
              key={t}
              style={{
                display: "flex",
                gap: 14,
                padding: i === 0 ? "0 0 16px" : "16px 0",
                borderTop: i === 0 ? "none" : `1px solid ${TITA.sage}`,
              }}
            >
              <span style={{ color: TITA.forest, fontWeight: 800, flex: "none" }}>✓</span>
              <span style={{ fontSize: 17, lineHeight: 1.75, wordBreak: "keep-all" }}>
                <b style={{ color: TITA.ink }}>{t}</b>
                <span style={{ color: TITA.muted }}> — {d}</span>
              </span>
            </div>
          ))}
        </div>
        <Body>
          <b style={{ color: TITA.ink }}>선착순이 아닙니다.</b> 아드님 측 여섯 · 따님
          측 여섯이 되도록 자리를 짭니다. 한쪽이 먼저 차면 다음 자리로 모십니다.
        </Body>
      </Section>

      {/* ── 조건을 어디까지 보나 ─────────────────────────────────────── */}
      <Section>
        <H2>조건을 어디까지 보나</H2>
        <Body>
          아무것도 안 본다고 하면 그건 솔직하지 않은 말이라고 생각합니다.
          자식 일인데 아무것도 안 궁금한 부모가 어디 계시겠어요.{" "}
          <b style={{ color: TITA.ink }}>
            저희가 보는 것은 줄을 세우는 조건이 아니라, 서로를 가늠할 기본입니다.
          </b>
        </Body>
        <div style={{ display: "grid", gap: 14, margin: "24px 0 0" }}>
          <div
            style={{
              background: TITA.surface,
              borderLeft: `4px solid ${TITA.forest}`,
              borderRadius: "0 14px 14px 0",
              padding: "20px 22px",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 10px" }}>
              봅니다
            </h3>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: TITA.ink, margin: 0, wordBreak: "keep-all" }}>
              본인이 맞으신지 · 자녀분이 실제로 계신지 · 미혼이신지 ·
              연세 · <b>하시는 일(회사원·전문직 같은 큰 갈래까지)</b> ·
              주로 생활하시는 곳
            </p>
          </div>
          <div
            style={{
              background: TITA.white,
              border: `1px solid ${TITA.sage}`,
              borderRadius: 14,
              padding: "20px 22px",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 800, color: TITA.muted, margin: "0 0 10px" }}>
              보지 않습니다
            </h3>
            <p style={{ fontSize: 17, lineHeight: 1.85, color: TITA.muted, margin: 0, wordBreak: "keep-all" }}>
              학교 · 회사 이름 · 직위 · 연봉 · 재산.
              졸업증명서도 재직증명서도 받지 않습니다.
            </p>
          </div>
        </div>
        <Body>
          저희가 막고 싶은 것은 거짓말하는 분이지, 조건이 부족한 분이 아니기
          때문입니다. 그래서 <b style={{ color: TITA.ink }}>등수를 매기거나 점수를
          보여드리지 않습니다.</b>
        </Body>

        <div
          style={{
            background: TITA.surface,
            borderRadius: 14,
            padding: "22px 22px",
            marginTop: 22,
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 800, color: TITA.forestDeep, margin: "0 0 10px" }}>
            그럼 비슷한 분들끼리 앉히긴 하나요
          </h3>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: TITA.ink, margin: "0 0 12px", wordBreak: "keep-all" }}>
            비슷한 집안이었으면 하는 마음, 당연하다고 생각합니다. 없는 척하지
            않겠습니다.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: TITA.muted, margin: 0, wordBreak: "keep-all" }}>
            다만 <b style={{ color: TITA.ink }}>저희가 재서 급을 나누지는
            않습니다.</b> 신청하실 때 「어떤 점이 비슷했으면 하세요」를 여쭙고,{" "}
            <b style={{ color: TITA.ink }}>그 답이 겹치는 분들끼리</b> 앉으시게
            자리를 짭니다. 무엇을 중요하게 보시는지는 부모님마다 다르고, 그 선을
            저희가 대신 정하지 않습니다. 이 답은 편성에만 쓰고 상대분께 보여드리지
            않습니다.
          </p>
        </div>
      </Section>

      <Section>
        <H2>이런 자리입니다</H2>
        <Features items={FEATURES} />
      </Section>

      <Section>
        <H2>이렇게 진행됩니다</H2>
        <Steps items={STEPS} />
      </Section>

      {/* ── 촬영·설문 고지 ───────────────────────────────────────────── */}
      <Section>
        <H2>미리 말씀드립니다</H2>
        <Body>
          이 자리는 <b style={{ color: TITA.ink }}>사진과 영상으로 남기려 합니다.</b>{" "}
          그리고 끝나기 전에 짧은 설문을 부탁드립니다 — 어떠셨는지, 다음에는 어떤
          자리면 좋을지 여쭙는 내용입니다.
        </Body>
        <Body>
          촬영을 원하지 않으시면 말씀만 해주십시오. 자리를 옮겨 앉으시면 됩니다.
          동의는 당일에 서면으로 따로 받고, <b style={{ color: TITA.ink }}>얼굴이
          나오지 않게 해달라는 선택</b>도 있습니다.
        </Body>
      </Section>

      <Section>
        <ChildNotice
          lead="본인 모르게 진행되는 자리가 아닙니다. 신청해 주시면 자녀분께 안내를 보내드립니다."
          quote="부모님께서 이런 자리에 참석하십니다. 내용을 확인하시거나 수정하실 수 있습니다."
        />
      </Section>

      <Section last>
        <H2>신청</H2>
        <ApplyForm
          fields={FIELDS}
          submitLabel="본인 확인하고 신청하기"
          foot={[
            "신청 후 이틀 안에 담당자가 전화드립니다.",
            "참가비는 없습니다.",
          ]}
        />
        <p style={{ textAlign: "center", marginTop: 24, fontSize: 15, color: TITA.mutedSoft }}>
          <Link href="/sadon/danji/" style={{ color: TITA.muted }}>
            같은 단지에서 찾아보기
          </Link>
        </p>
      </Section>

      <SadonLegal name="부모님들의 자리" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 8px" }}>
        <TitaFooter />
      </div>
    </div>
  );
}
