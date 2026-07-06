import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 링크 공유(스레드·카톡·인스타 등) 시 뜨는 1200×630 프리뷰 이미지.
// Next가 이 JSX를 PNG로 렌더한다. 한글은 번들된 Pretendard(src/app/fonts)로
// 그린다. 손 디자인 PNG로 바꾸려면 이 파일을 지우고 public/og-image.png +
// layout metadata의 openGraph.images로 교체.
// output: 'export'(정적 내보내기)에서는 이 라우트가 빌드 타임에 PNG로
// 구워져야 한다. force-static을 지정해야 Next가 서버 런타임 없이 정적 생성한다.
// (runtime="nodejs"는 정적 내보내기와 호환 안 됨 — 빌드 에러의 원인이었다.)
export const dynamic = "force-static";
export const alt = "티타 — 만 45세 이상, 결이 통하는 친구들";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFont(weight: "Bold" | "SemiBold") {
  // 번들 우선 (src/app/fonts) — 외부 fetch 없이 안전. 없으면 jsDelivr 폴백.
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

export default async function Image() {
  const [bold, semibold] = await Promise.all([
    loadFont("Bold"),
    loadFont("SemiBold"),
  ]);

  // 브랜드: Monotone Forest
  const forest = "#1F4E3D";
  const forestDeep = "#163A2D";
  const cream = "#FBF7F0";
  const sage = "#AFC8BA";

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
        {/* 상단: 워드마크 + 도메인 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: cream,
              color: forest,
              fontSize: 32,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            티타
          </div>
          <div style={{ color: sage, fontSize: 26, fontWeight: 600 }}>
            tita-app.com
          </div>
        </div>

        {/* 중앙: 헤드라인 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              color: cream,
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.28,
              letterSpacing: "-2px",
            }}
          >
            만 45세 이상,
          </div>
          <div
            style={{
              color: cream,
              fontSize: 66,
              fontWeight: 700,
              lineHeight: 1.28,
              letterSpacing: "-2px",
            }}
          >
            결이 통하는 친구들
          </div>
          <div style={{ color: sage, fontSize: 30, fontWeight: 600, marginTop: 10 }}>
            오후 한 잔의 안심 티타임 · 데이팅 앱이 아닙니다
          </div>
        </div>

        {/* 하단: 신뢰 배지 */}
        <div style={{ display: "flex", gap: 14 }}>
          {["NICE 본인인증", "친구 우선", "AI 안전망"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                background: "rgba(251,247,240,0.12)",
                color: cream,
                fontSize: 26,
                fontWeight: 600,
                padding: "12px 24px",
                borderRadius: 999,
              }}
            >
              {t}
            </div>
          ))}
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
