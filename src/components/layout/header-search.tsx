"use client";

// ヘッダー中央の横断検索フォーム。
// 送信で /search?q=xxx に遷移する。

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // /search ページ上ではURLクエリを初期値に
  const [q, setQ] = useState("");

  useEffect(() => {
    if (pathname === "/search") setQ(searchParams.get("q") ?? "");
  }, [pathname, searchParams]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-2xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ポータル内を横断検索（Enterで実行）"
        className={cn(
          "h-11 w-full rounded-full border border-line bg-bg pl-11 pr-4 text-sm",
          "placeholder:text-ink-soft",
          "focus:border-mint focus:bg-white",
        )}
      />
    </form>
  );
}
