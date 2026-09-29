/**
 * /sadon/chatjari — 사돈 찻자리 (참가비를 받는 자리 · 신고 후에 연다)
 *
 * 2026-09-29에 /sadon 에서 여기로 옮겼다. /sadon 은 10월 31일 **무료** 자리
 * 모집이 가져갔다 — 그게 지금 실제로 열리는 것이고, 유료 자리는 신고필증이
 * 나온 뒤의 이야기다.
 *
 * 미혼 자녀를 두신 부모님 열두 분이 모여 차를 마시며 집안 이야기를 나누는
 * 자리. 결정사가 자녀를 등급으로 매기는 방식에 거부감을 가진 부모가 타깃이다.
 *
 * 문서 근거: docs/sadon/ (bloomagain-korea 저장소)
 *   · 00_INDEX — 확정된 의사결정
 *   · 03_티타임_기획안 — 1회차 실행안
 *   · 04_법무_체크리스트 — 신고·개인정보·환불
 *   · 09_모집과_수익 — 가격과 경로
 *
 * 색인하지 않는다(robots). 헤더·사이트맵·내부 링크 어디에도 걸지 않았다.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { TitaHeader } from "../../_components/TitaHeader";
import { TitaFooter } from "../../_components/TitaFooter";
import { TITA, KOREAN_FONT_STACK } from "../../_components/tita-brand";
import {
  Section,
  H2,
  Body,
  Quotes,
  Features,
  Steps,
  PriceTable,
  ChildNotice,
  SadonLegal,
  PreparingBand,
} from "../_ui";
import { ApplyForm, type Field } from "../ApplyForm";
import {
  VERIFY_COPY,
  CHILD_AGES,
  CHILD_NATIONALITY,
  CHILD_SIDE,
  TOLD_OPTIONS,
} from "../_sadon";

export const metadata: Metadata = {
  // trailingSlash: true 라 끝 슬래시까지 적는다. 다만 색인은 막아 둔다 —
  // 신고 전 모집은 곧 영업이라, 검색에 뜨면 안 된다.
  alternates: { canonical: "/sadon/chatjari/" },
  robots: { index: false, follow: false },
  title: "사돈 찻자리 — 부모끼리 나누는 자리 | 티타",
  description:
    "미혼 자녀를 두신 부모님 열두 분이 모여 차 한 잔 하는 자리. 조건으로 등급을 매기지 않습니다.",
};

const QUOTES = [
  ["“결혼정보회사는 싫다고 하더라고요.", "억지로 보냈다가 사이만 나빠졌어요.”"],
  ["“잘 키웠는데 왜 아직 혼자인지,", "물어보면 대답도 잘 안 하고요.”"],
  ["“예전에 만나던 사람을 제가 반대했었어요.", "그 뒤로는 말을 못 꺼내겠더라고요.”"],
  ["“좋은 자리 있으면 소개해달라는 말,", "이제는 하기도 민망하고요.”"],
];

const FEATURES = [
  {
    t: "부모님이 먼저 만나보십니다",
    d: "자녀분들은 자기 삶을 꾸리기에도 바쁩니다. 시간과 여력이 있는 쪽이 먼저 움직이는 편이 낫다고 생각했습니다. 그리고 사돈이 될 분을 마주 앉아 뵈면, 서류로는 안 보이던 것들이 보입니다.",
  },
  {
    t: "부모님 열두 분이 모입니다",
    d: "아드님 두신 분 여섯, 따님 두신 분 여섯. 네 분씩 한 테이블에 앉아 차를 마시며 집안 이야기를 나눕니다. 세 시간 동안 모든 분과 한 번씩 마주 앉으십니다.",
  },
  {
    t: "가정마다 부모님 한 분만 오십니다",
    d: "두 분이 함께 오시면 네 사람의 마음이 다 맞아야 합니다. 첫 자리의 문턱을 낮추려고 한 가정에 한 분으로 정했습니다. 아버님이든 어머님이든 상관없습니다.",
  },
  {
    t: "자녀분 사진은 가져오지 않으셔도 됩니다",
    d: "앞에 놓이는 것은 부모님 본인 사진입니다. 지금 자녀분 나이 때의 사진이 있으시면 그것으로, 없으시면 최근 사진으로 오시면 됩니다. 얼굴이 아니라 집안으로 만나보자는 것이 저희 생각입니다.",
  },
  {
    t: "조건표는 없습니다 — 조건을 안 본다는 뜻은 아니고요",
    d: "학교나 직장, 연봉을 적는 칸은 두지 않았습니다. 다만 집안 형편이 서로 너무 다르면 나중에 자녀분들이 힘들어진다는 걸 저희도 압니다. 그건 미리 살펴 자리를 맞춰 드립니다. 자리에서는 등급도 점수도 나오지 않습니다 — 어떤 집인지, 무엇을 소중히 여기는 집인지를 이야기합니다.",
  },
  {
    t: "오늘 성사시키는 자리가 아닙니다",
    d: "마음이 가는 분이 안 계셔도 괜찮습니다. 같은 시기를 지나는 분들과 이야기 나누고 가시는 것만으로 충분한 자리입니다.",
  },
];

const STEPS = [
  {
    t: "신청",
    d: "아래 양식으로 간단히 신청해 주십시오. 본인 확인을 함께 진행합니다.",
  },
  {
    t: "통화",
    d: "담당자가 전화로 십 분 정도 이야기를 나눕니다. 자녀분 이야기와 어떤 사돈이었으면 하시는지 물어봅니다.",
  },
  {
    t: "확인",
    d: "신분증과 가족관계증명서 두 가지만 받습니다. 확인 후 곧바로 파기하고, 파기 완료를 문자로 알려드립니다.",
  },
  {
    t: "초대",
    d: "자리가 편성되면 안내드립니다. 참가비는 이때 결제하십니다.",
  },
  { t: "자리", d: "오셔서 차 한잔 하시면 됩니다." },
  {
    t: "이후",
    d: "더 이야기 나누고 싶은 분을 비공개로 적어주십시오. 양쪽 모두 마음이 맞을 때만 연결해 드립니다. 한쪽만 적으신 경우에는 아무에게도 알리지 않습니다.",
  },
];

const FIELDS: Field[] = [
  { kind: "text", id: "a-name", label: "성함", placeholder: "성함을 적어주십시오" },
  { kind: "text", id: "a-tel", label: "연락처", type: "tel", placeholder: "010-0000-0000" },
  { kind: "choice", id: "a-side", label: "자녀분은", options: CHILD_SIDE },
  { kind: "choice", id: "a-age", label: "자녀분 연세", options: CHILD_AGES },
  // 국적 문항은 뺄 수 없다 — 이유는 _sadon.ts 의 CHILD_NATIONALITY 주석 참고.
  { kind: "choice", id: "a-nat", label: "자녀분 국적", options: CHILD_NATIONALITY },
  {
    // 부모 거주지가 아니라 자녀 생활권을 묻는다. 사돈에서 중요한 건 결혼 후
    // 왕래이고, 그건 부모 주소가 아니라 두 집안의 생활권 문제다. 이 한 줄로
    // 받을 수 있는 분이 크게 넓어진다 (docs/sadon/09 참고).
    kind: "select",
    id: "a-zone",
    label: "자녀분이 주로 생활하시는 곳",
    options: ["강남·서초·송파", "서울 그 밖의 지역", "경기·인천", "그 밖의 지역"],
  },
  { kind: "choice", id: "a-told", label: "자녀분께 알리셨습니까", options: TOLD_OPTIONS },
  { kind: "text", id: "a-ref", label: "알게 되신 경로", placeholder: "예: 지인 소개" },
  {
    kind: "text",
    id: "a-with",
    label: "함께 신청하실 다른 가정 (선택)",
    placeholder: "성함 / 연락처",
  },
];

export default function SadonPage() {
  return (
    <div
      style={{
        background: TITA.cream,
        color: TITA.ink,
        fontFamily: KOREAN_FONT_STACK,
        minHeight: "100vh",
      }}
    >
      <PreparingBand />
      <TitaHeader />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <header
        style={{
          padding: "80px 24px 64px",
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: 15,
            letterSpacing: "0.22em",
            color: TITA.muted,
            margin: "0 0 24px",
          }}
        >
          사 돈 찻 자 리
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
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.75,
            color: TITA.muted,
            margin: "0 0 32px",
          }}
        >
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
            padding: "18px 26px",
            fontSize: 17,
            lineHeight: 1.9,
            color: TITA.ink,
          }}
        >
          주중 낮 · 청담
          <br />
          아드님 측 여섯 분 / 따님 측 여섯 분
        </div>
      </header>

      <Section>
        <H2>혹시, 이런 마음이신가요</H2>
        <Quotes items={QUOTES} />
      </Section>

      <Section>
        <H2>이런 자리입니다</H2>
        <Features items={FEATURES} />
      </Section>

      <Section>
        <H2>이렇게 진행됩니다</H2>
        <Steps items={STEPS} />
      </Section>

      <Section>
        <H2>확인하는 것과 확인하지 않는 것</H2>
        <Body>
          <b style={{ color: TITA.ink }}>확인합니다.</b> {VERIFY_COPY.yes} 한 분 한 분
          담당자가 직접 통화하고 서류로 확인합니다.
        </Body>
        <Body>
          <b style={{ color: TITA.ink }}>확인하지 않습니다.</b> {VERIFY_COPY.no}
        </Body>
        <Body>{VERIFY_COPY.why}</Body>
      </Section>

      <Section>
        <ChildNotice
          lead="본인 모르게 진행되는 자리가 아닙니다. 신청해 주시면 자녀분께 안내를 보내드립니다."
          quote="부모님께서 찻자리에 참석하십니다. 내용을 확인하시거나 수정하실 수 있습니다."
        />
      </Section>

      <Section>
        <H2>참가비 안내</H2>
        <PriceTable
          rows={[
            { label: "찻자리 참가비 — 아드님 측", amount: "150,000원" },
            {
              label: "찻자리 참가비 — 따님 측",
              sub: "(초대 우대)",
              amount: "50,000원",
            },
            {
              label: "연결 — 양가 모두 원하실 때 (한 건)",
              amount: "150,000원",
            },
          ]}
          notes={[
            "참가비는 다과를 포함하며, 자리가 편성된 뒤에 결제하십니다.",
            "정기 회비나 장기 약정이 없습니다. 자리마다 따로 결정하시면 됩니다.",
            "다른 가정의 부모님과 함께 신청하시면 두 분 모두 30,000원을 빼드립니다.",
            "성혼 사례금은 받지 않습니다.",
          ]}
          refund={[
            "자리 7일 전까지 전액 환불 · 3일 전까지 50% 환불",
            "2일 전부터 당일까지는 환불이 어렵습니다 (대관·다과 확정)",
            "주최 측 사정으로 취소되는 경우 전액 환불해 드립니다",
          ]}
        />
      </Section>

      <Section last>
        <H2>신청</H2>
        <ApplyForm
          fields={FIELDS}
          submitLabel="본인 확인하고 신청하기"
          foot={[
            "신청 후 이틀 안에 담당자가 전화드립니다.",
            "참가비는 자리가 편성된 뒤에 결제하십니다.",
          ]}
        />
        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 15,
            color: TITA.mutedSoft,
          }}
        >
          <Link href="/sadon/danji/" style={{ color: TITA.muted }}>
            같은 단지에서 찾아보기
          </Link>
        </p>
      </Section>

      <SadonLegal name="사돈 찻자리" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 8px" }}>
        <TitaFooter />
      </div>
    </div>
  );
}
