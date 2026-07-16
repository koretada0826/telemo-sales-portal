import { Loader2 } from "lucide-react";

/**
 * ポータル内共通のローディング表示。
 * ページ遷移時にサーバーからの取得完了を待つ間、これが自動表示される。
 */
export default function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-mint" />
        <p className="text-sm text-ink-soft">読み込み中…</p>
      </div>
    </div>
  );
}
