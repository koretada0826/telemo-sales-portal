"use client";

// ポータル内で予期しないエラーが発生した時のフォールバック UI。

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 本番はSentry等へ送信
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="max-w-md rounded-card border border-danger/30 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="h-6 w-6 text-danger" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-ink">問題が発生しました</h2>
        <p className="mt-2 text-sm text-ink-soft">
          このページの読み込み中にエラーが起きました。
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-ink-soft/70">エラーID: {error.digest}</p>
        )}
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="secondary" onClick={reset}>
            <RotateCcw className="h-4 w-4" />再読み込み
          </Button>
        </div>
      </div>
    </div>
  );
}
