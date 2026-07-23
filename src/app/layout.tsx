import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Suspense } from "react";
import { AnalyticsTracker } from "./_components/AnalyticsTracker";
import { MetaPixel } from "./_components/MetaPixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 고운돋움 — 흔하지 않으면서 50-60대에 편안하게 읽히는 한글 서체.
// next/font/google은 이 폰트의 korean 서브셋을 타입으로 열어두지 않아,
// 원본 TTF(7.2MB)를 한글 전체 음절+영문/기호만 남겨 woff2(384KB)로
// 서브셋한 파일을 self-host 한다. 단일 굵기(400)라 굵은 제목은 브라우저
// 합성 볼드로 표현된다(미니멀 톤). display:swap로 폴백 먼저 그린다.
const gowunDodum = localFont({
  src: "./_fonts/GowunDodum-subset.woff2",
  variable: "--font-gowun",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase가 있어야 opengraph-image / twitter-image URL이 절대경로로
  // 풀린다. 없으면 링크 공유 시 프리뷰 이미지가 깨진다.
  metadataBase: new URL("https://tita-app.com"),
  title: "티타 (Tita) — 결이 맞는 친구",
  description:
    "오후 한 잔의 안심 티타임. 본인인증·AI 안전망으로 보호받는 결친구 매칭. 툭 던져도 착 받아주는 우리의 티키타카.",
  // Icon stack — modern browsers prefer SVG; older / OS-native surfaces fall
  // back to fixed-size PNG. iOS home-screen uses the 180×180 apple-touch icon.
  icons: {
    icon: [
      { url: "/app_icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/icon-192.png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    // images 미지정 — Next가 src/app/opengraph-image.tsx를 1200×630 OG로 자동 사용.
    title: "티타 — 오후 한 잔의 안심 티타임",
    description:
      "결이 통하는 친구들, 천천히. 본인인증·AI 안전망으로 보호받는 친구 매칭.",
    siteName: "티타",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    // 큰 가로 카드. 이미지는 opengraph-image.tsx를 공유.
    card: "summary_large_image",
    title: "티타 (Tita) — 결이 맞는 친구",
    description: "오후 한 잔의 안심 티타임. 데이팅 앱이 아닙니다.",
  },
  // 검색엔진 사이트 소유확인.
  //  · 네이버: searchadvisor.naver.com에서 사이트 등록 시 주는 코드를
  //    NEXT_PUBLIC_NAVER_SITE_VERIFICATION 환경변수에 넣으면 아래 메타로 나간다.
  //    (없으면 렌더 안 됨 — 코드 받기 전엔 비워둬도 안전)
  //  · 구글: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION (Search Console용, 선택).
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION
      ? {
          other: {
            "naver-site-verification":
                process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION,
          },
        }
      : {}),
  },
};

export const viewport: Viewport = {
  // 2026-06 rebrand: navy → Monotone Forest. Drives iOS Safari address-bar
  // tint and Android Chrome status-bar color so the chrome blends into the
  // marketing palette.
  themeColor: "#1F4E3D",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${gowunDodum.variable} antialiased`}
      >
        {/* Suspense boundary required: AnalyticsTracker uses
            useSearchParams which Next.js needs to suspend on initial
            render. Static export build fails otherwise with
            "useSearchParams should be wrapped in a suspense boundary." */}
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
