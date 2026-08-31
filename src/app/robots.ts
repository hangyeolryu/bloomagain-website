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
          // 정적 export가 만드는 오류 페이지들. 실제 404(존재하지 않는 경로)는
          // Firebase가 404.html을 404 상태로 내주지만, /404/ 와 /_not-found/ 는
          // 디렉터리로 존재해서 200으로 응답한다. 내용은 없는데 canonical만
          // 홈을 가리켜 Search Console의 "대체 페이지"로 잡힌다.
          "/404",
          "/_not-found",
        ],
      },
    ],
    sitemap: "https://tita-app.com/sitemap.xml",
    host: "https://tita-app.com",
  };
}
