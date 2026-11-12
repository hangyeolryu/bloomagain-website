// 꿈 인터뷰(/dream) ↔ 백엔드 POST /api/v1/dream/web-turn.
//
// 인증은 /needs 이벤트와 같다 — 무가입 웹이라 토큰·App Check·tenant 헤더가 없다.
// 백엔드가 IP별 한도·세션 상한·숨은 칸·LLM 하루 상한으로 막는다.
// 다른 점 하나: needs 이벤트는 실패해도 그만(fire-and-forget)이지만, 여기는 답이
// 곧 화면이라 결과를 돌려주고 실패를 화면이 다룬다(다시 보내기).

// 첫 말 — 백엔드 app/services/dream_web_interview.py 의 OPENING과 같은 문장이어야 한다.
// 서버를 기다리지 않고 바로 보여 준다. 예전엔 첫 말까지 서버 왕복(+ Cloud Run 냉시동)을
// 기다려 몇 초씩 빈 화면이었다(2026-11-12 대표 확인). 세션은 첫 답을 보낼 때 서버가 만든다.
export const DREAM_OPENING =
  "안녕하세요, 저는 티타AI예요.\n\n" +
  "마음이 진짜 원하는 게 뭔지, 같이 찾아보려고 해요. 몇 가지 여쭤볼게요. " +
  "언제든 '그만'이라고 하시면 바로 멈출게요. " +
  "이름이나 전화번호 같은 개인정보는 말씀하지 않으셔도 돼요.\n\n" +
  "요즘 해 보고 싶은데 미뤄두신 게 있으세요? 시간 가는 줄 모르고 했던 일이어도 좋아요. " +
  "생각나는 대로 편하게 이야기해 주세요.";

export type DreamStatus = "active" | "completed" | "stopped" | "crisis";

export type DreamTurnResult =
  | { ok: true; reply: string; done: boolean; turn: number; status: DreamStatus }
  // limited = 잠깐 많이 보냈다(429). 다시 보내기 전에 쉬라고 말해야 해서 따로 둔다.
  | { ok: false; reason: "network" | "limited" | "server" };

const SID_KEY = "dream_sid";

// 세션 아이디 — 사람을 가리키지 않는 난수. 백엔드 규칙: 16–64자 [A-Za-z0-9_-].
// sessionStorage에 두는 이유: 새로고침해도 같은 대화를 이어가되, 탭을 닫으면
// 잊는다(같은 기기를 쓰는 가족에게 지난 이야기가 이어지지 않게).
function newSessionId(): string {
  const bytes = new Uint8Array(18);
  try {
    crypto.getRandomValues(bytes);
  } catch {
    // 아주 오래된 웹뷰. 보안 토큰이 아니라 대화 구분용이라 이걸로도 충분하다.
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function getDreamSessionId(): string {
  try {
    const saved = window.sessionStorage.getItem(SID_KEY);
    if (saved && /^[A-Za-z0-9_-]{16,64}$/.test(saved)) return saved;
    const sid = newSessionId();
    window.sessionStorage.setItem(SID_KEY, sid);
    return sid;
  } catch {
    // 프라이빗 모드 등으로 저장이 막혀도 대화는 된다 — 새로고침하면 새로 시작할 뿐.
    return newSessionId();
  }
}

export async function sendDreamTurn(body: {
  sessionId: string;
  message: string | null;
  utm: Record<string, string>;
  hp: string;
}): Promise<DreamTurnResult> {
  const backendUrl = process.env.NEXT_PUBLIC_BLOOMAGAIN_BACKEND_URL;
  if (!backendUrl) return { ok: false, reason: "server" };
  // 마지막 답에는 백엔드가 요약까지 만들어 모델을 두 번 부른다. 넉넉히 기다린다.
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 40_000);
  try {
    const res = await fetch(`${backendUrl.replace(/\/$/, "")}/api/v1/dream/web-turn`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: body.sessionId,
        message: body.message,
        utm: body.utm,
        hp: body.hp,
      }),
      signal: ctrl.signal,
    });
    if (res.status === 429) return { ok: false, reason: "limited" };
    // 409 = 이미 끝난 대화. 에러가 아니라 "끝났다"는 답이라 똑같이 화면에 싣는다.
    if (!res.ok && res.status !== 409) return { ok: false, reason: "server" };
    const data = (await res.json()) as {
      reply?: string;
      done?: boolean;
      turn?: number;
      status?: DreamStatus;
    };
    if (typeof data.reply !== "string") return { ok: false, reason: "server" };
    return {
      ok: true,
      reply: data.reply,
      done: data.done === true || res.status === 409,
      turn: typeof data.turn === "number" ? data.turn : 0,
      status: data.status ?? (data.done ? "completed" : "active"),
    };
  } catch {
    return { ok: false, reason: "network" };
  } finally {
    clearTimeout(timer);
  }
}

// 광고 추적값. 어느 문구(v=a|b)·어느 소재가 대화를 끝까지 이끄는지 보려고 백엔드
// 세션에 같이 남긴다. 값은 짧게 자른다(백엔드도 한 번 더 자른다).
export function readUtm(): { variant: "a" | "b"; utm: Record<string, string> } {
  const utm: Record<string, string> = {};
  let variant: "a" | "b" = "a";
  try {
    const params = new URLSearchParams(window.location.search);
    if ((params.get("v") || "").toLowerCase() === "b") variant = "b";
    params.forEach((value, key) => {
      const k = key.toLowerCase();
      const v = value.trim();
      if (/^utm_[a-z0-9_]{1,24}$/.test(k) && v) utm[k] = v.slice(0, 120);
    });
  } catch {
    /* 주소를 못 읽어도 대화는 시작한다 */
  }
  utm.v = variant;
  return { variant, utm };
}
