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
// 3개 이분 축으로 요약한 것이다. 12문항 = 축당 4문항.

export type Pole = "F" | "S" | "D" | "B" | "P" | "L";
// E축(충전): F 함께 vs S 혼자   |   R축(관계): D 깊이 vs B 넓이   |   T축(리듬): P 계획 vs L 즉흥

export type GyeolCode =
  | "FDP" | "FDL" | "FBP" | "FBL"
  | "SDP" | "SDL" | "SBP" | "SBL";

export interface Question {
  q: string;
  a: { text: string; pole: Pole };
  b: { text: string; pole: Pole };
}

// 12문항 — 축 순서를 섞어 응답 편향을 줄인다.
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
  },
};

export const ALL_CODES = Object.keys(TYPES) as GyeolCode[];

// 응답 배열(각 문항의 'a'|'b')로 결 유형 코드를 계산한다.
export function scoreToCode(answers: ("a" | "b")[]): GyeolCode {
  const tally: Record<Pole, number> = { F: 0, S: 0, D: 0, B: 0, P: 0, L: 0 };
  QUESTIONS.forEach((question, i) => {
    const pick = answers[i] === "b" ? question.b : question.a;
    tally[pick.pole] += 1;
  });
  // 동점(2:2)은 지금까지 과소대표된 쪽(F 함께 · B 넓이 · L 즉흥)으로 깨서
  // 분포 쏠림(조용한 깊이형 과다)을 완화한다. 마케팅 퀴즈라 임상 정확도보다
  // 8유형이 골고루 갈리는 게(=공유할 맛) 목적. 우세가 분명하면 그대로 반영.
  const e = tally.S > tally.F ? "S" : "F"; // 동점 → F
  const r = tally.D > tally.B ? "D" : "B"; // 동점 → B
  const t = tally.P > tally.L ? "P" : "L"; // 동점 → L
  return `${e}${r}${t}` as GyeolCode;
}
