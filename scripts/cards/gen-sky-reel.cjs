// 내 하늘 릴스 — 별이 천천히 돌고 그 위에 닉네임 라벨이 떠다니는 영상 (1080×1920, 10초, 30fps).
//
//   node gen-sky-reel.cjs [--sec 10] [--fps 30] [--out ../../assets/instagram/update-2026-11/sky-reel.mp4]
//
// 프레임마다 _sky.html?t=<초>를 헤드리스 크로미움으로 찍고(시간은 질의로 넘겨 결정적으로 그린다),
// ffmpeg로 묶는다. 앱 하늘 화면(assets/html/gyeol_map.html)의 느낌만 옮겼다 — 금색 별(#FFE08A),
// 이름 알약 라벨, 나와 끌리는 별 사이 가는 금선. 바탕은 카드와 같은 딥그린.
//
// ⚠️ 닉네임은 전부 지어낸 것이다. 실제 회원 닉네임을 공개물에 쓰지 않는다.
// ⚠️ 점 111개·덩어리 5개는 2026-11-09 지도 실측(gyeol_map/current)과 같다.
const {execFile, execFileSync} = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const SEC = parseFloat(arg('sec', '10'));
const FPS = parseInt(arg('fps', '30'), 10);
const OUT = path.resolve(arg('out', '../../assets/instagram/update-2026-11/sky-reel.mp4'));
const SHELL = path.join(os.homedir(),
    'Library/Caches/ms-playwright/chromium_headless_shell-1243',
    'chrome-headless-shell-mac-arm64/chrome-headless-shell');
const FRAMES = path.join(os.tmpdir(), 'tita-sky-frames');
fs.rmSync(FRAMES, {recursive: true, force: true});
fs.mkdirSync(FRAMES, {recursive: true});

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Gowun;font-weight:400;src:url('fonts/GowunDodum-Regular.woff2') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box;font-weight:400}
html,body{width:1080px;height:1920px;overflow:hidden;background:#143329}
canvas{display:block}
</style></head><body><canvas id="c" width="1080" height="1920"></canvas>
<script>
const Q=new URLSearchParams(location.search); const T=parseFloat(Q.get('t')||'0'); const DUR=${SEC};
const W=1080,H=1920; const c=document.getElementById('c'); const g=c.getContext('2d');
// 결정적 난수
let seed=20261109; const rnd=()=> (seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff;
const CL=[ {c:[-.5,.36,.4],col:'#9ED8B4'}, {c:[.46,.46,-.42],col:'#D4B895'}, {c:[-.4,-.46,-.4],col:'#E8A98C'}, {c:[.5,-.4,.42],col:'#CBDACE'}, {c:[0,0,0],col:'#F1E7D4'} ];
const N=[24,22,21,22,22]; // 111
const P=[]; CL.forEach((cl,ci)=>{ for(let i=0;i<N[ci];i++){ const r=.12+rnd()*.3; const a=rnd()*Math.PI*2, b=(rnd()-.5)*Math.PI; P.push({x:cl.c[0]+Math.cos(a)*Math.cos(b)*r, y:cl.c[1]+Math.sin(b)*r*.8, z:cl.c[2]+Math.sin(a)*Math.cos(b)*r, ci, s:5+rnd()*6, tw:rnd()*6.28, al:.35+rnd()*.45}); } });
// 이름 붙는 별 — 지어낸 닉네임. 나(가운데)와 끌리는 별 셋은 선으로 잇는다.
const NAMES=[ {i:3,n:'봄날',star:true}, {i:29,n:'은행나무',star:true}, {i:48,n:'노을빛',star:true}, {i:75,n:'라일락'}, {i:15,n:'소나무'}, {i:60,n:'민들레'}, {i:68,n:'물빛'} ];
const ME=93;
// 카메라: 천천히 요(yaw) 회전 + 살짝 흔들림
const yaw=T*0.22, pitch=Math.sin(T*0.35)*0.08;
function proj(p){ let x=p.x,y=p.y,z=p.z; let cx=Math.cos(yaw),sx=Math.sin(yaw); let x1=x*cx+z*sx, z1=-x*sx+z*cx; let cy=Math.cos(pitch),sy=Math.sin(pitch); let y1=y*cy-z1*sy, z2=y*sy+z1*cy; const d=2.8/(2.8+z2); return {sx:W/2+x1*d*560, sy:H*0.45+y1*d*560, d, z:z2}; }
// 바탕
const bg=g.createLinearGradient(0,0,W,H); bg.addColorStop(0,'#1B4A3B'); bg.addColorStop(1,'#10291F'); g.fillStyle=bg; g.fillRect(0,0,W,H);
let gl=g.createRadialGradient(300,380,0,300,380,900); gl.addColorStop(0,'rgba(212,184,149,.13)'); gl.addColorStop(1,'rgba(212,184,149,0)'); g.fillStyle=gl; g.fillRect(0,0,W,H);
gl=g.createRadialGradient(900,1500,0,900,1500,800); gl.addColorStop(0,'rgba(193,90,60,.14)'); gl.addColorStop(1,'rgba(193,90,60,0)'); g.fillStyle=gl; g.fillRect(0,0,W,H);
// 전체 등장: 0~1.2초 동안 별이 모인다 (멀리서 중심으로)
const appear=Math.min(1,T/1.2); const ease=1-Math.pow(1-appear,3);
const pts=P.map((p,i)=>({...proj({x:p.x*(1.8-0.8*ease),y:p.y*(1.8-0.8*ease),z:p.z*(1.8-0.8*ease)}),p,i})).sort((a,b)=>a.z-b.z);
// 연결선 (나 ↔ 끌리는 별 셋) — 2.2초부터 그려진다
const me=pts.find(q=>q.i===ME); const lineT=Math.max(0,Math.min(1,(T-2.2)/1.2));
NAMES.filter(n=>n.star).forEach(n=>{ const q=pts.find(x=>x.i===n.i); g.strokeStyle='rgba(255,224,138,'+(0.45*lineT*ease)+')'; g.lineWidth=2; g.beginPath(); g.moveTo(me.sx,me.sy); g.lineTo(me.sx+(q.sx-me.sx)*lineT, me.sy+(q.sy-me.sy)*lineT); g.stroke(); });
// 점
pts.forEach(q=>{ const named=NAMES.find(n=>n.i===q.i); const isMe=q.i===ME; const r=(isMe?11:named?8.5:q.p.s*0.55)*q.d; const tw=0.75+0.25*Math.sin(T*1.7+q.p.tw); let a=q.p.al*tw*ease*(0.55+0.45*q.d);
  if(isMe||named){ const col=isMe?'#FFE08A':named.star?'#FFE08A':'#F7E6B8'; const glow=g.createRadialGradient(q.sx,q.sy,0,q.sx,q.sy,r*5); glow.addColorStop(0,'rgba(255,230,160,'+(0.55*ease)+')'); glow.addColorStop(1,'rgba(255,230,160,0)'); g.fillStyle=glow; g.beginPath(); g.arc(q.sx,q.sy,r*5,0,6.29); g.fill(); g.fillStyle=col; g.globalAlpha=ease; }
  else { g.fillStyle=CL[q.p.ci].col; g.globalAlpha=a; }
  g.beginPath(); g.arc(q.sx,q.sy,r,0,6.29); g.fill(); g.globalAlpha=1;
  if(isMe){ g.strokeStyle='rgba(255,224,138,'+(0.5*ease)+')'; g.lineWidth=2.5; g.beginPath(); g.arc(q.sx,q.sy,r+16+Math.sin(T*2)*3,0,6.29); g.stroke(); }
});
// 라벨 — 별 위에 떠서 살짝 오르내린다. 하나씩 차례로 뜬다(1.6초부터 0.5초 간격)
g.font='34px Gowun'; g.textBaseline='middle';
const placed=[];
function pill(x,y,text,alpha,me){ const pad=22; const w=g.measureText(text).width+pad*2, h=58; const bob=Math.sin(T*1.6+x*0.01)*6; let yy=y-54+bob;
  // 겹치면 위로. 꼬리는 별까지 길게 내린다
  const hit=(r)=>placed.some(q=>Math.abs(q.x-r.x)<(q.w+r.w)/2+14 && Math.abs(q.y-r.y)<h+10);
  let guard=0; while(hit({x,y:yy,w}) && guard++<6) yy-=h+14; placed.push({x,y:yy,w});
  g.globalAlpha=alpha; g.fillStyle='rgba(16,36,28,.78)'; g.strokeStyle=me?'rgba(255,224,138,.9)':'rgba(255,226,160,.45)'; g.lineWidth=me?2.5:1.5; const rx=x-w/2; g.beginPath(); g.roundRect(rx,yy-h/2,w,h,29); g.fill(); g.stroke();
  // 꼬리
  g.beginPath(); g.moveTo(x-9,yy+h/2-1); g.lineTo(x+9,yy+h/2-1); g.lineTo(x,yy+h/2+10); g.closePath(); g.fillStyle='rgba(16,36,28,.78)'; g.fill();
  if(y-yy>80){ g.strokeStyle='rgba(255,226,160,.35)'; g.lineWidth=1.5; g.beginPath(); g.moveTo(x,yy+h/2+10); g.lineTo(x,y+30); g.stroke(); }
  g.fillStyle=me?'#FFFFFF':'#FFF3CF'; g.textAlign='center'; g.fillText(text,x,yy+1); g.globalAlpha=1; }
const order=[ME,...NAMES.map(n=>n.i)];
order.forEach((idx,k)=>{ const q=pts.find(x=>x.i===idx); const t0=1.6+k*0.5; const a=Math.max(0,Math.min(1,(T-t0)/0.5)); if(a<=0) return; const n=NAMES.find(n=>n.i===idx); pill(q.sx,q.sy-10,idx===ME?'나':n.n,a*(0.6+0.4*q.d),idx===ME); });
// 로고 (카드와 같은 두 원 + 티타)
g.fillStyle='#C15A3C'; g.beginPath(); g.arc(108,118,24,0,6.29); g.fill(); g.fillStyle='#D4B895'; g.beginPath(); g.arc(136,118,24,0,6.29); g.fill();
g.fillStyle='#FBF7F0'; g.font='44px Gowun'; g.textAlign='left'; g.fillText('티타',178,120);
// 표제 — 0.6초부터 떠서 머문다
const tt=Math.max(0,Math.min(1,(T-0.6)/0.8)); g.globalAlpha=tt; g.textAlign='left';
g.font='64px Gowun'; g.fillStyle='#FBF7F0'; g.fillText('티타 안에 누가 있는지,',84,1500);
g.fillStyle='#D4B895'; g.fillText('하늘처럼 그렸어요',84,1584);
g.globalAlpha=1;
// 마무리 문구 — 6.5초부터
const ft=Math.max(0,Math.min(1,(T-6.5)/0.8)); g.globalAlpha=ft; g.font='36px Gowun'; g.fillStyle='#E6EFE8';
g.fillText('결큐 8개만 답하면 내 별이 떠요.',84,1690); g.fillStyle='#9FB6A6'; g.font='30px Gowun'; g.fillText('45세 이상 또래 · @titakorea · tita-app.com',84,1750); g.globalAlpha=1;
// 처음·끝 페이드 (반복 재생이 매끄럽게)
const fade=Math.min(1, T/0.5, (DUR-T)/0.5); if(fade<1){ g.fillStyle='rgba(16,41,31,'+(1-Math.max(0,fade))+')'; g.fillRect(0,0,W,H); }
</script></body></html>`;
const htmlPath = path.join(__dirname, '_sky.html');
fs.writeFileSync(htmlPath, HTML);

const total = Math.round(SEC * FPS);
const jobs = Array.from({length: total}, (_, i) => i);
const CONC = 6;
let done = 0;
function shot(i) {
  return new Promise((res, rej) => {
    const t = (i / FPS).toFixed(4);
    const out = path.join(FRAMES, `f${String(i).padStart(4, '0')}.png`);
    execFile(SHELL, ['--headless', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      '--window-size=1080,1920', '--virtual-time-budget=1200', `--screenshot=${out}`,
      'file://' + htmlPath + '?t=' + t], (e) => { if (e) return rej(e); done++; if (done % 30 === 0) process.stdout.write(`  ${done}/${total}\n`); res(); });
  });
}
(async () => {
  console.log(`프레임 ${total}장 (${SEC}s × ${FPS}fps), 동시 ${CONC}`);
  let next = 0;
  await Promise.all(Array.from({length: CONC}, async () => { while (next < total) { const i = next++; await shot(i); } }));
  fs.mkdirSync(path.dirname(OUT), {recursive: true});
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FRAMES, 'f%04d.png'),
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '96k', '-shortest', '-movflags', '+faststart', OUT], {stdio: 'inherit'});
  // 표지 = 4초 지점
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', path.join(FRAMES, `f${String(Math.round(4 * FPS)).padStart(4, '0')}.png`), '-q:v', '3', OUT.replace(/\.mp4$/, '-cover.jpg')], {stdio: 'inherit'});
  fs.unlinkSync(htmlPath);
  console.log('끝.', OUT);
})().catch((e) => { console.error(e); process.exit(1); });
