// 3.2.34 업데이트 소식 — 인스타 카드 5장 (딥그린, 글만).
//
// 회원이 보게 되는 것 셋: 내 하늘(3.2.30부터, 인스타엔 처음 알림) · 추억 한 조각 ·
// 안부 저장 동의(3.2.34). 서체·색은 11월 일정 카드(gen-insta-nov-schedule.cjs)와 같다.
//
// ⚠️ 사실은 앱 코드에서 옮겼다(2026-11-09 확인):
//   - 내 별은 결큐 8개(gyeol_map/current.minAnswers) 답하면 다음 새벽에 생긴다. 하루 한 번 다시 그린다.
//   - 이름은 '끌리는 별' 셋에만 붙는다. 나머지는 점. 별 누르기는 같은 성별끼리만, 상대는 모른다,
//     서로 눌렀을 때만 방이 열린다(star_taps).
//   - 추억은 users/{uid}/memories, 규칙상 본인만 읽는다. 홈 카드는 사흘에 한 번.
//   - 안부는 시작 전 저장 동의, 설정 > 개인정보에서 끌 수 있고 끄면 응답이 지워진다.
// ⚠️ 자책 금지 — "그동안 안 물었다" 같은 말은 쓰지 않는다. 지금 어떻게 하는지만.
// ⚠️ '만 45세' 아님. '45세 이상'.
//
//   node gen-insta-update-2026-11.cjs
//   → ig_upd_1..5.png
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
.glow{position:absolute;width:1200px;height:1200px;left:-220px;top:-380px;border-radius:50%;
  background:radial-gradient(circle,rgba(212,184,149,.14) 0%,rgba(212,184,149,0) 62%)}
.glow2{position:absolute;width:900px;height:900px;right:-300px;bottom:-320px;border-radius:50%;
  background:radial-gradient(circle,rgba(193,90,60,.16) 0%,rgba(193,90,60,0) 64%)}
/* 표지에만 — 하늘의 점들. 실제 지도처럼 익명 점이 덩어리져 있다 */
.stars{position:absolute;inset:0;pointer-events:none}
.stars i{position:absolute;border-radius:50%;background:#FBF7F0;opacity:.55}
.stars i.me{background:#D4B895;opacity:1;box-shadow:0 0 0 10px rgba(212,184,149,.18),0 0 0 22px rgba(212,184,149,.08)}
.top{position:absolute;top:70px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:center;z-index:2}
.logo{display:flex;align-items:center;gap:18px}
.circles{position:relative;width:76px;height:48px}
.c1{position:absolute;width:48px;height:48px;left:0;border-radius:50%;background:#C15A3C}
.c2{position:absolute;width:48px;height:48px;left:28px;border-radius:50%;background:#D4B895}
.tita{font-size:44px;color:#FBF7F0;letter-spacing:.06em}
.badge{background:rgba(251,247,240,.12);color:#EDE3D6;font-size:26px;border-radius:999px;padding:12px 26px}
.wrap{position:absolute;left:0;right:0;padding:0 84px;z-index:2}
.wrap.at-bottom{bottom:104px}
.wrap.at-top{top:200px}
.wrap.at-mid{top:50%;transform:translateY(-50%)}
h3{line-height:1.3;color:#FBF7F0;letter-spacing:-.02em;-webkit-text-stroke:1.1px #FBF7F0}
h3 .o{color:#D4B895;-webkit-text-stroke-color:#D4B895}
h3 .line{display:block}
.sub{margin-top:30px;color:#E6EFE8;line-height:1.62;letter-spacing:-.01em}
.sub em{font-style:normal;color:#FBF7F0;box-shadow:inset 0 -.12em rgba(212,184,149,.8);padding:0 .04em}
.kicker{font-size:30px;color:#9FB6A6;letter-spacing:.02em;margin-bottom:22px}
/* 설명 줄 — 번호 대신 작은 점, 한 줄에 한 가지 */
.list{margin-top:54px;display:flex;flex-direction:column;gap:30px}
.row{display:flex;gap:26px;align-items:flex-start;border-top:1px solid rgba(251,247,240,.16);padding-top:30px}
.row:first-child{border-top:none;padding-top:0}
.row .k{flex:0 0 18px;width:18px;height:18px;border-radius:50%;background:#D4B895;margin-top:16px}
.row .p{font-size:35px;color:#FBF7F0;letter-spacing:-.015em;line-height:1.36}
.row .m{margin-top:10px;font-size:27px;color:#BFD0C4;line-height:1.5}
.row .m b{color:#D4B895}
.box{margin-top:36px;background:rgba(251,247,240,.08);border-radius:24px;padding:30px 34px}
.box .t{font-size:31px;color:#EDE3D6;line-height:1.58;letter-spacing:-.015em}
.box .t b{color:#D4B895}
.tags{margin-top:20px;display:flex;flex-wrap:wrap;gap:12px}
.tags span{background:rgba(251,247,240,.14);color:#DCE7DE;font-size:25px;padding:10px 20px;border-radius:999px}
.foot{position:absolute;bottom:52px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:flex-end;z-index:2}
.foot .cap{font-size:26px;color:#8FA797}
.foot .next{font-size:28px;color:#D4B895}
`;

const H = (size, ...lines) =>
  `<h3 style="font-size:${size}px">${lines.map((l) => `<span class="line">${l}</span>`).join('')}</h3>`;
const SUB = (t, size = 33) => `<div class="sub" style="font-size:${size}px">${t}</div>`;
const K = (t) => `<div class="kicker">${t}</div>`;
const LIST = (...rows) => `<div class="list">${rows.map(([p, m]) =>
  `<div class="row"><div class="k"></div><div><div class="p">${p}</div>${m ? `<div class="m">${m}</div>` : ''}</div></div>`).join('')}</div>`;

// 표지의 별 — 다섯 덩어리로 모인 점들(지도도 덩어리 5개다). 좌표는 손으로 둔 것.
const STARS = (() => {
  const pts = [];
  // 제목이 아래쪽(y 900~)에 오므로 별은 그 위에만 둔다
  const cl = [[200, 330], [800, 290], [330, 720], [840, 690], [560, 500]];
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  cl.forEach(([cx, cy], ci) => {
    for (let i = 0; i < 20; i++) {
      const a = rnd() * Math.PI * 2, r = 40 + rnd() * 150;
      const s = 6 + Math.round(rnd() * 8);
      pts.push(`<i style="left:${Math.round(cx + Math.cos(a) * r)}px;top:${Math.round(cy + Math.sin(a) * r * .8)}px;width:${s}px;height:${s}px;opacity:${(.25 + rnd() * .5).toFixed(2)}"></i>`);
    }
  });
  pts.push('<i class="me" style="left:596px;top:538px;width:22px;height:22px"></i>');
  return `<div class="stars">${pts.join('')}</div>`;
})();

const card = (s) => `
<div class="card">
  <div class="glow"></div><div class="glow2"></div>
  ${s.stars ? STARS : ''}
  <div class="top">
    <div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div>
    ${s.badge ? `<div class="badge">${s.badge}</div>` : ''}
  </div>
  <div class="wrap at-${s.at}">${s.mid}</div>
  <div class="foot"><div class="cap">${s.cap || ''}</div><div class="next">${s.foot || ''}</div></div>
</div>`;

const cards = [
  // 1 — 표지. 궁금증으로 연다. 결핍을 그 사람 것으로 짚지 않는다.
  {n: 1, at: 'bottom', badge: '새로 생긴 것', foot: '넘겨보세요 ›', stars: true,
    mid: H(72, '티타 안에 누가 있는지,', '<span class="o">하늘처럼 그렸어요</span>') +
      SUB('결큐에 답한 분들이 점이 되어 떠요.<br><em>답이 비슷한 분들끼리 가까이</em> 모이구요.', 36)},

  // 2 — 내 하늘이 어떻게 되는지. 사실은 코드대로.
  {n: 2, at: 'mid', badge: '내 하늘', foot: '넘겨보세요 ›', cap: '마이페이지 > 내 하늘',
    mid: K('내 하늘') + H(56, '내 별은 어디 있나,', '<span class="o">누구와 가까운가</span>') +
      LIST(['결큐 8개만 답하면 내 별이 생겨요', '하루에 한 번, 새벽에 다시 그려요'],
           ['이름은 <b>답이 가장 비슷한 별 셋</b>에만 붙어요', '나머지 분들은 점으로만 보여요'],
           ['마음에 드는 별을 눌러 둘 수 있어요', '상대는 몰라요. <b>서로 눌렀을 때만</b> 대화방이 열려요. 같은 성별끼리만요'])},

  // 3 — 추억 한 조각. 본인만 읽는다는 것이 핵심.
  {n: 3, at: 'mid', badge: '추억 한 조각', foot: '넘겨보세요 ›',
    mid: K('추억 한 조각') + H(60, '가끔, 지난 일을', '<span class="o">하나씩 물어요</span>') +
      SUB('사흘에 한 번쯤 홈에 물음이 하나 떠요.<br>행복했던 날, 그리운 사람, 싫었던 일까지.<br><br>적어 두신 글은 <em>나만 읽어요.</em><br>다른 회원은 물론, 티타도 들여다보지 않아요.', 34)},

  // 4 — 안부 동의. 지금 어떻게 하는지만 말한다(자책 금지).
  {n: 4, at: 'mid', badge: '안부', foot: '넘겨보세요 ›',
    mid: K('안부') + H(60, '마음을 묻는 건,', '<span class="o">먼저 묻고 시작해요</span>') +
      SUB('요즘 기분을 묻는 짧은 안부는 마음에 관한 답이라<br><em>저장해도 괜찮은지</em> 먼저 물어요.<br><br>마음이 바뀌면 설정에서 언제든 끌 수 있고,<br>끄는 순간 지금까지의 답은 바로 지워져요.', 34)},

  // 5 — 또래로 닫는다.
  {n: 5, at: 'mid', badge: '새로 생긴 것', foot: '저장하기 ♡',
    mid: H(56, '또래끼리라', '<span class="o">설명이 짧아요</span>') +
      SUB('비슷한 걸 좋아하는 분들이라<br><em>"그 시절" 한마디면</em> 통하는 게 있어요.', 34) +
      '<div class="box"><div class="t">티타는 <b>45세 이상</b>만 쓰는 앱이에요. 소개팅 앱이 아니고, ' +
      '결이 맞는 또래를 만나 같이 보고, 같이 걷는 곳이에요.<br><br>' +
      '앱을 업데이트하시면 <b>마이페이지</b>에 내 하늘과 추억이 보여요.</div>' +
      '<div class="tags"><span>@titakorea</span><span>tita-app.com</span></div></div>'},
];

(async () => {
  const dir = process.cwd();
  for (const s of cards) {
    const f = `_upd_${s.n}.html`;
    fs.writeFileSync(path.join(dir, f),
        `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${card(s)}</body></html>`);
    execFileSync(SHELL, [
      '--headless', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1080,1350',
      '--default-background-color=00000000',
      '--virtual-time-budget=2500',
      `--screenshot=${path.join(dir, `ig_upd_${s.n}.png`)}`,
      'file://' + path.join(dir, f),
    ], {stdio: 'ignore'});
    console.log('rendered', s.n);
  }
  console.log('\n끝. ig_upd_1..5.png');
})();
