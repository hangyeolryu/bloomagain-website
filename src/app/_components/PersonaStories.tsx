"use client";

// 페르소나 스토리 — "혹시 내 얘기?" 공감 카드. 연속 스크롤이 아니라
// 1.5초마다 '찰칵' 스냅으로 다음 카드로 넘어간다. 가운데 카드는 1.0,
// 양옆은 0.8 크기로 살짝 보인다. 손가락 스와이프로 직접 넘길 수 있고,
// 호버/터치 중엔 자동 넘김이 멈춘다. 리스트를 2배 복제해 마지막에서
// 처음으로 이음매 없이 되돌아온다(동일 카드라 점프가 보이지 않음).

import { useEffect, useRef, useState } from "react";
import { TITA } from "./tita-brand";

// 실제 후기가 아니라 공감용 상황 소묘. 특정 인물로 오해되지 않게
// 이름·나이 대신 '상황 라벨'을 단다.
const STORIES: { quote: string; tag: string }[] = [
  { quote: "아이들 다 키우고 나니, 낮이 참 조용하더라고요. 커피 한 잔 같이할 사람이 있었으면.", tag: "빈 둥지의 오후" },
  { quote: "회사를 그만두고 알았어요. 매일 보던 건 ‘동료’였지, 친구는 아니었다는 걸.", tag: "은퇴, 그 다음" },
  { quote: "새 취미를 시작하고 싶은데, 혼자 가려니 영 용기가 안 나더라고요.", tag: "혼자라 미뤄둔 것들" },
  { quote: "단톡방은 가득한데, 정작 속 얘기 편히 할 사람은 없더라고요.", tag: "연락처는 많은데" },
  { quote: "남편도 자식도 각자 바빠요. 나에게도 ‘내 사람’이 필요하더라고요.", tag: "가족 말고, 내 사람" },
  { quote: "나이 들수록 새 친구는 어렵다지만, 결이 맞는 한 사람은 늘 반가워요.", tag: "그래도, 결이 맞으면" },
];

const CARD_W = 260; // px
const GAP = 16;
const STRIDE = CARD_W + GAP;
const HOLD = 2500; // 카드당 머무는 시간
const SLIDE = 450; // 스냅 전환 시간

export function PersonaStories() {
  const n = STORIES.length;
  const items = [...STORIES, ...STORIES]; // 이음매 없는 루프용 복제
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);

  // 자동 넘김
  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => i + 1);
    }, HOLD);
    return () => clearInterval(t);
  }, []);

  // 마지막(복제 첫장)에 닿으면 전환 끝난 뒤 애니메이션 없이 0으로 리셋
  useEffect(() => {
    if (index >= n) {
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex((i) => i - n);
      }, SLIDE + 20);
      return () => clearTimeout(t);
    }
  }, [index, n]);

  // 리셋 직후 다음 프레임에 애니메이션 복구
  useEffect(() => {
    if (!animate) {
      const r = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(r);
    }
  }, [animate]);

  const go = (dir: number) => {
    setAnimate(true);
    setIndex((i) => Math.max(0, Math.min(i + dir, n)));
  };

  return (
    <div
      className="overflow-hidden select-none"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onTouchStart={(e) => {
        paused.current = true;
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }
        paused.current = false;
      }}
    >
      <div
        className="flex items-center"
        style={{
          gap: GAP,
          transform: `translateX(calc(50% - ${CARD_W / 2}px - ${index * STRIDE}px))`,
          transition: animate
            ? `transform ${SLIDE}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : "none",
        }}
      >
        {items.map((s, i) => {
          const active = i === index;
          return (
            <figure
              key={i}
              className="shrink-0 rounded-2xl p-5 flex flex-col justify-center"
              style={{
                width: CARD_W,
                minHeight: 150,
                backgroundColor: TITA.cream,
                transform: active ? "scale(1)" : "scale(0.8)",
                opacity: active ? 1 : 0.55,
                transition: `transform ${SLIDE}ms ease, opacity ${SLIDE}ms ease`,
                boxShadow: active ? "0 8px 24px rgba(0,0,0,0.18)" : "none",
              }}
              aria-hidden={!active}
            >
              <span
                className="text-[11px] font-bold tracking-wide mb-2"
                style={{ color: TITA.camel }}
              >
                {s.tag}
              </span>
              <blockquote
                className="text-[15px] leading-relaxed"
                style={{ color: TITA.ink }}
              >
                “{s.quote}”
              </blockquote>
            </figure>
          );
        })}
      </div>

      {/* 진행 점 */}
      <div className="flex justify-center gap-1.5 mt-6">
        {STORIES.map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-all"
            style={{
              width: index % n === i ? 18 : 6,
              height: 6,
              backgroundColor: index % n === i ? TITA.camel : "rgba(251,247,240,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
