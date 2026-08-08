import type { MetadataRoute } from "next";
import { BASE_CODES } from "./gyeol/types";
import { getAllPosts } from "./blog/posts";

// output:'export' — 정적 생성 강제(라우트 핸들러가 빌드 타임에 파일로 emit).
export const dynamic = "force-static";

const BASE = "https://tita-app.com";

// 사이트는 trailingSlash: true 다(next.config.js). 사이트맵이 슬래시 없는 URL을
// 내면 크롤러가 받는 건 전부 301이고, Search Console은 그걸 "리디렉션이 포함된
// 페이지"로 색인에서 제외한다. 최종 주소를 그대로 싣는다.
const url = (path: string) =>
  `${BASE}${path}${path.endsWith("/") ? "" : "/"}`;

// 네이버·구글이 수집할 페이지 목록. output:'export'라 빌드 시 sitemap.xml로
// 정적 생성된다. 전환/기능성 경로(subscribe 결과, delete-account, invite,
// security-processing 등)는 검색 노출 대상이 아니라 제외한다.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 우선순위: 브랜드/전환 페이지(홈·결큐·티타임·다운로드)가 최상.
  const staticPages: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/gyeol", priority: 0.9, freq: "weekly" },
    { path: "/titatime", priority: 0.8, freq: "weekly" },
    { path: "/enjoy", priority: 0.8, freq: "monthly" },
    { path: "/download", priority: 0.8, freq: "monthly" },
    { path: "/blog", priority: 0.7, freq: "weekly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
    { path: "/matching", priority: 0.7, freq: "monthly" },
    { path: "/business", priority: 0.6, freq: "monthly" },
    { path: "/parent-gift", priority: 0.6, freq: "monthly" },
    { path: "/for-children", priority: 0.5, freq: "monthly" },
    { path: "/subscribe/plus", priority: 0.5, freq: "monthly" },
    { path: "/support", priority: 0.4, freq: "monthly" },
    { path: "/privacy", priority: 0.3, freq: "yearly" },
    { path: "/terms", priority: 0.3, freq: "yearly" },
    // 일본어 브랜드 홈(별도 로케일)
    { path: "/ja", priority: 0.5, freq: "monthly" },
    { path: "/ja/gyeol", priority: 0.5, freq: "monthly" },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: url(p.path),
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  // 결 유형 결과 페이지 — 실제 콘텐츠라 검색·공유 자산이다.
  //
  // 기본 8종만 싣는다. 기질 변종(…W/…C)은 제목·설명이 기본형과 완전히 같고
  // 본문에 기질 블록 한 덩어리만 더 붙는 사실상 중복 페이지라, canonical을
  // 기본형으로 걸어 뒀다(gyeol/[type]/page.tsx). canonical이 다른 곳을 가리키는
  // URL을 사이트맵으로 제출하면 Search Console이 "중복, 제출된 URL이 표준으로
  // 선택되지 않음"으로 잡는다. 변종 페이지는 결과 링크로 계속 접근 가능하고
  // generateStaticParams도 그대로 24종을 만든다 — 색인 대상에서만 뺀다.
  const gyeolEntries: MetadataRoute.Sitemap = BASE_CODES.map((code) => ({
    url: url(`/gyeol/${code}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 블로그 글 — 실제 콘텐츠. generateStaticParams와 같은 소스(getAllPosts).
  const blogEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...gyeolEntries, ...blogEntries];
}
