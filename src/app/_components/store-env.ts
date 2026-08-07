// 스토어로 보내기 전에 알아야 하는 기기·브라우저 정보. 다운로드 CTA가 여러
// 페이지에 흩어져 있어서 감지 로직이 복사되다 서로 어긋났다 — 여기 하나만 둔다.

export type Platform = "ios" | "android" | "other";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  // iPadOS 13+ Safari는 데스크탑 UA로 위장 → 터치 지원 Mac을 iOS로 본다.
  const iPadOS =
    /Macintosh/.test(ua) &&
    typeof document !== "undefined" &&
    "ontouchend" in document;
  if (/iPad|iPhone|iPod/.test(ua) || iPadOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

// 인스타·페북·카톡·네이버·라인 인앱 브라우저.
export function detectInApp(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|NAVER\(inapp|Line\//.test(
    navigator.userAgent
  );
}

/**
 * iOS에서 App Store 링크를 JS로 열면(= window.location.href 대입) 앱이 안 뜬다.
 *
 * apps.apple.com은 유니버설 링크다. iOS는 유니버설 링크를 "사용자 제스처로
 * 시작된 내비게이션"에서만 App Store 앱으로 넘긴다. 스크립트가 일으킨 이동은
 * 그냥 웹뷰/탭 안에서 apps.apple.com 웹페이지로 로드된다. 일반 사파리에서는
 * 그 웹페이지가 다시 앱을 띄워 주지만, 인앱 브라우저(WKWebView)에서는 거기서
 * 끝난다 — 사용자 눈엔 "눌러도 아무 일 없음"이다.
 *
 * 그래서 인앱 브라우저에서는 자동 리다이렉트를 아예 하지 않고, 사용자가 직접
 * 탭할 <a href>를 보여준다. 탭은 제스처라 유니버설 링크가 정상 동작한다.
 *
 * (itms-apps:// 로 우회하려는 시도가 반복되는데, 그건 더 나쁘다. WKWebView는
 *  모르는 커스텀 스킴을 호스트 앱이 처리해 주지 않으면 조용히 무시하고,
 *  itunes.apple.com 호스트 자체가 은퇴해 일반 사파리에서도 죽은 링크다.)
 */
export function canAutoRedirectToStore(
  platform: Platform,
  inApp: boolean
): boolean {
  if (platform === "android") return true; // intent:// 는 인앱에서도 뜬다
  if (platform === "ios") return !inApp;
  return false;
}
