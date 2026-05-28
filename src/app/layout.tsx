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
  title: "다시, 봄 (Bloom Again) — 50+ 세대를 위한 안전한 친구·모임 앱",
  description:
    "안전 인프라는 모든 회원에게 무료. NICE 본인인증 + AI 4계층 안전 보호로 신뢰할 수 있는 친구·모임을 만나세요. 만남앱이 아닙니다.",
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
    title: "다시, 봄 — 50+ 세대를 위한 친구·모임 앱",
    description:
      "특허 출원 안전 기술로 보호받는 50+ 전용 커뮤니티. 모임 참여 무제한 무료, 창립 멤버 1~500명 6개월 무료 진행 중.",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "다시, 봄 로고" }],
    siteName: "다시, 봄",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "다시, 봄 (Bloom Again)",
    description:
      "50+ 세대를 위한 안전한 친구·모임 앱. 만남앱이 아닙니다.",
    images: ["/icon-512.png"],
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
