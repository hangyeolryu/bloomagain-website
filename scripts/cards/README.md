# 인사이트 카드 생성기

인스타 캐러셀용 1080×1350 카드를 렌더한다. 블로그 글에 들어가는 인라인
이미지도 같은 파일을 쓴다(`public/blog/insight-NN/card-N.png`).

## 실행

```bash
cd scripts/cards
npm i -g playwright        # 최초 1회 (헤드리스 크로미움 필요)
node gen-insight-cards.cjs # 현재 폴더에 gd_cardN.png 생성
```

렌더한 뒤 `public/blog/insight-NN/`으로 옮긴다.

```bash
mkdir -p ../../public/blog/insight-12
for i in 1 2 3 4 5; do cp gd_card$i.png ../../public/blog/insight-12/card-$i.png; done
```

## 새 세트 만들 때

`gen-insight-cards.cjs` 아래쪽 `cards` 배열만 갈아끼우면 된다.
`H(크기, ...줄)`이 표제, `SUB(내용, 크기)`가 본문이다.

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

## 렌더 실패 시

`font fail N` 에러는 폰트가 로드되기 전에 스크린샷을 찍었다는 뜻이다.
`page.setContent()`가 아니라 `file://`로 여는 이유가 이것 — setContent는
불투명 출처(opaque origin)라 `file://` 폰트 요청이 차단된다. 이 구조를
바꾸지 말 것.
