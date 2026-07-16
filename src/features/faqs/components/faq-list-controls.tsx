"use client";

// 一覧画面の検索・絞込・並び替えUI。
// 入力内容をURLのクエリ文字列に反映（ブックマーク・戻る対応のため）。

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FAQ_CATEGORIES } from "@/data/mock/categories";
import { cn } from "@/lib/utils/cn";

export function FaqListControls() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get("q") ?? "";
  const currentCategory = searchParams.get("categoryId") ?? "";
  const currentSort = searchParams.get("sort") ?? "newest";
  const isUnansweredOnly = searchParams.get("unanswered") === "1";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const toggleUnanswered = () => {
    updateParam("unanswered", isUnansweredOnly ? null : "1");
  };

  return (
    <div className="mb-5 space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_180px]">
        {/* 検索キーワード */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <Input
            type="search"
            placeholder="質問・回答内を検索"
            defaultValue={currentQ}
            className="pl-9"
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParam("q", (e.target as HTMLInputElement).value);
            }}
            onBlur={(e) => updateParam("q", e.target.value)}
            disabled={isPending}
          />
        </div>

        {/* カテゴリー絞り込み */}
        <Select
          value={currentCategory}
          onChange={(e) => updateParam("categoryId", e.target.value)}
          disabled={isPending}
        >
          <option value="">すべてのカテゴリー</option>
          {FAQ_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>

        {/* 並び替え */}
        <Select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          disabled={isPending}
        >
          <option value="newest">更新が新しい順</option>
          <option value="oldest">作成が古い順</option>
          <option value="most-viewed">閲覧数が多い順</option>
          <option value="most-favorited">お気に入りが多い順</option>
        </Select>
      </div>

      {/* 未回答のみトグル（オレンジ系で目立たせる） */}
      <div>
        <button
          type="button"
          onClick={toggleUnanswered}
          disabled={isPending}
          aria-pressed={isUnansweredOnly}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            isUnansweredOnly
              ? "border-warning bg-warning/10 text-warning"
              : "border-line bg-white text-ink-soft hover:bg-mint-softer",
          )}
        >
          <HelpCircle className="h-3.5 w-3.5" />
          {isUnansweredOnly ? "未回答のみ表示中（クリックで解除）" : "未回答のみ表示"}
        </button>
      </div>
    </div>
  );
}
