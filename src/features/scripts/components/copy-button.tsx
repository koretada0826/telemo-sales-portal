"use client";

// 指定テキストをクリップボードにコピーするボタン。
// スクリプト詳細で各セクション・全文コピーに使う。

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";

type Props = {
  text: string;
  label?: string;
  className?: string;
};

export function CopyButton({ text, label = "コピー", className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("クリップボードにコピーしました");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("コピーに失敗しました");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1 rounded-btn border border-line px-2.5 py-1.5 text-xs",
        "text-ink-soft hover:bg-mint-softer hover:text-mint-dark",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-mint" /> : <Copy className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}
