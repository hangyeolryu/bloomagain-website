"use client";

// "이런 분들을 만나요" — 결 맞는 45+ 또래 예시 프로필. PersonaStories와 같은
// 찰칵 스냅 캐러셀(자동 넘김·스와이프·가운데 확대·진행 점). 소극적 다수가
// "나 같은 사람들이 여기 있네" 를 느끼게 한다. 아바타는 public/avatars/p1~7.jpg.
// ※ 실제 회원이 아닌 예시 프로필(지어낸 페르소나 + AI 일러스트).

import { useEffect, useRef, useState } from "react";
import { TITA } from "./tita-brand";

type Person = {
  img: string;
  name: string;
  meta: string;
  quote: string;
  chips: string[];
  tag?: string;
  tagKind?: "new" | "tea";
};

const PEOPLE: Person[] = [
  { img: "/avatars/p1.jpg", name: "이현숙", meta: "56 · 은평", quote: "은퇴하고 서예를 다시 시작했어요. 조용히 오래 사귀는 걸 좋아해요.", chips: ["서예", "등산", "클래식"] },
  { img: "/avatars/p2.jpg", name: "김정순", meta: "61 · 부산", quote: "산에 혼자 다니는 것도, 하루 이틀이지.", chips: ["등산", "사진", "트로트"], tag: "새로 왔어요", tagKind: "new" },
  { img: "/avatars/p3.jpg", name: "박미영", meta: "49 · 분당", quote: "애들 대학 보내고 나니 시간이 확 생겼는데, 다들 바쁘더라고요.", chips: ["필라테스", "전시", "와인"] },
  { img: "/avatars/p4.jpg", name: "정말순", meta: "68 · 대구", quote: "손주 보는 낙으로 살았는데, 이제 걔들도 크네요.", chips: ["텃밭", "트로트", "산책"] },
  { img: "/avatars/p5.jpg", name: "최경자", meta: "53 · 인천", quote: "남편 따라 낯선 동네로 이사 왔어요. 여긴 아는 사람이 없네요.", chips: ["요리", "반려식물", "드라마"], tag: "이번 주 찻자리", tagKind: "tea" },
  { img: "/avatars/p6.jpg", name: "한영미", meta: "59 · 광주", quote: "새 사람 사귀는 거 어색한데… 그래도 마음 맞는 친구 하나쯤은.", chips: ["독서", "뜨개", "카페"] },
  { img: "/avatars/p7.jpg", name: "박영수", meta: "61 · 대구", quote: "혼자 밥 먹는 게 익숙해졌지만, 가끔은 말동무가 그립죠.", chips: ["바둑", "산책", "다큐멘터리"] },
];

const CARD_W = 300;
const GAP = 16;
const STRIDE = CARD_W + GAP;
const HOLD = 2800;
const SLIDE = 450;

export function PeopleWall() {
  const n = PEOPLE.length;
  const items = [...PEOPLE, ...PEOPLE];
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const paused = useRef(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      if (!paused.current) setIndex((i) => i + 1);
    }, HOLD);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (index >= n) {
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex((i) => i - n);
      }, SLIDE + 20);
      return () => clearTimeout(t);
    }
  }, [index, n]);

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
    <section
      className="py-16 sm:py-20 border-t"
      style={{ backgroundColor: TITA.surface, borderColor: TITA.sage }}
    >
      <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center mb-8">
        <p className="text-xs font-semibold tracking-wide mb-2.5" style={{ color: TITA.forestMid }}>
          티타 · 지금 여기
        </p>
        <h2
          className="text-xl sm:text-2xl font-bold mb-3 leading-snug"
          style={{ color: TITA.ink, letterSpacing: "-0.015em" }}
        >
          이런 분들을 만나요
        </h2>
        <p className="text-sm sm:text-base" style={{ color: TITA.muted, wordBreak: "keep-all" }}>
          같은 시기를 지나는, 같은 마음의 또래가 여기 있어요. 활발하지 않아도 괜찮아요.
        </p>
      </div>

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
          {items.map((p, i) => {
            const active = i === index;
            return (
              <figure
                key={i}
                className="shrink-0 rounded-2xl p-5 flex flex-col"
                style={{
                  width: CARD_W,
                  minHeight: 226,
                  backgroundColor: "#fff",
                  border: `1px solid ${TITA.sage}`,
                  wordBreak: "keep-all",
                  transform: active ? "scale(1)" : "scale(0.82)",
                  opacity: active ? 1 : 0.6,
                  transition: `transform ${SLIDE}ms ease, opacity ${SLIDE}ms ease`,
                  boxShadow: active ? "0 12px 30px -14px rgba(31,78,61,0.35)" : "none",
                }}
                aria-hidden={!active}
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.name}
                    className="rounded-full object-cover flex-none"
                    style={{ width: 52, height: 52, background: TITA.sage }}
                  />
                  <div className="min-w-0">
                    <div className="text-[16px] font-extrabold" style={{ color: TITA.ink }}>
                      {p.name}
                      <span className="text-[13px] font-semibold ml-1.5" style={{ color: TITA.muted }}>
                        {p.meta}
                      </span>
                    </div>
                    {p.tag && (
                      <span
                        className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={
                          p.tagKind === "tea"
                            ? { color: TITA.camel, backgroundColor: "#F3ECDD" }
                            : { color: TITA.forest, backgroundColor: TITA.surface }
                        }
                      >
                        {p.tag}
                      </span>
                    )}
                  </div>
                </div>
                <blockquote className="text-[14.5px] leading-relaxed mt-3.5" style={{ color: TITA.ink }}>
                  “{p.quote}”
                </blockquote>
                <div
                  className="flex flex-wrap gap-1.5 mt-auto pt-3.5"
                  style={{ borderTop: `1px solid ${TITA.sage}` }}
                >
                  {p.chips.map((c) => (
                    <span
                      key={c}
                      className="text-[12.5px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        color: TITA.forestMid,
                        backgroundColor: TITA.cream,
                        border: `1px solid ${TITA.sage}`,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </figure>
            );
          })}
        </div>

        <div className="flex justify-center gap-1.5 mt-7">
          {PEOPLE.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all"
              style={{
                width: index % n === i ? 18 : 6,
                height: 6,
                backgroundColor: index % n === i ? TITA.forest : "rgba(31,78,61,0.18)",
              }}
            />
          ))}
        </div>
      </div>

      <p className="text-center mt-8 text-[11.5px]" style={{ color: TITA.mutedSoft }}>
        * 서비스 이해를 돕기 위한 예시 프로필이에요 (실제 회원 아님).
      </p>
    </section>
  );
}
