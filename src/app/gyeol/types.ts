// 결 유형 테스트 — 데이터 단일 소스.
//
// 왜 이게 존재하나 (전략)
// ----------------------
// 친구 만들기는 "낮은 긴급도 + 높은 수치심" 카테고리라 스스로 검색 트래픽을
// 못 만든다. 그래서 다운로드를 끌려면 (1) 호기심(자기발견)과 (2) 공유 루프를
// 인위적으로 만들어줘야 한다. 한국인이 가장 잘 퍼뜨리는 포맷이 MBTI식 성격
// 테스트다. 결큐(티타의 매칭 질문)를 무가입 "결 유형 테스트"로 재포장해,
// 파운더 얼굴에 의존하지 않는 상시·바이럴 최상단 유입원을 만든다.
//
// 결과 페이지(/gyeol/[code])는 각자 고유 OG 카드를 가지므로, 링크를 공유하면
// 그 유형 카드가 프리뷰로 뜬다 → 친구가 보고 "나도 해볼래" → 테스트 → 다운로드.
//
// 축(axis) 설계는 결큐 태그 체계(e_high/e_low, depth_lover, planner/flexible…)를
// 3개 이분 축으로 요약한 것 + 공유 다양성을 위한 4번째 '온도' 축이다.

export type Pole = "F" | "S" | "D" | "B" | "P" | "L" | "W" | "C";
// E축(충전): F 함께 vs S 혼자   |   R축(관계): D 깊이 vs B 넓이
// T축(리듬): P 계획 vs L 즉흥    |   온도축(표현): W 온기(드러냄) vs C 담백(품음)
// 온도축은 8유형 중 한쪽(조용·깊은 결)에 과도하게 쏠리는 걸 완화해, 같은
// 유형이 나와도 공유 카드가 갈리게 하는 '세분화' 장치다.

export type GyeolCode =
  | "FDP" | "FDL" | "FBP" | "FBL"
  | "SDP" | "SDL" | "SBP" | "SBL";

export type Temperament = "W" | "C";

export interface Question {
  q: string;
  a: { text: string; pole: Pole };
  b: { text: string; pole: Pole };
}

// 14문항 — 축 순서를 섞어 응답 편향을 줄인다 (앞 12 = 3축, 뒤 2 = 온도축).
export const QUESTIONS: Question[] = [
  {
    q: "주말 오후, 마음이 제일 놓이는 쪽은?",
    a: { text: "마음 맞는 사람들과 왁자지껄", pole: "F" },
    b: { text: "혼자 조용히 나만의 시간", pole: "S" },
  },
  {
    q: "친구는 어느 쪽이 더 좋으세요?",
    a: { text: "속을 터놓는 가까운 몇 사람", pole: "D" },
    b: { text: "폭넓게 두루 어울리는 여러 사람", pole: "B" },
  },
  {
    q: "만날 약속은?",
    a: { text: "미리 정해두면 든든하다", pole: "P" },
    b: { text: "그날 기분 따라 정한다", pole: "L" },
  },
  {
    q: "기운이 빠질 때 회복법은?",
    a: { text: "사람 만나 수다 떨며", pole: "F" },
    b: { text: "혼자만의 시간으로", pole: "S" },
  },
  {
    q: "대화가 제일 즐거운 순간은?",
    a: { text: "마음속 깊은 얘기가 오갈 때", pole: "D" },
    b: { text: "웃음 끊이지 않는 유쾌한 수다", pole: "B" },
  },
  {
    q: "하루를 보내는 방식은?",
    a: { text: "계획대로 차곡차곡", pole: "P" },
    b: { text: "흐름대로 유연하게", pole: "L" },
  },
  {
    q: "처음 가는 모임에 도착하면?",
    a: { text: "먼저 말 걸며 어울린다", pole: "F" },
    b: { text: "분위기 익힌 뒤 천천히", pole: "S" },
  },
  {
    q: "편한 모임 규모는?",
    a: { text: "서넛이 오붓하게", pole: "D" },
    b: { text: "여럿이 어울리는 활기찬 자리", pole: "B" },
  },
  {
    q: "\"지금 잠깐 나올래요?\" 연락이 오면?",
    a: { text: "다음에 제대로 약속 잡자", pole: "P" },
    b: { text: "좋아요, 바로 나갈게!", pole: "L" },
  },
  {
    q: "여행지에서의 저녁은?",
    a: { text: "새로 만난 사람들과 함께", pole: "F" },
    b: { text: "좋아하는 사람과 조용히", pole: "S" },
  },
  {
    q: "새 사람과 친해지는 속도는?",
    a: { text: "천천히 스며들듯", pole: "D" },
    b: { text: "금세 스스럼없이", pole: "B" },
  },
  {
    q: "새로운 걸 시작할 때는?",
    a: { text: "준비를 갖추고 나서", pole: "P" },
    b: { text: "일단 해보면서", pole: "L" },
  },
  // ── 온도축 (표현) — 같은 유형을 온기형/담백형으로 가른다 ──
  {
    q: "고마운 마음이 들 때 나는?",
    a: { text: "바로 표현하는 편", pole: "W" },
    b: { text: "마음에 담아두는 편", pole: "C" },
  },
  {
    q: "속상한 일이 있으면?",
    a: { text: "티가 나는 편", pole: "W" },
    b: { text: "잘 안 드러내는 편", pole: "C" },
  },
];

export interface GyeolType {
  code: GyeolCode;
  emoji: string;
  name: string;
  tagline: string;
  desc: string;
  strengths: string[];
  match: GyeolCode;
  matchReason: string;
  // 결과 CTA 바로 위에 뜨는 '유형에 붙은 그리움' 한 줄 — 공포가 아니라
  // 아름다운 특성에서 자연스럽게 나오는 갈망(seen). pain → hope 전환용.
  longing: string;
}

export const TYPES: Record<GyeolCode, GyeolType> = {
  FDP: {
    code: "FDP",
    emoji: "🌿",
    name: "다정한 정원사",
    tagline: "마음 맞는 몇 사람과, 오래도록",
    desc: "함께 있을 때 힘이 나고, 관계는 넓히기보다 깊이 가꾸는 결이에요. 약속을 소중히 여기고 곁을 든든히 지켜, 한번 맺은 인연이 오래갑니다.",
    strengths: ["약속을 지키는 신뢰감", "깊고 진솔한 대화", "곁을 지키는 든든함"],
    match: "SDP",
    matchReason: "깊이와 약속을 아는 사람끼리는 서두르지 않아도 마음이 통해요.",
    longing: "곁을 든든히 지키는 당신 — 정작 내 곁을 오래 지켜줄 한 사람은, 생각보다 귀하죠.",
  },
  FDL: {
    code: "FDL",
    emoji: "🍵",
    name: "따뜻한 즉흥파",
    tagline: "통하면, 오늘 당장 마주 앉는",
    desc: "사람과의 시간이 즐겁고, 마음이 동하면 그 자리에서 깊은 얘기를 나누는 결이에요. 격식보다 진심, 계획보다 지금 이 순간을 소중히 합니다.",
    strengths: ["금세 마음을 여는 다정함", "깊은 즉흥 대화", "함께의 활력"],
    match: "FBL",
    matchReason: "지금을 즐길 줄 아는 사람과는 매번 새로운 자리가 반가워요.",
    longing: "마음이 동하면 바로 깊어지는 당신 — 그 속도를 맞춰줄 사람이 흔치 않죠.",
  },
  FBP: {
    code: "FBP",
    emoji: "☀️",
    name: "동네 분위기 메이커",
    tagline: "사람과 사람을 잇는",
    desc: "여럿이 어울리는 자리가 즐겁고, 그 자리를 미리 잘 챙기는 결이에요. 당신이 있으면 모임이 한결 따뜻하고 자연스러워집니다.",
    strengths: ["자리를 챙기는 세심함", "사람을 잇는 친화력", "밝은 분위기"],
    match: "FDP",
    matchReason: "넓게 잇는 당신과 깊게 가꾸는 사람이 만나면 균형이 좋아요.",
    longing: "모두를 챙기는 당신 — 정작 당신을 챙겨줄 사람은 곁에 있나요?",
  },
  FBL: {
    code: "FBL",
    emoji: "🎈",
    name: "흥 많은 마당발",
    tagline: "어디서든 금세 어울리는",
    desc: "새로운 사람, 새로운 자리가 즐거운 밝은 결이에요. 가볍게 시작해 두루 어울리며, 함께 있는 사람까지 기분 좋게 만듭니다.",
    strengths: ["어디서든 어울리는 붙임성", "즐거운 에너지", "새로움을 즐김"],
    match: "FDL",
    matchReason: "지금을 즐기는 사람끼리는 계획 없이도 좋은 하루가 돼요.",
    longing: "어디서든 잘 어울리는 당신 — 근데 '진짜 내 사람'은 또 다른 얘기죠.",
  },
  SDP: {
    code: "SDP",
    emoji: "🌙",
    name: "조용한 진심",
    tagline: "혼자도 편안하지만, 곁엔 진심인",
    desc: "혼자만의 시간이 편안하지만, 진짜 한두 사람에겐 더없이 깊은 결이에요. 예고된 조용한 만남에서 당신의 다정함이 가장 잘 드러납니다.",
    strengths: ["깊고 변치 않는 진심", "차분한 안정감", "믿음직한 곁"],
    match: "FDP",
    matchReason: "약속을 소중히 하고 깊이를 아는 사람과는 오래 편안해요.",
    longing: "아무나와의 수다보다, 말이 깊이 통하는 한 사람이 귀한 당신. 그런 사람은 쉽게 안 나타나서 더 그렇죠.",
  },
  SDL: {
    code: "SDL",
    emoji: "🌾",
    name: "느긋한 사색가",
    tagline: "잔잔하지만, 속은 단단한",
    desc: "혼자만의 시간을 아끼고, 마음이 동할 때 깊이 나누는 결이에요. 서두르지 않고 자기 리듬을 지키며, 속 깊은 대화 한 번이 여러 만남보다 소중합니다.",
    strengths: ["깊은 사색", "자기 리듬", "진솔한 한 번의 대화"],
    match: "SBL",
    matchReason: "부담 없이 곁을 내주는 사람과는 당신의 리듬이 지켜져요.",
    longing: "내 리듬을 지키면서 곁을 내줄 사람 만나기, 참 어렵죠.",
  },
  SBP: {
    code: "SBP",
    emoji: "🍃",
    name: "선을 지키는 다정",
    tagline: "두루 친절하되, 거리도 아는",
    desc: "여러 사람에게 두루 친절하면서도 적당한 거리를 지킬 줄 아는 결이에요. 예측 가능한 편안함이 매력이라, 곁에 있으면 마음이 놓입니다.",
    strengths: ["편안한 거리감", "두루 친절함", "예측 가능한 다정"],
    match: "SBL",
    matchReason: "가볍고 편안한 사람과는 서로 부담 없이 오래 이어져요.",
    longing: "적당한 거리를 아는 당신 — 그 거리를 편하게 맞춰줄 사람이 드물죠.",
  },
  SBL: {
    code: "SBL",
    emoji: "☕",
    name: "편안한 산책 친구",
    tagline: "부담 없이, 그때그때, 가볍게",
    desc: "무겁지 않게 그때그때 어울리는 편안한 결이에요. 곁에 있으면 마음이 놓이고, 억지로 애쓰지 않아도 자연스럽게 이어지는 사이를 좋아합니다.",
    strengths: ["편안한 존재감", "부담 없는 다정", "자연스러운 어울림"],
    match: "SDL",
    matchReason: "자기 리듬을 아는 사람과는 말없이 걸어도 편안해요.",
    longing: "애쓰지 않아도 편한 사이를 좋아하는 당신 — 근데 그 '편함'이 제일 만들기 어렵잖아요.",
  },
};

// 온도(표현) 축 — 같은 유형을 두 결로 가르는 세분화. '온기형/담백형' 딱지는
// 50~70대엔 붕 떠서, 가치 결과 똑같이 딱지 없이 설명형(title + blurb)으로만.
export const TEMPERAMENTS: Record<Temperament, {
  title: string;
  blurb: string;
}> = {
  W: {
    title: "마음을 잘 드러내는 편",
    blurb: "고마움도 속상함도 겉으로 잘 나타나는, 온기가 느껴지는 편이에요.",
  },
  C: {
    title: "마음을 안으로 품는 편",
    blurb: "잘 드러내진 않지만, 속이 깊고 잔잔한 편이에요.",
  },
};

export const BASE_CODES = Object.keys(TYPES) as GyeolCode[];

// 정적 생성용 라우트 코드: 4글자(유형+온도) 16개 + 3글자 레거시 8개.
// (온도축 도입 전 공유된 3글자 링크가 404 나지 않게 함께 굽는다.)
export const ALL_ROUTE_CODES: string[] = [
  ...BASE_CODES,
  ...BASE_CODES.flatMap((c) => [`${c}W`, `${c}C`]),
];

// 하위호환: 예전 이름을 참조하는 코드가 있을 수 있어 유지 (= 라우트 코드 전체).
export const ALL_CODES = ALL_ROUTE_CODES;

/** 라우트 코드(3 또는 4글자)를 기본 유형 + 온도로 분해. 잘못된 코드는 base null. */
export function parseCode(code: string): {
  base: GyeolCode | null;
  temp: Temperament | null;
} {
  const b = code.slice(0, 3) as GyeolCode;
  const base = TYPES[b] ? b : null;
  const t = code.length >= 4 ? (code[3] as Temperament) : null;
  const temp = t === "W" || t === "C" ? t : null;
  return { base, temp };
}

// 응답 배열(각 문항의 'a'|'b')로 결 유형 코드(4글자: 유형+온도)를 계산한다.
// 값 문항(VALUE_QUESTIONS)은 뒤에 붙어도 QUESTIONS만 순회하므로 영향 없음.
export function scoreToCode(answers: ("a" | "b")[]): string {
  const tally: Record<Pole, number> = {
    F: 0, S: 0, D: 0, B: 0, P: 0, L: 0, W: 0, C: 0,
  };
  QUESTIONS.forEach((question, i) => {
    const pick = answers[i] === "b" ? question.b : question.a;
    tally[pick.pole] += 1;
  });
  // 동점(2:2)은 지금까지 과소대표된 쪽(F 함께 · B 넓이 · L 즉흥)으로 깨서
  // 분포 쏠림(조용한 깊이형 과다)을 완화한다. 우세가 분명하면 그대로 반영.
  const e = tally.S > tally.F ? "S" : "F"; // 동점 → F
  const r = tally.D > tally.B ? "D" : "B"; // 동점 → B
  const t = tally.P > tally.L ? "P" : "L"; // 동점 → L
  const w = tally.C > tally.W ? "C" : "W"; // 온도: 동점 → W(온기)
  return `${e}${r}${t}${w}`;
}

// ── 가치 결 (두 번째 층) ──────────────────────────────────────────────────
// "어떻게 어울리나"(8유형)만큼 "무엇을 소중히 여기나"도 결의 핵심이라, 관계
// 스타일과 겹치지 않는 두 가치 축을 별도로 잰다. 8유형 코드/OG는 그대로 두고
// (method 1), 결과에 '가치 결'로 얹어 보여준다.
//   축① 삶의 방향: G 성장(새로움·도전) vs E 평온(익숙·여유)
//   축④ 열림      : O 열림(다름도 반가움) vs K 익숙(결이 통하는 게 편함)
export type ValueDirection = "G" | "E";
export type ValueOpenness = "O" | "K";
export type ValuePole = ValueDirection | ValueOpenness;

export interface ValueQuestion {
  q: string;
  a: { text: string; pole: ValuePole };
  b: { text: string; pole: ValuePole };
}

// 가치 문항 4개 (축당 2). 스타일 축과 겹치지 않게 '삶의 태도'를 묻는다.
export const VALUE_QUESTIONS: ValueQuestion[] = [
  {
    q: "요즘 더 끌리는 쪽은?",
    a: { text: "새로 배우고 도전하는 것", pole: "G" },
    b: { text: "익숙한 걸 편히 즐기는 것", pole: "E" },
  },
  {
    q: "나에게 좋은 하루란?",
    a: { text: "안 해본 걸 해본 날", pole: "G" },
    b: { text: "무리 없이 여유로운 날", pole: "E" },
  },
  {
    q: "모임에서 더 편한 사람은?",
    a: { text: "나와 좀 달라도 새 얘기 나누는 사람", pole: "O" },
    b: { text: "결이 비슷해 말이 잘 통하는 사람", pole: "K" },
  },
  {
    q: "생각이 다른 사람을 만나면?",
    a: { text: "그 얘기가 더 궁금해진다", pole: "O" },
    b: { text: "아무래도 결이 맞는 쪽이 편하다", pole: "K" },
  },
];

// 전체 퀴즈 = 스타일 14 + 가치 4. 테스트 화면은 이걸 순회한다.
export const QUIZ_QUESTIONS: (Question | ValueQuestion)[] = [
  ...QUESTIONS,
  ...VALUE_QUESTIONS,
];

export interface ValueResult {
  direction: ValueDirection;
  openness: ValueOpenness;
}

// '성장형/평온형' 같은 유형 딱지는 50~70대엔 자기계발 톤으로 붕 떠서, 딱지 없이
// 따뜻한 설명(title 한 줄 + blurb)으로만 보여준다. 어느 쪽도 옳다는 톤.
export const VALUE_AXES: {
  direction: Record<ValueDirection, { title: string; blurb: string }>;
  openness: Record<ValueOpenness, { title: string; blurb: string }>;
} = {
  direction: {
    G: {
      title: "새로움이 설레는 결",
      blurb: "새로운 걸 배우고, 안 해본 걸 해볼 때 마음이 설레는 편이에요.",
    },
    E: {
      title: "익숙함이 편안한 결",
      blurb: "익숙하고 편안한 것에서 행복을 찾는, 잔잔하고 단단한 편이에요.",
    },
  },
  openness: {
    O: {
      title: "다름도 반가운 결",
      blurb: "나와 좀 달라도 새로운 이야기가 즐거운, 마음이 열린 편이에요.",
    },
    K: {
      title: "통하는 사이가 좋은 결",
      blurb: "결이 비슷해 말이 잘 통하는 사이에서 가장 편안한 편이에요.",
    },
  },
};

// 가치 답(뒤 4개)으로 가치 결을 계산. 45+는 평온·익숙에 쏠리기 쉬워, 동점(1:1)은
// 과소대표될 쪽(G 성장 · O 열림)으로 깨 공유 카드 다양성을 지킨다.
export function scoreToValue(answers: ("a" | "b")[]): ValueResult {
  const tally: Record<ValuePole, number> = { G: 0, E: 0, O: 0, K: 0 };
  const offset = QUESTIONS.length;
  VALUE_QUESTIONS.forEach((question, i) => {
    const ans = answers[offset + i];
    if (ans !== "a" && ans !== "b") return; // 미응답은 건너뜀
    const pick = ans === "b" ? question.b : question.a;
    tally[pick.pole] += 1;
  });
  const direction: ValueDirection = tally.E > tally.G ? "E" : "G"; // 동점 → G
  const openness: ValueOpenness = tally.K > tally.O ? "K" : "O"; // 동점 → O
  return { direction, openness };
}

/** 가치 코드 문자열("GO","EK"…)을 ValueResult로. 잘못된 값은 null. */
export function parseValue(v: string | null | undefined): ValueResult | null {
  if (!v || v.length !== 2) return null;
  const d = v[0];
  const o = v[1];
  if ((d === "G" || d === "E") && (o === "O" || o === "K")) {
    return { direction: d, openness: o };
  }
  return null;
}

/** 가치 결이 통하는 상대에 대한 한 줄 (성사 보장 아님 — 결의 결합 설명). */
export function valueHarmony(v: ValueResult): string {
  const dir =
    v.direction === "G"
      ? "새로움을 함께 즐길 또래"
      : "여유의 속도가 맞는 또래";
  const open =
    v.openness === "O"
      ? "서로 다른 이야기도 반갑게 나눌 수 있어요"
      : "결이 통해 말이 편하게 이어져요";
  return `${dir}와 만나면, ${open}.`;
}
