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
      {/* 사업자정보 — 전자상거래법 + 토스페이먼츠 빌링 심사 필수 6항목.
          통신판매업신고번호·유선전화번호는 발급 후 교체 (현재 플레이스홀더). */}
      <p>
        상호명 ㈜이프이프 (EFFEFF Co., Ltd.) · 대표자명 유한결 · 사업자등록번호 466-81-04205
      </p>
      <p className="mt-0.5">
        통신판매업신고번호 제2026-서울영등포-____호 · 전화 010-5647-1196
      </p>
      <p className="mt-0.5">
        사업장 주소 (07271) 서울특별시 영등포구 국회대로50길 20, 101동 803호
      </p>
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
