import type { Metadata } from "next";
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
  title: "다시, 봄 (Bloom Again) - 50세 이상을 위한 따뜻한 동반자 앱",
  description:
    "50세 이상 분들을 위한 소셜 네트워킹 플랫폼. AI 기반 인연 추천, 서클 커뮤니티, 안전한 소통을 제공합니다.",
  icons: {
    icon: [{ url: "/logo_icon.svg" }],
  },
  openGraph: {
    title: "다시, 봄 (Bloom Again)",
    description:
      "50세 이상을 위한 따뜻하고 안전한 소셜 네트워킹 앱. 새로운 인연과 의미 있는 소통을 시작하세요.",
    images: [{ url: "/logo_icon.svg", alt: "다시, 봄 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "다시, 봄 (Bloom Again)",
    description:
      "50세 이상을 위한 따뜻한 동반자 앱. AI 기반 인연 추천과 안전한 소통 환경을 제공합니다.",
    images: ["/logo_icon.svg"],
  },
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
