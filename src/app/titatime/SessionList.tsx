"use client";

// 이번 주 모집 자리 — 어드민(Firestore meetup_sessions)에서 세팅한 세션을
// 백엔드 공개 엔드포인트로 읽어 표시한다. 날짜를 코드에 하드코딩하지 않는다.
// 게시된 세션이 하나도 없으면(또는 백엔드 미설정/실패) "편성 예정" 폴백만 보여줘
// 페이지가 늘 정상으로 보이게 한다 — 미뤄야 할 땐 어드민에서 게시만 내리면 끝.

import { useEffect, useState } from "react";
import { TITA } from "../_components/tita-brand";
import { SessionApply } from "./SessionApply";

type SessionStatus = "open" | "almost" | "closed" | "planning";

interface Session {
  id?: string;
  district: string;
  dateLabel: string;
  spotsLabel: string;
  status: SessionStatus;
  description?: string | null;
}

const STATUS_STYLE: Record<
  SessionStatus,
  { label: string; bg: string; fg: string }
> = {
  open: { label: "모집 중", bg: "#E7F0EA", fg: TITA.forest },
  almost: { label: "마감 임박", bg: "#F6E9DA", fg: "#9A6B33" },
  closed: { label: "모집 마감", bg: "#ECECEC", fg: "#7A7A7A" },
  planning: { label: "편성 예정", bg: TITA.surface, fg: TITA.muted },
};

// 게시된 자리가 없을 때 항상 보여주는 폴백 — "관심 지역을 앱에서" 안내로
// 다운로드 퍼널은 유지한다.
const FALLBACK: Session = {
  district: "우리 동네",
  dateLabel: "새로운 자리를 편성하고 있어요",
  spotsLabel: "관심 지역을 앱에서 알려주세요",
  status: "planning",
};

function isOpenStatus(s: SessionStatus) {
  return s === "open" || s === "almost";
}

export function SessionList() {
  // null = 로딩 중(SSR/첫 렌더는 폴백을 보여줌 → 하이드레이션 안정)
  const [sessions, setSessions] = useState<Session[] | null>(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
    if (!backendUrl) {
      setSessions([]); // 백엔드 미설정 → 폴백
      return;
    }
    let cancelled = false;
    fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/titatime/sessions`, {
      headers: { Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((json) => {
        if (cancelled) return;
        const items: Session[] = Array.isArray(json?.items) ? json.items : [];
        setSessions(items);
      })
      .catch(() => {
        if (!cancelled) setSessions([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 로딩 중이거나 게시된 자리가 없으면 폴백 카드 하나.
  const list: Session[] =
    sessions && sessions.length > 0 ? sessions : [FALLBACK];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {list.map((s, i) => {
        const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.planning;
        const applyOpen = isOpenStatus(s.status);
        return (
          <div
            key={s.id ?? i}
            style={{
              background: TITA.white,
              border: `1px solid ${TITA.sage}`,
              borderRadius: 16,
              padding: "18px 20px",
            }}
          >
            <div
              style={{
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
                {s.description ? (
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: TITA.muted,
                      marginTop: 6,
                    }}
                  >
                    {s.description}
                  </div>
                ) : null}
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
            {applyOpen && <SessionApply district={s.district} />}
          </div>
        );
      })}
    </div>
  );
}
