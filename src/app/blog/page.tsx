import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";
import { TITA, KOREAN_FONT_STACK } from "../_components/tita-brand";
import { TitaFooter } from "../_components/TitaFooter";
import { getAllPosts } from "./posts";

const BASE = "https://tita-app.com";

export const metadata: Metadata = {
  title: "티타 블로그 — 관계·외로움·중장년 인사이트",
  description:
    "50·60대의 관계와 외로움, 안전하게 친구를 만나는 법. 데이터로 읽는 관계 인사이트와 티타가 만드는 것들을 나눕니다.",
  alternates: { canonical: `${BASE}/blog/` },
  openGraph: {
    title: "티타 블로그 — 관계·외로움·중장년 인사이트",
    description:
      "데이터로 읽는 관계 인사이트와 티타가 만드는 것들. 5060의 외로움과 연결에 관한 이야기.",
    url: `${BASE}/blog/`,
    siteName: "티타",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "티타 블로그",
    description: "데이터로 읽는 관계 인사이트 — 5060의 외로움과 연결.",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  // Blog 컬렉션 구조화 데이터.
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "티타 블로그",
    url: `${BASE}/blog/`,
    inLanguage: "ko-KR",
    publisher: { "@type": "Organization", name: "㈜이프이프 (티타)", url: BASE },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${BASE}/blog/${p.slug}/`,
      datePublished: p.date,
      description: p.description,
    })),
  };

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: KOREAN_FONT_STACK, backgroundColor: TITA.cream }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
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
        <nav className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <Link href="/" className="flex items-baseline gap-2">
              <span className="text-xl font-bold tracking-tight" style={{ color: TITA.ink }}>
                티타
              </span>
              <span className="text-xs" style={{ color: TITA.muted }}>
                블로그
              </span>
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

      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        {/* Hero */}
        <section className="mb-10 sm:mb-14">
          <h1
            className="text-3xl sm:text-4xl font-extrabold leading-tight mb-3"
            style={{ color: TITA.ink, letterSpacing: "-0.02em" }}
          >
            관계, 데이터로 읽다
          </h1>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: TITA.muted }}>
            5060의 외로움과 연결에 관한 이야기, 그리고 티타가 만드는 것들.
          </p>
        </section>

        {/* Post list */}
        <section className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl overflow-hidden transition-transform hover:scale-[1.01]"
              style={{
                backgroundColor: TITA.white,
                border: `1px solid ${TITA.sage}`,
              }}
            >
              <article className="flex flex-col sm:flex-row">
                <div className="sm:w-56 sm:flex-shrink-0 bg-white flex items-center justify-center p-4">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    width={1080}
                    height={1350}
                    className="w-full max-w-[200px] sm:max-w-none rounded-xl"
                    style={{ border: `1px solid ${TITA.sage}` }}
                  />
                </div>
                <div className="p-5 sm:p-6 flex flex-col">
                  <span
                    className="text-xs font-semibold tracking-wide mb-2"
                    style={{ color: TITA.forest }}
                  >
                    {post.category}
                  </span>
                  <h2
                    className="text-lg sm:text-xl font-bold leading-snug mb-2"
                    style={{ color: TITA.ink, letterSpacing: "-0.01em" }}
                  >
                    {post.title}
                  </h2>
                  <p
                    className="text-sm leading-relaxed mb-4 line-clamp-3"
                    style={{ color: TITA.muted }}
                  >
                    {post.description}
                  </p>
                  <div
                    className="flex items-center gap-2 text-xs mt-auto"
                    style={{ color: TITA.mutedSoft }}
                  >
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>약 {post.readingMinutes}분</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </section>

        <TitaFooter />
      </main>
    </div>
  );
}
