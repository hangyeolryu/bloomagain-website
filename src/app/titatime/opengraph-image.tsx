import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 티타임 모집 공유 카드(1200×630). output:'export' 호환 정적 생성.
export const dynamic = "force-static";
export const alt = "이번 주, 우리 동네 티타임 — 티타";
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
            tita-app.com/titatime
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              color: cream,
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1.25,
            }}
          >
            이번 주, 우리 동네
          </div>
          <div
            style={{
              color: cream,
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1.25,
            }}
          >
            티타임
          </div>
          <div style={{ color: sage, fontSize: 32, fontWeight: 600, marginTop: 10 }}>
            결이 통하는 3~4명과 낮에 차 한 잔, 90분
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["만 45세 이상", "본인인증", "데이팅 앱 아님"].map((t) => (
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
