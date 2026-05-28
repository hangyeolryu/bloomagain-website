import Link from "next/link";
import { ReactNode } from "react";
import BackToTop from "./BackToTop";
import TableOfContents, { TocItem } from "./TableOfContents";

interface LegalLayoutProps {
  /** H1 title, e.g. "이용약관". */
  title: string;
  /** Subtitle line under the title. */
  subtitle?: string;
  /** "v2.0 · 2026-05-19" or similar version tag (renders prominently). */
  versionTag: string;
  /** Sections for the table of contents — order matches body order. */
  toc: TocItem[];
  /** Last-update date in user-friendly Korean (e.g. "2026년 5월 19일"). */
  lastUpdated: string;
  /** Effective date in user-friendly Korean. */
  effectiveDate: string;
  /** Currently-active nav link key (terms | privacy | security). */
  activeKey: "terms" | "privacy" | "security";
  /** Body sections — each section should have an `id` matching the TOC anchor. */
  children: ReactNode;
}

const NAV_LINKS = [
  { key: "home", label: "홈", href: "/" },
  { key: "terms", label: "이용약관", href: "/terms" },
  { key: "privacy", label: "개인정보처리방침", href: "/privacy" },
  { key: "security", label: "보안·행동 데이터", href: "/security-processing" },
  { key: "delete", label: "계정삭제", href: "/delete-account" },
];

export default function LegalLayout({
  title,
  subtitle,
  versionTag,
  toc,
  lastUpdated,
  effectiveDate,
  activeKey,
  children,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-[#1a1a1a]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#0F1A35]">다시, 봄</span>
              <span className="text-sm text-gray-500 hidden sm:inline">Bloom Again</span>
            </Link>
            <div className="hidden md:flex items-baseline space-x-1">
              {NAV_LINKS.map((link) => {
                const isActive = link.key === activeKey;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? "text-[#0F1A35] bg-[#BFE38A]/25"
                        : "text-gray-600 hover:text-[#10367D] hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Title + meta band */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#BFE38A]/30 text-[#0F1A35] text-sm font-medium">
              {versionTag}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F1A35] mb-2 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-600 mb-6">{subtitle}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base text-gray-700">
            <div>
              <span className="text-gray-500">시행일자</span>{" "}
              <span className="font-medium">{effectiveDate}</span>
            </div>
            <div>
              <span className="text-gray-500">최종 업데이트</span>{" "}
              <span className="font-medium">{lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content with TOC */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <TableOfContents items={toc} />
          </aside>
          <article
            className="
              bg-white rounded-lg shadow-sm p-6 sm:p-10
              text-[1.25rem] leading-[1.85] text-gray-800
              [&_h2]:text-[1.75rem] [&_h2]:font-bold [&_h2]:text-[#0F1A35]
              [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24
              [&_h2:first-child]:mt-0
              [&_h3]:text-[1.4rem] [&_h3]:font-semibold [&_h3]:text-[#0F1A35]
              [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:my-4
              [&_ul]:list-disc [&_ul]:pl-7 [&_ul]:my-4 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-7 [&_ol]:my-4 [&_ol]:space-y-2
              [&_li]:my-1
              [&_strong]:text-[#0F1A35] [&_strong]:font-semibold
              [&_a]:text-[#10367D] [&_a]:underline [&_a]:underline-offset-2
              [&_a:hover]:text-[#0F1A35]
            "
          >
            {children}
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-600">
            <div>
              <p className="font-semibold text-[#0F1A35] mb-2">문의처</p>
              <p>
                이메일:{" "}
                <a
                  href="mailto:ceo@effeffcorp.com"
                  className="text-[#10367D] underline underline-offset-2 hover:text-[#0F1A35]"
                >
                  ceo@effeffcorp.com
                </a>
              </p>
              <p>운영시간: 평일 09:00 - 18:00</p>
            </div>
            <div>
              <p className="font-semibold text-[#0F1A35] mb-2">㈜이프이프</p>
              <p>사업자등록 466-81-04205</p>
              <p>서울 영등포구 국회대로50길 20, 101동 803호</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            © 2026 EFFEFF Co., Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
