import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { getAllPosts, getPost } from "../posts";

// 글별 링크 공유 프리뷰(1200×630). 루트 opengraph-image.tsx와 같은 패턴 —
// 번들된 Pretendard(src/app/fonts)로 한글을 그리고, output:'export'라
// force-static으로 빌드 타임에 PNG로 굽는다.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

async function loadFont(weight: "Bold" | "SemiBold") {
  try {
    return await readFile(
      join(process.cwd(), "src/app/fonts", `Pretendard-${weight}.otf`)
    );
  } catch {
    const url = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-${weight}.otf`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`font load failed: ${weight}`);
    return Buffer.from(await res.arrayBuffer());
  }
}

type Params = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "티타 블로그";
  const category = post?.category ?? "관계 인사이트";

  const [bold, semibold] = await Promise.all([
    loadFont("Bold"),
    loadFont("SemiBold"),
  ]);

  const forest = "#1F4E3D";
  const forestDeep = "#163A2D";
  const cream = "#FBF7F0";
  const sage = "#AFC8BA";
  const camel = "#D4B895";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(135deg, ${forest} 0%, ${forestDeep} 100%)`,
          fontFamily: "Pretendard",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 15,
              background: cream,
              color: forest,
              fontSize: 30,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            티타
          </div>
          <div style={{ color: camel, fontSize: 26, fontWeight: 600 }}>
            {category}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: cream,
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.28,
            letterSpacing: "-2px",
          }}
        >
          {title}
        </div>

        <div style={{ color: sage, fontSize: 26, fontWeight: 600 }}>
          tita-app.com/blog
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: bold, weight: 700, style: "normal" },
        { name: "Pretendard", data: semibold, weight: 600, style: "normal" },
      ],
    }
  );
}
