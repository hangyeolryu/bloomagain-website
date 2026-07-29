// 티타 (Tita) brand tokens shared across every public page.
//
// Why a single source of truth
// ----------------------------
// Before the 2026-06 rebrand, every page defined its own BRAND const
// (typically with the navy palette inline). When we swapped to forest,
// I had to chase 14 separate copies — easy to miss one and end up with
// a single page still rendering navy. Importing from here ties them all
// to one constant; future palette tweaks land in one diff.
//
// Keep these in lockstep with the Flutter app's `lib/core/theme/
// app_theme.dart` so the WebView pages (about/terms/privacy/security)
// blend into the app surface seamlessly.

export const TITA = {
  forest: "#1F4E3D",      // primary
  forestDeep: "#143329",  // pressed / emphasis
  forestMid: "#3A6B58",   // success aligned with primary
  ink: "#1A2E26",         // body text (deep forest black)
  muted: "#6B7D6E",       // secondary text (muted sage)
  mutedSoft: "#9CA89E",   // hints / disabled
  sage: "#D6E2D8",        // soft sage border / surface
  cream: "#FBF7F0",       // page background
  surface: "#F2EDE3",     // warm secondary surface
  camel: "#D4B895",       // warm accent (quiet luxury)
  white: "#FFFFFF",       // explicit white card surface
} as const;

// Korean-first font stack. Geist (the project default) only ships Latin
// glyphs; without this fallback, Korean characters fall back to whatever
// the OS picks and look inconsistent across iOS/Android/desktop.
// 1순위: 고운돋움(next/font가 --font-gowun 변수로 주입). 웹폰트가 로드되기
// 전/실패 시엔 아래 OS 폰트로 폴백해 깨지지 않게 한다.
export const KOREAN_FONT_STACK =
  'var(--font-gowun), -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans CJK KR", "Noto Sans KR", "Malgun Gothic", Pretendard, sans-serif';

// Store URLs — exposed here so every page's "앱 받기" button points at
// the same destination. Easier than threading these through props.
export const APP_STORE_URL = "https://apps.apple.com/app/id6751523550";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.bloomagain.bloomagain";

// 안드로이드 인앱 브라우저(인스타·카톡 등)에서도 Play 스토어 '앱'을 강제로 열기
// 위한 intent URL. scheme=market + package=com.android.vending 로 네이티브
// 스토어를 띄우고, 실패하면 browser_fallback_url(https Play 링크)로 자동 폴백한다.
// → 50대가 "외부 브라우저로 열기" 같은 조작을 안 해도 설치 화면이 바로 뜬다.
// (일반 크롬에서도 안전 — 폴백이 있어 그냥 스토어로 감.)
export const PLAY_STORE_INTENT_URL =
  "intent://details?id=com.bloomagain.bloomagain#Intent;scheme=market;package=com.android.vending;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.bloomagain.bloomagain;end";
