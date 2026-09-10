"use client";

/**
 * 도시별로 몇 분이 모이셨는지 — 결과 화면 아래에 붙는다.
 *
 * 날숫자를 그대로 쓰면 역효과다. "부산 6명이 모이고 있어요"를 본 부산 분은
 * '아무도 없구나'로 읽는다. 사회적 증명은 숫자가 클 때만 작동한다. 그래서
 * 목표(8명)까지의 진행으로 보여준다 — 같은 6이 '두 분만 더'가 된다.
 *
 * 두 명 이하인 도시는 숫자를 아예 안 쓴다. 막대를 그려도 비어 보이고
 * "한 분 모이셨어요"는 아무도 없다는 말로 읽힌다. 그 자리에는 창립회원
 * 문구를 넣어, 같은 상황을 먼저 들어올 이유로 바꾼다.
 *
 * 숫자는 본인인증을 마친 분만 센다(서버 cityCounts). 자리를 신청할 수 있는 게
 * 그분들뿐이라, 가입자로 세면 "여덟 분 모이면 엽니다"가 거짓말이 된다.
 */

import { useEffect, useState } from "react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";

const ENDPOINT =
  "https://asia-northeast3-bloomagain-korea.cloudfunctions.net/cityCounts";

/** 숫자를 쓰기 시작하는 선. 이하는 '아직 시작 전'으로 둔다. */
const SHOW_FROM = 3;

/**
 * 사람을 셀 때는 고유어로. "6분이 모이셨어요"는 6분(minutes)으로 읽힌다 —
 * 분이 시간 단위와 사람 높임말을 겸해서, 아라비아 숫자를 앞에 붙이면
 * 시간 쪽으로 먼저 기운다. 열까지는 고유어로 적고 그 위는 '명'으로 센다.
 */
const NATIVE = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉", "열"];
const people = (n: number) => (n <= 10 ? `${NATIVE[n]} 분` : `${n}명`);

type Row = { key: string; label: string; count: number; open: boolean };
type Counts = { goal: number; rows: Row[]; rest: number };

export default function CityProgress() {
  const [data, setData] = useState<Counts | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(ENDPOINT)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (alive && j?.rows?.length) setData(j);
      })
      .catch(() => {
        /* 부가 정보다 — 못 불러오면 이 칸만 조용히 빠진다 */
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!data) return null;

  return (
    <section
      style={{
        marginTop: 36,
        padding: "22px 20px",
        borderRadius: 16,
        background: TITA.white,
        border: `1px solid ${TITA.sage}`,
        fontFamily: KOREAN_FONT_STACK,
        textAlign: "left",
      }}
    >
      <h2 style={{ fontSize: 16, color: TITA.ink, margin: "0 0 6px" }}>
        어느 도시에서 열리고 있나요
      </h2>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: TITA.muted, margin: "0 0 18px" }}>
        티타는 도시마다 사람이 모이면 그곳에서 자리를 엽니다.
        <br />
        본인인증까지 마치신 분만 세었어요.
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {data.rows.map((r) => (
          <CityRow key={r.key} row={r} goal={data.goal} />
        ))}
      </ul>

      <p style={{ fontSize: 12.5, lineHeight: 1.75, color: TITA.muted, margin: "18px 0 0" }}>
        사시는 곳이 아직 시작 전이어도 괜찮습니다.
        <br />
        먼저 들어와 계시면, 그 도시가 열릴 때 가장 먼저 알려드릴게요.
      </p>
    </section>
  );
}

function CityRow({ row, goal }: { row: Row; goal: number }) {
  const started = row.count >= SHOW_FROM;
  const left = Math.max(0, goal - row.count);

  let note: string;
  if (row.open) note = "자리가 열려 있어요";
  else if (!started) note = "아직 시작 전이에요";
  else if (left === 0) note = "곧 첫 자리를 엽니다";
  else note = `${people(row.count)}이 모이셨어요 · ${people(left)}만 더 모이면 첫 자리를 엽니다`;

  const pct = row.open ? 100 : Math.min(100, (row.count / goal) * 100);

  return (
    <li style={{ padding: "10px 0", borderTop: `1px solid ${TITA.surface}` }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 14.5, color: TITA.ink, minWidth: 74 }}>{row.label}</span>
        <span style={{ fontSize: 12.5, color: row.open ? TITA.forest : TITA.muted }}>
          {note}
        </span>
      </div>
      <div
        style={{
          marginTop: 7,
          height: 5,
          borderRadius: 99,
          background: TITA.surface,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${started || row.open ? pct : 0}%`,
            height: "100%",
            borderRadius: 99,
            background: row.open ? TITA.forest : TITA.forestMid,
            transition: "width .6s ease",
          }}
        />
      </div>
      {!row.open && !started && (
        <p style={{ fontSize: 12, lineHeight: 1.65, color: TITA.mutedSoft, margin: "6px 0 0" }}>
          첫 번째로 이름을 올려두시면, 그 도시가 열릴 때 창립회원으로 시작합니다.
        </p>
      )}
    </li>
  );
}
