const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

// GowunDodum은 400 한 종류뿐이다. 굵기로 위계를 못 만들므로 크기·색·하이라이트로
// 대신한다. font-weight를 아예 쓰지 않아 브라우저의 가짜 볼드(합성 굵기)도 막는다.
const CSS = `
@font-face{font-family:Gowun;font-weight:400;src:url('fonts/GowunDodum-Regular.ttf') format('truetype')}
/* 색 대비 — 딥그린 배경(#1F4E3D→#143329) 기준 명도비를 맞춘 값이다. 라벨이 2.6:1로
   큰 글씨 최소 기준(3:1)에도 못 미쳐 전체를 올렸다.
   표제 12.9:1 · 본문 9.1:1 · 라벨 8.1:1(+획 보정) · 배지 6.0:1 · 출처 5.4:1
   45+ 사용자와 작은 피드 썸네일을 함께 고려한 값이라 더 낮추지 말 것. */
*{margin:0;padding:0;box-sizing:border-box;font-weight:400}
html,body{width:1080px;height:1350px}
.card{width:1080px;height:1350px;background:linear-gradient(150deg,#1F4E3D 0%,#143329 100%);padding:96px 84px;display:flex;flex-direction:column;font-family:Gowun,sans-serif;-webkit-font-smoothing:antialiased}
.top{display:flex;justify-content:space-between;align-items:center}
.logo{display:flex;align-items:center;gap:20px}
.circles{position:relative;width:88px;height:56px}
.c1{position:absolute;width:56px;height:56px;left:0;border-radius:50%;background:#C15A3C}
.c2{position:absolute;width:56px;height:56px;left:32px;border-radius:50%;background:#D4B895}
.tita{font-size:52px;color:#FBF7F0;letter-spacing:.06em}
.badge{background:rgba(251,247,240,.14);color:#EDE3D6;font-size:28px;border-radius:999px;padding:14px 30px;letter-spacing:.01em}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center}
/* 고운돋움은 400 하나뿐이라 굵기를 못 올린다. 합성 볼드는 획을 옆으로 밀어
   뭉개므로 쓰지 않고, text-stroke로 외곽선을 균일하게 덧그려 자소 모양을
   유지한 채 두께만 얻는다. 색이 다른 부분은 stroke 색도 같이 맞춰야
   테두리가 겉돌지 않는다. */
h3{line-height:1.34;color:#FBF7F0;letter-spacing:-.015em;-webkit-text-stroke:1.1px #FBF7F0}
h3 .o{-webkit-text-stroke-color:#D4B895}
h3 .line{display:block}
.o{color:#D4B895}
.sub{color:#CBDACE;line-height:1.68;letter-spacing:-.005em}
/* 굵기 대신 색 + 옅은 형광 하이라이트로 강조한다 */
.sub em{font-style:normal;color:#FBF7F0;box-shadow:inset 0 -.12em rgba(212,184,149,.85);padding:0 .04em}
.pair{margin-top:46px;display:flex;flex-direction:column;gap:18px}
.pair div{background:rgba(251,247,240,.10);border-radius:22px;padding:28px 34px;font-size:35px;color:#FBF7F0;letter-spacing:-.015em;display:flex;justify-content:space-between;align-items:center}
.pair .up{color:#9ED8B4;font-size:42px}
.pair .dn{color:#E8A98C;font-size:42px}
/* 마무리 카드 — 여기서 끝난다는 신호를 주고, 티타가 뭘 하는지 한 줄로 남긴다 */
.close{margin-top:32px;background:rgba(251,247,240,.12);border-radius:24px;padding:26px 30px}
.close .t{font-size:30px;color:#FBF7F0;line-height:1.5;letter-spacing:-.015em}
.close .t b{font-weight:400;color:#D4B895}
.close .tags{margin-top:16px;display:flex;flex-wrap:wrap;gap:12px}
.ex{margin-top:34px;display:flex;flex-direction:column;gap:13px}
.ex div{background:rgba(251,247,240,.10);border-radius:20px;padding:20px 28px;font-size:30px;color:#FBF7F0;letter-spacing:-.015em;line-height:1.4}
.ex div span{color:#B8CCBC;font-size:28px;display:block;margin-bottom:4px}
.close .tags span{background:rgba(251,247,240,.10);color:#CBDACE;font-size:25px;padding:10px 20px;border-radius:999px}
.bot{display:flex;justify-content:space-between;align-items:flex-end;margin-top:auto}
.src{font-size:28px;color:#9DB2A2;letter-spacing:-.005em}
.src span{color:#CBDACE}
.foot{margin-top:24px;font-size:37px;color:#D4B895;letter-spacing:.01em}
.pg{display:flex;flex-direction:column;align-items:flex-end;gap:16px}
.num{font-size:33px;color:#9DB2A2}
.dots{display:flex;gap:11px}
.dot{width:15px;height:15px;border-radius:50%}`;

const ON='#D4B895', OFF='rgba(251,247,240,.30)';
const dots=(i)=>Array.from({length:5},(_,k)=>`<div class="dot" style="background:${k===i?ON:OFF}"></div>`).join('');
const card=(s)=>`<div class="card"><div class="top"><div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div><div class="badge">티타 인사이트 · 관계수업</div></div><div class="mid">${s.mid}</div><div class="bot"><div>${s.src?`<div class="src"><span>출처</span> ${s.src}</div>`:''}<div class="foot">${s.foot}</div></div><div class="pg"><div class="num">${s.page}</div><div class="dots">${dots(s.page-1)}</div></div></div></div>`;
const H=(f,...l)=>`<h3 style="font-size:${f}px">${l.map(x=>`<span class="line">${x}</span>`).join('')}</h3>`;
const SUB=(t,size=36)=>`<div class="sub" style="margin-top:46px;font-size:${size}px">${t}</div>`;

const cards=[
 { page:1, foot:'넘겨보세요 ›',
   mid:H(54,'글을 올렸는데 답이 없는 건','<span class="o">안 읽어서가 아니에요.</span>')
      +SUB('다들 읽고 있어요.<br>다만 <em>첫 한 줄</em>을 서로 기다리는 중입니다.',35) },

 { page:2, src:'Nielsen, 참여 불평등', foot:'넘겨보세요 ›',
   mid:H(54,'읽는 사람은 원래','<span class="o">훨씬 많아요.</span>')
      +SUB('온라인 모임은 <em>대부분이 읽기만</em> 하고<br>극소수가 거의 모든 글을 씁니다.<br>흔적을 안 남길 뿐, 안 본 게 아니에요.',33) },

 { page:3, src:'Markey, Computers in Human Behavior (2000)', foot:'넘겨보세요 ›',
   mid:H(50,'보는 사람이 많을수록','<span class="o">아무도 나서지 않아요.</span>')
      +SUB('채팅방 인원이 많을수록 답이 <em>늦게</em> 왔어요.<br>각자 “누군가 하겠지” 하고 기다린 거죠.<br>안 봐서가 아니라 <em>다들 보고 있어서</em>입니다.',32) },

 { page:4, src:'Muchnik, Aral & Taylor, Science (2013)', foot:'넘겨보세요 ›',
   mid:H(50,'첫 한 줄이','<span class="o">판을 바꿉니다.</span>')
      +SUB('10만 건 넘는 글에 무작위로 첫 반응을 달았더니 —<br>다음 사람이 반응할 확률이 <em>32% 올랐어요.</em><br>나쁜 반응은 그렇게 번지지 않았고요.',32) },

 { page:5, foot:'저장하기 ♡',
   mid:H(54,'우리 서로','<span class="o">아는 척 해 볼까요.</span>')
      +SUB('잘 쓴 답글이 아니라<br><em>읽었다는 기척</em> 하나면 됩니다.',35)
      +`<div class="close"><div class="t">우리는 <b>조금 더 나은 날</b>을 보내려고 모였잖아요.<br>서로 스쳐 지나가기엔 아까운 사이입니다.</div><div class="tags"><span>관계 연구, 매주 한 편</span><span>@titakorea</span></div></div>` },
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
