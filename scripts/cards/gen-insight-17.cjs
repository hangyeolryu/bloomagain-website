// 관계수업 #17 — 30대 절반이 아직 미혼입니다 / 블러시(핑크)
//
//   blog 5장 → public/blog/insight-17/   본문 옆에 놓이니 표제 위주
//
// CSS·헬퍼는 #15 것을 그대로 물려받았다(색 대비 값 포함). playwright를 쓰지
// 않는다 — HTML만 쓰고 스크린샷은 바깥 셸에서 크롬 헤드리스로 찍는다.
const fs = require('fs');

const CSS = `
@font-face{font-family:Gowun;font-weight:400;src:url('fonts/GowunDodum-Regular.woff2') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box;font-weight:400}
html,body{width:1080px;height:1350px}
.card{width:1080px;height:1350px;background:#F6E4E2;padding:96px 84px;display:flex;flex-direction:column;font-family:Gowun,sans-serif;-webkit-font-smoothing:antialiased}
.top{display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:20px}
.circles{position:relative;width:88px;height:56px}
.c1{position:absolute;width:56px;height:56px;left:0;border-radius:50%;background:#C15A3C}
.c2{position:absolute;width:56px;height:56px;left:32px;border-radius:50%;background:#35503F}
.tita{font-size:52px;color:#26221F;letter-spacing:.06em}
.badge{background:#EAD7D5;color:#4F4340;font-size:28px;border-radius:999px;padding:14px 30px;letter-spacing:.01em;-webkit-text-stroke:.3px #4F4340}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center}
.mid.up{justify-content:flex-start;padding-top:120px}
h3{line-height:1.34;color:#26221F;letter-spacing:-.015em;-webkit-text-stroke:1.1px #26221F}
h3 .o{-webkit-text-stroke-color:#C15A3C}
h3 .line{display:block}
.o{color:#C15A3C}
.sub{color:#433936;-webkit-text-stroke:.22px #433936;line-height:1.68;letter-spacing:-.005em}
.sub em{font-style:normal;color:#26221F;box-shadow:inset 0 -.34em rgba(193,90,60,.24);padding:0 .06em}
.pair{margin-top:46px;display:flex;flex-direction:column;gap:18px}
.pair div{background:rgba(255,255,255,.78);border-radius:22px;padding:30px 36px;font-size:39px;color:#3A302D;letter-spacing:-.015em;display:flex;justify-content:space-between;align-items:center}
.pair .up{color:#2E6B4E;font-size:48px;-webkit-text-stroke:.4px #2E6B4E}
.pair .dn{color:#C15A3C;font-size:48px;-webkit-text-stroke:.4px #C15A3C}
.close{margin-top:32px;background:rgba(255,255,255,.82);border-radius:24px;padding:26px 30px}
.close .t{font-size:33px;color:#26221F;line-height:1.5;letter-spacing:-.015em}
.close .t b{font-weight:400;color:#C15A3C}
.close .tags{margin-top:16px;display:flex;flex-wrap:wrap;gap:12px}
.close .tags span{background:#F6E4E2;color:#4F4340;font-size:28px;-webkit-text-stroke:.3px #4F4340;padding:10px 20px;border-radius:999px}
.ex{margin-top:34px;display:flex;flex-direction:column;gap:13px}
.ex div{background:rgba(255,255,255,.78);border-radius:20px;padding:22px 30px;font-size:34px;color:#3A302D;letter-spacing:-.015em;line-height:1.4}
.ex div span{color:#4A3F3C;font-size:31px;-webkit-text-stroke:.35px #4A3F3C;display:block;margin-bottom:4px}
.ex div b{font-weight:400;color:#2E6B4E;-webkit-text-stroke:.4px #2E6B4E}
.bot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto}
.src{font-size:31px;color:#574B48;letter-spacing:-.005em;-webkit-text-stroke:.3px #574B48}
.src span{color:#4A3F3C;-webkit-text-stroke-color:#4A3F3C}
.foot{margin-top:24px;font-size:37px;color:#C15A3C;letter-spacing:.01em}
.pg{display:flex;flex-direction:column;align-items:flex-end;gap:16px}
.num{font-size:33px;color:#665A57;-webkit-text-stroke:.3px #665A57}
.dots{display:flex;gap:11px}
.dot{width:15px;height:15px;border-radius:50%}
/* 1장에만 쓰는 사진. 상자로 얹지 않고 배경에 스며들게 한다 — 티타 광고 카드가
   쓰는 문법이다. 사진을 카드 가장자리까지 깔고 블러시를 덮어, 위쪽은 완전히
   배경색으로 녹고 가운데만 은은히 드러나게 한다. 아래쪽은 다시 덮어 하단
   글씨(넘겨보세요·점)가 묻히지 않게 한다. 얼굴 없는 컷이라 특정인을 세우지 않는다. */
.card{position:relative;overflow:hidden}
.bleed{position:absolute;left:0;right:0;bottom:0;height:660px;z-index:0}
.bleed img{width:100%;height:100%;object-fit:cover;object-position:center 44%;display:block}
.bleed:after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,
  #F6E4E2 0%, rgba(246,228,226,.72) 10%, rgba(246,228,226,.34) 34%,
  rgba(246,228,226,.28) 66%, rgba(246,228,226,.64) 84%,
  rgba(246,228,226,.9) 100%)}
.top,.mid,.bot{position:relative;z-index:1}`;

const ON='#C15A3C', OFF='#D9C7C5';
const dots=(i,total)=>Array.from({length:total},(_,k)=>`<div class="dot" style="background:${k===i?ON:OFF}"></div>`).join('');
const BLEED='<div class="bleed"><img src="photos/three-tea-noface.png"></div>';
const card=(s,total)=>`<div class="card">${s.bleed?BLEED:''}<div class="top"><div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div><div class="badge">티타 인사이트 · 관계수업</div></div><div class="mid${s.bleed?' up':''}">${s.mid}</div><div class="bot"><div>${s.src?`<div class="src"><span>출처</span> ${s.src}</div>`:''}<div class="foot">${s.foot}</div></div><div class="pg"><div class="num">${s.page}</div><div class="dots">${dots(s.page-1,total)}</div></div></div></div>`;
const H=(f,...l)=>`<h3 style="font-size:${f}px">${l.map(x=>`<span class="line">${x}</span>`).join('')}</h3>`;
const SUB=(t,size=36)=>`<div class="sub" style="margin-top:46px;font-size:${size}px">${t}</div>`;
const EX=(...rows)=>`<div class="ex">${rows.map(r=>`<div>${r[0]?`<span>${r[0]}</span>`:''}${r[1]}</div>`).join('')}</div>`;
const PAIR=(...rows)=>`<div class="pair">${rows.map(r=>`<div><span>${r[0]}</span><span class="${r[2]}">${r[1]}</span></div>`).join('')}</div>`;
const CLOSE=`<div class="close"><div class="t">45세 이상 · 본인인증을 거친 분들과<br><b>결이 맞는 서넛</b>이 모여 차 한 잔 합니다.</div><div class="tags"><span>관계 연구, 매주 한 편</span><span>@titakorea</span></div></div>`;

const SRC_CENSUS='국가데이터처, 2025 인구주택총조사 (2025.11.1 기준)';
const SRC_MARRIAGE='국가데이터처, 2025년 혼인·이혼 통계 (2026.3.19)';

// ── 블로그 5장 — 본문이 옆에서 설명하니 표제 위주 ─────────────────────────
const blog=[
 { page:1, foot:'넘겨보세요 \u203a',
   mid:H(60,'30대 절반이','<span class="o">아직 미혼이에요.</span>')
      +SUB('<em>우리 애만 늦은 게 아니었어요.</em>',35)
      , bleed:true },
 { page:2, src:SRC_CENSUS, foot:'넘겨보세요 \u203a',
   mid:H(50,'예외가 아니라','<span class="o">다수예요.</span>')
      +PAIR(['30대 미혼율','54.7%',''],['18세 이상 전체 미혼','29.6%',''])
      +SUB('2025년 기준입니다. 30대는 절반을 넘겼어요.',33) },
 { page:3, src:SRC_MARRIAGE, foot:'넘겨보세요 \u203a',
   mid:H(50,'\u2018늦었다\u2019의 기준이','<span class="o">옮겨갔어요.</span>')
      +SUB('평균 초혼연령은 <em>남자 33.9세 \u00b7 여자 31.6세</em>.<br>2025년 혼인은 24만 건으로 <em>8.1% 늘었고요.</em>',34) },
 { page:4, foot:'넘겨보세요 \u203a',
   mid:H(48,'걱정은 몰라서','<span class="o">커지는 게 아니에요.</span>')
      +SUB('말할 곳이 없을 때 커집니다.<br><br>자식한테 하면 잔소리가 되고,<br>오래된 친구한테 하면 자식 비교가 되고요.',34) },
 { page:5, foot:'저장하기 \u2661',
   mid:H(48,'걱정은 걱정대로 두고,','<span class="o">그 시간엔 나도 좀 살고요.</span>')
      +SUB('같은 자리에 서 계신 분들이<br><em>생각보다 훨씬 많습니다.</em>',34)
      +CLOSE },
];

for (const [name,set] of [['blog',blog]]) {
  for (const s of set) {
    fs.writeFileSync(`_i17_${name}_${s.page}.html`,
      `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${card(s,set.length)}</body></html>`);
  }
  console.log(`${name} ${set.length}장 HTML 생성`);
}
