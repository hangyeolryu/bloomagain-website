"use client";

// Shared sticky header used on every public page (home, about, business,
// for-children, etc.). Renders the wordmark on the left + "앱 받기"
// CTA on the right. The 2026-06 rebrand turned the navy bar into a
// translucent cream surface with a sage bottom border so the page
// content can show through during scroll.

import Link from "next/link";
import { Download } from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "./tita-brand";
import { logAnalyticsEvent } from "@/lib/firebase";

export function TitaHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(251, 247, 240, 0.92)",
        backdropFilter: "blur(8px)",
        borderColor: TITA.sage,
        fontFamily: KOREAN_FONT_STACK,
      }}
    >
      <nav className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="flex items-baseline gap-2">
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: TITA.ink }}
            >
              티타
            </span>
            <span className="text-xs" style={{ color: TITA.muted }}>
              Tita
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/blog"
              className="relative inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-70"
              style={{ color: TITA.ink }}
            >
              블로그
              <span
                className="inline-flex items-center rounded-full px-1.5 py-px text-[9px] font-extrabold leading-none tracking-wide"
                style={{ backgroundColor: TITA.camel, color: TITA.forestDeep }}
              >
                NEW
              </span>
            </Link>
            <Link
              href="/download/"
              onClick={() =>
                logAnalyticsEvent("download_cta_click", {
                  source: "header",
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:scale-105"
              style={{ backgroundColor: TITA.forest, color: "white" }}
            >
              앱 받기 <Download className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
