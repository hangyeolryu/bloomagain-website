// 카카오톡 공유 — 45+ 여성 최강 확산 채널.
//
// env 방식: NEXT_PUBLIC_KAKAO_JS_KEY 없으면 아무것도 안 함(버튼도 안 뜸).
// SDK는 필요할 때(첫 공유 클릭) 지연 로드해 초기 로딩을 막지 않는다.
// 공유 카드 이미지는 결과별 OG(/gyeol/{code}/opengraph-image)를 그대로 쓴다.

/* eslint-disable @typescript-eslint/no-explicit-any */

// JS 키는 등록된 웹 도메인에서만 동작하도록 잠겨 있어 공개돼도 안전한 값
// (모든 클라이언트 번들에 노출됨) — 픽셀과 동일하게 기본값으로 박아 env·빌드
// 이슈로 깨지지 않게 한다. 필요 시 NEXT_PUBLIC_KAKAO_JS_KEY로 덮어씀.
export const KAKAO_JS_KEY =
  process.env.NEXT_PUBLIC_KAKAO_JS_KEY || "13772752b37f3d38fc4eedfd6dd37333";

let loadingPromise: Promise<any> | null = null;

function loadSdk(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  const w = window as any;
  if (w.Kakao) return Promise.resolve(w.Kakao);
  if (loadingPromise) return loadingPromise;
  loadingPromise = new Promise((resolve) => {
    const sc = document.createElement("script");
    sc.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
    sc.async = true;
    sc.onload = () => resolve((window as any).Kakao ?? null);
    sc.onerror = () => resolve(null);
    document.head.appendChild(sc);
  });
  return loadingPromise;
}

/**
 * 카카오톡 공유 시트 열기. 키·SDK 없으면 false 반환(호출부가 폴백).
 * @return 공유 시트를 실제로 띄웠으면 true
 */
export async function shareKakao(opts: {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}): Promise<boolean> {
  if (!KAKAO_JS_KEY) return false;
  const Kakao = await loadSdk();
  if (!Kakao) return false;
  try {
    if (!Kakao.isInitialized()) Kakao.init(KAKAO_JS_KEY);
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: opts.title,
        description: opts.description,
        imageUrl: opts.imageUrl,
        link: { mobileWebUrl: opts.url, webUrl: opts.url },
      },
      buttons: [
        {
          title: "나도 결 알아보기",
          link: { mobileWebUrl: opts.url, webUrl: opts.url },
        },
      ],
    });
    return true;
  } catch {
    return false;
  }
}
