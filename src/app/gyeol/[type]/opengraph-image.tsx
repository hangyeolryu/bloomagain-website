import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { TYPES, TEMPERAMENTS, ALL_ROUTE_CODES, parseCode } from "../types";

// 결과별 공유 카드(1200×630). 링크를 스레드·카톡에 붙이면 이 카드가 프리뷰로
// 뜬다 → 친구가 유형을 보고 "나도 해볼래" → 바이럴 루프. output:'export' 호환을
// 위해 유형×온도 16개 + 레거시 8개를 정적 생성하고 force-static으로 굽는다.
export function generateStaticParams() {
  return ALL_ROUTE_CODES.map((type) => ({ type }));
}
export const dynamicParams = false;
export const dynamic = "force-static";
export const alt = "나의 결 유형 — 티타";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function Image({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const { base, temp } = parseCode(type);
  const t = TYPES[base ?? "FDP"];
  const tempLabel = temp ? TEMPERAMENTS[temp].label : null;
  const [bold, semibold] = await Promise.all([
    loadFont("Bold"),
    loadFont("SemiBold"),
  ]);

  const forest = "#1F4E3D";
  const forestDeep = "#143329";
  const cream = "#FBF7F0";
  const sage = "#AFC8BA";

  // 이모지는 Satori가 CDN 폰트를 받아야 그려져 빌드 환경에 따라 비거나 다르게
  // 나온다. OG 카드는 타이포그래피만으로 완결되게 하고, 이모지는 브라우저가
  // 직접 렌더하는 결과 HTML 페이지에서만 쓴다.
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(150deg, ${forest} 0%, ${forestDeep} 100%)`,
          fontFamily: "Pretendard",
          textAlign: "center",
        }}
      >
        {/* 상단 라벨 */}
        <div style={{ color: sage, fontSize: 30, fontWeight: 600 }}>
          나의 결 유형
        </div>

        {/* 중앙: 이름 + 태그라인 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: cream,
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1.15,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              width: 64,
              height: 5,
              background: sage,
              borderRadius: 999,
              margin: "28px 0",
            }}
          />
          <div style={{ color: sage, fontSize: 38, fontWeight: 600 }}>
            {t.tagline}
          </div>
          {tempLabel && (
            <div
              style={{
                marginTop: 26,
                color: forestDeep,
                background: cream,
                fontSize: 28,
                fontWeight: 700,
                padding: "10px 28px",
                borderRadius: 999,
              }}
            >
              {tempLabel}
            </div>
          )}
        </div>

        {/* 하단: 워드마크 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: cream,
              color: forest,
              fontSize: 22,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            티타
          </div>
          <div style={{ color: sage, fontSize: 26, fontWeight: 600 }}>
            tita-app.com/gyeol
          </div>
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
