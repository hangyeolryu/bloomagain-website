import type { MetadataRoute } from "next";
import { ALL_ROUTE_CODES } from "./gyeol/types";

// output:'export' — 정적 생성 강제(라우트 핸들러가 빌드 타임에 파일로 emit).
export const dynamic = "force-static";

const BASE = "https://tita-app.com";

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
    { path: "/download", priority: 0.8, freq: "monthly" },
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
    url: `${BASE}${p.path}`,
    lastModified: now,
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  // 결 유형 결과 페이지 — 실제 콘텐츠라 검색·공유 자산이다.
  // generateStaticParams와 같은 소스(ALL_ROUTE_CODES)를 써서 어긋나지 않게.
  const gyeolEntries: MetadataRoute.Sitemap = ALL_ROUTE_CODES.map((code) => ({
    url: `${BASE}/gyeol/${code}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...gyeolEntries];
}
