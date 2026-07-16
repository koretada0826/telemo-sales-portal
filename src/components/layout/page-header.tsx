import { cn } from "@/lib/utils/cn";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

/**
 * 各ページ上部の共通タイトル。
 * タイトル + 説明 + 右のアクションボタン + 下の短いミント下線。
 */
export function PageHeader({ title, description, action }: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className={cn("text-2xl font-bold text-ink sm:text-3xl")}>{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-ink-soft">{description}</p>
        )}
        <div className="mt-3 h-[3px] w-16 rounded-full bg-mint" />
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
