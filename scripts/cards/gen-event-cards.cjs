// 데이터 기반 "갈 곳" 카드 렌더러 — assets/instagram/<slug>/set.json → card-N.jpg (+ story.jpg)
//
//   node scripts/cards/gen-event-cards.cjs <slug>
//
// 스타일은 gen-insta-nov-schedule.cjs와 같다(고운돋움 400, 딥그린 #143329, 크림, 샌드, 카멜).
// 구성: 표지 1장 → 일정 n장(한 장에 4줄까지) → 마무리 1장. 표지를 9:16으로 한 장 더 구워 스토리로 쓴다.
// 인스타 게시 API는 JPEG만 받으므로 sips로 jpg 변환한다(macOS).
const {execFileSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const slug = process.argv[2];
if (!slug) { console.error('쓰는 법: node gen-event-cards.cjs <slug> [--theme forest|cream|terracotta|plum|teal]'); process.exit(1); }

// ── 커버 테마 — 세트마다 색이 돌아간다. 일정·마무리 장은 늘 딥그린(forest)이라
//    세트 안에선 통일되고, 프로필 격자에선 표지 색이 섞여 보인다.
//    바탕은 따뜻한 쪽(크림·테라코타·플럼)을 섞고, 남색(teal)은 한 톤만 — 전면 남색 금지 원칙.
const THEMES = {
  forest:     {bg: '#143329', g1: 'rgba(212,184,149,.14)', g2: 'rgba(193,90,60,.16)',  title: '#FBF7F0', accent: '#D4B895', sub: '#E6EFE8', badgeBg: 'rgba(251,247,240,.12)', badgeFg: '#EDE3D6', foot: '#D4B895', ul: 'rgba(212,184,149,.8)'},
  cream:      {bg: '#F3EBDD', g1: 'rgba(193,90,60,.14)',   g2: 'rgba(20,51,41,.12)',   title: '#143329', accent: '#C15A3C', sub: '#3E4F45', badgeBg: 'rgba(20,51,41,.08)',     badgeFg: '#143329', foot: '#C15A3C', ul: 'rgba(193,90,60,.38)'},
  terracotta: {bg: '#6B3A2A', g1: 'rgba(251,247,240,.12)', g2: 'rgba(212,184,149,.20)', title: '#FBF7F0', accent: '#F0D9B5', sub: '#F4E6DA', badgeBg: 'rgba(251,247,240,.14)', badgeFg: '#F7EBDF', foot: '#F0D9B5', ul: 'rgba(240,217,181,.7)'},
  plum:       {bg: '#3F2A3C', g1: 'rgba(212,184,149,.16)', g2: 'rgba(193,90,60,.16)',  title: '#FBF7F0', accent: '#E1B98C', sub: '#EADFE5', badgeBg: 'rgba(251,247,240,.12)', badgeFg: '#EDE3D6', foot: '#E1B98C', ul: 'rgba(225,185,140,.8)'},
  teal:       {bg: '#1F4556', g1: 'rgba(212,184,149,.14)', g2: 'rgba(193,90,60,.14)',  title: '#FBF7F0', accent: '#D4B895', sub: '#DCE8EC', badgeBg: 'rgba(251,247,240,.12)', badgeFg: '#EDE3D6', foot: '#D4B895', ul: 'rgba(212,184,149,.8)'},
};
const ORDER = ['forest', 'cream', 'terracotta', 'plum', 'teal'];
const argTheme = (() => { const i = process.argv.indexOf('--theme'); return i > 0 ? process.argv[i + 1] : null; })();
const ROOT = path.resolve(__dirname, '../..');
const DIR = path.join(ROOT, 'assets/instagram', slug);
const set = JSON.parse(fs.readFileSync(path.join(DIR, 'set.json'), 'utf8'));
// 테마는 처음 구울 때 정해 set.json에 적는다 → 다시 구워도 같은 색. 순서는 앞서 만든 세트
// 수로 돌린다(forest → cream → terracotta → plum → teal → …). --theme으로 바꾸면 그것도 적는다.
function nextTheme() {
  const root = path.join(ROOT, 'assets/instagram');
  const used = fs.readdirSync(root).filter((d) => d !== slug && !d.startsWith('_') && fs.existsSync(path.join(root, d, 'set.json')))
    .map((d) => { try { return JSON.parse(fs.readFileSync(path.join(root, d, 'set.json'), 'utf8')).theme; } catch { return null; } })
    .filter(Boolean);
  return ORDER[used.length % ORDER.length];
}
const coverTheme = THEMES[argTheme] ? argTheme : (THEMES[set.theme] ? set.theme : nextTheme());
if (set.theme !== coverTheme && !slug.startsWith('_')) {
  set.theme = coverTheme;
  fs.writeFileSync(path.join(DIR, 'set.json'), JSON.stringify(set, null, 2) + '\n');
}
const T = THEMES[coverTheme], F = THEMES.forest;
const FONT = 'file://' + path.join(__dirname, 'fonts/GowunDodum-Regular.woff2');

const SHELL = path.join(os.homedir(),
    'Library/Caches/ms-playwright/chromium_headless_shell-1243',
    'chrome-headless-shell-mac-arm64/chrome-headless-shell');

const CSS = (W, H) => `
@font-face{font-family:Gowun;font-weight:400;src:url('${FONT}') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box;font-weight:400}
html,body{width:${W}px;height:${H}px;overflow:hidden}
.card{position:relative;width:${W}px;height:${H}px;font-family:Gowun,sans-serif;
  -webkit-font-smoothing:antialiased;overflow:hidden;background:var(--bg)}
.glow{position:absolute;width:1200px;height:1200px;left:-220px;top:-380px;border-radius:50%;
  background:radial-gradient(circle,var(--g1) 0%,transparent 62%)}
.glow2{position:absolute;width:900px;height:900px;right:-300px;bottom:-320px;border-radius:50%;
  background:radial-gradient(circle,var(--g2) 0%,transparent 64%)}
.photo{position:absolute;left:0;top:0;width:100%;height:62%;overflow:hidden}
.photo img{width:100%;height:100%;object-fit:cover;display:block;opacity:.92}
.photo::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 45%,var(--bg) 100%)}
.wrap.at-low{top:60%}
.top{position:absolute;top:70px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:18px}
.circles{position:relative;width:76px;height:48px}
.c1{position:absolute;width:48px;height:48px;left:0;border-radius:50%;background:#C15A3C}
.c2{position:absolute;width:48px;height:48px;left:28px;border-radius:50%;background:#D4B895}
.tita{font-size:44px;color:var(--title);letter-spacing:.06em}
.badge{background:var(--badgeBg);color:var(--badgeFg);font-size:26px;border-radius:999px;padding:12px 26px}
.wrap{position:absolute;left:0;right:0;padding:0 84px}
.wrap.at-top{top:${H > 1500 ? 300 : 200}px}
.wrap.at-mid{top:50%;transform:translateY(-50%)}
h3{line-height:1.3;color:var(--title);letter-spacing:-.02em;-webkit-text-stroke:1.1px var(--title)}
h3 .o{color:var(--accent);-webkit-text-stroke-color:var(--accent)}
h3 .line{display:block}
.sub{margin-top:30px;color:var(--sub);line-height:1.62;letter-spacing:-.01em}
.sub em{font-style:normal;color:var(--title);box-shadow:inset 0 -.12em var(--ul);padding:0 .04em}
.sched{margin-top:58px;display:flex;flex-direction:column;gap:40px}
.row{display:flex;gap:30px;align-items:flex-start;border-top:1px solid rgba(251,247,240,.16);padding-top:36px}
.row:first-child{border-top:none;padding-top:0}
.when{flex:0 0 232px}
.when .d{font-size:42px;color:#D4B895;letter-spacing:-.02em;line-height:1.15}
.when .t{margin-top:8px;font-size:26px;color:#9FB6A6}
.what{min-width:0;flex:1}
.thumb{flex:0 0 150px;width:150px;height:200px;border-radius:18px;overflow:hidden;background:rgba(251,247,240,.08);
  box-shadow:0 6px 24px rgba(0,0,0,.25)}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
.row.has-thumb{align-items:center}
.sched.compact{margin-top:40px;gap:22px}
.sched.compact .row{padding-top:22px}
.sched.compact .what .p{font-size:32px}
.sched.compact .what .m{font-size:24px;margin-top:6px}
.sched.compact .when .d{font-size:36px}
.sched.compact .when .t{font-size:23px}
.thumb.small{flex-basis:120px;width:120px;height:160px;border-radius:14px}
.what .p{font-size:35px;color:#FBF7F0;letter-spacing:-.015em;line-height:1.26;word-break:keep-all}
.what .m{margin-top:11px;font-size:26px;color:#BFD0C4;line-height:1.5}
.what .m b{color:#D4B895}
.box{margin-top:36px;background:rgba(251,247,240,.08);border-radius:24px;padding:30px 34px}
.box .t{font-size:31px;color:#EDE3D6;line-height:1.58;letter-spacing:-.015em}
.box .t b{color:#D4B895}
.tags{margin-top:20px;display:flex;flex-wrap:wrap;gap:12px}
.tags span{background:rgba(251,247,240,.14);color:#DCE7DE;font-size:25px;padding:10px 20px;border-radius:999px}
.foot{position:absolute;bottom:52px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:flex-end}
.foot .cap{font-size:24px;color:#8FA797}
.foot .next{font-size:28px;color:var(--foot)}
`;

const H = (size, ...lines) =>
  `<h3 style="font-size:${size}px">${lines.map((l, i) => `<span class="line${i === lines.length - 1 && lines.length > 1 ? ' o' : ''}">${l}</span>`).join('')}</h3>`;
const SUB = (t, size = 33) => `<div class="sub" style="font-size:${size}px">${t}</div>`;
const chunk = (a, n) => Array.from({length: Math.ceil(a.length / n)}, (_, i) => a.slice(i * n, i * n + n));

const pages = [];
pages.push({at: set.cover.image ? 'low' : 'mid', badge: set.cover.badge, foot: '넘겨보세요 ›', theme: T, image: set.cover.image || null,
  mid: H(set.cover.image ? 70 : 78, ...set.cover.title) + SUB(set.cover.sub, set.cover.image ? 34 : 37)});
const hasThumbs = set.rows.some((r) => r.img);
const groups = chunk(set.rows, hasThumbs ? 3 : 4);
groups.forEach((rows, gi) => pages.push({at: 'top', foot: '넘겨보세요 ›', cap: (gi === groups.length - 1 || hasThumbs) ? `출처 ${set.source}` : '',
  mid: H(50, groups.length > 1 ? `${set.cover.badge} 갈 곳 ${gi + 1}/${groups.length}` : `${set.cover.badge} 갈 곳`) +
    `<div class="sched">${rows.map((r) => `
      <div class="row${r.img ? ' has-thumb' : ''}">
        <div class="when"><div class="d">${r.d}</div><div class="t">${r.t}</div></div>
        <div class="what"><div class="p">${r.p}</div><div class="m">${r.m}</div></div>
        ${r.img ? `<div class="thumb"><img src="file://${path.join(DIR, r.img)}"></div>` : ''}
      </div>`).join('')}</div>`}));
pages.push({at: 'mid', badge: set.cover.badge, foot: '저장하기 ♡',
  mid: H(56, ...set.closing.title) + SUB(set.closing.sub, 34) +
    `<div class="box"><div class="t">${set.closing.box}</div>` +
    '<div class="tags"><span>@titakorea</span><span>tita-app.com</span></div></div>'});

const vars = (t) => `--bg:${t.bg};--g1:${t.g1};--g2:${t.g2};--title:${t.title};--accent:${t.accent};--sub:${t.sub};--badgeBg:${t.badgeBg};--badgeFg:${t.badgeFg};--foot:${t.foot};--ul:${t.ul}`;
const card = (s, W, H_) => `
<div class="card" style="${vars(s.theme || F)}">
  <div class="glow"></div><div class="glow2"></div>
  ${s.image ? `<div class="photo"><img src="file://${path.join(DIR, s.image)}"></div>` : ''}
  <div class="top">
    <div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div>
    ${s.badge ? `<div class="badge">${s.badge}</div>` : ''}
  </div>
  <div class="wrap at-${s.at}">${s.mid}</div>
  <div class="foot"><div class="cap">${s.cap || ''}</div><div class="next">${s.foot || ''}</div></div>
</div>`;

function render(html, W, H_, outPng) {
  const f = path.join(os.tmpdir(), `_ev_${slug}_${path.basename(outPng, '.png')}.html`);
  fs.writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><style>${CSS(W, H_)}</style></head><body>${html}</body></html>`);
  execFileSync(SHELL, ['--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--window-size=${W},${H_}`, '--default-background-color=00000000', '--virtual-time-budget=2500',
    `--screenshot=${outPng}`, 'file://' + f], {stdio: 'ignore'});
  const jpg = outPng.replace(/\.png$/, '.jpg');
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '92', outPng, '--out', jpg], {stdio: 'ignore'});
  fs.unlinkSync(outPng); fs.unlinkSync(f);
  return jpg;
}

// 오래된 카드가 남지 않게 지운다
for (const f of fs.readdirSync(DIR)) if (/^(card-\d+|story)\.(jpe?g|png)$/.test(f)) fs.unlinkSync(path.join(DIR, f));
pages.forEach((p, i) => { render(card(p, 1080, 1350), 1080, 1350, path.join(DIR, `card-${i + 1}.png`)); console.log('rendered card', i + 1); });
// 스토리: 표지를 9:16으로. 중앙 정렬이라 같은 마크업이 그대로 선다.
render(card({...pages[0], foot: '자세한 건 피드에서 ›'}, 1080, 1920), 1080, 1920, path.join(DIR, 'story.png'));
// 스토리 둘째 장: 일정 전체를 9:16 한 장에 — 캡처해 두기 좋은 "한 장짜리" (8줄까지)
if (set.rows.length) {
  const rows = set.rows.slice(0, 8);
  render(card({at: 'top', foot: '저장해 두세요 ♡', cap: `출처 ${set.source}`,
    mid: H(50, `${set.cover.badge} 갈 곳`) +
      `<div class="sched compact">${rows.map((r) => `
      <div class="row${r.img ? ' has-thumb' : ''}">
        <div class="when"><div class="d">${r.d}</div><div class="t">${r.t}</div></div>
        <div class="what"><div class="p">${r.p}</div><div class="m">${r.m}</div></div>
        ${r.img ? `<div class="thumb small"><img src="file://${path.join(DIR, r.img)}"></div>` : ''}
      </div>`).join('')}</div>`}, 1080, 1920), 1080, 1920, path.join(DIR, 'story-list.png'));
  console.log('rendered story-list');
}
console.log(`rendered story (표지 테마 ${coverTheme})\n끝. assets/instagram/${slug}/card-1..${pages.length}.jpg + story.jpg`);
