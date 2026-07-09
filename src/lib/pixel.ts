// Meta(Facebook) Pixel — 광고 리타게팅·전환 최적화용.
//
// 왜: 결 테스트 완료자를 '따뜻한 청중'으로 모아, 다운로드 광고를 그들에게만
// 다시 띄우면 콜드 설치 광고보다 전환 단가가 훨씬 싸다. 그러려면 픽셀이
// (1) 방문(PageView) (2) 테스트 완료(Lead) (3) 다운로드 클릭을 브라우저에서
// Meta로 쏴줘야 한다. GA4(logAnalyticsEvent)와 병행 — 서로 다른 목적.
//
// Pixel ID는 코드에 박지 않는다. NEXT_PUBLIC_META_PIXEL_ID 환경변수로 주입하고,
// 없으면 조용히 no-op (커밋 안전). 광고 시작할 때 .env에 ID만 넣고 재배포.

/* eslint-disable @typescript-eslint/no-explicit-any */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Meta Pixel 이벤트 전송. fbq 미로드/미설정 시 조용히 무시.
 * @param event 이벤트명 (표준: Lead·ViewContent 등 / 커스텀: 임의 문자열)
 * @param params 부가 파라미터
 * @param custom true면 trackCustom (표준 이벤트가 아닌 커스텀 이벤트)
 */
export function trackPixel(
  event: string,
  params?: Record<string, unknown>,
  custom = false,
): void {
  if (typeof window === "undefined") return;
  const fbq = (window as any).fbq;
  if (typeof fbq !== "function") return;
  try {
    fbq(custom ? "trackCustom" : "track", event, params);
  } catch {
    /* swallow — 분석이 UX를 막지 않는다 */
  }
}
