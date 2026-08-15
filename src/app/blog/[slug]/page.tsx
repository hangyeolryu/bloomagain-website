import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download } from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "../../_components/tita-brand";
import { TitaFooter } from "../../_components/TitaFooter";
import { getAllPosts, getPost, getSeries, type Block } from "../posts";

const BASE = "https://tita-app.com";

// output:'export' — 모든 글을 빌드 타임에 정적 생성.
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "글을 찾을 수 없어요 — 티타 블로그" };
  const url = `${BASE}/blog/${post.slug}/`;
  return {
    title: `${post.title} — 티타`,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "티타",
      locale: "ko_KR",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      // 글별 OG는 [slug]/opengraph-image.tsx가 1200×630으로 자동 생성.
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

// 인라인 **굵게** 파싱 — 마크다운 의존성 없이 최소 처리.
function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((seg, i) =>
    seg.startsWith("**") && seg.endsWith("**") ? (
      <strong key={i} style={{ color: TITA.ink, fontWeight: 700 }}>
        {seg.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{seg}</span>
    )
  );
}

function BlockView({ block, priority }: { block: Block; priority?: boolean }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          className="text-xl sm:text-2xl font-extrabold mt-12 mb-4 scroll-mt-20"
          style={{ color: TITA.ink, letterSpacing: "-0.02em" }}
        >
          {block.text}
        </h2>
      );
    case "p":
      return (
        <p
          className="text-[15px] sm:text-base leading-[1.85] mb-5"
          style={{ color: TITA.muted }}
        >
          {renderInline(block.text)}
        </p>
      );
    case "image":
      return (
        <figure className="my-8">
          <Image
            src={block.src}
            alt={block.alt}
            width={1080}
            height={1350}
            priority={priority}
            className="w-full max-w-[420px] mx-auto rounded-2xl"
            style={{ border: `1px solid ${TITA.sage}` }}
          />
          {block.caption && (
            <figcaption
              className="text-center text-xs mt-2.5"
              style={{ color: TITA.mutedSoft }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "callout":
      return (
        <div
          className="rounded-2xl p-5 my-8"
          style={{
            backgroundColor: TITA.surface,
            border: `1px solid ${TITA.sage}`,
          }}
        >
          <p
            className="text-[15px] sm:text-base leading-relaxed font-semibold"
            style={{ color: TITA.ink }}
          >
            {renderInline(block.text)}
          </p>
        </div>
      );
    case "quote":
      return (
        <blockquote
          className="my-8 pl-5 border-l-4"
          style={{ borderColor: TITA.forest }}
        >
          <p
            className="text-lg sm:text-xl font-bold leading-snug"
            style={{ color: TITA.ink, letterSpacing: "-0.01em" }}
          >
            {block.text}
          </p>
          {block.cite && (
            <cite
              className="block mt-2 text-xs not-italic"
              style={{ color: TITA.muted }}
            >
              — {block.cite}
            </cite>
          )}
        </blockquote>
      );
  }
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${BASE}/blog/${post.slug}/`;
  const dateLabel = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── 구조화 데이터 (구글 리치 결과) ──────────────────────────────────
  // BlogPosting: 기사 카드/저자/발행일. FAQPage: 펼침 Q&A 후보.
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: `${BASE}${post.cover}`,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "ko-KR",
    keywords: post.tags.join(", "),
    articleSection: post.category,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "티타", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "㈜이프이프 (티타)",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
    },
  };
  const faqLd = post.faq && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${BASE}/` },
      { "@type": "ListItem", position: 2, name: "블로그", item: `${BASE}/blog/` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: KOREAN_FONT_STACK, backgroundColor: TITA.cream }}
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          backgroundColor: "rgba(251, 247, 240, 0.92)",
          backdropFilter: "blur(8px)",
          borderColor: TITA.sage,
        }}
      >
        <nav className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <Link href="/blog" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: TITA.ink }}>
              <ArrowLeft className="w-4 h-4" /> 블로그
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ backgroundColor: TITA.forest, color: "white" }}
            >
              앱 받기 <Download className="w-3 h-3" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <article>
          {/* 머리말 */}
          <div className="mb-8">
            <span
              className="text-xs font-semibold tracking-wide"
              style={{ color: TITA.forest }}
            >
              {post.category}
            </span>
            <h1
              className="text-2xl sm:text-[34px] font-extrabold leading-tight mt-3 mb-4"
              style={{ color: TITA.ink, letterSpacing: "-0.02em" }}
            >
              {post.title}
            </h1>
            <p
              className="text-[15px] sm:text-base leading-relaxed"
              style={{ color: TITA.muted }}
            >
              {post.description}
            </p>
            <div
              className="flex items-center gap-2 mt-4 text-xs"
              style={{ color: TITA.mutedSoft }}
            >
              <time dateTime={post.date}>{dateLabel}</time>
              <span>·</span>
              <span>약 {post.readingMinutes}분</span>
            </div>
          </div>

          {/* 본문 — 첫 이미지는 priority(LCP 개선). */}
          <div>
            {(() => {
              const firstImageIdx = post.body.findIndex((b) => b.type === "image");
              return post.body.map((block, i) => (
                <BlockView key={i} block={block} priority={i === firstImageIdx} />
              ));
            })()}
          </div>

          {/* 출처 */}
          {/* 시리즈 목차 — 이어지는 글이면 본문 끝에서 바로 다음 편으로.
              현재 글은 링크가 아니라 표시만 해 어디쯤인지 알 수 있게 한다. */}
          {post.series && (
            <nav
              className="mt-12 rounded-2xl p-5"
              style={{
                backgroundColor: TITA.white,
                border: `1px solid ${TITA.sage}`,
              }}
              aria-label={post.series.name}
            >
              <p
                className="text-xs font-bold mb-3"
                style={{ color: TITA.camel, letterSpacing: "0.02em" }}
              >
                {post.series.name}
              </p>
              <ol className="space-y-2">
                {getSeries(post.series.name).map((s) => {
                  const here = s.slug === post.slug;
                  return (
                    <li key={s.slug} className="flex gap-2.5 items-start">
                      <span
                        className="text-sm shrink-0 tabular-nums"
                        style={{
                          color: here ? TITA.forest : TITA.mutedSoft,
                          fontWeight: here ? 800 : 600,
                        }}
                      >
                        {s.series!.order}
                      </span>
                      {here ? (
                        <span
                          className="text-sm leading-snug"
                          style={{ color: TITA.ink, fontWeight: 800 }}
                        >
                          {s.title}
                          <span
                            className="ml-1.5 text-xs"
                            style={{ color: TITA.camel, fontWeight: 700 }}
                          >
                            지금 보는 글
                          </span>
                        </span>
                      ) : (
                        <Link
                          href={`/blog/${s.slug}/`}
                          className="text-sm leading-snug underline underline-offset-2"
                          style={{ color: TITA.forest }}
                        >
                          {s.title}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          <section
            className="mt-12 pt-6 border-t"
            style={{ borderColor: TITA.sage }}
          >
            <h2
              className="text-sm font-bold mb-3"
              style={{ color: TITA.ink }}
            >
              출처
            </h2>
            <ul className="space-y-2">
              {post.sources.map((s) => (
                <li
                  key={s.label}
                  className="text-xs leading-relaxed flex gap-1.5"
                  style={{ color: TITA.muted }}
                >
                  <span style={{ color: TITA.mutedSoft }}>·</span>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: TITA.forest }}
                    >
                      {s.label} ↗
                    </a>
                  ) : (
                    <span>{s.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ (화면용 — 스키마는 위 JSON-LD) */}
          {post.faq && (
            <section className="mt-10">
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: TITA.ink }}
              >
                자주 묻는 질문
              </h2>
              <div className="space-y-3">
                {post.faq.map((f) => (
                  <details
                    key={f.q}
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: TITA.white,
                      border: `1px solid ${TITA.sage}`,
                    }}
                  >
                    <summary
                      className="text-sm font-semibold cursor-pointer"
                      style={{ color: TITA.ink }}
                    >
                      {f.q}
                    </summary>
                    <p
                      className="text-sm leading-relaxed mt-2.5"
                      style={{ color: TITA.muted }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section
            className="rounded-2xl p-6 sm:p-8 mt-12 text-center"
            style={{
              background: `linear-gradient(135deg, ${TITA.forest} 0%, ${TITA.forestDeep} 100%)`,
            }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              이번 주말, 차 한 잔 어때요?
            </h2>
            <p className="text-white/85 text-sm mb-5">
              결이 맞는 사람과 가까운 동네에서. 티타가 관계를 연결해요.
            </p>
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: "white", color: TITA.forest }}
            >
              <Download className="w-4 h-4" /> 앱 다운로드
            </Link>
          </section>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mt-10">
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: TITA.surface,
                  color: TITA.muted,
                  border: `1px solid ${TITA.sage}`,
                }}
              >
                #{t}
              </span>
            ))}
          </div>
        </article>

        <TitaFooter />
      </main>
    </div>
  );
}
