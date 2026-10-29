// 카드 세트 → 릴스 영상 (1080×1920, MP4 H.264 + 무음 AAC)
//
//   node scripts/cards/gen-reel.cjs <slug> [--sec 2.8] [--music path.m4a]
//   → assets/instagram/<slug>/reel.mp4 (+ reel-cover.jpg)
//
// 카드(4:5)를 9:16 바탕에 얹고 장마다 살짝 확대(켄 번스)하면서 0.5초 크로스페이드로 넘긴다.
// 표지 테마 색을 바탕으로 깐다. 음악은 기본 무음 — 릴스는 오디오 트랙이 있어야 안전해서
// 무음 AAC를 넣는다. 음원을 쓰려면 저작권이 깨끗한 파일을 --music으로.
// ffmpeg 필요(brew install ffmpeg). Playwright 번들 ffmpeg는 WebM만 만들어 못 쓴다.
const {execFileSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
if (!slug) { console.error('쓰는 법: node gen-reel.cjs <slug> [--sec 2.8] [--music file]'); process.exit(1); }
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const SEC = parseFloat(arg('sec', '2.8'));   // 장당 노출
const FADE = 0.5;
const MUSIC = arg('music', null);

const ROOT = path.resolve(__dirname, '../..');
const DIR = path.join(ROOT, 'assets/instagram', slug);
const set = JSON.parse(fs.readFileSync(path.join(DIR, 'set.json'), 'utf8'));
const THEME_BG = {forest: '#143329', cream: '#F3EBDD', terracotta: '#6B3A2A', plum: '#3F2A3C', teal: '#1F4556'};
const BG = (THEME_BG[set.theme] || '#143329').replace('#', '0x');

const cards = fs.readdirSync(DIR).filter((f) => /^card-\d+\.jpe?g$/.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
if (cards.length < 2) { console.error('카드가 2장 미만'); process.exit(1); }

const W = 1080, H = 1920, FPS = 30;
const frames = Math.round(SEC * FPS);
// 각 입력: 정지 이미지 → 켄 번스(1.00→1.06) → 9:16 바탕에 가운데 배치
const inputs = [];
const filters = [];
cards.forEach((f, i) => {
  inputs.push('-loop', '1', '-t', String(SEC), '-i', path.join(DIR, f));
  // zoompan은 큰 캔버스에서 돌려야 떨림이 적다 → 2배로 키운 뒤 다시 줄인다
  filters.push(
    `[${i}:v]scale=2160:2700,zoompan=z='min(zoom+0.0004,1.06)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1350:fps=${FPS},` +
    `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${BG},format=yuv420p,setsar=1[v${i}]`);
});
// 크로스페이드 체인
let prev = 'v0';
let offset = 0;
for (let i = 1; i < cards.length; i++) {
  offset += SEC - FADE;
  const out = i === cards.length - 1 ? 'vout' : `x${i}`;
  filters.push(`[${prev}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset.toFixed(3)}[${out}]`);
  prev = out;
}
const total = cards.length * SEC - (cards.length - 1) * FADE;

const out = path.join(DIR, 'reel.mp4');
const args = ['-y', '-hide_banner', '-loglevel', 'error', ...inputs];
if (MUSIC) args.push('-stream_loop', '-1', '-i', MUSIC);
else args.push('-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100');
args.push('-filter_complex', filters.join(';'),
  '-map', '[vout]', '-map', `${cards.length}:a`,
  '-t', total.toFixed(3),
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  '-c:a', 'aac', '-b:a', '128k', '-ar', '44100',
  '-movflags', '+faststart', '-shortest', out);
execFileSync('ffmpeg', args, {stdio: 'inherit'});
// 커버: 표지 카드를 9:16에 얹은 것
execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', path.join(DIR, cards[0]),
  '-vf', `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${BG}`, '-q:v', '3', path.join(DIR, 'reel-cover.jpg')], {stdio: 'inherit'});
const mb = (fs.statSync(out).size / 1048576).toFixed(1);
console.log(`끝. assets/instagram/${slug}/reel.mp4 (${cards.length}장 · ${total.toFixed(1)}초 · ${mb}MB) + reel-cover.jpg`);
