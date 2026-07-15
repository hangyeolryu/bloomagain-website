import type { Metadata } from "next";

// page.tsx は "use client" のため metadata を直接 export できない。
// このサーバー layout が診断入口のタイトル・説明・OGテキストを担う。
export const metadata: Metadata = {
  title: "波長タイプ診断 — あなたはどんな波長の人？ | ティタ",
  description:
    "MBTIじゃなくて、人と人のあいだの「波長」。12の質問・3分で、あなたの波長タイプと相性のいい友だちがわかります。登録なしで、すぐ。45歳以上のための、安心して集えるティタ。",
  openGraph: {
    title: "あなたはどんな波長の人？ 🍵 — 3分の波長タイプ診断",
    description:
      "MBTIじゃなくて、人と人の波長。登録なし3分で、あなたの波長タイプと相性のいい友だちまで。",
    siteName: "ティタ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "あなたはどんな波長の人？ 🍵 — 3分の波長タイプ診断",
    description: "MBTIじゃなくて、人と人の波長。登録なし、3分で。",
  },
};

export default function GyeolJaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
