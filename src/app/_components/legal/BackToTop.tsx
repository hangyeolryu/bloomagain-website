"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 bg-[#0F1A35] text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center hover:bg-[#10367D] focus:outline-none focus:ring-4 focus:ring-[#BFE38A]/50 transition-colors"
    >
      <span className="text-xl" aria-hidden="true">
        ↑
      </span>
      <span className="sr-only">맨 위로</span>
    </button>
  );
}
