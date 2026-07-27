// "이런 분들을 만나요" — 결 맞는 45+ 또래 예시 프로필 벽. 소극적 다수가
// "나 같은 사람들이 여기 있네" 를 느끼게. 마크업은 dangerouslySetInnerHTML로,
// CSS는 .tpw-root 스코프. 아바타는 public/avatars/p1~7.jpg. 원본: scratchpad/tita_wall.html
const STYLE = `.tpw-root{--forest:#1F4E3D; --forest-mid:#3A6B58; --cream:#FBF7F0; --surface:#F2EDE3;
    --sage:#D6E2D8; --sage-line:#E7EEE7; --camel:#D4B895; --gold:#8A6D38;
    --ink:#1A2E26; --muted:#6B7D6E; --muted-soft:#9CA89E;
    --font:"Pretendard",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;}
.tpw-root *{box-sizing:border-box;margin:0;padding:0}
.tpw-root{font-family:var(--font);color:var(--ink);word-break:keep-all;-webkit-font-smoothing:antialiased;background:var(--surface);padding:56px 22px 72px}
.tpw-root .head{text-align:center;max-width:620px;margin:0 auto 40px}
.tpw-root .head .eyebrow{font-size:12.5px;font-weight:800;letter-spacing:.14em;color:var(--forest-mid);text-transform:uppercase;margin-bottom:11px}
.tpw-root .head h1{font-size:clamp(26px,5vw,34px);font-weight:800;letter-spacing:-.02em;color:var(--ink);line-height:1.3;text-wrap:balance}
.tpw-root .head p{margin-top:11px;font-size:14.5px;color:var(--muted);line-height:1.6}
.tpw-root .grid{max-width:760px;margin:0 auto;display:flex;flex-wrap:wrap;gap:16px;justify-content:center}
.tpw-root .grid .card{width:calc(50% - 8px)}
.tpw-root .card{background:#fff;border:1px solid var(--sage-line);border-radius:20px;padding:18px;
    box-shadow:0 6px 18px -12px rgba(31,78,61,.14);display:flex;flex-direction:column}
.tpw-root .top{display:flex;align-items:center;gap:12px}
.tpw-root .av{width:54px;height:54px;border-radius:999px;flex:none;overflow:hidden;background:var(--sage)}
.tpw-root .av img{width:100%;height:100%;object-fit:cover}
.tpw-root .who{flex:1;min-width:0}
.tpw-root .name{font-size:16.5px;font-weight:800;color:var(--ink)}
.tpw-root .name span{font-size:13px;font-weight:600;color:var(--muted);margin-left:6px}
.tpw-root .tag{display:inline-block;margin-top:5px;font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px}
.tpw-root .tag.new{color:var(--forest);background:var(--surface)}
.tpw-root .tag.tea{color:var(--gold);background:#F3ECDD}
.tpw-root .quote{margin:13px 0 0;font-size:14.5px;line-height:1.55;color:var(--ink)}
.tpw-root .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:13px;padding-top:13px;border-top:1px solid var(--sage-line)}
.tpw-root .chip{font-size:12.5px;font-weight:600;color:var(--forest-mid);background:var(--cream);border:1px solid var(--sage);padding:5px 11px;border-radius:999px}
.tpw-root .foot{text-align:center;margin-top:36px;font-size:14px;color:var(--muted)}
.tpw-root .foot b{color:var(--forest);font-weight:800}
.tpw-root .note{text-align:center;margin-top:10px;font-size:11.5px;color:var(--muted-soft)}
@media(max-width:560px){.tpw-root .grid .card{width:100%}}`;
const MARKUP = `<div class="head">
    <div class="eyebrow">티타 · 지금 여기</div>
    <h1>이런 분들을 만나요</h1>
    <p>같은 시기를 지나는, 같은 마음의 또래가 여기 있어요.<br>활발하지 않아도 괜찮아요.</p>
  </div>

  <div class="grid">

    <div class="card">
      <div class="top">
        <div class="av"><img src="/avatars/p1.jpg" alt="이현숙"></div>
        <div class="who"><div class="name">이현숙<span>56 · 은평</span></div></div>
      </div>
      <p class="quote">"은퇴하고 서예를 다시 시작했어요. 조용히 오래 사귀는 걸 좋아해요."</p>
      <div class="chips"><span class="chip">서예</span><span class="chip">등산</span><span class="chip">클래식</span></div>
    </div>

    <div class="card">
      <div class="top">
        <div class="av"><img src="/avatars/p2.jpg" alt="김정순"></div>
        <div class="who"><div class="name">김정순<span>61 · 부산</span></div><span class="tag new">새로 왔어요</span></div>
      </div>
      <p class="quote">"산에 혼자 다니는 것도, 하루 이틀이지."</p>
      <div class="chips"><span class="chip">등산</span><span class="chip">사진</span><span class="chip">트로트</span></div>
    </div>

    <div class="card">
      <div class="top">
        <div class="av"><img src="/avatars/p3.jpg" alt="박미영"></div>
        <div class="who"><div class="name">박미영<span>49 · 분당</span></div></div>
      </div>
      <p class="quote">"애들 대학 보내고 나니 시간이 확 생겼는데, 다들 바쁘더라고요."</p>
      <div class="chips"><span class="chip">필라테스</span><span class="chip">전시</span><span class="chip">와인</span></div>
    </div>

    <div class="card">
      <div class="top">
        <div class="av"><img src="/avatars/p4.jpg" alt="정말순"></div>
        <div class="who"><div class="name">정말순<span>68 · 대구</span></div></div>
      </div>
      <p class="quote">"손주 보는 낙으로 살았는데, 이제 걔들도 크네요."</p>
      <div class="chips"><span class="chip">텃밭</span><span class="chip">트로트</span><span class="chip">산책</span></div>
    </div>

    <div class="card">
      <div class="top">
        <div class="av"><img src="/avatars/p5.jpg" alt="최경자"></div>
        <div class="who"><div class="name">최경자<span>53 · 인천</span></div><span class="tag tea">이번 주 찻자리</span></div>
      </div>
      <p class="quote">"남편 따라 낯선 동네로 이사 왔어요. 여긴 아는 사람이 없네요."</p>
      <div class="chips"><span class="chip">요리</span><span class="chip">반려식물</span><span class="chip">드라마</span></div>
    </div>

    <div class="card">
      <div class="top">
        <div class="av"><img src="/avatars/p6.jpg" alt="한영미"></div>
        <div class="who"><div class="name">한영미<span>59 · 광주</span></div></div>
      </div>
      <p class="quote">"새 사람 사귀는 거 어색한데… 그래도 마음 맞는 친구 하나쯤은."</p>
      <div class="chips"><span class="chip">독서</span><span class="chip">뜨개</span><span class="chip">카페</span></div>
    </div>

    <div class="card">
      <div class="top">
        <div class="av"><img src="/avatars/p7.jpg" alt="박영수"></div>
        <div class="who"><div class="name">박영수<span>61 · 대구</span></div></div>
      </div>
      <p class="quote">"혼자 밥 먹는 게 익숙해졌지만, 가끔은 말동무가 그립죠."</p>
      <div class="chips"><span class="chip">바둑</span><span class="chip">산책</span><span class="chip">다큐멘터리</span></div>
    </div>

  </div>

  <p class="foot"><b>45세 이상, 검증된 또래끼리 친구가 되는 앱</b> — 티타</p>
  <p class="note">* 서비스 이해를 돕기 위한 예시 프로필이에요 (실제 회원 아님).</p>`;

export function PeopleWall() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="tpw-root" dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </>
  );
}
