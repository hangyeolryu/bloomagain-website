import { ImageResponse } from "next/og";

// 링크 공유 시(스레드·카톡·인스타 등) 뜨는 1200×630 프리뷰 이미지.
// Next가 빌드/요청 시 아래 JSX를 PNG로 렌더한다. 별도 정적 이미지 파일이
// 없어도 바로 작동하며, 나중에 손으로 디자인한 og-image.png로 교체하고
// 싶으면 이 파일을 지우고 public/og-image.png + layout metadata로 바꾸면 된다.
export const runtime = "nodejs";
export const alt = "티타 — 만 45세 이상, 결이 맞는 친구를 만나는 곳";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Satori(ImageResponse)는 한글 글리프를 내장하지 않으므로 한글 폰트를
// 빌드 시 불러와 넣어준다. Pretendard(오픈소스)를 jsDelivr에서 fetch.
async function loadFont(weight: "Bold" | "SemiBold") {
  const url = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard/packages/pretendard/dist/public/static/Pretendard-${weight}.otf`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`font load failed: ${weight}`);
  return res.arrayBuffer();
}

export default async function Image() {
  const [bold, semibold] = await Promise.all([
    loadFont("Bold"),
    loadFont("SemiBold"),
  ]);

  const forest = "#20362B";
  const forestDeep = "#16261E";
  const cream = "#F4F1EA";
  const sage = "#A9C3B0";

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
        {/* 상단: 워드마크 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: cream,
              color: forest,
              fontSize: 34,
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
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: cream,
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-2px",
            }}
          >
            만 45세 이상,
          </div>
          <div
            style={{
              color: cream,
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.25,
              letterSpacing: "-2px",
            }}
          >
            결이 맞는 친구를 만나는 곳 🍵
          </div>
          <div
            style={{
              color: sage,
              fontSize: 30,
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            데이팅 앱이 아닙니다. 안심하고 만드는 동네 친구.
          </div>
        </div>

        {/* 하단: 신뢰 배지 */}
        <div style={{ display: "flex", gap: 14 }}>
          {["NICE 본인인증", "친구 only", "AI 사기 차단"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                background: "rgba(244,241,234,0.12)",
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
