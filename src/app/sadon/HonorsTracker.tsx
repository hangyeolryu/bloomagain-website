"use client";

/**
 * 아너스 랜딩 이탈 지점 측정 (2026-10-05).
 *
 * 광고로 하루 수십 명이 들어오는데 신청 버튼을 누른 사람이 0이었다.
 * 어디서 나가는지 보려고 붙였다. 개인정보는 보내지 않는다 — 구간 이름과
 * 시간뿐이다.
 *
 *   honors_section_view {section}  각 구간이 화면에 반쯤 들어오면 한 번
 *   honors_scroll {depth}          25·50·75·100%
 *   honors_engaged {seconds}       화면을 보고 있는 채로 30·60·120초
 *   honors_cta_click {cta}         첫 화면 '참가 신청' 버튼
 *
 * GA(→ BigQuery, 다음 날)와 Meta 픽셀(커스텀 이벤트, 이벤트 관리자에서
 * 바로 보임) 두 곳으로 같이 쏜다.
 */

import { useEffect } from "react";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";

function fire(event: string, params: Record<string, string | number>) {
  logAnalyticsEvent(event, params);
  // Meta 커스텀 이벤트 이름은 낙타 표기로 — 이벤트 관리자에서 읽기 쉽게.
  const meta = "Honors" + event.replace(/^honors_/, "").replace(/(^|_)(\w)/g, (_, __, c) => c.toUpperCase());
  trackPixel(meta, params, true);
}

export function HonorsTracker() {
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const name = (e.target as HTMLElement).dataset.honors;
          if (!name || !e.isIntersecting || seen.has(name)) return;
          seen.add(name);
          fire("honors_section_view", { section: name });
        });
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll<HTMLElement>("[data-honors]").forEach((el) => io.observe(el));

    const depths = [25, 50, 75, 100];
    const hit = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const pct = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
      depths.forEach((d) => {
        if (pct >= d - 1 && !hit.has(d)) {
          hit.add(d);
          fire("honors_scroll", { depth: d });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // 화면을 실제로 보고 있는 시간만 센다(탭을 내려두면 멈춤).
    let visibleMs = 0;
    let last = Date.now();
    const marks = [30, 60, 120];
    const sent = new Set<number>();
    const tick = setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === "visible") visibleMs += now - last;
      last = now;
      marks.forEach((m) => {
        if (visibleMs >= m * 1000 && !sent.has(m)) {
          sent.add(m);
          fire("honors_engaged", { seconds: m });
        }
      });
    }, 1000);

    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement).closest<HTMLElement>("[data-honors-cta]");
      if (el) fire("honors_cta_click", { cta: el.dataset.honorsCta || "" });
    };
    document.addEventListener("click", onClick);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick);
      clearInterval(tick);
    };
  }, []);
  return null;
}
