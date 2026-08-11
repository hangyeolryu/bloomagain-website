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
   mid:H(58,'예의와 여유는','<span class="o">성품이 아니라 습관</span>이었어요.')
      +SUB('연구가 재 본 어른다움의 정체 —<br><em>한 발 물러서서 보는 것</em>이었습니다.',37) },

 { page:2, src:'Roberts 외, 92개 종단연구 메타분석 (2006)', foot:'넘겨보세요 ›',
   mid:H(56,'‘어른답다’는 건','<span class="o">막연한 칭찬이 아니에요.</span>')
      +SUB('92개 추적연구에서 실제로 오른 항목 —<br><em>성실성 · 정서적 안정 · 우호성</em>.<br>우리가 어른답다고 부르는 게 정확히 이것들이죠.',34) },

 { page:3, src:'Grossmann 외, PNAS (2010)', foot:'넘겨보세요 ›',
   mid:H(54,'여유는 감정이 식은 게','아니라 <span class="o">거리</span>였어요.')
      +SUB('갈등 앞에서 가장 현명한 건 <em>60~90세</em>.<br>메말라서가 아니라 <em>판을 넓게 봐서</em>였습니다.',35) },

 { page:4, src:'Grossmann & Kross, Psych. Science (2014)', foot:'넘겨보세요 ›',
   mid:H(56,'남 일엔 현명한데','<span class="o">내 일엔 아니에요.</span>')
      +SUB('심리학은 이걸 <em>솔로몬의 역설</em>이라 불러요.<br>나이가 들어도 저절로 사라지지 않았습니다.<br>무례해지는 순간은 대개 여기죠.',33) },

 { page:5, src:'Kross & Grossmann, JEP: General (2012)', foot:'티타 · @titakorea →',
   mid:H(48,'<span class="o">멀리서 보는 사람</span>처럼','상상해 보세요.')
      +`<div class="ex"><div><span>화가 올라올 때</span>‘나는 왜’ 대신 ‘○○은 지금 왜 화가 났을까’</div><div><span>말이 나가기 전에</span>벽에 붙은 파리가 본다면 뭐라고 할까</div><div><span>상대 말이 거슬릴 때</span>‘무엇이 걱정돼서 저렇게 말할까’</div></div>`
      +`<div class="close"><div class="t">이 한 문장으로 지혜로운 추론이 <b>실제로 올라갔어요.</b><br>다만 거리를 둘 <b>상대</b>가 있어야 연습이 됩니다.</div><div class="tags"><span>만 45세 이상</span><span>NICE 본인인증</span><span>1:1 아닌 여럿이</span></div></div>` },
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
