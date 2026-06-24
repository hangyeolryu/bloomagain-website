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
  title: "티타 (Tita) — 결이 맞는 40+ 친구",
  description:
    "본인인증을 마친 회원만 함께하는 안전한 친구 매칭. AI가 결이 맞는 분을 동네에서 찾아드립니다.",
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
    title: "티타 — 결이 맞는 40+ 친구",
    description:
      "본인인증·AI 안전망으로 보호되는 40+ 친구 매칭. 동네에서 결이 통하는 분을 찾아드려요.",
    images: [
      { url: "/icon-512.png", width: 512, height: 512, alt: "티타 로고" },
    ],
    siteName: "티타",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "티타 (Tita)",
    description: "결이 맞는 친구 매칭.",
    images: ["/icon-512.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
