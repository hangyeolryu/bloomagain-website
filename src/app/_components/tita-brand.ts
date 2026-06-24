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
export const KOREAN_FONT_STACK =
  '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Noto Sans CJK KR", "Noto Sans KR", "Malgun Gothic", Pretendard, sans-serif';

// Store URLs — exposed here so every page's "앱 받기" button points at
// the same destination. Easier than threading these through props.
export const APP_STORE_URL = "https://apps.apple.com/app/id6751523550";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.bloomagain.bloomagain";
