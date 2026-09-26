// 사돈 수요조사 문항 — 원본은 docs/sadon/14_수요조사_문항.md (bloomagain-korea).
// 여기와 그 문서가 어긋나면 **문서가 맞다.**
//
// 값(value)은 서버의 _SD_ONE·_SD_MANY 와 글자 그대로 같아야 한다. 어긋나면
// 서버가 조용히 버려서, 화면은 멀쩡히 묻는데 답만 사라진다. 백엔드
// tests/test_needs_event_options.py 가 그 사고를 막는다 — 보기를 고치면
// 거기도 같이 고칠 것.

export type Opt = { value: string; label: string };
export type SurveyQ = {
  /** 이벤트에 실리는 질문 키. 서버 q Literal과 같아야 한다. */
  q: string;
  /** NeedsAnswers의 어느 칸에 담을지. q와 대개 같지만 2번만 다르다. */
  field: string;
  title: string;
  sub?: string;
  options: Opt[];
  /** 복수 선택이면 true. 고른 뒤 「다음」을 눌러야 넘어간다. */
  multi?: boolean;
  /** 복수 선택에서 권하는 최대 개수(화면에서만 건다. 서버는 안 자른다). */
  max?: number;
};

// 9·10번은 **같은 보기를 순서까지 그대로** 쓴다. 두 답을 나란히 놓고 읽는 게
// 목적이라, 순서를 섞으면 대조가 깨진다.
const WANT_OPTIONS: Opt[] = [
  { value: "character", label: "사람 됨됨이·성품" },
  { value: "values", label: "가치관이 맞는지" },
  { value: "job", label: "직업과 안정성" },
  { value: "money", label: "경제력" },
  { value: "education", label: "학력" },
  { value: "looks", label: "외모" },
  { value: "health", label: "건강" },
  { value: "age", label: "나이" },
  { value: "region", label: "사는 지역" },
  { value: "religion", label: "종교" },
  { value: "politics", label: "정치 성향" },
  { value: "family", label: "집안 분위기·부모님" },
];

export const QUESTIONS: SurveyQ[] = [
  // ── 여는 문 ──────────────────────────────────────────────────────────
  {
    q: "sdHasSingle",
    field: "sdHasSingle",
    title: "미혼 자녀를\n두셨나요?",
    sub: "이 조사는 그분들께 드리는 것이에요",
    options: [
      { value: "yes", label: "네, 있어요" },
      { value: "no", label: "아니요" },
    ],
  },
  {
    // 기존 /enjoy의 childSex 칸을 그대로 쓴다 — 같은 걸 묻는데 칸을 새로
    // 만들면 두 설문을 견줄 수가 없다.
    q: "childSex",
    field: "childSex",
    title: "아드님이신가요,\n따님이신가요?",
    options: [
      { value: "son", label: "아들만 있어요" },
      { value: "daughter", label: "딸만 있어요" },
      { value: "both", label: "둘 다 있어요" },
    ],
  },
  {
    q: "sdChildAge",
    field: "sdChildAge",
    title: "자녀분은\n몇 살쯤이세요?",
    sub: "여럿이면 미혼인 첫째 기준으로요",
    options: [
      { value: "20s", label: "20대" },
      { value: "30s_early", label: "30대 초반" },
      { value: "30s_late", label: "30대 후반" },
      { value: "40plus", label: "40대 이상" },
    ],
  },
  // ── ① 하실 건지 ──────────────────────────────────────────────────────
  {
    q: "sdIntent",
    field: "sdIntent",
    title: "이런 자리가 있다면\n나가보시겠어요?",
    sub: "미혼 자녀를 두신 부모님들끼리 모여 집안 이야기를 나누는 자리예요",
    options: [
      { value: "want", label: "나가보고 싶어요" },
      { value: "curious", label: "궁금하긴 해요" },
      { value: "ask_child", label: "자녀에게 먼저 물어봐야겠어요" },
      { value: "reluctant", label: "내키지 않아요" },
    ],
  },
  {
    q: "sdWhen",
    field: "sdWhen",
    title: "언제쯤이면\n나가보시겠어요?",
    options: [
      { value: "asap", label: "자리가 열리면 바로요" },
      { value: "months", label: "몇 달 뒤라도요" },
      { value: "if_child_agrees", label: "자녀가 동의하면요" },
      { value: "unsure", label: "잘 모르겠어요" },
    ],
  },
  {
    q: "sdAssurance",
    field: "sdAssurance",
    title: "무엇이 있으면\n마음이 놓이시겠어요?",
    sub: "여러 개 고르셔도 돼요",
    multi: true,
    options: [
      { value: "identity", label: "오시는 분들 신원 확인" },
      { value: "notify_child", label: "자녀에게 알리는 절차" },
      { value: "no_grading", label: "조건으로 재지 않는다는 약속" },
      { value: "no_acquaintance", label: "아는 사람은 안 만나게" },
      { value: "price_open", label: "비용을 미리 공개" },
      { value: "small", label: "적은 인원" },
    ],
  },
  {
    q: "sdPersuade",
    field: "sdPersuade",
    title: "자녀분께 이야기를 꺼내신다면,\n무엇이 있으면 수월할까요?",
    sub: "여러 개 고르셔도 돼요",
    multi: true,
    options: [
      { value: "child_edits", label: "자녀가 직접 보고 고칠 수 있는 화면" },
      { value: "no_photo_name", label: "사진·이름이 안 나간다는 보장" },
      { value: "can_stop", label: "원하면 바로 멈출 수 있다는 것" },
      { value: "not_agency", label: "결혼정보회사가 아니라는 설명" },
      { value: "others_stories", label: "다녀오신 분들의 이야기" },
      { value: "words_for_me", label: "꺼낼 말을 대신 적어준 것" },
      { value: "hard_anyway", label: "무엇을 해도 어려울 것 같아요" },
    ],
  },
  // ── ② 조건을 어디까지 ────────────────────────────────────────────────
  {
    q: "sdConditionLine",
    field: "sdConditionLine",
    title: "형편이나 학력 같은 조건은\n어디까지 보는 게 좋을까요?",
    options: [
      { value: "none", label: "아예 안 봤으면 해요" },
      { value: "similar", label: "크게 차이 안 나는 정도만 맞춰주면 돼요" },
      { value: "tell_me", label: "중요한 건 미리 알려줬으면 해요" },
      { value: "most_important", label: "조건이 제일 중요해요" },
    ],
  },
  // ── ③ 내 생각과 자녀 생각 ────────────────────────────────────────────
  {
    q: "sdWantMine",
    field: "sdWantMine",
    title: "자녀분의 배우자로\n무엇을 중요하게 보세요?",
    sub: "세 개까지 고르실 수 있어요",
    multi: true,
    max: 3,
    options: WANT_OPTIONS,
  },
  {
    q: "sdWantChild",
    field: "sdWantChild",
    title: "자녀분은 무엇을\n중요하게 볼 것 같으세요?",
    sub: "세 개까지 고르실 수 있어요",
    multi: true,
    max: 3,
    options: WANT_OPTIONS,
  },
  {
    q: "sdGapWorry",
    field: "sdGapWorry",
    title: "서로 너무 차이 나면\n곤란하다 싶은 건요?",
    sub: "여러 개 고르셔도 돼요",
    multi: true,
    options: [
      { value: "money", label: "경제적 형편" },
      { value: "lifestyle", label: "생활 수준·씀씀이" },
      { value: "education", label: "교육 배경" },
      { value: "region", label: "사는 지역" },
      { value: "mood", label: "집안 분위기" },
      { value: "ok", label: "차이는 괜찮아요" },
    ],
  },
  {
    q: "sdDealbreaker",
    field: "sdDealbreaker",
    title: "이것만은 곤란하다\n싶은 건요?",
    sub: "여러 개 고르셔도 돼요",
    multi: true,
    options: [
      { value: "debt", label: "빚이나 금전 문제" },
      { value: "addiction", label: "술·도박" },
      { value: "family_conflict", label: "가족 간 불화" },
      { value: "intrusive", label: "지나친 간섭" },
      { value: "no_contact", label: "왕래를 아예 안 함" },
      { value: "none", label: "딱히 없어요" },
    ],
  },
];
