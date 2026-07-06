import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // metadataBase가 있어야 opengraph-image / twitter-image URL이 절대경로로
  // 풀린다. 없으면 링크 공유 시 프리뷰 이미지가 깨진다.
  metadataBase: new URL("https://tita-app.com"),
  title: "티타 — 만 45세 이상, 결이 맞는 친구를 만나는 곳",
  description:
    "데이팅 앱이 아닙니다. NICE 본인인증 된 또래와 안심하고 만드는 동네 친구. 매일 한 질문이 쌓이면 결이 맞는 분이 가까워져요.",
  // Icon stack — modern browsers prefer SVG; older / OS-native surfaces fall
  // back to fixed-size PNG. iOS home-screen uses the 180×180 apple-touch icon.
  icons: {
    icon: [
      { url: "/app_icon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png",  sizes: "32x32",  type: "image/png" },
      { url: "/icon-16.png",  sizes: "16x16",  type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/icon-192.png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    // images는 지정하지 않는다 — Next가 src/app/opengraph-image.tsx를
    // 자동으로 1200×630 OG 이미지로 잡는다.
    title: "티타 — 만 45세 이상, 결이 맞는 친구를 만나는 곳",
    description:
      "데이팅 앱이 아닙니다. 본인인증 된 또래와 안심하고 만드는 동네 친구. 매일 한 질문이 쌓이면 결이 맞는 분이 가까워져요.",
    siteName: "티타",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    // 큰 가로 카드. 이미지는 opengraph-image.tsx를 공유한다.
    card: "summary_large_image",
    title: "티타 — 만 45세 이상, 결이 맞는 친구를 만나는 곳",
    description:
      "데이팅 앱이 아닙니다. 안심하고 만드는 동네 친구.",
  },
};

export const viewport: Viewport = {
  // Brand navy — drives the iOS Safari address-bar tint and Android Chrome
  // status-bar color so the chrome blends into the marketing palette instead
  // of falling back to default white.
  themeColor: "#10367D",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
