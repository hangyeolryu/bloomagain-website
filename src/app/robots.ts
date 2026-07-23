import type { MetadataRoute } from "next";

// output:'export' — 정적 생성 강제(라우트 핸들러가 빌드 타임에 파일로 emit).
export const dynamic = "force-static";

// output:'export'라 빌드 시 robots.txt로 정적 생성된다.
// 전 검색엔진 수집 허용 + 사이트맵 위치 지정(네이버·구글이 여기서 페이지 발견).
// 검색 노출 대상이 아닌 전환/기능성 경로만 막는다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/subscribe/success",
          "/subscribe/fail",
          "/delete-account",
          "/security-processing",
          "/invite",
        ],
      },
    ],
    sitemap: "https://tita-app.com/sitemap.xml",
    host: "https://tita-app.com",
  };
}
