// 결 유형 테스트 카드뉴스 생성기 (인스타 4:5 · 1080×1350)
// 실행: node scripts/gen-cardnews.mjs  (website 디렉토리에서)
// 출력: scripts/cardnews-out/*.png
// OG 카드와 같은 Satori 파이프라인(next/og) — 이모지는 렌더 안 되니 타이포/도형만.
import { createRequire } from "module";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import React from "react";

// next/og는 서브패스 exports라 plain node에서 직접 못 import → 컴파일된 node 빌드 사용.
const require = createRequire(import.meta.url);
const { ImageResponse } = require(
  join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/index.node.js")
);

const h = React.createElement;
const ROOT = process.cwd();
const OUT = join(ROOT, "scripts/cardnews-out");

const forest = "#1F4E3D";
const forestDeep = "#143329";
const cream = "#FBF7F0";
const sage = "#AFC8BA";
const W = 1080, H = 1350;

const bold = await readFile(join(ROOT, "src/app/fonts/Pretendard-Bold.otf"));
const semibold = await readFile(join(ROOT, "src/app/fonts/Pretendard-SemiBold.otf"));

// 페이지 인디케이터 점
function dots(active, total) {
  return h("div", { style: { display: "flex", gap: 10 } },
    ...Array.from({ length: total }, (_, i) =>
      h("div", { style: {
        width: 12, height: 12, borderRadius: 999,
        background: i === active ? cream : "rgba(251,247,240,0.28)",
      } })
    )
  );
}

// 공통 프레임: 상단 워드마크, 중앙 콘텐츠, 하단 점
function frame(idx, total, children, opts = {}) {
  return h("div", { style: {
    width: "100%", height: "100%", display: "flex", flexDirection: "column",
    justifyContent: "space-between", padding: "84px 80px",
    background: opts.bg || `linear-gradient(155deg, ${forest} 0%, ${forestDeep} 100%)`,
    fontFamily: "Pretendard",
  } },
    h("div", { style: { display: "flex", alignItems: "center", gap: 14 } },
      h("div", { style: {
        width: 60, height: 60, borderRadius: 15, background: cream, color: forest,
        fontSize: 30, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
      } }, "티타"),
      h("div", { style: { color: sage, fontSize: 24, fontWeight: 600 } }, "결 유형 테스트")
    ),
    h("div", { style: { display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "center" } }, children),
    dots(idx, total)
  );
}

const bigText = (t, size = 76) => h("div", { style: {
  color: cream, fontSize: size, fontWeight: 700, letterSpacing: "-2.5px", lineHeight: 1.3,
} }, t);
const subText = (t, size = 36) => h("div", { style: {
  color: sage, fontSize: size, fontWeight: 600, lineHeight: 1.5,
} }, t);

const TOTAL = 6;

// 카드별 콘텐츠
const cards = [
  // 1. 표지
  frame(0, TOTAL, h("div", { style: { display: "flex", flexDirection: "column", gap: 24 } },
    subText("MBTI 말고, 사람 사이의"),
    bigText("나는 어떤", 104),
    bigText("'결'일까?", 104),
    h("div", { style: { marginTop: 20, display: "flex", background: "rgba(251,247,240,0.14)", color: cream, fontSize: 30, fontWeight: 600, padding: "14px 30px", borderRadius: 999 } }, "가입 없이 3분")
  )),

  // 2. 개념
  frame(1, TOTAL, h("div", { style: { display: "flex", flexDirection: "column", gap: 22 } },
    subText("'결'이 뭐냐면"),
    bigText("성격(MBTI)이 아니라,", 62),
    bigText("사람과 사람", 62),
    bigText("'사이'의 결이에요.", 62)
  )),

  // 3. 공감
  frame(2, TOTAL, h("div", { style: { display: "flex", flexDirection: "column", gap: 30 } },
    bigText("“좋은 사람인데", 60),
    bigText("이상하게 안 편해.”", 60),
    h("div", { style: { height: 2, width: 120, background: "rgba(251,247,240,0.25)", margin: "8px 0" } }),
    bigText("“처음 봤는데", 60),
    bigText("왜 이렇게 편하지?”", 60),
    subText("그 차이가 '결'이에요.", 34)
  )),

  // 4. 유형 미리보기
  frame(3, TOTAL, h("div", { style: { display: "flex", flexDirection: "column", gap: 20 } },
    subText("이런 결이 있어요"),
    ...[
      "다정한 정원사", "느긋한 사색가", "흥 많은 마당발",
      "조용한 진심", "동네 분위기 메이커",
    ].map((n) => h("div", { style: {
      display: "flex", color: cream, fontSize: 46, fontWeight: 700,
    } }, "· " + n)),
    subText("당신은 어떤 결일까요?", 34)
  )),

  // 5. 메커니즘
  frame(4, TOTAL, h("div", { style: { display: "flex", flexDirection: "column", gap: 22 } },
    subText("티타는 서두르지 않아요"),
    bigText("매일 한 질문에", 58),
    bigText("답할수록 또렷해져,", 58),
    bigText("진짜 맞는 사람을", 58),
    h("div", { style: { color: sage, fontSize: 58, fontWeight: 700, letterSpacing: "-2px" } }, "천천히 찾아줘요."),
  )),

  // 6. CTA
  frame(5, TOTAL, h("div", { style: { display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" } },
    subText("만 45세 이상 · 본인인증"),
    bigText("무료 3분 테스트", 72),
    h("div", { style: { marginTop: 16, display: "flex", flexDirection: "column", gap: 8 } },
      h("div", { style: { color: cream, fontSize: 40, fontWeight: 700 } }, "tita-app.com/gyeol"),
      h("div", { style: { color: sage, fontSize: 30, fontWeight: 600 } }, "프로필 링크에서 지금 →")
    )
  ), { bg: `linear-gradient(155deg, ${forestDeep} 0%, #0F2A20 100%)` }),
];

await mkdir(OUT, { recursive: true });
for (let i = 0; i < cards.length; i++) {
  const res = new ImageResponse(cards[i], {
    width: W, height: H,
    fonts: [
      { name: "Pretendard", data: bold, weight: 700, style: "normal" },
      { name: "Pretendard", data: semibold, weight: 600, style: "normal" },
    ],
  });
  const buf = Buffer.from(await res.arrayBuffer());
  const name = `card-${i + 1}.png`;
  await writeFile(join(OUT, name), buf);
  console.log("wrote", name, buf.length, "bytes");
}
console.log("done →", OUT);
