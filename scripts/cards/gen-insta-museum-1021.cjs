// 10/21 수요일 미술관 자리 — 인스타 캐러셀 7장 (사진 위에 글).
//
// 기존 gen-insta-cards.cjs 는 딥그린 바탕에 글만 얹는 틀이다. 이번 건
// 대표님이 그날 찍은 사진이 주인공이라 사진을 꽉 채우고 글을 올린다.
// 서체·색·핸들은 기존 카드와 같게 맞춘다(고운돋움 400 하나, 크림 #FBF7F0,
// 샌드 #D4B895, 카멜 #C15A3C).
//
// 렌더는 playwright 없이 ms-playwright 캐시의 chrome-headless-shell 로 한다.
// 이 맥에 playwright 전역 설치가 없고, 카드 몇 장 뽑자고 깔 일은 아니다.
//
//   node gen-insta-museum-1021.cjs
//   → ig_museum_1..7.png
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const SHELL = path.join(os.homedir(),
    'Library/Caches/ms-playwright/chromium_headless_shell-1243',
    'chrome-headless-shell-mac-arm64/chrome-headless-shell');

const CSS = `
@font-face{font-family:Gowun;font-weight:400;src:url('fonts/GowunDodum-Regular.woff2') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box;font-weight:400}
html,body{width:1080px;height:1350px;overflow:hidden}
.card{position:relative;width:1080px;height:1350px;font-family:Gowun,sans-serif;
  -webkit-font-smoothing:antialiased;overflow:hidden;background:#143329}
.photo{position:absolute;inset:0;background-size:cover;background-position:center}
/* ⚠️ modifier 를 .top/.bottom 으로 두면 위 로고 줄의 .top(display:flex)과
   부딪혀 글이 가로로 벌어진다. at- 접두사를 붙여 떼어 둔다.
   글이 앉는 쪽만 어둡게. 사진을 통째로 덮으면 그림이 죽는다.
   위쪽 카드는 아래에, 아래쪽 카드는 위에 글을 둔다. */
.scrim{position:absolute;inset:0}
.scrim.at-bottom{background:linear-gradient(to top,rgba(10,26,20,.92) 0%,rgba(10,26,20,.72) 28%,rgba(10,26,20,.12) 58%,rgba(10,26,20,0) 78%)}
.scrim.at-top{background:linear-gradient(to bottom,rgba(10,26,20,.92) 0%,rgba(10,26,20,.70) 30%,rgba(10,26,20,.10) 60%,rgba(10,26,20,0) 80%)}
.wrap{position:absolute;left:0;right:0;padding:0 84px}
.wrap.at-bottom{bottom:96px}
.wrap.at-top{top:196px}  /* 로고 줄(70px + 48px)을 피해 내린다 */
/* 고운돋움은 굵기가 400뿐이라 text-stroke 로 두께를 얻는다(기존 카드와 같은 방식).
   사진 위라 획이 얇으면 바로 묻힌다 — 블로그 카드보다 조금 더 준다. */
h3{line-height:1.3;color:#FBF7F0;letter-spacing:-.02em;-webkit-text-stroke:1.3px #FBF7F0;
  text-shadow:0 2px 24px rgba(10,26,20,.55)}
h3 .o{color:#D4B895;-webkit-text-stroke-color:#D4B895}
h3 .line{display:block}
.sub{margin-top:28px;color:#E6EFE8;line-height:1.62;letter-spacing:-.01em;
  text-shadow:0 2px 18px rgba(10,26,20,.6)}
.sub em{font-style:normal;color:#FBF7F0;box-shadow:inset 0 -.12em rgba(212,184,149,.8);padding:0 .04em}
/* 머리의 티타 마크 — 기존 카드와 같은 두 원 */
.top{position:absolute;top:70px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:18px}
.circles{position:relative;width:76px;height:48px}
.c1{position:absolute;width:48px;height:48px;left:0;border-radius:50%;background:#C15A3C}
.c2{position:absolute;width:48px;height:48px;left:28px;border-radius:50%;background:#D4B895}
.tita{font-size:44px;color:#FBF7F0;letter-spacing:.06em;text-shadow:0 2px 18px rgba(10,26,20,.7)}
.badge{background:rgba(10,26,20,.55);color:#EDE3D6;font-size:26px;border-radius:999px;padding:12px 26px}
.foot{position:absolute;bottom:52px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:flex-end}
.foot .cap{font-size:26px;color:#BFD0C4;text-shadow:0 2px 14px rgba(10,26,20,.7)}
.foot .next{font-size:28px;color:#D4B895;text-shadow:0 2px 14px rgba(10,26,20,.7)}
/* 마무리 카드의 안내 상자 */
.box{margin-top:34px;background:rgba(10,26,20,.62);border-radius:24px;padding:28px 32px}
.box .t{font-size:31px;color:#FBF7F0;line-height:1.55;letter-spacing:-.015em}
.box .t b{color:#D4B895}
.box .tags{margin-top:18px;display:flex;flex-wrap:wrap;gap:12px}
.box .tags span{background:rgba(251,247,240,.14);color:#DCE7DE;font-size:25px;padding:10px 20px;border-radius:999px}
`;

const H = (size, ...lines) =>
  `<h3 style="font-size:${size}px">${lines.map((l) => `<span class="line">${l}</span>`).join('')}</h3>`;
const SUB = (t, size = 32) => `<div class="sub" style="font-size:${size}px">${t}</div>`;

const card = (s) => `
<div class="card">
  <div class="photo" style="background-image:url('_museum/${s.img}.jpg');${s.pos ? `background-position:${s.pos}` : ''}"></div>
  <div class="scrim at-${s.at || 'bottom'}"></div>
  <div class="top">
    <div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div>
    ${s.badge ? `<div class="badge">${s.badge}</div>` : ''}
  </div>
  <div class="wrap at-${s.at || 'bottom'}">${s.mid}</div>
  <div class="foot"><div class="cap">${s.cap || ''}</div><div class="next">${s.foot || ''}</div></div>
</div>`;

const cards = [
  // 1 — 커버. 욕구로 연다. 결핍을 짚지 않는다.
  { n: 1, img: 'cover', at: 'bottom', badge: '10월 21일 수요일',
    foot: '넘겨보세요 ›',
    mid: H(72, '수요일 저녁,', '<span class="o">미술관이 공짜예요</span>')
       + SUB('저녁 6시부터 밤 9시까지.<br>예약도 필요 없어요.', 34) },

  // 2 — 전시
  { n: 2, img: 'hanok', at: 'bottom', foot: '넘겨보세요 ›',
    cap: '서도호 회고전 · 국립현대미술관 서울관',
    mid: H(58, '천으로 지은 집 한 채가', '<span class="o">천장에 떠 있어요</span>')
       + SUB('기와도 서까래도 다 천이에요.', 32) },

  { n: 3, img: 'parts', at: 'top', foot: '넘겨보세요 ›',
    mid: H(56, '스위치, 손잡이, 콘센트.', '<span class="o">살던 집을 다 떠냈어요</span>')
       + SUB('반투명한 천으로 하나씩.', 32) },

  { n: 4, img: 'room', at: 'bottom', foot: '넘겨보세요 ›',
    mid: H(58, '벽도 천장도 가득해서', '<span class="o">자꾸 올려다보게 돼요</span>') },

  { n: 5, img: 'thread', at: 'bottom', foot: '넘겨보세요 ›',
    mid: H(58, '실로 그린 문이에요.', '<span class="o">가까이 가야 보여요</span>') },

  // 6 — 자리의 핵심. 여기서 '같이 가는 것'을 말한다.
  { n: 6, img: 'drawings', at: 'bottom', foot: '넘겨보세요 ›',
    mid: H(56, '무슨 말을 할지', '<span class="o">고민 안 해도 돼요</span>')
       + SUB('<em>방금 같이 본 것</em>이 있으니까요.<br>이 작품 어떠셨어요, 한마디면 됩니다.', 33) },

  // 7 — 실용 + 다음. 또래로 닫는다.
  { n: 7, img: 'ticket', at: 'top', foot: '저장하기 ♡',
    mid: H(56, '관람권은', '<span class="o">0원이에요</span>')
       + `<div class="box"><div class="t">국립현대미술관 서울관 · 수요일 밤 9시까지<br><b>저녁 6시부터 무료</b> · 안국역 1번 출구 10분<br><br>티타는 <b>45세 넘은 분들이</b> 같이 가는 자리를 엽니다. 미술관, 공예박물관, 고궁으로 <b>매주</b> 가요.</div><div class="tags"><span>한 분만 오셔도 열려요</span><span>@titakorea</span></div></div>` },
];

(async () => {
  const dir = process.cwd();
  for (const s of cards) {
    const f = `_mu_${s.n}.html`;
    fs.writeFileSync(path.join(dir, f),
        `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${card(s)}</body></html>`);
    execFileSync(SHELL, [
      '--headless', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1080,1350',
      '--default-background-color=00000000',
      '--virtual-time-budget=2500',
      `--screenshot=${path.join(dir, `ig_museum_${s.n}.png`)}`,
      'file://' + path.join(dir, f),
    ], {stdio: 'ignore'});
    console.log('rendered', s.n);
  }
  console.log('\n끝. ig_museum_1..7.png');
})();
