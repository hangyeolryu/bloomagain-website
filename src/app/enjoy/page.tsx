"use client";

/**
 * /enjoy — "506070, 이제 즐길 때" 밝은판 랜딩 (3문항).
 *
 * ── 왜 따로 만드는가 ────────────────────────────────────────────────────────
 * /needs(9문항)는 도착 1134명 중 913명(80%)이 **첫 질문에서** 빠졌다. 그런데
 * 첫 질문만 넘기면 57%가 끝까지 간다 — 아홉 문항을 지나며 잃는 건 96명뿐이다.
 * 길이가 아니라 첫 화면이 문제였다.
 *
 * 그 첫 질문이 "그 시간을 어떻게 보내세요?"였고, 보기 다섯 중 넷이 자기
 * 고백이었다(TV만 본다 / 혼자다 / 그냥 흘러간다). 8/4에 이걸 '삶의 변화'로
 * 바꿔봤다가 더 나빠져서 되돌렸다(56.5% → 70.4%, z=2.77 p=0.0056). 사별·이혼이
 * 첫 화면에 보이니 더 사적이었던 것이다.
 *
 * 두 번의 실패가 축을 알려줬다. 중요한 건 '사실이냐 평가냐'가 아니라
 * **얼마나 사적이냐**다. 그래서 여기는 가장 덜 사적인 질문으로 연다 —
 * "뭐가 제일 하고 싶으세요?" 고백도, 가족사도 없다.
 *
 * 문항은 셋뿐이다. 실제로 서비스가 쓰는 값이 활동·지역·나이라서다. 나머지
 * 리서치용 문항은 /needs에서 이미 132명분을 받았다.
 *
 * ── 색 ──────────────────────────────────────────────────────────────────────
 * 딥그린이 아니라 연분홍/테라코타. 광고 소재(506070 캐러셀)와 같은 팔레트라
 * 광고를 누른 사람이 같은 화면에 도착한 느낌을 받는다. 딥그린으로 받으면
 * "다른 데로 왔나" 싶어진다.
 */

import { useEffect, useRef, useState } from "react";
import { KOREAN_FONT_STACK } from "../_components/tita-brand";
import CityProgress from "./CityProgress";
import { logAnalyticsEvent } from "@/lib/firebase";
import { trackPixel } from "@/lib/pixel";
import { recordNeedsEvent } from "../needs/needs-events";
// 다운로드 CTA는 반드시 이걸 쓴다. 직접 <a href>나 window.location으로 짜면
// 아이폰 인앱(인스타·카톡)에서 빈 화면으로 끝난다 — WKWebView가 유니버설
// 링크를 앱으로 안 넘긴다. 이 컴포넌트는 안드로이드는 스토어를 열고,
// 아이폰 인앱에서는 "App Store에서 티타 검색"을 안내한다.
import {
  StoreDownloadButton,
  type StoreKind,
} from "../_components/StoreDownloadButton";

const VARIANT = "enjoy";

// 광고 캐러셀과 같은 색. 새로 만들지 않는다.
const C = {
  blush: "#F7E4E1",
  ink: "#1A1A1A",
  terra: "#C85A3A",
  terraDeep: "#A8482D",
  muted: "#786E6C",
  white: "#FFFFFF",
  line: "#E7CFCA",
} as const;

type CoreKey = "activity" | "district" | "outing" | "ageBand" | "gender";
type ChildKey =
  | "hasChild" | "childAge" | "childMarital" | "childContact"
  | "childRelation" | "noChildStatus" | "childTalk" | "childSex";
type Q = {
  key: CoreKey | ChildKey;
  title: string;
  sub?: string;
  options: { value: string; label: string }[];
};

// 활동 보기는 /needs 4번 문항의 실측 분포를 따랐다(차 한잔 23 · 취미배움 18 ·
// 수다 18 · 여행 16 · 전시공연 10 · 운동등산 8). 고르게 갈리는 게 첫 질문으로
// 좋다 — 누구나 자기 답이 있다. 광고에 쓴 낱말(전시·연극·뮤지컬·여행)이
// 보기에 그대로 있어야 "방금 본 그거"로 이어진다.
const QUESTIONS: Q[] = [
  {
    key: "activity",
    title: "뭐가 제일\n하고 싶으세요?",
    sub: "고르시면 그걸 같이 할 분들을 찾아드려요",
    options: [
      { value: "culture", label: "전시·공연 나들이" },
      { value: "theater", label: "연극·뮤지컬" },
      { value: "travel", label: "같이 여행" },
      { value: "tea", label: "차 한잔, 맛있는 집" },
      { value: "hobby", label: "취미·배움 함께" },
      { value: "exercise", label: "운동·등산 같이" },
      { value: "walk", label: "동네 산책" },
      { value: "chat", label: "그냥 편한 수다" },
    ],
  },
  {
    key: "district",
    title: "어디서 만나기\n편하세요?",
    sub: "가까운 분들끼리 모아드려요",
    options: [
      { value: "gangnam", label: "강남·서초·송파" },
      { value: "jongno", label: "종로·중구·용산" },
      { value: "mapo", label: "마포·서대문·은평" },
      { value: "yeongdeungpo", label: "영등포·구로·양천·강서" },
      { value: "nowon", label: "노원·도봉·강북·성북" },
      { value: "gangdong", label: "광진·성동·동대문·중랑·강동" },
      // 경기·인천이 응답의 33%로 단일 최대 블록인데 한 칸이라, 어디에 자리를
      // 열지 알 수가 없었다. 40분 안에 모일 수 있는 묶음으로 쪼갠다.
      { value: "incheon", label: "인천·부천·김포" },
      { value: "gg_north", label: "고양·파주·의정부" },
      { value: "gg_south", label: "성남·용인·수원" },
      { value: "gg_west", label: "안양·광명·안산" },
      // 전국 광고를 태우기 전에는 이 칸이 "그 외 지역"이었다. 열 칸이 전부
      // 수도권이고 나머지 전국이 한 칸이라, 부산·대구 응답이 전부 여기 쌓여
      // 어느 도시를 열어야 할지 알 수가 없었다. 게다가 부산에서 이 화면을
      // 보면 "여긴 서울 앱이네"로 읽힌다. 누르면 시·도를 한 번 더 고른다.
      { value: "outside", label: "서울·경기·인천이 아니에요" },
    ],
  },
  {
    key: "outing",
    title: "요즘 바깥 활동은\n어떠세요?",
    sub: "편하게 고르시면 돼요",
    // /needs 아홉 문항 중 앱 받기를 실제로 예측한 답은 둘뿐이었고, 그중 하나가
    // "혼자서라도 나간다"였다(34% 대 18%, p=0.013). 나머지 — 사기 걱정, 연령,
    // 지금 상황, 활동 종류 — 는 전부 차이가 없었다. 유일하게 검증된 행동
    // 신호라 밝은판으로 옮겨 온다.
    //
    // 세 번째에 두는 이유: "나가고 싶은데 잘 안 된다"에는 자기 고백이 조금
    // 섞인다. /needs가 그런 질문을 첫 화면에 뒀다가 80%를 잃었다.
    options: [
      { value: "solo_out", label: "혼자서라도 나가는 편" },
      { value: "want_out", label: "나가고 싶은데 잘 안 돼요" },
      { value: "home", label: "집이 편해요" },
      { value: "has_group", label: "이미 다니는 모임이 있어요" },
    ],
  },
  {
    key: "ageBand",
    title: "연령대가\n어떻게 되세요?",
    // 45세 이상 전용임을 여기서 밝힌다. 설치 뒤 본인인증에서 튕기는 것보다
    // 지금 아는 편이 서로 낫다 — 결큐 시도자의 43%가 45세 미만이었다.
    sub: "티타는 45세 이상만 이용하실 수 있어요",
    options: [
      { value: "45-49", label: "45–49세" },
      { value: "50-54", label: "50–54세" },
      { value: "55-59", label: "55–59세" },
      { value: "60-64", label: "60–64세" },
      { value: "65plus", label: "65세 이상" },
      { value: "under45", label: "45세 미만이에요" },
    ],
  },
  {
    // 성별 (2026-09-26 복원). /needs 에는 있었는데 /enjoy 로 옮기면서 빠졌다.
    // 그 사이 앱 방향이 5060 여성 쪽으로 기울었는데, 정작 수요를 재는 설문이
    // 그 축을 못 보고 있었다 — 자녀 블록 첫 이틀에 미혼 자녀를 둔 분이 열셋
    // 나왔는데 그중 몇 분이 여성인지 알 길이 없었다.
    //
    // 연령대 **뒤**에 둔다. 실측상 연령까지 온 분은 세 구간 모두 100%
    // 완주했다(153/153 · 113/113 · 23/23). 그 뒤는 사실상 공짜다.
    // 45세 미만은 연령대에서 바로 끝나므로 이 질문을 보지 않는다.
    //
    // 값은 f / m / na 그대로 쓴다. 백엔드 Literal이 이 셋으로 고정돼 있고,
    // /needs 시절 데이터와도 그대로 비교된다.
    key: "gender",
    title: "성별이\n어떻게 되세요?",
    sub: "모임 구성에 참고해요 — 동성만 원하시면 앱에서 그렇게 둘 수 있어요",
    options: [
      { value: "f", label: "여성" },
      { value: "m", label: "남성" },
      { value: "na", label: "말하지 않을래요" },
    ],
  },
];

/**
 * ── 자녀 블록 (2026-09-25) ──────────────────────────────────────────────────
 * 연령을 답한 45세 이상에게만 이어서 묻는다. 광고로 온 분들이 실제로 어떤
 * 가족 상황인지를 보려는 것 — 미혼 성인 자녀가 있는지(사돈 라운지 수요),
 * 자녀와 얼마나 자주·어떤 사이로 지내는지(외로움의 다른 얼굴).
 *
 * 왜 다섯 문항 뒤인가: 가족사는 제일 사적인 질문이다. /needs가 사별·이혼을
 * 첫 화면에 뒀다가 80%를 잃었다. 여기서는 활동·동네·나이까지 답해 온기가
 * 생긴 뒤, 그리고 45세 미만은 아예 안 묻는다(그분들껜 쓸모도 없고 나이
 * 들어 보이게만 한다).
 *
 * 왜 complete를 여기로 안 미루나: 완주(complete)와 EnjoyComplete 픽셀은
 * 지금처럼 연령 답 시점에 그대로 쏜다. 광고 최적화 청중과 어드민의 완주율이
 * 이 블록 때문에 끊기면 안 된다. 자녀 답은 answer 이벤트에 하나씩 실리고,
 * 어드민이 세션 단위로 모은다.
 *
 * 답에 따라 다음 질문이 갈린다:
 *   있어요 → 나이대 → (10대 이하면 건너뜀) 결혼 → 연락 빈도 → 어떤 사이
 *   없어요 → 지금 상황
 * 그래서 step 번호가 질문과 1:1이 아니다 — 이벤트의 q로 읽는다.
 *
 * 어느 화면에서든 "건너뛰고 결과 보기"가 열려 있다. 답하기 싫은 사람이 탭을
 * 닫는 것과 결과 화면으로 가는 것은 다르다 — 후자만 앱을 받는다.
 */
const CHILD_QUESTIONS: Record<ChildKey, Q> = {
  hasChild: {
    key: "hasChild",
    title: "자녀가 있으세요?",
    sub: "자녀 얘기가 통하는 또래를 모아드리려고요",
    options: [
      { value: "yes", label: "네, 있어요" },
      { value: "no", label: "없어요" },
    ],
  },
  childAge: {
    key: "childAge",
    title: "자녀분은\n몇 살쯤이에요?",
    sub: "여럿이면 첫째 기준으로요",
    options: [
      { value: "teen", label: "10대 이하" },
      { value: "20s", label: "20대" },
      { value: "30s", label: "30대" },
      { value: "40plus", label: "40대 이상" },
    ],
  },
  childMarital: {
    key: "childMarital",
    title: "자녀분 결혼은요?",
    options: [
      { value: "all_single", label: "아직 다 미혼이에요" },
      { value: "some_married", label: "결혼한 자녀도, 미혼인 자녀도 있어요" },
      { value: "all_married", label: "다 결혼했어요" },
    ],
  },
  childContact: {
    key: "childContact",
    title: "자녀와는 얼마나\n자주 연락하세요?",
    sub: "전화·문자·만나는 것 다 합쳐서요",
    options: [
      { value: "daily", label: "거의 매일" },
      { value: "weekly", label: "일주일에 한두 번" },
      { value: "monthly", label: "한 달에 한두 번" },
      { value: "rarely", label: "명절이나 특별한 날 정도" },
    ],
  },
  // 또래와 자녀 결혼 얘기를 나눠본 적이 있나 (2026-09-26).
  //
  // **의도가 아니라 겪은 일을 묻는다.** "자녀 결혼에 관심 있으세요?"는
  // 인정해야 하는 질문이라 안 눌린다 — 결정사가 싫어서 안 간 부모가
  // "네, 사돈 찾으러 왔습니다"를 누르지 않는 것과 같다(00_INDEX 확정 결정).
  //
  // 가운데 보기가 이 문항의 전부다. 고르는 사람이 자기 처지를 고백하는 게
  // 아니라 **세상에 빈 곳이 있다**고 말하는 것이라 훨씬 쉽게 눌린다.
  childTalk: {
    key: "childTalk",
    title: "또래 부모님들과\n자녀 결혼 얘기,\n나눠보신 적 있으세요?",
    options: [
      { value: "sometimes", label: "가끔 해요" },
      { value: "want_no_place", label: "하고 싶은데 마땅한 데가 없어요" },
      { value: "no_thanks", label: "별로 하고 싶지 않아요" },
    ],
  },
  // 자녀 성별 — 관심을 보이신 분께만 묻는다.
  //
  // 사돈 찻자리는 아드님 측 여섯 / 따님 측 여섯으로 성비를 맞춰야 하는데
  // **자녀 성별은 부모 성별과 아무 상관이 없다.** 이 값이 없으면 딸 측
  // 후보를 한 명도 못 고른다. 다만 관심 없다고 하신 분께 물으면 쓸 데도
  // 없고 결혼 얘기로 읽히므로, 갈림길 뒤에 둔다.
  childSex: {
    key: "childSex",
    title: "미혼인 자녀분은\n어느 쪽이세요?",
    options: [
      { value: "son", label: "아들이에요" },
      { value: "daughter", label: "딸이에요" },
      { value: "both", label: "아들딸 다 있어요" },
    ],
  },
  childRelation: {
    key: "childRelation",
    title: "자녀와는\n어떤 사이세요?",
    sub: "편하게 고르시면 돼요",
    options: [
      { value: "close", label: "속 얘기도 하는 사이예요" },
      { value: "ok", label: "무난해요, 필요한 얘기는 해요" },
      { value: "distant", label: "좀 서먹해요" },
      { value: "complicated", label: "좀 복잡해요" },
      { value: "na", label: "말하지 않을래요" },
    ],
  },
  noChildStatus: {
    key: "noChildStatus",
    title: "지금은\n어떤 상황이세요?",
    sub: "비슷한 분들을 모아드리려고요",
    options: [
      { value: "single", label: "결혼은 안 했어요" },
      { value: "couple", label: "배우자와 둘이 지내요" },
      { value: "divorced", label: "이혼했어요" },
      { value: "widowed", label: "사별했어요" },
      { value: "na", label: "말하지 않을래요" },
    ],
  },
};

/**
 * 지금까지의 답으로 자녀 블록의 질문 순서를 만든다. 아직 안 답한 갈림길은
 * **긴 쪽**으로 가정한다 — 진행 표시가 도중에 늘어나는 건 없던 부담을 만들고,
 * 줄어드는 건 괜찮다.
 */
function childFlow(a: Record<string, string>): Q[] {
  const list: Q[] = [CHILD_QUESTIONS.hasChild];
  if ((a.hasChild ?? "yes") === "yes") {
    list.push(CHILD_QUESTIONS.childAge);
    if (a.childAge !== "teen") list.push(CHILD_QUESTIONS.childMarital);
    // 결혼 얘기 갈림길 — **사실로 먼저 거른다.** 미혼 자녀가 있고 그
    // 자녀가 30대 이상일 때만 묻는다. 스물다섯과 서른여덟은 다른
    // 이야기라, 20대까지 물으면 후보 명단이 엉킨다.
    const unmarried = a.childMarital === "all_single" ||
      a.childMarital === "some_married";
    const grown = a.childAge === "30s" || a.childAge === "40plus";
    if (unmarried && grown) {
      list.push(CHILD_QUESTIONS.childTalk);
      // 성별은 관심을 보이신 분께만. '별로 하고 싶지 않아요'면 묻지 않는다.
      if (a.childTalk === "sometimes" || a.childTalk === "want_no_place") {
        list.push(CHILD_QUESTIONS.childSex);
      }
    }
    list.push(CHILD_QUESTIONS.childContact, CHILD_QUESTIONS.childRelation);
  } else {
    list.push(CHILD_QUESTIONS.noChildStatus);
  }
  return list;
}

/** 갈림길에서 되돌아와 다른 쪽을 고르면, 안 가는 길의 답은 지운다. */
function pruneChild(a: Record<string, string>): Record<string, string> {
  const keep = new Set<string>(childFlow(a).map((q) => q.key));
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(a)) {
    if (k in CHILD_QUESTIONS && !keep.has(k)) continue;
    out[k] = v;
  }
  return out;
}

/**
 * 수도권 밖 시·도. 직접 입력이 아니라 고르게 한다 — 자유입력은 표기가 갈려
 * (부산/부산시/해운대/Busan) 집계가 안 되고, 45+ 모바일에서 타이핑은 그
 * 자리에서 이탈이 된다.
 */
const REGIONS: { value: string; label: string }[] = [
  { value: "busan", label: "부산" },
  { value: "daegu", label: "대구" },
  { value: "daejeon", label: "대전" },
  { value: "gwangju", label: "광주" },
  { value: "ulsan", label: "울산" },
  { value: "sejong", label: "세종" },
  { value: "gangwon", label: "강원" },
  { value: "chungbuk", label: "충북" },
  { value: "chungnam", label: "충남" },
  { value: "jeonbuk", label: "전북" },
  { value: "jeonnam", label: "전남" },
  { value: "gyeongbuk", label: "경북" },
  { value: "gyeongnam", label: "경남" },
  { value: "jeju", label: "제주" },
];

/**
 * 고르신 활동과 자리 제목을 잇는다.
 *
 * 자리 문서에 activity·topic 필드가 있지만 **전부 비어 있다**(2026-09-26 확인).
 * 지금 활동이 적히는 곳은 cardTitle 뿐이다 — "낮에 전시 한 번", "느지막한
 * 브런치", "차 한잔·수다". 그래서 글자로 맞춘다. 어드민이 activity 를 채우기
 * 시작하면 그걸 먼저 보도록 고치면 된다.
 */
const ACTIVITY_WORDS: Record<string, string[]> = {
  tea: ["차 한잔", "브런치", "밥", "점심", "저녁", "한 끼", "맛"],
  culture: ["전시", "공연", "미술관", "박물관", "나들이"],
  theater: ["연극", "뮤지컬", "공연"],
  chat: ["수다", "차 한잔"],
  walk: ["산책", "걷"],
  exercise: ["등산", "운동", "걷"],
  // "나들이"는 넣지 않는다 — "전시·공연 나들이"가 여행으로 잡혀서, 여행을
  // 고른 분께 전시 자리를 보여주며 "기다리고 있어요"라고 했다(라이브 확인
  // 2026-09-26). 느슨한 낱말 하나가 이 장치를 통째로 무력화한다.
  travel: ["여행"],
  hobby: ["공방", "클래스", "배움", "원데이"],
};

/**
 * 보여줄 자리 두 개를 고른다. **거르지 않고 순서만 바꾼다** —
 * 거르면 여행을 고른 분께 자리가 0개가 되어 화면이 비고, 그건 어긋난 자리를
 * 보여주는 것보다 나쁘다. 맞는 게 있으면 앞에, 없으면 그냥 가까운 것부터.
 */
function pickSeats(
  seats: { dateLabel: string; district: string; cardTitle: string }[],
  answers: Record<string, string>,
  districtLabel: string,
) {
  const words = ACTIVITY_WORDS[answers.activity ?? ""] ?? [];
  const scored = seats.map((s2) => {
    const actHit = words.some((w) => s2.cardTitle.includes(w));
    // 지역은 느슨하게 본다. 자리 쪽은 "시청역 · 중구"처럼 적히기도 해서
    // 정확히 같지 않다. 낱말 하나라도 겹치면 같은 동네로 본다.
    const near =
      !!districtLabel &&
      districtLabel
        .split("·")
        .some((t) => t.length > 1 && s2.district.includes(t));
    return { ...s2, score: (actHit ? 2 : 0) + (near ? 1 : 0), actHit };
  });
  scored.sort((a, b) => b.score - a.score);
  return { list: scored.slice(0, 2), matched: scored.some((x) => x.actHit) };
}

function detectPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/iPhone|iPad|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

export default function EnjoyPage() {
  // 지금 열려 있는 자리. 완료 화면이 "모이면 알려드릴게요"(약속)가 아니라
  // "이 자리가 열려 있어요"(사실)를 말하게 하려고 불러온다. 실패하면 조용히
  // 예전 문구로 돌아간다 — 랜딩이 API 때문에 막히면 안 된다.
  const [openSeats, setOpenSeats] = useState<
    { dateLabel: string; district: string; cardTitle: string }[]
  >([]);
  const [step, setStep] = useState(0);
  // 동네 문항 안에서만 열리는 두 번째 화면. 단계를 늘리지 않는다 —
  // 수도권 분은 지금과 똑같이 네 번만 고르는데 진행 표시가 5로 바뀌면
  // 없던 부담이 생긴다.
  const [regionPick, setRegionPick] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    fetch(
      "https://bloomagain-backend-api-469607573966.asia-northeast3.run.app/api/v1/titatime/sessions",
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d) return;
        const items = Array.isArray(d) ? d : (d.sessions ?? d.items ?? []);
        // 여기서 자르지 않는다. 어느 자리를 보여줄지는 **답을 보고** 고른다
        // (pickSeats). 전에는 앞에서 두 개를 그냥 집어서, 여행을 고른 분께도
        // 브런치 자리가 떴다 — 제목은 "여행"이라 불러놓고 밑이 어긋났다.
        const open = items
          .filter(
            (x: Record<string, unknown>) =>
              x.status === "open" && typeof x.dateLabel === "string" && x.dateLabel,
          )
          .map((x: Record<string, unknown>) => ({
            dateLabel: String(x.dateLabel),
            district: String(x.district ?? ""),
            cardTitle: String(x.cardTitle ?? ""),
          }));
        setOpenSeats(open);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  const [done, setDone] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  // "티타가 뭔가요?"를 펼쳤나. 첫 화면에서 46%가 나가는데 안드로이드 이탈자가
  // 중앙값 34초를 보고도 아무것도 안 눌렀다 — 안 보여서도 어려워서도 아니라
  // 누를 이유를 못 찾은 것이다(2026-08-06). 이걸 누르는 사람이 많으면
  // "티타가 뭔지 몰라서"가 원인이라는 뜻이다.
  const [explained, setExplained] = useState(false);

  useEffect(() => setPlatform(detectPlatform()), []);

  // start는 화면이 실제로 보일 때만 쏜다. Meta 인앱 브라우저는 광고를 띄울 때
  // 랜딩을 미리 로드하는데, 그때도 찍히면 팬텀 도착이 쌓인다(/needs에서
  // 겪은 문제 그대로).
  const firedRef = useRef(false);
  useEffect(() => {
    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      const hydMs = Math.round(
        typeof performance !== "undefined" ? performance.now() : 0,
      );
      recordNeedsEvent("start", { variant: VARIANT, hydMs });
      logAnalyticsEvent("enjoy_start", { hyd_ms: hydMs });
      trackPixel("EnjoyStart", {}, true);
    };
    if (typeof document === "undefined" || document.visibilityState === "visible") {
      fire();
      return;
    }
    const onVisible = () => {
      if (document.visibilityState === "visible") fire();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // 나갈 때 보고 있던 질문을 남긴다 — 어디서 관두는지 잡는 유일한 방법.
  const stepRef = useRef(step);
  stepRef.current = step;
  // 자녀 블록은 답에 따라 갈리므로 "지금 보고 있는 질문"을 ref로 들고 있어야
  // pagehide에서 맞는 q를 남긴다.
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const doneRef = useRef(done);
  doneRef.current = done;
  const abandonRef = useRef(false);
  useEffect(() => {
    const onHide = () => {
      if (doneRef.current || abandonRef.current) return;
      // 한 번도 보인 적 없는 페이지는 이탈로 세지 않는다. start를 못 쐈다는
      // 건 화면에 뜬 적이 없다는 뜻이다(/needs에서 이 구멍 때문에 검사
      // 트래픽이 '첫 질문 이탈'로 잡혔다).
      if (!firedRef.current) return;
      abandonRef.current = true;
      const s = stepRef.current;
      const cur = s < QUESTIONS.length
        ? QUESTIONS[s]
        : childFlow(answersRef.current)[s - QUESTIONS.length];
      recordNeedsEvent("abandon", {
        variant: VARIANT,
        q: cur?.key ?? "hasChild",
        step: s,
      });
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  const underage = answers.ageBand === "under45";
  // 자녀 블록 안에 있나. step이 핵심 문항 수를 넘으면 그 뒤는 childFlow의 것.
  const inChild = step >= QUESTIONS.length;
  const child = childFlow(answers);
  const childIdx = step - QUESTIONS.length;

  function choose(value: string) {
    const q = inChild ? child[childIdx] : QUESTIONS[step];
    const next = pruneChild({ ...answers, [q.key]: value });
    setAnswers(next);
    recordNeedsEvent("answer", {
      variant: VARIANT,
      q: q.key,
      step,
      [q.key]: value,
    });
    if (q.key === "district" && value === "outside") {
      setRegionPick(true);
      return;
    }
    if (inChild) {
      // 갈림길을 방금 답했으니 새 답으로 다시 센다.
      if (childIdx < childFlow(next).length - 1) {
        setStep(step + 1);
        return;
      }
      setDone(true);
      return;
    }
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }
    // 연령까지 = 완주. 여기서 complete와 픽셀을 쏜다(자녀 블록 전). 45세
    // 이상은 결과 대신 자녀 블록으로 이어지고, 미만은 바로 결과.
    if (value === "under45") setDone(true);
    else setStep(step + 1);
    recordNeedsEvent("complete", {
      variant: VARIANT,
      activity: next.activity,
      district: next.district,
      outing: next.outing,
      ageBand: next.ageBand,
    });
    logAnalyticsEvent("enjoy_complete", { activity: next.activity ?? "" });
    if (value === "under45") {
      trackPixel("NeedsUnderage", {}, true);
    } else {
      trackPixel("NeedsAgeQualified", { age_band: value }, true);
      trackPixel("EnjoyComplete", { activity: next.activity ?? "" }, true);
    }
  }

  // 설문을 안 하고 바로 받는 길. phase를 download와 나눈다 — 섞으면
  // "완주한 사람이 얼마나 받나"를 못 읽는다(/needs가 8/1에 같은 이유로 나눴다).
  //
  // store는 StoreDownloadButton이 넘겨준다. 기기 판별을 그 컴포넌트가 하므로
  // 여기서 또 추측하면 판별과 어긋난다. 8/8~8/10에는 이 값을 아예 안 받아서
  // needs_survey_events의 store가 사흘간 통째로 비었다 — 다운로드 수는
  // 멀쩡한데 iOS/안드로이드 구분만 사라져 어드민에서 "전환 0"으로 보였다.
  function skipDownload(store?: StoreKind) {
    recordNeedsEvent("skip_download", { variant: VARIANT, ...answers, store });
    trackPixel("AppDownloadClick", { source: "enjoy_skip" }, true);
  }

  function explain() {
    if (!explained) recordNeedsEvent("explain", { variant: VARIANT });
    setExplained(true);
  }

  // 자녀 블록을 건너뛰고 결과로. 어느 질문에서 건너뛰었는지는 step에 남는다.
  function skipChild() {
    recordNeedsEvent("answer", { variant: VARIANT, q: "childSkip", step });
    setDone(true);
  }

  function back() {
    if (done) {
      setDone(false);
      return;
    }
    if (regionPick) {
      setRegionPick(false);
      return;
    }
    if (step > 0) setStep(step - 1);
  }

  // 설문을 끝내고 받는 길. store는 skipDownload와 같은 이유로 버튼에서 받는다.
  function download(store?: StoreKind) {
    recordNeedsEvent("download", { variant: VARIANT, ...answers, store });
    trackPixel("AppDownloadClick", { source: "enjoy" }, true);
  }

  async function share() {
    recordNeedsEvent("share", { variant: VARIANT });
    const data = {
      title: "506070, 이제 즐길 때",
      text: "전시, 연극, 뮤지컬, 여행 — 같이 할 분을 찾는 곳이에요. 45세 이상.",
      url: "https://tita-app.com/enjoy",
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(data.url);
      }
    } catch {
      /* 사용자가 취소한 것 — 조용히 넘긴다 */
    }
  }

  const page: React.CSSProperties = {
    minHeight: "100dvh",
    background: C.blush,
    fontFamily: KOREAN_FONT_STACK,
    display: "flex",
    justifyContent: "center",
    padding: "20px 20px 40px",
  };
  const inner: React.CSSProperties = { width: "100%", maxWidth: 460 };
  const optionBtn: React.CSSProperties = {
    width: "100%",
    textAlign: "left",
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 16.5,
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: "-0.3px",
    color: C.ink,
    background: C.white,
    border: "none",
    borderRadius: 14,
    padding: "13px 18px",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(160,90,70,0.10)",
  };
  // 보기와 확실히 달라 보여야 한다 — 아홉 번째 보기처럼 보이면 답으로 오해한다.
  const escapeBtn: React.CSSProperties = {
    fontFamily: KOREAN_FONT_STACK,
    fontSize: 13.5,
    fontWeight: 700,
    color: C.muted,
    background: "transparent",
    border: `1px solid ${C.line}`,
    borderRadius: 999,
    padding: "11px 12px",
    cursor: "pointer",
  };
  // 탈출구 두 개보다는 세고, 보기(흰 카드)와는 확실히 다르게. 답을 유도하는
  // 화면이라 이게 제일 눈에 띄면 안 된다.
  const getBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    width: "100%",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
    fontSize: 14.5,
    fontWeight: 800,
    color: C.terra,
    background: "transparent",
    border: `1.5px solid ${C.terra}`,
    borderRadius: 999,
    padding: "12px 16px",
    cursor: "pointer",
  };
  const bigBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    fontFamily: KOREAN_FONT_STACK,
    textDecoration: "none",
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: "-0.3px",
    color: C.white,
    background: C.terra,
    border: "none",
    borderRadius: 999,
    padding: "17px 24px",
    cursor: "pointer",
  };

  // ── 결과 ──────────────────────────────────────────────────────────────────
  if (done) {
    if (underage) {
      return (
        <main style={page}>
          <div style={inner}>
            <div style={{ height: 40 }} />
            <h1 style={{ fontSize: 25, fontWeight: 800, lineHeight: 1.45, color: C.ink, margin: "0 0 10px", letterSpacing: "-0.6px" }}>
              아직은 티타를
              <br />
              쓰실 수 없어요
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: C.muted, margin: "0 0 26px" }}>
              티타는 45세 이상만 이용하실 수 있어요.
              <br />
              대신, 요즘 즐길 거리를 찾고 계신{" "}
              <b style={{ color: C.ink }}>45세 이상 가족·친구</b>가
              <br />
              떠오르지 않으세요?
            </p>
            <button onClick={share} style={bigBtn}>
              그분께 알려주기
            </button>
          </div>
        </main>
      );
    }
    const chosen = QUESTIONS[0].options.find((o) => o.value === answers.activity);
    const districtLabel =
      QUESTIONS.find((q) => q.key === "district")?.options.find(
        (o) => o.value === answers.district,
      )?.label ?? "";
    const { list: shownSeats, matched: seatMatchesActivity } = pickSeats(
      openSeats,
      answers,
      districtLabel,
    );
    return (
      <main style={page}>
        <div style={inner}>
          <div style={{ height: 32 }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: C.terra, margin: "0 0 8px" }}>
            고르셨어요
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.45, color: C.ink, margin: "0 0 14px", letterSpacing: "-0.6px" }}>
            {chosen?.label ?? "함께할 거리"},
            <br />
            {/* 맞는 자리가 있을 때만 "기다리고 있어요"라고 한다. 여행을
                고르셨는데 브런치 자리를 보여주면서 기다린다고 하면 거짓말이
                된다 — 실측에서 여행 16.8% · 산책 15.6% 대 차·맛집 28.5% ·
                연극 36%로, 열리는 자리와 먼 답일수록 안 받으셨다. */}
            {shownSeats.length > 0 && seatMatchesActivity
              ? "같이 하실 분들이 기다리고 있어요"
              : "같이 하실 분들을 찾아드릴게요"}
          </h1>
          {shownSeats.length > 0 ? (
            <>
              {/* 열려 있는 자리를 이름으로 보여준다. "모이면 알려드릴게요"는
                  약속이라 기다려야 하지만, 날짜와 동네가 적힌 자리는 사실이라
                  지금 받을 이유가 된다(다운로드 전환 39%에서 멈춘 자리). */}
              <p style={{ fontSize: 15, lineHeight: 1.75, color: C.muted, margin: "0 0 14px" }}>
                {seatMatchesActivity
                  ? "지금 신청할 수 있는 자리가 있어요."
                  : "그 자리는 열리는 대로 알려드릴게요. 먼저 이런 자리가 열려 있어요."}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 18px" }}>
                {shownSeats.map((s2) => (
                  <li
                    key={s2.dateLabel}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "12px 14px",
                      marginBottom: 8,
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.ink,
                      lineHeight: 1.5,
                    }}
                  >
                    {/* 무슨 자리인지 먼저 보이게 한다. 날짜·동네만 적혀
                        있으면 고른 활동과 맞는지 알 수가 없었다. */}
                    {s2.cardTitle
                      ? s2.cardTitle.split(" · ")[0]
                      : s2.dateLabel}
                    <span style={{ fontWeight: 500, color: C.muted }}>
                      {" · "}
                      {s2.dateLabel}
                      {s2.district ? ` · ${s2.district}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: C.muted, margin: "0 0 28px" }}>
                첫마디도 티타가 꺼내드리니 편하게 오시면 돼요.
              </p>
            </>
          ) : (
            <p style={{ fontSize: 15, lineHeight: 1.75, color: C.muted, margin: "0 0 28px" }}>
              결이 통하는 서넛이 모이면 티타가 알려드려요.
              <br />
              첫마디도 티타가 꺼내드리니 편하게 오시면 돼요.
            </p>
          )}

          {/* 기기 판별·인앱 안내는 StoreDownloadButton이 전부 맡는다.
              여기서 다시 짜지 않는다 — 페이지마다 새로 짜다가 아이폰에서
              "눌러도 아무 일도 안 나는" 사고가 반복됐다. */}
          <StoreDownloadButton
            source="enjoy_result"
            label="티타 받기"
            onStoreClick={(store) => download(store)}
          />

          <p style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted, textAlign: "center", margin: "18px 0 0" }}>
            45세 이상 · 본인인증 · 셋넷이 함께
            <br />
            실명과 연락처는 다른 회원에게 보이지 않아요
          </p>

          {/* 받기 버튼 아래에 둔다. 위에 두면 "우리 도시는 아직이네"를 먼저
              읽고 버튼까지 안 내려온다 — 받을 이유를 먼저 주고, 사는 곳이
              아직이어도 괜찮다는 말을 뒤에 붙인다. */}
          <CityProgress />
        </div>
      </main>
    );
  }

  // ── 질문 ──────────────────────────────────────────────────────────────────
  const q = inChild ? child[childIdx] : QUESTIONS[step];
  // 진행 표시. 자녀 블록은 자기 점을 따로 찍는다 — 핵심 문항 표시가 갑자기
  // 아홉으로 늘면 "30초"라던 말이 거짓이 된다. 이건 별도의 짧은 추가 질문이다.
  const dots = inChild ? child.length : QUESTIONS.length;
  const dotAt = inChild ? childIdx : step;

  /** 시·도를 고르면 그 값이 동네 답이 된다. "outside"는 거쳐 가는 값일 뿐이다. */
  function chooseRegion(value: string) {
    setAnswers({ ...answers, district: value });
    recordNeedsEvent("answer", {
      variant: VARIANT,
      q: "district_region",
      step,
      district: value,
    });
    setRegionPick(false);
    setStep(step + 1);
  }

  return (
    <main style={page}>
      <div style={inner}>
        {step === 0 && (
          <p style={{ fontSize: 15, fontWeight: 800, color: C.terra, textAlign: "center", margin: "8px 0 14px", letterSpacing: "-0.3px" }}>
            506070, 이제 즐길 때
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <button
            onClick={back}
            style={{
              fontFamily: KOREAN_FONT_STACK,
              fontSize: 14,
              fontWeight: 700,
              color: C.muted,
              background: "transparent",
              border: "none",
              padding: 3,
              cursor: "pointer",
              visibility: step === 0 ? "hidden" : "visible",
            }}
          >
            ← 이전
          </button>
          <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: dots }, (_, i) => (
              <span
                key={i}
                style={{
                  width: i === dotAt ? 18 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: i <= dotAt ? C.terra : C.line,
                  transition: "all .2s",
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>
            {inChild ? "추가 " : ""}{dotAt + 1}/{dots}
          </span>
        </div>

        {inChild && childIdx === 0 && (
          // 네 문항이 끝난 자리에서 갑자기 가족 얘기가 나오면 "이건 또 뭐지"가
          // 된다. 왜 묻는지와 안 해도 된다는 걸 한 줄로 먼저 말한다.
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: C.terra, fontWeight: 700, margin: "0 0 10px" }}>
            다 됐어요. 몇 가지만 더 물어볼게요 — 건너뛰셔도 돼요.
          </p>
        )}
        <h2 style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.42, letterSpacing: "-0.6px", color: C.ink, margin: "0 0 6px", whiteSpace: "pre-line" }}>
          {regionPick ? "어느 지역에\n계세요?" : q.title}
        </h2>
        {(regionPick || q.sub) && (
          <p style={{ fontSize: 13.5, color: C.muted, fontWeight: 600, margin: "0 0 16px" }}>
            {regionPick ? "시·도만 고르시면 돼요" : q.sub}
          </p>
        )}

        {regionPick ? (
          // 이름이 두 글자라 세 칸이 들어간다. 두 칸으로 깔았더니 일곱 줄이
          // 되어 벽처럼 보였다 — 앞 화면(익숙한 동네 이름 열한 개)에서 넘어온
          // 참이라, 갑자기 목록이 길어지면 처음부터 다시 하는 기분이 든다.
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
              {REGIONS.map((o) => (
                <button key={o.value} onClick={() => chooseRegion(o.value)} style={optionBtn}>
                  {o.label}
                </button>
              ))}
            </div>
            {/* 고르면 뭐가 좋은지를 목록 아래에 둔다. 위에 두면 안내문을 읽느라
                버튼이 늦게 보인다. */}
            <p style={{ fontSize: 12.5, lineHeight: 1.7, color: C.muted, margin: "14px 0 0", textAlign: "center" }}>
              그 지역에 함께하실 분들이 모이면
              <br />
              그곳에서 자리를 엽니다
            </p>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {q.options.map((o) => (
              <button key={o.value} onClick={() => choose(o.value)} style={optionBtn}>
                {o.label}
              </button>
            ))}
          </div>
        )}

        {inChild && (
          // 보기(흰 카드)와 확실히 다르게 — 여섯 번째 보기로 읽히면 안 된다.
          // 탭을 닫는 사람과 결과로 가는 사람은 다르다. 후자만 앱을 받는다.
          <div style={{ marginTop: 14 }}>
            <button onClick={skipChild} style={{ ...escapeBtn, width: "100%" }}>
              건너뛰고 결과 보기
            </button>
          </div>
        )}

        {/* 첫 화면에만 탈출구를 둔다. 여기서 46%가 나가는데, 누를 게 보기밖에
            없어서 안 맞으면 나가는 것 말고 할 수 있는 게 없었다.
            둘 중 어느 쪽이 눌리는지로 원인이 갈린다 — "내 답이 없다"인지
            "이게 뭔지 모르겠다"인지. */}
        {step === 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => choose("unsure")}
                style={{ ...escapeBtn, flex: 1 }}
              >
                아직 잘 모르겠어요
              </button>
              <button
                onClick={explain}
                style={{ ...escapeBtn, flex: 1 }}
                aria-expanded={explained}
              >
                티타가 뭔가요?
              </button>
            </div>

            {/* 설문에 답할 생각이 없는 사람에게도 길을 준다. /needs 실측으로는
                답 안 한 396명 중 3명(1%)만 이 길로 갔다 — 큰 기대는 안 한다.
                다만 지금은 그 1%마저 통째로 잃고 있다.

                skipDownload로 따로 세서 "완주한 사람이 얼마나 받나"를 흐리지
                않는다. 기기 판별과 아이폰 인앱 안내는 버튼이 알아서 한다. */}
            <div style={{ marginTop: 8 }}>
              <StoreDownloadButton
                source="enjoy_skip"
                label="티타 받으러 가기"
                style={getBtn}
                onStoreClick={(store) => skipDownload(store)}
              />
            </div>

            {explained && (
              // 과장하지 않는다. 본인인증은 누구인지를 확인할 뿐 의도를 거르지
              // 못한다 — "이상한 사람 못 들어와요"류는 쓰지 않는다.
              <div
                style={{
                  marginTop: 8,
                  background: C.white,
                  border: `1px solid ${C.line}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  fontSize: 13.5,
                  lineHeight: 1.75,
                  color: C.ink,
                }}
              >
                45세 이상만 들어오는 앱이에요. 결이 맞는 서넛이 모여
                차 한잔하거나(티타임), 만나기 전에 대화부터 나눕니다.
                둘 다 티타가 자리를 잡아드려요.
                <span style={{ color: C.muted }}> 들어오시려면 본인인증을 하셔야 해요.</span>
              </div>
            )}
          </div>
        )}

        <p style={{ fontSize: 12.5, color: C.muted, textAlign: "center", margin: "18px 0 0" }}>
          가입 없이 30초 · 45세 이상
        </p>
      </div>
    </main>
  );
}
