"use client";

// ページネーション。現在ページ ± 2 を表示。
// URLクエリ ?page=N を書き換えて遷移する。

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";

type Props = {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

export function Pagination({ total, page, perPage, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ページ番号を変えてURLを更新
  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // 表示するページ番号の配列を作る（現在の±2、必要なら省略記号）
  const pages: (number | "…")[] = [];
  const push = (v: number | "…") => {
    if (pages[pages.length - 1] !== v) pages.push(v);
  };
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
      push(i);
    } else {
      push("…");
    }
  }

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <nav
      aria-label="ページネーション"
      className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row"
    >
      {/* 左：総件数・現在位置 */}
      <p className="text-sm text-ink-soft">
        {formatNumber(start)}〜{formatNumber(end)} / {formatNumber(total)}件
      </p>

      {/* 右：ページボタン */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-btn border border-line",
            "hover:bg-mint-softer disabled:pointer-events-none disabled:opacity-40",
          )}
          aria-label="前のページ"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e-${i}`} className="px-2 text-sm text-ink-soft">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => goTo(p)}
              className={cn(
                "inline-flex h-9 min-w-[36px] items-center justify-center rounded-btn px-2 text-sm",
                p === page
                  ? "bg-mint text-white"
                  : "border border-line hover:bg-mint-softer",
              )}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-btn border border-line",
            "hover:bg-mint-softer disabled:pointer-events-none disabled:opacity-40",
          )}
          aria-label="次のページ"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
