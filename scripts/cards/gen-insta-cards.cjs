const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright');
const fs = require('fs');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

// 인스타용 카드다. 블로그 카드는 본문 옆에 놓이니 표제 한 줄로 족하지만,
// 인스타에서는 카드가 혼자 서야 하고 캡션은 잘 안 읽힌다. 그래서 근거와
// 숫자를 카드 안에 넣고 장수도 5장에서 7장으로 늘렸다.
// GowunDodum은 400 한 종류뿐이다. 굵기로 위계를 못 만들므로 크기·색·하이라이트로
// 대신한다. font-weight를 아예 쓰지 않아 브라우저의 가짜 볼드(합성 굵기)도 막는다.
const CSS = `
@font-face{font-family:Gowun;font-weight:400;src:url('fonts/GowunDodum-Regular.woff2') format('woff2')}
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
/* 정보량이 많은 카드라 박스 안에서도 핵심 구절만 색으로 띄운다 */
.ex div b{color:#D4B895}
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
const TOTAL=7;
const dots=(i)=>Array.from({length:TOTAL},(_,k)=>`<div class="dot" style="background:${k===i?ON:OFF}"></div>`).join('');
const card=(s)=>`<div class="card"><div class="top"><div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div><div class="badge">티타 인사이트 · 관계수업</div></div><div class="mid">${s.mid}</div><div class="bot"><div>${s.src?`<div class="src"><span>출처</span> ${s.src}</div>`:''}<div class="foot">${s.foot}</div></div><div class="pg"><div class="num">${s.page}</div><div class="dots">${dots(s.page-1)}</div></div></div></div>`;
const H=(f,...l)=>`<h3 style="font-size:${f}px">${l.map(x=>`<span class="line">${x}</span>`).join('')}</h3>`;
const SUB=(t,size=36)=>`<div class="sub" style="margin-top:42px;font-size:${size}px">${t}</div>`;
const EX=(...rows)=>`<div class="ex">${rows.map(r=>`<div>${r[0]?`<span>${r[0]}</span>`:''}${r[1]}</div>`).join('')}</div>`;

const cards=[
 { page:1, foot:'넘겨보세요 ›',
   mid:H(48,'요즘은 다들','<span class="o">알면서 모르는 척한다고요?</span>')
      +SUB('도움이 필요해 보여도 못 본 듯 지나가고<br>어렵게 꺼낸 이야기엔 잠깐 조용해졌다 화제가 바뀝니다.<br>분명히 봤고 분명히 들었는데도요.',32)
      +EX(['','그럴 때면 <b>사람들이 변했나 보다</b> 싶어집니다.'],
          ['','그런데 <b>1968년에도 똑같았습니다.</b>']) },

 { page:2, src:'Darley & Latané (1968) · 방관자 효과', foot:'넘겨보세요 ›',
   mid:H(48,'지켜보는 사람이 많을수록','<span class="o">아무도 나서지 않아요.</span>')
      +SUB('각자 “누군가 하겠지” 하고 기다립니다.<br>이걸 밝혀낸 게 <em>1968년</em>이에요.<br>스마트폰도 인터넷도 없던 때입니다.',32)
      +EX(['1970년, 또 다른 연구','도시에서 서로에게 덜 반응하는 건 냉정해서가 아니라<br>하루에 스치는 얼굴이 감당할 양을 넘어서기 때문입니다.']) },

 { page:3, src:'Darley & Latané (1968)', foot:'넘겨보세요 ›',
   mid:H(46,'그런데 안 나선 사람들은','<span class="o">떨고 있었습니다.</span>')
      +SUB('태연한 게 아니었어요.<br><em>오히려 나서서 도운 사람들보다</em><br>더 불안해하고 손을 떨었습니다.',33)
      +EX(['연구진의 풀이','나설까 말까 하는 <b>망설임이 끝나지 않은 상태.</b><br>도운 사람은 몸을 움직여 그 망설임을 끝낸 겁니다.'],
          ['당시 언론은 “냉담해졌다”고 썼지만','저자들은 그 해석을 <b>정면으로 반박했습니다.</b>']) },

 { page:4, src:'Latané & Darley (1968) · 다원적 무지', foot:'넘겨보세요 ›',
   mid:H(48,'다들 서로의','<span class="o">눈치를 보고 있었어요.</span>')
      +SUB('방에 연기를 흘려 넣는 실험이 있었습니다.<br>혼자면 <em>대부분 곧바로 알렸는데</em><br>여럿이면 훨씬 적게 알렸어요.',33)
      +EX(['왜 그럴까요','애매할 때 사람은 남의 얼굴을 봅니다.<br>그런데 그 사람도 <b>태연한 척 나를 보고 있어요.</b>'],
          ['','모두가 마음을 감춘 채 서로를 살피니<br>그 태연함을 서로 <b>‘무관심’으로 읽습니다.</b>']) },

 { page:5, src:'Vu 외, Psychological Bulletin (2023)', foot:'넘겨보세요 ›',
   mid:H(46,'좋은 사람이 되는 것과','<span class="o">좋은 사람으로 보이는 것.</span>')
      +SUB('3만 건이 넘는 선택을 모아 봤더니<br>내 선택이 남에게 어떤 영향을 주는지<br><em>열에 넷은 알아보지 않는 쪽을 골랐습니다.</em>',32)
      +EX(['왜 굳이 안 볼까요','알면 도와야 하고, 알고도 안 도우면 나쁜 사람이 되니까<br><b>아예 안 보는 쪽</b>을 고르는 겁니다.'],
          ['','마음이 있었는데 <b>못 한 것</b>과<br><b>안 보기로 한 것</b>은 다릅니다.']) },

 { page:6, src:'Muchnik, Aral & Taylor, Science (2013)', foot:'넘겨보세요 ›',
   mid:H(48,'첫 한 줄이','<span class="o">다음을 부릅니다.</span>')
      +SUB('10만 건 넘는 글에 <em>무작위로</em> 첫 반응을 달았어요.<br>글 내용과는 아무 상관 없이요.',33)
      +EX(['첫 반응이 긍정이었던 글','최종 점수 <b>25% 상승</b> · 다음 사람이 반응할 확률 <b>32% 상승</b>'],
          ['첫 반응이 부정이었을 때','<b>그렇게 번지지 않았습니다.</b> 좋은 반응만 옮았어요.']) },

 { page:7, foot:'저장하기 ♡',
   mid:H(48,'아마','<span class="o">그런 분은 아닐 거예요.</span>')
      +SUB('여기까지 읽으셨다면<br><em>읽고 마음이 움직였는데 손이 안 나갔던 쪽</em>이겠지요.<br>그 망설임은 대개 배려에서 나옵니다.',32)
      +`<div class="close"><div class="t">누군가 먼저 <b>문을 열어 두었다면</b><br>한 번만 아는 척해 주시면 어떨까요.<br>잘 쓴 답글이 아니라 <b>읽었다는 기척</b> 하나면 됩니다.</div><div class="tags"><span>관계 연구, 매주 한 편</span><span>@titakorea</span></div></div>` },
];

(async()=>{
  const b=await chromium.launch({executablePath:CHROME});
  const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
  for(const s of cards){
    const f=`_ig_${s.page}.html`;
    fs.writeFileSync(f,`<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${card(s)}</body></html>`);
    await p.goto('file://'+process.cwd()+'/'+f,{waitUntil:'load'});
    await p.evaluate(()=>document.fonts.ready);
    if(!(await p.evaluate(()=>document.fonts.check('400 66px Gowun')))) throw new Error('font fail '+s.page);
    await p.waitForTimeout(160);
    await p.screenshot({path:`ig_card${s.page}.png`});
    console.log('rendered',s.page);
  }
  await b.close();
})();
