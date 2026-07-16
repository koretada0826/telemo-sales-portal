"use client";

// 通知を既読にするボタン（ボタン単体）

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { markNotificationReadAction, markAllNotificationsReadAction } from "../actions";
import { cn } from "@/lib/utils/cn";

type Props = { id?: string; all?: boolean; className?: string };

export function MarkReadButton({ id, all, className }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      if (all) await markAllNotificationsReadAction();
      else if (id) await markNotificationReadAction(id);
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1 rounded-btn border border-line px-2.5 py-1.5 text-xs text-ink-soft",
        "hover:bg-mint-softer hover:text-mint-dark disabled:opacity-50",
        className,
      )}
    >
      <Check className="h-3.5 w-3.5" />
      {all ? "すべて既読にする" : "既読にする"}
    </button>
  );
}
