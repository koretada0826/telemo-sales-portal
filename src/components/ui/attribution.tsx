import { User, RefreshCcw } from "lucide-react";
import { getMockUser } from "@/data/mock/users";
import { cn } from "@/lib/utils/cn";

/**
 * 「誰が作った・誰が更新した」を統一表示する共通コンポーネント。
 *
 * 表示ルール（機械的）：
 *  - authorId と updaterId が同じ → 「作成: 山田」のみ
 *  - 異なる → 「作成: 山田 / 更新: 佐藤」
 *  - FAQのQ&Aモード（isQA=true）では「質問: 山田 / 回答: 佐藤」
 */
type Props = {
  authorId: string;
  updaterId?: string;
  /** true のとき FAQ 用「質問者/回答者」ラベルに切り替え */
  isQA?: boolean;
  /** true のとき FAQ 未回答扱い → 「回答者」を出さない */
  unanswered?: boolean;
  className?: string;
};

export function Attribution({ authorId, updaterId, isQA, unanswered, className }: Props) {
  const author = getMockUser(authorId);
  const updater = updaterId ? getMockUser(updaterId) : null;
  const sameUser = !updaterId || authorId === updaterId;
  const authorLabel = isQA ? "質問" : "作成";
  const updaterLabel = isQA ? "回答" : "更新";

  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft", className)}>
      <span className="inline-flex items-center gap-1">
        <User className="h-3.5 w-3.5" />
        {authorLabel}：{author?.name ?? "不明"}
      </span>
      {isQA && unanswered ? (
        <span className="inline-flex items-center gap-1 text-warning">
          <RefreshCcw className="h-3.5 w-3.5" />
          未回答
        </span>
      ) : !sameUser && updater ? (
        <span className="inline-flex items-center gap-1">
          <RefreshCcw className="h-3.5 w-3.5" />
          {updaterLabel}：{updater.name}
        </span>
      ) : null}
    </span>
  );
}
