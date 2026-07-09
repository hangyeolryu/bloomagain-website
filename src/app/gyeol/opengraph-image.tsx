import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 테스트 입구(/gyeol) 전용 공유 카드. 스레드·인스타에 뿌릴 링크가 바로 이거라
// 홈 일반 카드가 아니라 "테스트를 파는" 카드가 떠야 한다. output:'export' 정적 생성.
export const dynamic = "force-static";
export const alt = "나는 어떤 결일까? — 3분 결 유형 테스트 · 티타";
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

export default async function Image() {
  const [bold, semibold] = await Promise.all([
    loadFont("Bold"),
    loadFont("SemiBold"),
  ]);
  const forest = "#1F4E3D";
  const forestDeep = "#143329";
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
          background: `linear-gradient(150deg, ${forest} 0%, ${forestDeep} 100%)`,
          fontFamily: "Pretendard",
        }}
      >
        {/* 상단: 워드마크 + 배지 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
              tita-app.com/gyeol
            </div>
          </div>
          <div
            style={{
              display: "flex",
              background: "rgba(251,247,240,0.14)",
              color: cream,
              fontSize: 24,
              fontWeight: 600,
              padding: "10px 22px",
              borderRadius: 999,
            }}
          >
            가입 없이 3분
          </div>
        </div>

        {/* 중앙: 헤드라인 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: sage, fontSize: 34, fontWeight: 600 }}>
            MBTI 말고, 사람 사이의 결
          </div>
          <div
            style={{
              color: cream,
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: "-3px",
              lineHeight: 1.15,
            }}
          >
            나는 어떤 결일까?
          </div>
        </div>

        {/* 하단: 서브 */}
        <div style={{ color: sage, fontSize: 30, fontWeight: 600 }}>
          14개 질문으로 알아보는 나의 결 유형 · 잘 맞는 친구까지 🍵
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
