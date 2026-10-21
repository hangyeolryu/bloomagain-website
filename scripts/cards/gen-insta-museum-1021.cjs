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
  // 문구 축 — 전시 소개가 아니라 **티타 쓰는 이야기**로 간다(대표님 방향).
  // 욕구로 열고 또래로 닫는다. 결핍은 그 사람 것으로 짚지 않는다.
  //
  // 커버는 대표님 원안. 내가 한 번 우려를 말했고(서도호는 2027-02-09까지라
  // "놓치면 안 되는"이 기간상 급하지 않다) 대표님이 그대로 가자고 하셨다.
  //
  // ⚠️ 전시 정보는 **확인한 것만** 쓴다. 처음에 한옥을 "천으로 지어 천장에
  // 떠 있다"고 썼는데 둘 다 틀렸다 — 사진은 올려다본 각도였을 뿐이고,
  // 그 작업은 성북동 한옥을 1:1로 뜬 **탁본**이다(〈러빙/러빙: 서울 집〉).
  // 눈으로 본 것과 아는 것을 섞어 짓지 않는다.
  //
  // 출처: 국립현대미술관 《서도호》 2026.8.27~2027.2.9 · 지하1층 3·4·5
  // 전시실 + 2층 MMCA 스튜디오 · 500여 점. 표본 시리즈(Specimen Series)는
  // 실제 살던 아파트의 부분을 폴리에스터로 반투명하게 뜬 것. 실 드로잉은
  // 2026년 STPI 레지던시 신작이 이번에 처음 공개됐다.

  // 1 — 커버
  { n: 1, img: 'cover', at: 'bottom', badge: '10월 21일 수요일',
    foot: '넘겨보세요 ›',
    mid: H(62, '놓치면 안 되는 이 전시,', '<span class="o">또래랑 가요</span>')
       + SUB('수요일 저녁엔 관람료가 없어요.<br>예약도 필요 없구요.', 34) },

  // 2 — 한옥 탁본
  { n: 2, img: 'hanok', at: 'bottom', foot: '넘겨보세요 ›',
    cap: '《서도호》 국립현대미술관 서울 · 2027년 2월 9일까지',
    mid: H(54, '집 한 채를 통째로', '<span class="o">탁본으로 떠냈어요</span>')
       + SUB('성북동 한옥을 <em>1:1 크기로</em>요.<br>이런 건 같이 보면 더 오래 보게 돼요.', 32) },

  // 3 — 표본 시리즈
  { n: 3, img: 'parts', at: 'top', foot: '넘겨보세요 ›',
    mid: H(52, '스위치, 손잡이, 콘센트.', '<span class="o">살던 집을 다 떠냈어요</span>')
       + SUB('실제로 사셨던 아파트를 반투명하게.<br>“우리 집에도 저거 있었는데.”<br>거기서 <em>이야기가 시작돼요.</em>', 31) },

  // 4 — 규모. 대표님 말씀 "와우 하는 것들의 연속"
  { n: 4, img: 'room', at: 'bottom', foot: '넘겨보세요 ›',
    mid: H(56, '와, 하는 게', '<span class="o">계속 나와요</span>')
       + SUB('500점이 넘어요. 지하 전시실 셋에 2층까지.<br>말이 없어도 어색하지 않은 시간이에요.', 32) },

  // 5 — 실 드로잉
  { n: 5, img: 'thread', at: 'bottom', foot: '넘겨보세요 ›',
    mid: H(54, '실로 그린 그림이에요.', '<span class="o">가까이 가야 보여요</span>')
       + SUB('올해 새로 만든 것들이 <em>이번에 처음</em> 나왔어요.<br>각자 보다가 다시 만나면 돼요.', 32) },

  // 6 — 대표님 문구. 이 세트의 중심이다.
  { n: 6, img: 'drawings', at: 'bottom', foot: '넘겨보세요 ›',
    mid: H(54, '같은 걸 봐도', '<span class="o">느끼는 건 달라요</span>')
       + SUB('비슷한 걸 좋아하는 또래끼리라<br><em>달라도 이야기할 게 생겨요.</em><br>무슨 말을 할지 미리 고민 안 하셔도 돼요.', 33) },

  // 7 — 또래로 닫는다
  //
  // "한 분만 오셔도 열려요"는 뺐다(대표님). 자리 설명문 안에서는 안심을
  // 주는 말이지만, 공개 게시물에서는 "아무도 안 온다"로 읽힌다.
  { n: 7, img: 'ticket', at: 'top', foot: '저장하기 ♡',
    mid: H(54, '관람권은', '<span class="o">0원이에요</span>')
       + `<div class="box"><div class="t">《서도호》 · 국립현대미술관 서울관<br><b>2027년 2월 9일까지</b> · 수요일 밤 9시까지<br><b>저녁 6시부터 무료</b> · 안국역 1번 출구 10분<br><br>티타는 <b>45세 넘은 또래끼리</b> 같이 가는 자리를 엽니다. 미술관, 공예박물관, 고궁으로 <b>매주</b> 가요.</div><div class="tags"><span>@titakorea</span></div></div>` },
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
