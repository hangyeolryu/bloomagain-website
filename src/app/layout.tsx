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
  title: "다시, 봄",
  description: "50세 이상을 위한 따뜻한 동반자 앱",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logotile.png", type: "image/png" },
    ],
    shortcut: "/logotile.png",
    apple: "/logotile.png",
  },
  openGraph: {
    title: "다시, 봄",
    description: "50세 이상을 위한 따뜻한 동반자 앱",
    images: [{ url: "/logotile.png", alt: "다시, 봄 로고" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "다시, 봄",
    description: "50세 이상을 위한 따뜻한 동반자 앱",
    images: ["/logotile.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
