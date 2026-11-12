// 앱 '티타 이야기' 탭용 피드 — /blog/feed.json (빌드 때 정적 파일로 나간다).
//
// Cloud Functions syncBlogFromWeb(bloomagain-korea)가 매일 이 파일을 읽어
// Firestore blog_posts에 옮긴다. 예전엔 대표가 sync_blog_to_app.py를 손으로 돌렸다.
// 필드와 이미지 절대경로 처리는 그 스크립트와 같다. 파운더 스토리는 앱에 넣지 않는다.
// POSTS는 이미 예약 발행 거름(발행일 ≤ 오늘)을 거친 목록이다.
import { POSTS } from "../posts";

export const dynamic = "force-static";

const SITE = "https://tita-app.com";
const abs = (v: string | undefined) => (v && v.startsWith("/") ? `${SITE}${v}` : v ?? "");

export function GET() {
  const posts = POSTS.filter((p) => p.audience !== "founder").map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description ?? "",
    date: p.date,
    category: p.category ?? "",
    cover: abs(p.cover),
    tags: p.tags ?? [],
    readingMinutes: p.readingMinutes ?? 3,
    body: p.body.map((b) => ("src" in b ? { ...b, src: abs(b.src) } : b)),
    sources: p.sources ?? [],
    faq: p.faq ?? [],
  }));
  return Response.json({ generatedAt: new Date().toISOString(), posts });
}
