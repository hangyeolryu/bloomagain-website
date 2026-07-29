import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 니즈 설문(/needs) 전용 공유 카드 — 쓰레드·카톡에 이 링크를 뿌리므로,
// OG 미지정 시 SNS가 페이지 속 여성 이미지를 멋대로 잘라(얼굴 잘림) 쓰던
// 문제를 해결한다. 광고 카드 1과 같은 실태형 훅 + 여성 컷아웃(얼굴 보이게).
export const dynamic = "force-static";
export const alt = "그 빈 시간, 어떻게 채우고 계세요? — 1분 테스트 · 티타";
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
  const [bold, semibold, womanBuf] = await Promise.all([
    loadFont("Bold"),
    loadFont("SemiBold"),
    readFile(join(process.cwd(), "public/needs/woman50-og.png")),
  ]);
  const woman = `data:image/png;base64,${womanBuf.toString("base64")}`;
  const forest = "#1F4E3D";
  const forestDeep = "#143329";
  const cream = "#FBF7F0";
  const camel = "#D4B895";
  const sage = "#AFC8BA";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(150deg, ${forest} 0%, ${forestDeep} 100%)`,
          fontFamily: "Pretendard",
          position: "relative",
        }}
      >
        {/* 좌측 — 훅 + CTA */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 64px 80px",
            width: 780,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
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
            <div style={{ color: sage, fontSize: 25, fontWeight: 600 }}>
              tita-app.com/needs
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: cream,
                fontSize: 34,
                fontWeight: 600,
                marginBottom: 18,
              }}
            >
              자녀 독립, 은퇴 — 부쩍 많아진 나만의 시간
            </div>
            <div
              style={{
                color: camel,
                fontSize: 62,
                fontWeight: 700,
                lineHeight: 1.25,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>그 빈 시간,</span>
              <span>어떻게 채우고 계세요?</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                background: cream,
                color: forestDeep,
                fontSize: 28,
                fontWeight: 700,
                padding: "18px 36px",
                borderRadius: 999,
              }}
            >
              1분, 알아보기
            </div>
            <div style={{ color: sage, fontSize: 24, fontWeight: 600 }}>
              가입 없이 · 이름·연락처 안 물어요
            </div>
          </div>
        </div>

        {/* 우측 — 여성 컷아웃 (얼굴 보이게 하단 고정) */}
        <img
          src={woman}
          width={340}
          height={510}
          style={{ position: "absolute", right: 40, bottom: 0 }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Pretendard", data: bold, weight: 700 },
        { name: "Pretendard", data: semibold, weight: 600 },
      ],
    }
  );
}
