// 관계수업 #15 — 부모님은 제가 모셔요 / 블러시(핑크)
//
// 두 벌을 한 번에 낸다.
//   blog  5장 → public/blog/insight-15/        본문 옆에 놓이니 표제 위주
//   insta 7장 → assets/instagram/insight-15/   혼자 서야 하니 근거·숫자를 카드 안에
//
// CSS는 gen-insight-cards.cjs 것을 그대로 가져왔다(색 대비 값 포함). 이 파일은
// playwright를 쓰지 않는다 — 로컬 맥에는 없어서 크롬 헤드리스로 직접 찍는다.
// HTML만 쓰고 스크린샷은 바깥 셸에서 돈다.
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
.bleed{position:absolute;left:0;right:0;bottom:0;height:880px;z-index:0}
.bleed img{width:100%;height:100%;object-fit:cover;object-position:center 44%;display:block}
.bleed:after{content:'';position:absolute;inset:0;background:linear-gradient(to bottom,
  #F6E4E2 0%, rgba(246,228,226,.88) 12%, rgba(246,228,226,.5) 38%,
  rgba(246,228,226,.42) 70%, rgba(246,228,226,.86) 100%)}
.top,.mid,.bot{position:relative;z-index:1}`;

const ON='#C15A3C', OFF='#D9C7C5';
const dots=(i,total)=>Array.from({length:total},(_,k)=>`<div class="dot" style="background:${k===i?ON:OFF}"></div>`).join('');
const BLEED='<div class="bleed"><img src="photos/three-tea-noface.png"></div>';
const card=(s,total)=>`<div class="card">${s.bleed?BLEED:''}<div class="top"><div class="logo"><div class="circles"><div class="c1"></div><div class="c2"></div></div><div class="tita">티타</div></div><div class="badge">티타 인사이트 · 관계수업</div></div><div class="mid${s.bleed?' up':''}">${s.mid}</div><div class="bot"><div>${s.src?`<div class="src"><span>출처</span> ${s.src}</div>`:''}<div class="foot">${s.foot}</div></div><div class="pg"><div class="num">${s.page}</div><div class="dots">${dots(s.page-1,total)}</div></div></div></div>`;
const H=(f,...l)=>`<h3 style="font-size:${f}px">${l.map(x=>`<span class="line">${x}</span>`).join('')}</h3>`;
const SUB=(t,size=36)=>`<div class="sub" style="margin-top:46px;font-size:${size}px">${t}</div>`;
const EX=(...rows)=>`<div class="ex">${rows.map(r=>`<div>${r[0]?`<span>${r[0]}</span>`:''}${r[1]}</div>`).join('')}</div>`;
const PAIR=(...rows)=>`<div class="pair">${rows.map(r=>`<div><span>${r[0]}</span><span class="${r[2]}">${r[1]}</span></div>`).join('')}</div>`;
const CLOSE=`<div class="close"><div class="t">만 45세 이상 · 본인인증을 거친 분들과<br><b>결이 맞는 서넛</b>이 모여 차 한 잔 합니다.</div><div class="tags"><span>관계 연구, 매주 한 편</span><span>@titakorea</span></div></div>`;

const SRC_PANEL='한국보건사회연구원 한국복지패널 · 전국 7,300가구';
const SRC_STAT='국가데이터처, 2025 고령자통계';

// ── 블로그 5장 — 본문이 옆에서 설명하니 표제 위주 ─────────────────────────
const blog=[
 { page:1, foot:'넘겨보세요 ›',
   mid:H(66,'내 몫은','<span class="o">여기까지.</span>')
      +SUB('이제 내 삶을 <em>더 재미있게 꾸려보려고요.</em>',35)
      , bleed:true },
 { page:2, src:SRC_PANEL, foot:'넘겨보세요 ›',
   mid:H(50,'부모는 모셨지만,','<span class="o">모셔지길 바라진 않아요.</span>')
      +PAIR(['2007년','52.6%','up'],['2025년','20.6%','dn'])
      +SUB('“부모 부양은 자녀 책임”에 그렇다고 답한 비율입니다.',33) },
 { page:3, src:SRC_STAT, foot:'넘겨보세요 ›',
   mid:H(52,'바뀐 건 아이들이 아니라','<span class="o">조건이에요.</span>')
      +SUB('예순다섯이 되어도 <em>평균 스무 해</em>를 더 삽니다.<br>부양이 몇 년의 일이 아니라<br>이십 년의 일이 된 거예요.',35) },
 { page:4, foot:'넘겨보세요 ›',
   mid:H(52,'그래서 이건','<span class="o">짐을 내려놓는 일이에요.</span>')
      +SUB('자식에게 짐이 되지 않으려는 마음에는<br>늘 걱정 하나가 붙어 있었죠.<br>그 걱정을 <em>조금 덜어도 됩니다.</em>',35) },
 { page:5, foot:'저장하기 ♡',
   mid:H(50,'내 몫은 여기까지 하고,','이제 <span class="o">재미있게</span> 꾸려보려고요.')
      +SUB('다만, <em>결이 맞는 친구랑요.</em><br><br>혼자가 아니에요. 같은 자리에 서 계신 분들이<br>생각보다 훨씬 많습니다.',34)
      +CLOSE },
];

// ── 인스타 7장 — 혼자 서야 하니 근거와 숫자를 카드 안에 ────────────────────
const insta=[
 { page:1, foot:'넘겨보세요 ›',
   mid:H(66,'내 몫은','<span class="o">여기까지.</span>')
      +SUB('이제 내 삶을 <em>더 재미있게 꾸려보려고요.</em><br>그런데 이게 나 혼자 하는 생각이 아니더군요.',35)
      , bleed:true },
 { page:2, foot:'넘겨보세요 ›',
   mid:H(48,'부모는 모셨지만,','<span class="o">모셔지길 바라진 않아요.</span>')
      +SUB('절반이 “그건 자식 몫”이라 답하던 시절에<br>부모를 모셨습니다. 그렇게 배웠고, 대체로 그렇게 했고요.<br><br>그런데 <em>자기 차례 이야기가 나오면 답이 달라집니다.</em><br>자식이 모셔주기를 기다리는 분은 거의 없어요.',34) },
 { page:3, src:SRC_PANEL, foot:'넘겨보세요 ›',
   mid:H(50,'“부모 부양은 자녀 책임”','절반에서 <span class="o">다섯 중 하나</span>로.')
      +EX(['2007년 · 1차 조사','그렇다 <b>52.6%</b> · 아니다 24.3%'],
          ['2013년','처음으로 뒤집힘'],
          ['2025년 · 20차 조사','그렇다 <b>20.6%</b> · 아니다 <b>47.6%</b>'])
      +SUB('18년째 같은 가구를 따라가며 물어온 결과입니다.',33) },
 { page:4, src:SRC_STAT, foot:'넘겨보세요 ›',
   mid:H(50,'바뀐 건 아이들이 아니라','<span class="o">조건이에요.</span>')
      +EX(['65세의 기대여명 (2023년)','<b>21.5년</b> — 남자 19.2년 · 여자 23.6년'],
          ['65세 이상 인구 (2025년)','전체의 <b>20.3%</b>'])
      +SUB('부양이 몇 년의 일이 아니라 이십 년의 일이 됐습니다.<br>규범이 아니라 <em>셈이 안 맞게 된 거예요.</em>',33) },
 { page:5, foot:'넘겨보세요 ›',
   mid:H(48,'그래서 이건','<span class="o">짐을 내려놓는 일이에요.</span>')
      +SUB('몸을 챙기고, 쓸 데를 줄이고, 미리 정리해 둡니다.<br>말로 꺼내지 않을 뿐 대부분 그렇게 준비하시죠.<br><br>그 마음에 붙어 있던 걱정 하나 —<br><em>언젠가 내가 짐이 되면 어쩌나.</em><br>유별난 결심이 아니라 사회가 함께 옮겨온 겁니다.',33) },
 { page:6, foot:'넘겨보세요 ›',
   mid:H(46,'들어오는 문은 닫히는데','<span class="o">나가는 문만 열려 있어요.</span>')
      +SUB('학교, 직장, 결혼, 아이 학교 —<br>새 사람이 들어오던 통로는 대부분 그 전에 있었습니다.<br>반면 떠나는 일은 계속 생기죠.<br><br>인맥이 좁아지는 건 성격 탓도, 노력 부족도 아닙니다.<br><em>구조가 그렇게 되어 있습니다.</em>',33) },
 { page:7, foot:'저장하기 ♡',
   mid:H(50,'내 몫은 여기까지 하고,','이제 <span class="o">재미있게</span> 꾸려보려고요.')
      +SUB('다만, <em>결이 맞는 친구랑요.</em><br><br>혼자가 아니에요. 같은 자리에 서 계신 분들이<br>생각보다 훨씬 많습니다.',34)
      +CLOSE },
];

for (const [name,set] of [['blog',blog],['insta',insta]]) {
  for (const s of set) {
    fs.writeFileSync(`_i15_${name}_${s.page}.html`,
      `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${card(s,set.length)}</body></html>`);
  }
  console.log(`${name} ${set.length}장 HTML 생성`);
}
