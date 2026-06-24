"use client";

// Fires a Firebase Analytics `page_view` event on every Next.js route
// change. Without this, only the initial document load registers — soft
// navigations (Link, router.push) silently miss because Firebase
// Analytics' built-in pageview hook is set up for full-page reloads.
//
// Mount once at the root layout. The component renders nothing visible.

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logAnalyticsEvent } from "@/lib/firebase";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const search = searchParams?.toString() ?? "";
    const fullPath = search ? `${pathname}?${search}` : pathname;
    logAnalyticsEvent("page_view", {
      page_path: fullPath,
      page_title: typeof document !== "undefined" ? document.title : "",
    });
  }, [pathname, searchParams]);

  return null;
}
