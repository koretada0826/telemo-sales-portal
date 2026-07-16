import Link from "next/link";
import { Home, Search } from "lucide-react";

/** グローバル404ページ */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg p-6">
      <div className="max-w-md rounded-card border border-line bg-white p-10 text-center shadow-card">
        <p className="text-sm font-semibold text-mint">404</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">お探しのページが見つかりません</h1>
        <p className="mt-3 text-sm text-ink-soft">
          URLが変更された、削除された、または権限がない可能性があります。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-btn bg-mint px-4 py-2 text-sm font-medium text-white hover:bg-mint-dark"
          >
            <Home className="h-4 w-4" />
            ダッシュボードへ
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-btn border border-line px-4 py-2 text-sm text-ink hover:bg-mint-softer"
          >
            <Search className="h-4 w-4" />
            検索する
          </Link>
        </div>
      </div>
    </div>
  );
}
