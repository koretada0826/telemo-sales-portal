import { cn } from "@/lib/utils/cn";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

/**
 * 各ページ上部の共通タイトル。
 * タイトル + 説明 + 右のアクションボタン + 下の短いミント下線。
 * モバイル：タイトル小さめ、アクションは下段に自動回り込み。
 */
export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <h1 className={cn("text-xl font-bold text-ink sm:text-2xl lg:text-3xl")}>{title}</h1>
        {description && (
          <p className="mt-1 text-xs text-ink-soft sm:text-sm">{description}</p>
        )}
        <div className="mt-3 h-[3px] w-16 rounded-full bg-mint" />
      </div>
      {action && <div className="min-w-0 shrink-0 sm:max-w-full">{action}</div>}
    </div>
  );
}
