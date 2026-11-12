import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// 꿈 인터뷰(/dream) 공유 카드. /needs 카드와 같은 틀(숲색 바탕·크림 배지·카멜 훅·
// 여성 컷아웃)을 쓴다 — 광고와 공유 미리보기가 같은 브랜드로 보이게.
// 훅은 광고 A안 문구. 공유 카드는 하나뿐이라 기본(A)안을 쓴다.
export const dynamic = "force-static";
export const alt = "요즘 해 보고 싶은데 미뤄둔 거, 있으세요? — 티타의 AI와 이야기 · 티타";
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 0 64px 80px",
            width: 800,
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
              tita-app.com/dream
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: cream, fontSize: 34, fontWeight: 600, marginBottom: 18 }}>
              꿈이 끝난 나이는 없어요
            </div>
            <div
              style={{
                color: camel,
                fontSize: 60,
                fontWeight: 700,
                lineHeight: 1.25,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>요즘 해 보고 싶은데</span>
              <span>미뤄둔 거, 있으세요?</span>
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
              AI와 이야기하기
            </div>
            {/* 오른쪽 컷아웃과 겹치지 않게 짧게 둔다. */}
            <div style={{ color: sage, fontSize: 24, fontWeight: 600 }}>
              가입 없이, 편하게
            </div>
          </div>
        </div>

        <img
          src={woman}
          alt=""
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
