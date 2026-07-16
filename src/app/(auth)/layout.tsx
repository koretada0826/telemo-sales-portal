// 認証系ページ（/login, /register）の共通レイアウト。
// サイドバー・ヘッダーは無い、シンプルな中央寄せ枠のみ。

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg p-4">
      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="mb-6 flex flex-col items-center leading-tight">
          <span className="text-3xl font-bold tracking-widest text-sidebar">TELEMO</span>
          <span className="mt-0.5 text-[10px] tracking-[0.25em] text-mint-dark">
            AI SALES AUTOMATION
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
