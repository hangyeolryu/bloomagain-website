// 11월 자리 일정 — 인스타 카드 3장 (사진 없이 딥그린 바탕).
//
// 10/21 미술관 캐러셀(gen-insta-museum-1021.cjs)은 그날 찍은 사진이
// 주인공이었다. 이번엔 공예박물관·중앙박물관·덕수궁 사진이 없다. 없는 걸
// 지어내거나 남의 사진을 쓰느니 기존 브랜드 카드처럼 글만으로 간다.
// 서체·색은 같게 맞춘다(고운돋움 400 하나, 딥그린 #143329, 크림 #FBF7F0,
// 샌드 #D4B895, 카멜 #C15A3C).
//
// ⚠️ 일정은 **meetup_sessions 실물에서 옮겼다.** 날짜·시각·장소·값 모두
// 자리 문서와 같아야 한다 — 카드가 자리보다 먼저 사람을 데려오는데
// 둘이 어긋나면 헛걸음이 된다.
//
// ⚠️ "매주"라고 쓰지 않는다. 11/4·11/11·11/14·11/25라서 11월 16~22일
// 주에는 자리가 없다. 10/21 카드 7번에 쓴 "매주"는 그때 기준이었고,
// 11/15(일)를 11/14(토)로 당기면서 셋째 주가 비었다.
//
// ⚠️ 덕수궁이 11월 마지막 수요일이라 '문화가 있는 날'로 무료일 수 있다는
// 얘기가 자리 설명문에 있지만, 확인 전이라 카드에는 안 쓴다. 1,000원으로만
// 적는다 — 공짜라고 했다가 받으면 그게 사고다.
//
//   node gen-insta-nov-schedule.cjs
//   → ig_nov_1..3.png
const {execFileSync} = require('child_process');
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
/* 바탕에 아주 옅은 빛 — 단색 판이 아니라 공간처럼 보이게 */
.glow{position:absolute;width:1200px;height:1200px;left:-220px;top:-380px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,184,149,.14) 0%,rgba(212,184,149,0) 62%)}
.glow2{position:absolute;width:900px;height:900px;right:-300px;bottom:-320px;border-radius:50%;
  background:radial-gradient(circle,rgba(193,90,60,.16) 0%,rgba(193,90,60,0) 64%)}
.top{position:absolute;top:70px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:18px}
.circles{position:relative;width:76px;height:48px}
.c1{position:absolute;width:48px;height:48px;left:0;border-radius:50%;background:#C15A3C}
.c2{position:absolute;width:48px;height:48px;left:28px;border-radius:50%;background:#D4B895}
.tita{font-size:44px;color:#FBF7F0;letter-spacing:.06em}
.badge{background:rgba(251,247,240,.12);color:#EDE3D6;font-size:26px;border-radius:999px;padding:12px 26px}
.wrap{position:absolute;left:0;right:0;padding:0 84px}
.wrap.at-bottom{bottom:104px}
.wrap.at-top{top:200px}
.wrap.at-mid{top:50%;transform:translateY(-50%)}
h3{line-height:1.3;color:#FBF7F0;letter-spacing:-.02em;-webkit-text-stroke:1.1px #FBF7F0}
h3 .o{color:#D4B895;-webkit-text-stroke-color:#D4B895}
h3 .line{display:block}
.sub{margin-top:30px;color:#E6EFE8;line-height:1.62;letter-spacing:-.01em}
.sub em{font-style:normal;color:#FBF7F0;box-shadow:inset 0 -.12em rgba(212,184,149,.8);padding:0 .04em}
/* 일정 줄 — 날짜를 왼쪽에 세로로 떨어뜨려 눈이 날짜만 훑을 수 있게 */
.sched{margin-top:58px;display:flex;flex-direction:column;gap:44px}
.row{display:flex;gap:30px;align-items:flex-start;
  border-top:1px solid rgba(251,247,240,.16);padding-top:38px}
.row:first-child{border-top:none;padding-top:0}
.when{flex:0 0 212px}
.when .d{font-size:46px;color:#D4B895;letter-spacing:-.02em;line-height:1.1}
.when .t{margin-top:8px;font-size:27px;color:#9FB6A6}
.what .p{font-size:37px;color:#FBF7F0;letter-spacing:-.015em;line-height:1.26}
.what .m{margin-top:11px;font-size:27px;color:#BFD0C4;line-height:1.5}
.what .m b{color:#D4B895}
.box{margin-top:36px;background:rgba(251,247,240,.08);border-radius:24px;padding:30px 34px}
.box .t{font-size:31px;color:#EDE3D6;line-height:1.58;letter-spacing:-.015em}
.box .t b{color:#D4B895}
.tags{margin-top:20px;display:flex;flex-wrap:wrap;gap:12px}
.tags span{background:rgba(251,247,240,.14);color:#DCE7DE;font-size:25px;padding:10px 20px;border-radius:999px}
.foot{position:absolute;bottom:52px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:flex-end}
.foot .cap{font-size:26px;color:#8FA797}
.foot .next{font-size:28px;color:#D4B895}
`;

const H = (size, ...lines) =>
  `<h3 style="font-size:${size}px">${lines.map((l) => `<span class="line">${l}</span>`).join('')}</h3>`;
const SUB = (t, size = 33) => `<div class="sub" style="font-size:${size}px">${t}</div>`;

// 자리 문서에서 그대로 옮긴 것 (meetup_sessions, 2026-10-27 확인)
const ROWS = [
  {d: '11월 4일<br>(수)', t: '오전 10시 50분', p: '서울공예박물관',
    m: '안국역 1번 출구 1분 · <b>무료</b><br>11시 직물공예 해설을 같이 들어요'},
  {d: '11월 11일<br>(수)', t: '저녁 6시 30분', p: '국립현대미술관 서울관',
    m: '안국역 1번 출구 10분 · <b>저녁 6시부터 무료</b><br>올해의 작가상 전시를 같이 봐요'},
  {d: '11월 14일<br>(토)', t: '낮 12시 50분', p: '국립중앙박물관',
    m: '이촌역 지하 통로로 이어져요 · <b>무료</b><br>1시 대표유물 해설을 같이 들어요'},
  {d: '11월 25일<br>(수)', t: '오전 11시', p: '덕수궁 한 바퀴',
    m: '시청역 2번 출구 2분 · <b>입장 1,000원</b><br>11시 15분 궁 해설, 만 65세 이상 무료'},
];

const card = (s) => `
<div class="card">
  <div class="glow"></div><div class="glow2"></div>
  <div class="top">
    <div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div>
    ${s.badge ? `<div class="badge">${s.badge}</div>` : ''}
  </div>
  <div class="wrap at-${s.at}">${s.mid}</div>
  <div class="foot"><div class="cap">${s.cap || ''}</div><div class="next">${s.foot || ''}</div></div>
</div>`;

const cards = [
  // 1 — 커버. 욕구로 연다. "혼자 가기 뭐해서" 같은 결핍은 그 사람 것으로
  // 짚지 않는다(고백형 첫 질문 80% 이탈, 2026-09 실측).
  {n: 1, at: 'mid', badge: '11월', foot: '넘겨보세요 ›',
    mid: H(78, '11월에 갈 곳,', '<span class="o">네 군데 골랐어요</span>') +
      SUB('미술관 둘, 공예박물관, 고궁 하나.<br>세 군데는 <em>관람료가 없어요.</em>', 37)},

  // 2 — 일정. 이 한 장만 따로 올려도 되게 만든다(저장용).
  {n: 2, at: 'top', foot: '넘겨보세요 ›', cap: '해설은 예약 없이 현장에서 들어요',
    mid: H(50, '11월 자리') +
      `<div class="sched">${ROWS.map((r) => `
        <div class="row">
          <div class="when"><div class="d">${r.d}</div><div class="t">${r.t}</div></div>
          <div class="what"><div class="p">${r.p}</div><div class="m">${r.m}</div></div>
        </div>`).join('')}</div>`},

  // 3 — 또래로 닫는다.
  //
  // "한 분만 오셔도 열려요"는 안 쓴다 — 자리 설명문 안에서는 안심을 주지만
  // 공개 게시물에서는 "아무도 안 온다"로 읽힌다(10/21 카드에서 뺀 이유).
  {n: 3, at: 'mid', badge: '11월', foot: '저장하기 ♡',
    mid: H(56, '같은 걸 봐도', '<span class="o">느끼는 건 달라요</span>') +
      SUB('비슷한 걸 좋아하는 또래끼리라<br><em>달라도 이야기할 게 생겨요.</em>', 34) +
      '<div class="box"><div class="t">티타는 <b>45세 이상</b>만 쓰는 앱이에요. ' +
      '먼저 가서 기다리는 사람이 있으니 <b>혼자 오셔도</b> 돼요.<br><br>' +
      '각자 보다가, 보고 나서 차 한 잔. <b>먼저 가셔도 괜찮아요.</b><br>' +
      '무슨 말을 할지 미리 고민 안 하셔도 되구요.</div>' +
      '<div class="tags"><span>@titakorea</span><span>tita-app.com</span></div></div>'},
];

(async () => {
  const dir = process.cwd();
  for (const s of cards) {
    const f = `_nov_${s.n}.html`;
    fs.writeFileSync(path.join(dir, f),
        `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${card(s)}</body></html>`);
    execFileSync(SHELL, [
      '--headless', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1080,1350',
      '--default-background-color=00000000',
      '--virtual-time-budget=2500',
      `--screenshot=${path.join(dir, `ig_nov_${s.n}.png`)}`,
      'file://' + path.join(dir, f),
    ], {stdio: 'ignore'});
    console.log('rendered', s.n);
  }
  console.log('\n끝. ig_nov_1..3.png');
})();
