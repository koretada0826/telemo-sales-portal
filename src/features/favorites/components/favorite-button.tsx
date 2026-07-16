"use client";

// お気に入りトグルボタン（星アイコン）。
// クリックでServer Actionを呼び、状態をリアルタイム反転。

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import type { FavoriteContentType } from "@/types/favorite";
import { toggleFavoriteAction } from "@/features/favorites/actions";

type Props = {
  contentType: FavoriteContentType;
  contentId: string;
  /** 初期状態（Server Componentから渡される） */
  initialFavorited: boolean;
  /** 見た目：icon（アイコンのみ） or button（テキスト付き） */
  variant?: "icon" | "button";
};

export function FavoriteButton({ contentType, contentId, initialFavorited, variant = "button" }: Props) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // 楽観的更新（UIをすぐ反映、失敗時に戻す）
    const prev = favorited;
    setFavorited(!prev);
    startTransition(async () => {
      const r = await toggleFavoriteAction(contentType, contentId);
      if (r.ok) {
        setFavorited(r.favorited);
        toast.success(r.favorited ? "お気に入りに追加しました" : "お気に入りから外しました");
        router.refresh();
      } else {
        setFavorited(prev);
        toast.error(r.error);
      }
    });
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-pressed={favorited}
        aria-label={favorited ? "お気に入りから外す" : "お気に入りに追加"}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
          favorited ? "text-warning hover:bg-warning/10" : "text-ink-soft hover:bg-mint-softer",
        )}
      >
        <Star className={cn("h-5 w-5", favorited && "fill-current")} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={favorited}
      className={cn(
        "inline-flex items-center gap-2 rounded-btn border px-3 py-2 text-sm transition-colors",
        favorited
          ? "border-warning bg-warning/10 text-warning"
          : "border-line bg-white text-ink hover:bg-mint-softer",
      )}
    >
      <Star className={cn("h-4 w-4", favorited && "fill-current")} />
      {favorited ? "お気に入り登録済み" : "お気に入りに追加"}
    </button>
  );
}
