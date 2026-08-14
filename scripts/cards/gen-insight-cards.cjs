const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

// GowunDodum은 400 한 종류뿐이다. 굵기로 위계를 못 만들므로 크기·색·하이라이트로
// 대신한다. font-weight를 아예 쓰지 않아 브라우저의 가짜 볼드(합성 굵기)도 막는다.
const CSS = `
@font-face{font-family:Gowun;font-weight:400;src:url('fonts/GowunDodum-Regular.woff2') format('woff2')}
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
.badge{background:#EAD7D5;color:#4F4340;font-size:28px;border-radius:999px;-webkit-text-stroke:.3px #4F4340;padding:14px 30px;letter-spacing:.01em}
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
.close{margin-top:52px;background:rgba(255,255,255,.82);border-radius:26px;padding:34px 36px}
.close .t{font-size:34px;color:#26221F;line-height:1.5;letter-spacing:-.015em}
.close .t b{font-weight:400;color:#C15A3C}
.close .tags{margin-top:22px;display:flex;flex-wrap:wrap;gap:12px}
.close .tags span{background:#F6E4E2;color:#5F534F;font-size:26px;padding:12px 22px;border-radius:999px}
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
   mid:H(66,'멋진 어른이 된다는 건','<span class="o">어떤 걸까요?</span>')
      +SUB('중년쯤 되면 한 번씩 떠올리는 질문이죠.<br>연구는 조금 <em>다른 답</em>을 내놓습니다.',37) },

 { page:2, src:'Roberts 외, 92개 종단연구 메타분석 (2006)', foot:'넘겨보세요 ›',
   mid:H(58,'성숙은 <span class="o">노력이 아니라</span>','이미 일어나고 있어요.')
      +SUB('92개 추적연구를 모아 보니 —<br><em>성실성과 정서적 안정</em>은 나이 들수록 올라갑니다.<br>중년·노년에도 계속 변합니다.',35) },

 { page:3, src:'Grossmann 외, PNAS (2010)', foot:'넘겨보세요 ›',
   mid:H(60,'갈등 앞에서 가장 현명한 건','<span class="o">60~90세</span>였어요.')
      +SUB('여러 입장을 헤아리고, 타협의 여지를 남기고,<br><em>내가 다 알지는 못한다</em>고 인정하는 것 —<br>젊은 층보다 노년층이 더 잘했습니다.',34) },

 { page:4, src:'Levy 외, JPSP (2002) · 660명 23년 추적', foot:'넘겨보세요 ›',
   mid:H(60,'나이듦을 <span class="o">어떻게 보느냐</span>가','<span class="o">7.5년</span>을 갈랐어요.')
      +SUB('나이 드는 자신을 긍정적으로 본 사람이<br><em>7.5년 더 오래</em> 살았습니다.<br>외로움과 건강 상태를 걷어내도 남은 차이였어요.',34) },

 { page:5, foot:'티타 · @titakorea →',
   mid:H(58,'네, <span class="o">멋질 필요는 없지요.</span>','다만 혼자는, 조금 아깝습니다.')
      +SUB('지혜는 상대가 있어야 쓰이고,<br>나이 든 나를 보는 눈은<br><em>주변이 나를 대하는 방식</em>에서 만들어지니까요.',34)
      +`<div class="close"><div class="t">은퇴하고 아이들이 독립하면 그 자리가 빕니다.<br><b>결이 맞는 또래 몇 사람</b>, 가까운 동네에서.</div><div class="tags"><span>만 45세 이상</span><span>NICE 본인인증</span><span>1:1 아닌 여럿이</span></div></div>` },
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
