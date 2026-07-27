// 앱 화면 미리보기 — 목업(오늘의 결Q / 티타임 / 결친구 프로필)을 홈에 노출.
// 마크업은 SVG가 많아 dangerouslySetInnerHTML로 그대로 이식하고, CSS는
// `.tap-root` 스코프로 격리해 홈 전역 스타일과 충돌하지 않게 한다.
// 원본 목업: scratchpad/tita_app_mockups.html
import { TITA } from "./tita-brand";

const STYLE = `.tap-root{--forest:#1F4E3D; --forest-deep:#143329; --forest-mid:#3A6B58;
    --gold:#8A6D38; --cream:#FBF7F0; --surface:#F2EDE3;
    --tint:#EAF1EA;         /* 세이지 틴트 카드/칩 */
    --tint-line:#DCE7DC;
    --track:#E4EDE3;        /* 매치 바 트랙 (실제 앱 값) */
    --sage:#D6E2D8; --sage-line:#E7EEE7;
    --camel:#D4B895; --camel-soft:#EFE4D2;
    --ink:#1A2E26; --muted:#6B7D6E; --muted-soft:#9CA89E;
    --font:"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;}
.tap-root *{box-sizing:border-box;margin:0;padding:0}
.tap-root{font-family:var(--font);word-break:keep-all;-webkit-font-smoothing:antialiased}
.tap-root .rack{display:flex;flex-wrap:wrap;gap:46px 40px;justify-content:center;align-items:flex-start}
.tap-root .stage{display:flex;flex-direction:column;align-items:center;gap:16px}
.tap-root .stage .caption{font-size:13.5px;font-weight:700;color:var(--forest)}
.tap-root .phone{width:312px;background:var(--forest-deep);border-radius:46px;padding:11px;
    box-shadow:0 30px 60px -24px rgba(20,51,41,.45),0 6px 16px -8px rgba(20,51,41,.3)}
.tap-root .screen{position:relative;background:var(--cream);border-radius:36px;overflow:hidden;
    height:660px;display:flex;flex-direction:column}
.tap-root .notch{position:absolute;top:9px;left:50%;transform:translateX(-50%);width:104px;height:26px;border-radius:0 0 16px 16px;background:var(--forest-deep);z-index:8}
.tap-root .statusbar{display:flex;justify-content:space-between;align-items:center;padding:15px 24px 0;font-size:13px;font-weight:800;color:var(--ink)}
.tap-root .statusbar .r{display:flex;gap:6px;align-items:center;color:var(--ink)}
.tap-root .statusbar .batt{width:22px;height:11px;border:1.5px solid var(--ink);border-radius:3px;position:relative}
.tap-root .statusbar .batt::after{content:"";position:absolute;inset:2px;background:var(--ink);border-radius:1px}
.tap-root .scroll{flex:1;overflow:hidden;padding:0 16px}
.tap-root .scroll::-webkit-scrollbar{display:none}
.tap-root /* ── header ── */
  .apphead{display:flex;justify-content:space-between;align-items:center;padding:10px 4px 14px}
.tap-root .wordmark{font-size:24px;font-weight:800;letter-spacing:-.02em;color:var(--forest)}
.tap-root .wordmark .en{color:var(--gold);font-size:20px;margin-left:2px}
.tap-root .apphead .ic{display:flex;gap:16px;align-items:center;color:var(--ink)}
.tap-root .apphead .bell{position:relative}
.tap-root .apphead .badge{position:absolute;top:-5px;right:-6px;background:#E45858;color:#fff;font-size:9px;font-weight:800;min-width:15px;height:15px;border-radius:999px;display:grid;place-items:center;padding:0 3px}
.tap-root .card{background:#fff;border:1px solid var(--sage-line);border-radius:22px;padding:18px;
    box-shadow:0 6px 18px -10px rgba(31,78,61,.12);margin-bottom:14px}
.tap-root /* 결Q */
  .kq-label{font-size:12px;font-weight:800;letter-spacing:.02em;color:var(--gold)}
.tap-root .kq-q{margin-top:6px;font-size:19px;font-weight:800;line-height:1.32;letter-spacing:-.02em;color:var(--ink)}
.tap-root .kq-opts{display:flex;flex-direction:column;gap:8px;margin-top:12px}
.tap-root .opt{display:flex;align-items:center;gap:12px;padding:15px 16px;border-radius:16px;background:#F5F8F4;border:1px solid #E1EADF}
.tap-root .opt .radio{width:20px;height:20px;border-radius:999px;border:1.8px solid #B6CDB4;flex:none}
.tap-root .opt span{font-size:15.5px;font-weight:600;color:var(--ink);line-height:1.35}
.tap-root .foot{margin-top:13px;font-size:12px;font-weight:500;color:var(--muted)}
.tap-root /* 티타임 (세이지 카드) */
  .tt{background:var(--tint);border:1px solid var(--tint-line);border-radius:22px;padding:18px;margin-bottom:14px}
.tap-root .tt-label{font-size:12.5px;font-weight:800;color:var(--forest-mid)}
.tap-root .tt-title{margin-top:5px;font-size:19px;font-weight:800;letter-spacing:-.02em;color:var(--ink)}
.tap-root .tt-sub{margin-top:8px;font-size:13.5px;line-height:1.55;color:var(--muted)}
.tap-root .tt-btn{width:100%;margin-top:16px;padding:15px;border-radius:16px;border:none;background:var(--forest);color:var(--cream);
    font-family:var(--font);font-size:16px;font-weight:800;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:8px}
.tap-root /* 사람 카드 */
  .sec-h{font-size:18px;font-weight:800;letter-spacing:-.02em;color:var(--ink);margin:6px 2px 12px}
.tap-root .person .p-top{display:flex;gap:12px;align-items:flex-start}
.tap-root .avatar{width:52px;height:52px;border-radius:999px;flex:none;display:grid;place-items:center;
    font-size:20px;font-weight:800;color:var(--forest);background:linear-gradient(150deg,#D3E2D4,#BAD0BC)}
.tap-root .p-mid{flex:1;min-width:0}
.tap-root .p-name{font-size:16.5px;font-weight:800;color:var(--ink)}
.tap-root .p-name span{font-size:13px;font-weight:600;color:var(--muted);margin-left:5px}
.tap-root .p-desc{margin-top:5px;font-size:14px;line-height:1.5;color:var(--ink)}
.tap-root .wave{width:44px;height:44px;border-radius:999px;flex:none;border:1.5px solid var(--sage);background:#fff;color:var(--forest-mid);display:grid;place-items:center}
.tap-root .p-hr{height:1px;background:var(--sage-line);margin:14px 0 11px}
.tap-root .p-int{font-size:13px;font-weight:600;color:var(--muted)}
.tap-root /* tab bar (3) */
  .tabbar{display:flex;justify-content:space-around;align-items:center;padding:11px 6px 15px;border-top:1px solid var(--sage-line);background:#fff}
.tap-root .tab{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--muted-soft)}
.tap-root .tab svg{width:24px;height:24px}
.tap-root .tab.on{color:var(--forest)}
.tap-root /* ── profile ── */
  .pf-bar{display:flex;justify-content:space-between;align-items:center;padding:10px 4px 8px;color:var(--ink)}
.tap-root .pf-head{display:flex;gap:15px;padding:4px 2px 12px;align-items:flex-start}
.tap-root .pf-photo{width:78px;height:78px;border-radius:999px;flex:none;position:relative;display:grid;place-items:center;
    font-size:30px;font-weight:800;color:var(--forest);background:linear-gradient(150deg,#D3E2D4,#B4CCB7)}
.tap-root .pf-img{width:100%;height:100%;object-fit:cover;border-radius:999px}
.tap-root .pf-check{position:absolute;right:-1px;bottom:-1px;width:24px;height:24px;border-radius:999px;background:var(--forest);color:#fff;display:grid;place-items:center;border:2.5px solid var(--cream)}
.tap-root .pf-name{font-size:20px;font-weight:800;color:var(--ink)}
.tap-root .pf-name span{font-size:15px;font-weight:600;color:var(--muted);margin-left:6px}
.tap-root .pf-loc{display:flex;align-items:center;gap:4px;margin-top:5px;font-size:13.5px;font-weight:600;color:var(--muted)}
.tap-root .pf-desc{margin-top:10px;font-size:13.5px;line-height:1.55;color:var(--ink)}
.tap-root .pf-desc b{color:var(--forest);font-weight:700}
.tap-root .match{background:#fff;border:1px solid var(--sage-line);border-radius:22px;padding:15px;box-shadow:0 6px 18px -10px rgba(31,78,61,.12)}
.tap-root .m-top{display:flex;gap:14px;align-items:center}
.tap-root .ring{width:62px;height:62px;flex:none;position:relative}
.tap-root .ring .pct{position:absolute;inset:0;display:grid;place-items:center;font-size:15px;font-weight:800;color:var(--forest)}
.tap-root .m-label{font-size:12px;font-weight:800;color:var(--gold)}
.tap-root .m-title{margin-top:3px;font-size:18px;font-weight:800;letter-spacing:-.02em;color:var(--ink)}
.tap-root .m-sub{margin-top:3px;font-size:12.5px;color:var(--muted)}
.tap-root .m-bar{display:flex;align-items:center;gap:12px;margin-top:11px}
.tap-root .m-bar .lbl{width:86px;flex:none;font-size:13px;font-weight:700;color:var(--ink);white-space:nowrap}
.tap-root .m-bar .track{flex:1;height:9px;border-radius:999px;background:var(--track);overflow:hidden}
.tap-root .m-bar .fill{display:block;height:100%;border-radius:999px;background:var(--forest)}
.tap-root .m-bar .fill.camel{background:var(--camel)}
.tap-root .m-bar .val{width:40px;flex:none;text-align:right;font-size:13px;font-weight:800;color:var(--ink)}
.tap-root .m-hr{height:1px;background:var(--sage-line);margin:12px 0}
.tap-root .m-ov{font-size:13.5px;font-weight:800;color:var(--ink)}
.tap-root .ov-chips{display:flex;flex-wrap:nowrap;gap:5px;margin-top:9px;overflow-x:auto}
.tap-root .ov-chips::-webkit-scrollbar{display:none}
.tap-root .ov-chip{flex:none;white-space:nowrap;font-size:11.5px;font-weight:700;color:var(--forest);background:var(--tint);border:1px solid var(--tint-line);padding:6px 9px;border-radius:999px}
.tap-root .ai-note{display:flex;gap:11px;background:var(--tint);border-radius:16px;padding:12px;margin-top:11px}
.tap-root .ai-badge{width:26px;height:26px;flex:none;border-radius:999px;background:var(--forest);color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center}
.tap-root .ai-note p{font-size:13.5px;line-height:1.55;color:var(--ink)}
.tap-root .pf-cta{display:flex;align-items:center;gap:12px;margin-top:16px}
.tap-root .lock{display:flex;flex-direction:column;align-items:center;gap:3px;color:var(--muted-soft);font-size:10.5px;font-weight:600;text-align:center;flex:1;line-height:1.3}
.tap-root .send{padding:15px 22px;border-radius:999px;border:none;background:var(--forest);color:var(--cream);
    font-family:var(--font);font-size:16px;font-weight:800;display:flex;align-items:center;gap:8px;white-space:nowrap}`;
const MARKUP = `<div class="rack">

    <!-- 1. 홈 -->
    <div class="stage">
      <div class="phone">
        <div class="screen">
          <div class="notch"></div>
          <div class="statusbar">
            <span>3:22</span>
            <span class="r">
              <svg width="17" height="12" viewBox="0 0 24 18" fill="currentColor"><path d="M12 3c3.9 0 7.4 1.5 10 4l-2 2a11 11 0 0 0-16 0L2 7a14 14 0 0 1 10-4z" opacity=".9"/><path d="M12 9c1.9 0 3.6.8 4.9 2L12 16l-4.9-5A7 7 0 0 1 12 9z"/></svg>
              <span class="batt"></span>
            </span>
          </div>
          <div class="scroll">
            <div class="apphead">
              <div class="wordmark">티타 <span class="en">[TITA]</span></div>
              <div class="ic">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v5" stroke-linecap="round"/><circle cx="12" cy="8" r=".9" fill="currentColor" stroke="none"/></svg>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                <span class="bell">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.5 21a2 2 0 0 1-3 0"/></svg>
                  <span class="badge">26</span>
                </span>
              </div>
            </div>

            <div class="card">
              <div class="kq-label">오늘의 결Q</div>
              <div class="kq-q">물건이나 관계나, 나는?</div>
              <div class="kq-opts">
                <div class="opt"><span class="radio"></span><span>정리하고 단순하게</span></div>
                <div class="opt"><span class="radio"></span><span>두루 품고 가는 편</span></div>
              </div>
              <div class="foot">답할수록 결친구를 더 잘 찾아드려요</div>
            </div>

            <div class="tt">
              <div class="tt-label">티타임</div>
              <div class="tt-title">낮에, 결 맞는 또래와 만나요</div>
              <div class="tt-sub">만나고 싶은 동네·시간만 골라두면,<br>자리가 열릴 때 알려드려요.</div>
              <button class="tt-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                만날 동네 고르기
              </button>
            </div>

            <div class="sec-h">이런 분들이 계세요</div>
            <div class="card person">
              <div class="p-top">
                <div class="avatar">황</div>
                <div class="p-mid">
                  <div class="p-name">황정희<span>(59세 | 울산)</span></div>
                  <div class="p-desc">인생 중반을 살았는데,<br>애들도 다 커서 멀리 있다 보니…</div>
                </div>
                <button class="wave">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V7a1.6 1.6 0 0 0-3.2 0M14.8 10V5a1.6 1.6 0 0 0-3.2 0v5M11.6 10.5V6.5a1.6 1.6 0 0 0-3.2 0V13"/><path d="M18 8.5a1.6 1.6 0 0 1 3.2 0c0 3-1 7.5-4.5 9.3-1.3.7-3 .9-4.3.9a6 6 0 0 1-6-5.2l-.4-2a1.6 1.6 0 0 1 2.9-1.3l1 1.6"/></svg>
                </button>
              </div>
              <div class="p-hr"></div>
              <div class="p-int">동네 산책 · 미술관 · 요리 · 반려식물</div>
            </div>
          </div>

          <div class="tabbar">
            <div class="tab on">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>홈</div>
            <div class="tab">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8 8 0 0 1-11.5 7.2L3 20.5l1.8-6A8 8 0 1 1 21 11.5z"/></svg>채팅</div>
            <div class="tab">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><circle cx="9" cy="10" r=".9" fill="currentColor" stroke="none"/><circle cx="15" cy="10" r=".9" fill="currentColor" stroke="none"/></svg>마이</div>
          </div>
        </div>
      </div>
      <div class="caption">홈 — 결Q · 티타임 · 결친구</div>
    </div>

    <!-- 2. 결친구 프로필 -->
    <div class="stage">
      <div class="phone">
        <div class="screen">
          <div class="notch"></div>
          <div class="statusbar">
            <span>3:22</span>
            <span class="r">
              <svg width="17" height="12" viewBox="0 0 24 18" fill="currentColor"><path d="M12 3c3.9 0 7.4 1.5 10 4l-2 2a11 11 0 0 0-16 0L2 7a14 14 0 0 1 10-4z" opacity=".9"/><path d="M12 9c1.9 0 3.6.8 4.9 2L12 16l-4.9-5A7 7 0 0 1 12 9z"/></svg>
              <span class="batt"></span>
            </span>
          </div>
          <div class="scroll">
            <div class="pf-bar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>
            </div>

            <div class="pf-head">
              <div class="pf-photo"><img class="pf-img" src="/avatars/woman_51.jpg" alt="이현숙">
                <span class="pf-check"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
              </div>
              <div style="flex:1;min-width:0">
                <div class="pf-name">이현숙<span>56세</span></div>
                <div class="pf-loc">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                  서울 은평구
                </div>
                <div class="pf-desc">은퇴하고 나서 등산이랑 서예를 다시 시작했어요. 조용히 오래 사귀는 걸 좋아합니다. <b>더보기</b></div>
              </div>
            </div>

            <div class="match">
              <div class="m-top">
                <div class="ring">
                  <svg width="62" height="62" viewBox="0 0 62 62">
                    <circle cx="31" cy="31" r="26" fill="none" stroke="#E4EDE3" stroke-width="7"/>
                    <circle cx="31" cy="31" r="26" fill="none" stroke="#1F4E3D" stroke-width="7" stroke-linecap="round"
                      stroke-dasharray="163.4" stroke-dashoffset="26.1" transform="rotate(-90 31 31)"/>
                  </svg>
                  <span class="pct">84%</span>
                </div>
                <div>
                  <div class="m-label">결 매치</div>
                  <div class="m-title">결이 잘 통해요</div>
                  <div class="m-sub">대화 결이 특히 비슷한 사이예요</div>
                </div>
              </div>
              <div class="m-bar">
                <span class="lbl">대화 결 (AI)</span>
                <span class="track"><span class="fill" style="width:84%"></span></span>
                <span class="val">84%</span>
              </div>
              <div class="m-bar">
                <span class="lbl">취향 결</span>
                <span class="track"><span class="fill camel" style="width:67%"></span></span>
                <span class="val">67%</span>
              </div>
              <div class="m-hr"></div>
              <div class="m-ov">관심 겹침 · 4개</div>
              <div class="ov-chips">
                <span class="ov-chip">등산</span>
                <span class="ov-chip">서예</span>
                <span class="ov-chip">트로트</span>
                <span class="ov-chip">텃밭 가꾸기</span>
              </div>
            </div>

            <div class="ai-note">
              <span class="ai-badge">AI</span>
              <p>천천히 깊게 사귀는 걸 좋아하고, 혼자만의 취미 시간도 소중히 여기는 점이 두 분 다 닮았어요.</p>
            </div>
          </div>

          <div style="padding:12px 16px 16px;border-top:1px solid var(--sage-line);background:#fff">
            <div class="pf-cta">
              <div class="lock">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                게시글은 결친구가<br>되면 볼 수 있어요
              </div>
              <button class="send">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V7a1.6 1.6 0 0 0-3.2 0M14.8 10V5a1.6 1.6 0 0 0-3.2 0v5M11.6 10.5V6.5a1.6 1.6 0 0 0-3.2 0V13"/><path d="M18 8.5a1.6 1.6 0 0 1 3.2 0c0 3-1 7.5-4.5 9.3-1.3.7-3 .9-4.3.9a6 6 0 0 1-6-5.2l-.4-2a1.6 1.6 0 0 1 2.9-1.3l1 1.6"/></svg>
                인사 보내기
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="caption">결친구 프로필 — 결 매치 · AI 코멘트</div>
    </div>

  </div>`;

export function AppPreview() {
  return (
    <section
      className="py-16 sm:py-20 border-t"
      style={{ backgroundColor: TITA.surface, borderColor: TITA.sage }}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-6 text-center">
        <p
          className="text-xs font-semibold tracking-wide mb-2.5"
          style={{ color: TITA.forest }}
        >
          미리 보기
        </p>
        <h2
          className="text-xl sm:text-2xl font-bold mb-3 leading-snug"
          style={{ color: TITA.ink, letterSpacing: "-0.015em" }}
        >
          앱은 이렇게 생겼어요
        </h2>
        <p className="text-sm sm:text-base mb-2" style={{ color: TITA.muted }}>
          질문에 답하며 결을 쌓고 · 낮에 가볍게 만나고 · 결이 맞는 또래를 만나요.
        </p>
      </div>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div
        className="tap-root mt-8"
        style={{ display: "flex", justifyContent: "center" }}
        dangerouslySetInnerHTML={{ __html: MARKUP }}
      />
    </section>
  );
}
