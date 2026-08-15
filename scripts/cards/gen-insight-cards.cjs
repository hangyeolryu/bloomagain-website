const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

// GowunDodum은 400 한 종류뿐이다. 굵기로 위계를 못 만들므로 크기·색·하이라이트로
// 대신한다. font-weight를 아예 쓰지 않아 브라우저의 가짜 볼드(합성 굵기)도 막는다.
const CSS = `
@font-face{font-family:Gowun;font-weight:400;src:url('fonts/GowunDodum-Regular.ttf') format('truetype')}
/* 색 대비 — 배경 #F6E4E2 기준 명도비를 맞춘 값이다. 라벨이 2.6:1로
   큰 글씨 최소 기준(3:1)에도 못 미쳐 전체를 올렸다.
   표제 12.9:1 · 본문 9.1:1 · 라벨 8.1:1(+획 보정) · 배지 6.0:1 · 출처 5.4:1
   45+ 사용자와 작은 피드 썸네일을 함께 고려한 값이라 더 낮추지 말 것. */
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
/* 고운돋움은 400 하나뿐이라 굵기를 못 올린다. 합성 볼드는 획을 옆으로 밀어
   뭉개므로 쓰지 않고, text-stroke로 외곽선을 균일하게 덧그려 자소 모양을
   유지한 채 두께만 얻는다. 색이 다른 부분은 stroke 색도 같이 맞춰야
   테두리가 겉돌지 않는다. */
h3{line-height:1.34;color:#26221F;letter-spacing:-.015em;-webkit-text-stroke:1.1px #26221F}
h3 .o{-webkit-text-stroke-color:#C15A3C}
h3 .line{display:block}
.o{color:#C15A3C}
.sub{color:#433936;-webkit-text-stroke:.22px #433936;line-height:1.68;letter-spacing:-.005em}
/* 굵기 대신 색 + 옅은 형광 하이라이트로 강조한다 */
.sub em{font-style:normal;color:#26221F;box-shadow:inset 0 -.34em rgba(193,90,60,.24);padding:0 .06em}
.pair{margin-top:46px;display:flex;flex-direction:column;gap:18px}
.pair div{background:rgba(255,255,255,.78);border-radius:22px;padding:28px 34px;font-size:35px;color:#3A302D;letter-spacing:-.015em;display:flex;justify-content:space-between;align-items:center}
.pair .up{color:#35503F;font-size:42px}
.pair .dn{color:#C15A3C;font-size:42px}
/* 마무리 카드 — 여기서 끝난다는 신호를 주고, 티타가 뭘 하는지 한 줄로 남긴다 */
.close{margin-top:32px;background:rgba(255,255,255,.82);border-radius:24px;padding:26px 30px}
.close .t{font-size:30px;color:#26221F;line-height:1.5;letter-spacing:-.015em}
.close .t b{font-weight:400;color:#C15A3C}
.close .tags{margin-top:16px;display:flex;flex-wrap:wrap;gap:12px}
.ex{margin-top:34px;display:flex;flex-direction:column;gap:13px}
.ex div{background:rgba(255,255,255,.78);border-radius:20px;padding:20px 28px;font-size:30px;color:#3A302D;letter-spacing:-.015em;line-height:1.4}
.ex div span{color:#4A3F3C;font-size:28px;-webkit-text-stroke:.35px #4A3F3C;display:block;margin-bottom:4px}
.close .tags span{background:#F6E4E2;color:#4F4340;font-size:25px;-webkit-text-stroke:.3px #4F4340;padding:10px 20px;border-radius:999px}
.bot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto}
.src{font-size:28px;color:#574B48;letter-spacing:-.005em;-webkit-text-stroke:.3px #574B48}
.src span{color:#4A3F3C;-webkit-text-stroke-color:#4A3F3C}
.foot{margin-top:24px;font-size:37px;color:#C15A3C;letter-spacing:.01em}
.pg{display:flex;flex-direction:column;align-items:flex-end;gap:16px}
.num{font-size:33px;color:#665A57;-webkit-text-stroke:.3px #665A57}
.dots{display:flex;gap:11px}
.dot{width:15px;height:15px;border-radius:50%}`;

const ON='#C15A3C', OFF='#D9C7C5';
const dots=(i)=>Array.from({length:5},(_,k)=>`<div class="dot" style="background:${k===i?ON:OFF}"></div>`).join('');
const card=(s)=>`<div class="card"><div class="top"><div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div><div class="badge">티타 인사이트 · 관계수업</div></div><div class="mid">${s.mid}</div><div class="bot"><div>${s.src?`<div class="src"><span>출처</span> ${s.src}</div>`:''}<div class="foot">${s.foot}</div></div><div class="pg"><div class="num">${s.page}</div><div class="dots">${dots(s.page-1)}</div></div></div></div>`;
const H=(f,...l)=>`<h3 style="font-size:${f}px">${l.map(x=>`<span class="line">${x}</span>`).join('')}</h3>`;
const SUB=(t,size=36)=>`<div class="sub" style="margin-top:46px;font-size:${size}px">${t}</div>`;

const cards=[
 { page:1, foot:'넘겨보세요 ›',
   mid:H(58,'꾸미지 않아도 돼요.','<span class="o">어차피 티가 나거든요.</span>')
      +SUB('오랜만에 새 사람을 만나는 자리.<br>나도 모르게 말을 다듬게 되죠.<br>그런데 그 다듬은 게 <em>거의 다 보입니다.</em>',34) },

 { page:2, src:'Sezer, Gino & Norton (JPSP) · 아홉 개 연구', foot:'넘겨보세요 ›',
   mid:H(54,'돌려 말하면','<span class="o">오히려 눈에 띄어요.</span>')
      +SUB('겸손이나 불평으로 한 겹 싼 말은<br>담백하게 말한 것보다 <em>호감을 덜 얻었어요.</em><br>감추려던 쑥스러움이 제일 잘 보인 셈이죠.',32) },

 { page:3, src:'Scopelliti 외, “I Call It Bragging” (2015)', foot:'넘겨보세요 ›',
   mid:H(52,'나는 <span class="o">그냥 이야기</span>인데,','상대에겐 <span class="o">자랑</span>이에요.')
      +SUB('연구 논문 제목이 딱 그거였어요.<br>“당신은 자기표현이라 하고, 나는 자랑이라 한다.”<br>감탄은 <em>생각보다 적었고</em>, 불편함은 <em>생각보다 컸어요.</em>',31) },

 { page:4, src:'Skowronski 외, JPSP (1998) · 특성 전이', foot:'넘겨보세요 ›',
   mid:H(50,'남 이야기는 그 사람이 아니라','<span class="o">나에게 남아요.</span>')
      +SUB('누가 인색하더라 전하면, 나중에 남는 건<br><em>전한 사람의 인색한 인상</em>이었어요.<br>다행히 <em>좋은 이야기의 따뜻함</em>도 똑같이 남습니다.',31) },

 { page:5, src:'Bruk 외 (2018) · 아름다운 실수 효과', foot:'저장하기 ♡',
   mid:H(54,'우리,','<span class="o">자연스럽게 만나요.</span>')
      +SUB('모른다고 말하는 일, 먼저 사과하는 일 —<br>내가 하면 나약해 보이지만<br><em>남이 하면 용기로 보입니다.</em>',32)
      +`<div class="close"><div class="t">차 한 잔 놓고, <b>오늘 무슨 일이 있었는지</b>부터.<br>그거면 충분합니다.</div><div class="tags"><span>관계 연구, 매주 한 편</span><span>@titakorea</span></div></div>` },
];

(async()=>{
  const b=await chromium.launch({executablePath:CHROME});
  const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
  for(const s of cards){
    const f=`_gd_${s.page}.html`;
    fs.writeFileSync(f,`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${card(s)}</body></html>`);
    await p.goto('file://'+process.cwd()+'/'+f,{waitUntil:'load'});
    await p.evaluate(()=>document.fonts.ready);
    if(!(await p.evaluate(()=>document.fonts.check('400 66px Gowun')))) throw new Error('font fail '+s.page);
    await p.waitForTimeout(160);
    await p.screenshot({path:`gd_card${s.page}.png`});
    console.log('rendered',s.page);
  }
  await b.close();
})();
