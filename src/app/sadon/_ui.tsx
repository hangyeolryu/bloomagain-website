/**
 * 사돈 찻자리 랜딩의 공용 조각들.
 *
 * 두 장(`/sadon`, `/sadon/danji`)이 같은 골격을 쓴다. 톤은 티타 본 사이트와
 * 같은 forest/cream 팔레트로 맞췄다 — 신규 브랜드를 만들지 않는다는 결정
 * (docs/sadon/00_INDEX.md)에 따라 별도 색을 쓰지 않는다.
 *
 * 글자는 전부 한 단계 크다. 읽는 분이 55세 이상이다.
 */

import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { LICENSE_NO, OFFICE_ADDRESS, CONTACT_TEL, SADON_OPEN } from "./_sadon";

const WRAP: React.CSSProperties = {
  maxWidth: 720,
  margin: "0 auto",
  padding: "0 24px",
  width: "100%",
};

/** 신고 전에는 이 띠가 상단에 붙는다. 번호가 들어오면 사라진다. */
export function PreparingBand() {
  if (SADON_OPEN) return null;
  return (
    <div
      style={{
        background: TITA.forestDeep,
        color: TITA.cream,
        textAlign: "center",
        padding: "12px 16px",
        fontSize: 15,
        lineHeight: 1.6,
        fontFamily: KOREAN_FONT_STACK,
      }}
    >
      준비 중인 자리입니다 · <b>국내결혼중개업 신고를 마친 뒤 신청을 받습니다</b>
    </div>
  );
}

export function Section({
  children,
  last = false,
}: {
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      style={{
        padding: "64px 0",
        borderBottom: last ? "none" : `1px solid ${TITA.sage}`,
      }}
    >
      <div style={WRAP}>{children}</div>
    </section>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 26,
        fontWeight: 800,
        letterSpacing: "-0.6px",
        lineHeight: 1.5,
        color: TITA.forestDeep,
        margin: "0 0 32px",
      }}
    >
      {children}
    </h2>
  );
}

export function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 18,
        lineHeight: 1.85,
        color: TITA.muted,
        margin: "0 0 20px",
        wordBreak: "keep-all",
      }}
    >
      {children}
    </p>
  );
}

/** 공감 카드 — 부모님이 실제로 하신 말의 형태로 쓴다. */
export function Quotes({ items }: { items: string[][] }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {items.map((lines) => (
        <div
          key={lines.join("")}
          style={{
            background: TITA.white,
            border: `1px solid ${TITA.sage}`,
            borderRadius: 16,
            padding: "24px 26px",
            fontSize: 18,
            lineHeight: 1.8,
            color: TITA.ink,
            wordBreak: "keep-all",
          }}
        >
          {lines.map((l, i) => (
            <span key={l}>
              {i > 0 && <br />}
              {l}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Features({
  items,
}: {
  items: { t: string; d: string }[];
}) {
  return (
    <div>
      {items.map((f, i) => (
        <div
          key={f.t}
          style={{
            padding: i === 0 ? "0 0 26px" : "26px 0",
            borderTop: i === 0 ? "none" : `1px solid ${TITA.sage}`,
          }}
        >
          <h3
            style={{
              fontSize: 21,
              fontWeight: 800,
              color: TITA.ink,
              margin: "0 0 8px",
              letterSpacing: "-0.4px",
            }}
          >
            {f.t}
          </h3>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.8,
              color: TITA.muted,
              margin: 0,
              wordBreak: "keep-all",
            }}
          >
            {f.d}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Steps({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {items.map((s, i) => (
        <li
          key={s.t}
          style={{ display: "flex", gap: 16, paddingBottom: 28 }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 34,
              height: 34,
              borderRadius: 999,
              background: TITA.sage,
              color: TITA.forest,
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
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: TITA.ink,
                marginBottom: 4,
              }}
            >
              {s.t}
            </div>
            <div
              style={{
                fontSize: 17,
                lineHeight: 1.8,
                color: TITA.muted,
                wordBreak: "keep-all",
              }}
            >
              {s.d}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * 요금표.
 *
 * 홈페이지에 수수료·회비 표를 게시하는 것은 결혼중개업의 상시 의무다
 * (`04` §5). 장식이 아니라 법정 게시물이라 접거나 숨기지 않는다.
 */
export function PriceTable({
  rows,
  notes,
  refund,
}: {
  rows: { label: string; sub?: string; amount: string }[];
  notes: string[];
  refund: string[];
}) {
  return (
    <>
      <div
        style={{
          background: TITA.white,
          border: `1px solid ${TITA.sage}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 20px",
            background: TITA.surface,
            fontSize: 15,
            fontWeight: 700,
            color: TITA.ink,
          }}
        >
          <span>항목</span>
          <span>금액</span>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 16,
              padding: "16px 20px",
              borderTop: i === 0 ? "none" : `1px solid ${TITA.sage}`,
              fontSize: 17,
            }}
          >
            <span style={{ color: TITA.ink, wordBreak: "keep-all" }}>
              {r.label}
              {r.sub && (
                <span style={{ color: TITA.mutedSoft, fontSize: 15 }}>
                  {" "}
                  {r.sub}
                </span>
              )}
            </span>
            <span
              style={{
                whiteSpace: "nowrap",
                fontWeight: 700,
                color: TITA.forestDeep,
              }}
            >
              {r.amount}
            </span>
          </div>
        ))}
      </div>

      <ul
        style={{
          margin: "18px 0 0",
          paddingLeft: 20,
          fontSize: 16,
          lineHeight: 1.85,
          color: TITA.muted,
        }}
      >
        {notes.map((n) => (
          <li key={n} style={{ wordBreak: "keep-all" }}>
            {n}
          </li>
        ))}
      </ul>

      <h3
        style={{
          fontSize: 19,
          fontWeight: 800,
          color: TITA.forestDeep,
          margin: "32px 0 10px",
        }}
      >
        환불 규정
      </h3>
      <ul
        style={{
          margin: 0,
          paddingLeft: 20,
          fontSize: 16,
          lineHeight: 1.85,
          color: TITA.muted,
        }}
      >
        {refund.map((r) => (
          <li key={r} style={{ wordBreak: "keep-all" }}>
            {r}
          </li>
        ))}
      </ul>
    </>
  );
}

/** 자녀분께 알린다는 약속. 이 상자는 두 장에서 문구만 바뀐다. */
export function ChildNotice({
  lead,
  quote,
}: {
  lead: string;
  quote: string;
}) {
  return (
    <div
      style={{
        background: TITA.surface,
        borderLeft: `4px solid ${TITA.forest}`,
        borderRadius: "0 16px 16px 0",
        padding: "26px 26px",
      }}
    >
      <h3
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: TITA.forestDeep,
          margin: "0 0 10px",
        }}
      >
        자녀분께 미리 알려주십시오
      </h3>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.8,
          color: TITA.ink,
          margin: "0 0 10px",
          wordBreak: "keep-all",
        }}
      >
        {lead}
      </p>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.8,
          color: TITA.muted,
          margin: "0 0 10px",
          wordBreak: "keep-all",
        }}
      >
        “{quote}”
      </p>
      <p
        style={{
          fontSize: 17,
          lineHeight: 1.8,
          color: TITA.ink,
          margin: 0,
          fontWeight: 700,
        }}
      >
        자녀분이 원하지 않으시면 그 자리에서 중단됩니다.
      </p>
    </div>
  );
}

/**
 * 법정 표시 — 신고번호는 광고·표시에 반드시 들어가야 한다(`04` §5).
 * 아직 없으므로 ○○○○ 로 비워 두고, LICENSE_NO 가 채워지면 자동으로 바뀐다.
 */
export function SadonLegal({ name }: { name: string }) {
  const blank = (v: string, ph: string) =>
    v ? (
      <>{v}</>
    ) : (
      <span
        style={{
          background: "#FFF0C2",
          color: "#7A5B00",
          padding: "0 6px",
          borderRadius: 4,
        }}
      >
        {ph}
      </span>
    );

  return (
    <div
      style={{
        ...WRAP,
        padding: "36px 24px 8px",
        fontSize: 15,
        lineHeight: 2,
        color: TITA.mutedSoft,
      }}
    >
      <p style={{ margin: 0 }}>
        <b style={{ color: TITA.muted }}>{name}</b>
        <br />
        국내결혼중개업 신고번호 제{blank(LICENSE_NO, "○○○○")}호
        <br />
        주식회사 이프이프 · 대표 유한결 · 사업자등록번호 466-81-04205
        <br />
        중개사무소 {blank(OFFICE_ADDRESS, "○○○○○○")}
        <br />
        문의 {blank(CONTACT_TEL, "○○○-○○○○-○○○○")}
      </p>
    </div>
  );
}
