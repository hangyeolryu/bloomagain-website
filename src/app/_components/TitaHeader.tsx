"use client";

// Shared sticky header used on every public page (home, about, business,
// for-children, etc.). Renders the wordmark on the left + "앱 받기"
// CTA on the right. The 2026-06 rebrand turned the navy bar into a
// translucent cream surface with a sage bottom border so the page
// content can show through during scroll.

import Link from "next/link";
import { Download } from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "./tita-brand";

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
          <Link
            href="/download"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: TITA.forest, color: "white" }}
          >
            앱 받기 <Download className="w-3 h-3" />
          </Link>
        </div>
      </nav>
    </header>
  );
}
