/**
 * /sadon/danji — 사돈 찻자리 · 단지편
 *
 * 같은 아파트 단지 입주민 부모님끼리 먼저 찾아보는 모델. `/sadon` 이 회차마다
 * 새로 모집하는 오프라인 자리라면, 이쪽은 **한 번 확인한 분을 명단에 남겨
 * 두고 계속 쓰는** 구조다 — 모집 노동이 회차마다 다시 들지 않는 대신,
 * 단지별 밀도를 못 채우면 돈만 받고 자리를 못 드리게 된다. 그 위험이
 * 회비 구조(가입비+연회비)에 그대로 붙어 있다는 걸 알고 여는 페이지다.
 *
 * ⚠️ 두 가지는 아직 미결이라 문안을 조심해서 썼다.
 *   1. 연회비는 티타 플러스(월 19,000원)와 부딪힌다 — docs/sadon/00_INDEX 참고
 *   2. 단지를 고르게 하는 것은 사실상 단지 필터다. 결혼중개업법이 금지하는
 *      "차별하거나 편견을 조장할 우려가 있는 표시·광고"에 닿을 수 있어,
 *      순위·시세·등급을 암시하는 표현은 한 줄도 쓰지 않았고 푸터에 명시했다.
 *
 * 색인하지 않는다(robots).
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
  alternates: { canonical: "/sadon/danji/" },
  robots: { index: false, follow: false },
  title: "사돈 찻자리 · 단지 — 같은 단지 부모님들의 모임 | 티타",
  description:
    "미혼 자녀를 두신 입주민 부모님들의 모임. 입주 확인을 마치신 분들만 함께하십니다.",
};

const QUOTES = [
  ["“결혼정보회사는 싫다고 하더라고요.", "억지로 보냈다가 사이만 나빠졌어요.”"],
  ["“어디서 만나야 마음이 놓일지 모르겠어요.", "모르는 사람은 아무래도 걱정이 되고요.”"],
  ["“같은 단지에 사시는 분들이라면", "그래도 좀 안심이 되죠.”"],
];

const FEATURES = [
  {
    t: "입주 확인을 거친 분들만",
    d: "본인 확인과 입주 확인을 모두 마치신 분들만 함께하십니다. 서로가 어떤 분인지 이미 알고 시작하는 자리입니다.",
  },
  {
    t: "우리 단지에서, 또는 이웃 단지까지",
    d: "우리 단지 안에서 찾아보실 수도 있고, 가까운 이웃 단지까지 넓혀 보실 수도 있습니다. 넓히실지 말지는 부모님께서 정하십니다.",
  },
  {
    t: "자녀분 사진은 쓰지 않습니다",
    d: "올리시는 사진은 부모님 본인 사진입니다. 자녀분의 얼굴은 양가 부모님의 마음이 맞고, 자녀분이 동의하신 뒤에야 오갑니다.",
  },
  {
    t: "조건표가 없습니다",
    d: "학교나 직장, 연봉을 적는 칸을 두지 않았습니다. 어떤 집인지, 무엇을 소중히 여기는 집인지만 나눕니다.",
  },
  {
    t: "단지 안에서 만납니다",
    d: "계절마다 가까운 곳에서 차를 나누는 자리를 엽니다. 멀리 나가지 않으셔도 됩니다.",
  },
];

const STEPS = [
  { t: "가입 신청", d: "본인 확인과 입주 확인을 진행합니다." },
  { t: "통화", d: "담당자가 전화로 십 분 정도 이야기를 나눕니다." },
  {
    t: "집안 소개 작성",
    d: "부모님 사진과 집안 이야기, 자녀분 기본 사항을 적어주십시오.",
  },
  {
    t: "자녀분께 안내",
    d: "자녀분께 안내가 나갑니다. 확인하고 수정하실 수 있습니다.",
  },
  { t: "살펴보기", d: "우리 단지, 또는 넓히신 범위의 부모님들을 살펴보십니다." },
  {
    t: "연결",
    d: "양가 모두 마음이 맞을 때만 연결해 드립니다. 한쪽만 표시하신 경우에는 아무에게도 알리지 않습니다.",
  },
  { t: "찻자리", d: "계절마다 가까운 곳에서 만나는 자리를 엽니다." },
];

const FIELDS: Field[] = [
  { kind: "text", id: "b-name", label: "성함", placeholder: "성함을 적어주십시오" },
  { kind: "text", id: "b-tel", label: "연락처", type: "tel", placeholder: "010-0000-0000" },
  { kind: "text", id: "b-danji", label: "단지", placeholder: "단지 이름" },
  // 입주 확인 서류는 주소만 보는 것으로 좁혔다. 등기부등본과 '소유/임차'
  // 문항은 뺐다 — 재산 관련 서류는 받지 않는다는 원칙(docs/sadon/04 §7)과
  // "조건표가 없습니다"라는 이 페이지의 약속을 동시에 깨기 때문이다.
  {
    kind: "upload",
    id: "b-doc",
    label: "입주 확인 서류",
    hint: "주민등록등본 또는 최근 3개월 이내 관리비 고지서 · 주소만 확인한 뒤 즉시 파기합니다",
  },
  { kind: "choice", id: "b-side", label: "자녀분은", options: CHILD_SIDE },
  { kind: "choice", id: "b-age", label: "자녀분 연세", options: CHILD_AGES },
  { kind: "choice", id: "b-nat", label: "자녀분 국적", options: CHILD_NATIONALITY },
  { kind: "choice", id: "b-told", label: "자녀분께 알리셨습니까", options: TOLD_OPTIONS },
];

export default function SadonDanjiPage() {
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
            color: TITA.camel,
            margin: "0 0 24px",
          }}
        >
          사 돈 찻 자 리 · 단 지
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
          같은 단지에서
          <br />
          먼저 찾아봅니다
        </h1>
        <p
          style={{
            fontSize: 19,
            lineHeight: 1.75,
            color: TITA.muted,
            margin: "0 0 32px",
          }}
        >
          미혼 자녀를 두신 입주민 부모님들의 모임입니다.
          <br />
          입주 확인을 마치신 분들만 함께하십니다.
        </p>
        <span
          style={{
            display: "inline-block",
            border: `1px solid ${TITA.camel}`,
            color: TITA.forestDeep,
            background: TITA.white,
            borderRadius: 999,
            padding: "10px 22px",
            fontSize: 16,
          }}
        >
          입주민 전용
        </span>
      </header>

      <Section>
        <H2>혹시, 이런 마음이신가요</H2>
        <Quotes items={QUOTES} />
      </Section>

      <Section>
        <H2>이런 모임입니다</H2>
        <Features items={FEATURES} />
      </Section>

      <Section>
        <H2>입주 확인</H2>
        <div
          style={{
            background: TITA.white,
            border: `1px solid ${TITA.sage}`,
            borderRadius: 16,
            padding: "26px 24px",
          }}
        >
          <Body>
            아래 가운데 <b style={{ color: TITA.ink }}>한 가지</b>만 올려주시면 됩니다.
          </Body>
          <ul
            style={{
              margin: "0 0 18px",
              paddingLeft: 20,
              fontSize: 17,
              lineHeight: 1.9,
              color: TITA.muted,
            }}
          >
            <li>주민등록등본 — 정부24에서 무료로 발급받으실 수 있습니다</li>
            <li>관리비 고지서 — 최근 3개월 이내</li>
          </ul>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: TITA.ink,
              margin: 0,
              wordBreak: "keep-all",
            }}
          >
            <b>주소만</b> 확인한 뒤 곧바로 파기하며, 파기 완료를 문자로
            알려드립니다. 소유하셨는지 세 드셨는지는 묻지 않고, 다른 정보는
            보지 않습니다.
          </p>
        </div>
      </Section>

      <Section>
        <H2>이렇게 진행됩니다</H2>
        <Steps items={STEPS} />
      </Section>

      <Section>
        <H2>확인하는 것과 확인하지 않는 것</H2>
        <Body>
          <b style={{ color: TITA.ink }}>확인합니다.</b> {VERIFY_COPY.yes}{" "}
          그리고 이 단지에 실제로 사시는지.
        </Body>
        <Body>
          <b style={{ color: TITA.ink }}>확인하지 않습니다.</b> {VERIFY_COPY.no}
        </Body>
        <Body>{VERIFY_COPY.why}</Body>
      </Section>

      <Section>
        <ChildNotice
          lead="본인 모르게 진행되는 모임이 아닙니다. 가입하시면 자녀분께 안내를 보내드립니다."
          quote="부모님께서 사돈 찻자리에 가입하셨습니다. 내용을 확인하시거나 수정하실 수 있습니다."
        />
      </Section>

      <Section>
        <H2>회비 안내</H2>
        <PriceTable
          rows={[
            { label: "가입비", sub: "(최초 1회)", amount: "200,000원" },
            { label: "연회비", amount: "300,000원" },
            {
              label: "연결 — 양가 모두 원하실 때 (한 건)",
              amount: "150,000원",
            },
          ]}
          notes={[
            "계절 찻자리 참가비는 회비에 포함되어 있습니다 (다과 실비 별도).",
            "만남 횟수를 약정하지 않으며, 횟수를 차감하지 않습니다.",
            "성혼 사례금은 받지 않습니다.",
          ]}
          refund={[
            "가입 후 7일 이내 · 서비스 이용 전이라면 전액 환불",
            "이용 중 해지하시면 남은 기간에 해당하는 연회비를 일할 계산하여 환불",
            "가입비는 입주 확인과 상담을 마친 뒤에는 환불이 어렵습니다",
            "주최 측 사정으로 운영이 중단되는 경우 전액 환불해 드립니다",
          ]}
        />
      </Section>

      <Section last>
        <H2>가입 신청</H2>
        <ApplyForm
          fields={FIELDS}
          submitLabel="본인 확인하고 신청하기"
          foot={[
            "신청 후 이틀 안에 담당자가 전화드립니다.",
            "회비는 통화 이후에 결제하십니다.",
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
          <Link href="/sadon/" style={{ color: TITA.muted }}>
            단지와 상관없이 열리는 찻자리
          </Link>
        </p>
      </Section>

      <SadonLegal name="사돈 찻자리 · 단지" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px" }}>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.9,
            color: TITA.mutedSoft,
            margin: "0 0 8px",
            wordBreak: "keep-all",
          }}
        >
          이 모임은 특정 단지나 건설사와 제휴하거나 후원받지 않으며, 단지의
          가치나 순위를 평가하지 않습니다.
        </p>
        <TitaFooter />
      </div>
    </div>
  );
}
