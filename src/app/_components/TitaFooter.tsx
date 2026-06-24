"use client";

// Shared site footer. Tiny legal-grade strip with the company line,
// links to privacy/terms, and a contact email. Lives at the bottom of
// every page so the legal links are always reachable (App Store
// reviewer + Korean PIPA compliance).

import Link from "next/link";
import { TITA, KOREAN_FONT_STACK } from "./tita-brand";

export function TitaFooter() {
  return (
    <footer
      className="pt-10 mt-10 border-t text-center text-[11px]"
      style={{
        color: TITA.muted,
        borderColor: TITA.sage,
        fontFamily: KOREAN_FONT_STACK,
      }}
    >
      <p>㈜이프이프 (EFFEFF Co., Ltd.) · 사업자등록 466-81-04205</p>
      <p className="mt-1.5">
        <Link
          href="/about"
          className="hover:underline"
          style={{ color: TITA.forest }}
        >
          소개
        </Link>
        {" · "}
        <Link
          href="/privacy"
          className="hover:underline"
          style={{ color: TITA.forest }}
        >
          개인정보 처리방침
        </Link>
        {" · "}
        <Link
          href="/terms"
          className="hover:underline"
          style={{ color: TITA.forest }}
        >
          이용약관
        </Link>
        {" · "}
        <a
          href="mailto:ceo@effeffcorp.com"
          className="hover:underline"
          style={{ color: TITA.forest }}
        >
          연락처
        </a>
      </p>
      <p className="mt-2 mb-4" style={{ color: TITA.mutedSoft }}>
        © {new Date().getFullYear()} EFFEFF · Tita
      </p>
    </footer>
  );
}
