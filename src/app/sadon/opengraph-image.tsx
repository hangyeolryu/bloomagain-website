import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

/**
 * /sadon 전용 링크 미리보기 (1200×630).
 *
 * 카톡으로 이 초대장을 보내면 사이트 기본 OG("45세 이상, 결이 통하는
 * 친구들 · 데이팅 앱이 아닙니다")가 떴다. 초대받은 분이 받는 첫 인상이
 * 엉뚱한 광고였던 셈이다. 이 자리만의 것을 따로 만든다.
 *
 * 인물 사진은 왼쪽 위를 바라보고 있어 **오른쪽에 둔다** — 시선이 글 쪽으로
 * 향하게. 투명 PNG라 초록 바탕에 그대로 얹힌다.
 *
 * ⚠️ 카톡은 미리보기를 오래 캐시한다. 바꾼 뒤에는 카카오 디버거
 * (developers.kakao.com/tool/debugger/sharing)에서 이 주소를 한 번
 * 긁어줘야 새 이미지가 뜬다.
 */
export const dynamic = "force-static";
export const alt = "10월 31일, 부모님들 모이는 자리 — 티타";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function font(weight: "Bold" | "SemiBold") {
  return readFile(join(process.cwd(), "src/app/fonts", `Pretendard-${weight}.otf`));
}

export default async function Image() {
  const [bold, semibold, model] = await Promise.all([
    font("Bold"),
    font("SemiBold"),
    readFile(join(process.cwd(), "public/sadon/model.png")),
  ]);
  const modelSrc = `data:image/png;base64,${model.toString("base64")}`;

  const forest = "#1F4E3D";
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
          background: forest,
          position: "relative",
        }}
      >
        {/* 글 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            width: 760,
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 10,
              color: camel,
              fontFamily: "P-SemiBold",
              marginBottom: 26,
            }}
          >
            초 대 합 니 다
          </div>
          <div
            style={{
              fontSize: 50,
              lineHeight: 1.38,
              color: cream,
              fontFamily: "P-Bold",
              letterSpacing: -1.5,
              marginBottom: 28,
              // Satori 는 자식이 둘 이상인 div 에 display:flex 를 요구한다.
              // 문자열 하나 + pre-line 으로 두면 자식이 하나라 안전하다.
              whiteSpace: "pre-line",
            }}
          >
            {"우리 아이 좋은 인연,\n부모가 든든한 조력자가\n되어주면 어떨까요?"}
          </div>
          <div
            style={{
              fontSize: 26,
              color: sage,
              fontFamily: "P-SemiBold",
              lineHeight: 1.6,
              whiteSpace: "pre-line",
            }}
          >
            {"10월 31일 토요일 오후 · 서울 청담\n미혼 자녀를 두신 부모님들의 자리"}
          </div>
        </div>

        {/* 인물 — 오른쪽 아래에 붙인다 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={modelSrc}
          width={399}
          height={630}
          alt=""
          style={{ position: "absolute", right: 40, bottom: 0 }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "P-Bold", data: bold, weight: 700, style: "normal" },
        { name: "P-SemiBold", data: semibold, weight: 600, style: "normal" },
      ],
    }
  );
}
