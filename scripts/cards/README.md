# 인사이트 카드 생성기

1080×1350 카드를 렌더한다. 쓰임이 둘이라 생성기도 둘이다.

| 생성기 | 쓰임 | 장수 | 나가는 곳 |
|---|---|---|---|
| `gen-insight-cards.cjs` (블러시) / `gen-insight-cards-green.cjs` (딥그린) | 블로그 본문 인라인 | 5 | `public/blog/insight-NN/` |
| `gen-insta-cards.cjs` | 인스타 캐러셀 | 7 | `assets/instagram/insight-NN/` |

**왜 나눴나.** 블로그 카드는 이미 설명이 끝난 문단 옆에 놓이니 표제 한 줄이면
족하다. 인스타 카드는 혼자 서야 하고, 캡션은 카드에 글이 있으면 잘 안 읽힌다.
그래서 인스타 쪽에만 근거와 숫자를 `EX()` 박스로 카드 안에 넣고 장수를 늘렸다.
인스타 카드는 사이트에 서빙할 필요가 없어 `public/` 바깥에 둔다.

## 실행

```bash
cd scripts/cards
npm i -g playwright   # 최초 1회 (헤드리스 크로미움 필요)

node gen-insight-cards-green.cjs   # gd_cardN.png / i14_cardN.png
node gen-insta-cards.cjs           # ig_cardN.png
```

렌더한 뒤 옮기고 임시 파일을 지운다.

```bash
mkdir -p ../../public/blog/insight-14 ../../assets/instagram/insight-14
for i in 1 2 3 4 5;     do cp i14_card$i.png ../../public/blog/insight-14/card-$i.png; done
for i in 1 2 3 4 5 6 7; do cp ig_card$i.png  ../../assets/instagram/insight-14/card-$i.png; done
rm -f _*.html *_card*.png
```

## 새 세트 만들 때

아래쪽 `cards` 배열만 갈아끼우면 된다.
`H(크기, ...줄)`이 표제, `SUB(내용, 크기)`가 본문, `EX([라벨, 내용], ...)`이
인스타 카드의 근거 박스다. 장수를 바꾸면 `gen-insta-cards.cjs`의 `TOTAL`도
같이 고쳐야 점 표시가 맞는다.

## 서체 — 고운돋움만 쓴다

웹사이트 한글 서체와 맞춘다(`src/app/_fonts/GowunDodum-subset.woff2`).
여기 있는 건 서브셋이 아닌 전체 글리프 판이라 어떤 문구를 넣어도 깨지지 않는다.

**고운돋움은 굵기가 400 하나뿐이다.** 그래서:

* `font-weight`를 아예 쓰지 않는다. 합성 볼드는 획을 옆으로 밀어 한글
  자소의 속공간을 막는다.
* 표제는 `-webkit-text-stroke: 1.1px`로 외곽선을 균일하게 덧그려 두께를 얻는다.
  자소 모양이 유지된다. 색이 다른 구간(`.o`)은 stroke 색도 같이 맞춰야
  테두리가 겉돌지 않는다.
* 본문 강조는 `<b>` 대신 `<em>` — 밑줄형 옅은 형광 하이라이트로 처리한다.
  `EX()` 박스 안에서만 `<b>`가 금색으로 뜬다(하이라이트가 겹치면 지저분해서).

## 렌더 실패 시

`font fail N` 에러는 폰트가 로드되기 전에 스크린샷을 찍었다는 뜻이다.
`page.setContent()`가 아니라 `file://`로 여는 이유가 이것 — setContent는
불투명 출처(opaque origin)라 `file://` 폰트 요청이 차단된다. 이 구조를
바꾸지 말 것.
