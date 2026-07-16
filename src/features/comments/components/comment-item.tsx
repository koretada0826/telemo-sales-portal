"use client";

// 1件のコメント表示 + 返信・編集・削除ボタン

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Reply, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatRelative } from "@/lib/utils/format";
import type { Comment } from "@/types/comment";
import type { CurrentUser } from "@/lib/current-user";
import { deleteCommentAction } from "@/features/comments/actions";
import { CommentForm } from "./comment-form";
import { getMockUser } from "@/data/mock/users";

type Props = {
  comment: Comment;
  currentUser: CurrentUser;
  /** 返信は1階層のみ許可（返信の返信は不可） */
  allowReply?: boolean;
};

export function CommentItem({ comment, currentUser, allowReply = true }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit" | "reply">("view");
  const [isPending, startTransition] = useTransition();
  const author = getMockUser(comment.authorId);
  const canModify = currentUser.role === "admin" || comment.authorId === currentUser.id;

  const handleDelete = () => {
    if (!confirm("このコメントを削除しますか？")) return;
    startTransition(async () => {
      const r = await deleteCommentAction(comment.id);
      if (r.ok) {
        toast.success("コメントを削除しました");
        router.refresh();
      } else toast.error(r.error);
    });
  };

  return (
    <div className={cn("flex gap-3", comment.parentId && "ml-10")}>
      {/* アバター */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar text-sm font-semibold text-white">
        {author?.name.charAt(0) ?? "?"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="rounded-card border border-line bg-white p-4 shadow-card">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold text-ink">{author?.name ?? "退会ユーザー"}</span>
            <span className="text-xs text-ink-soft">{formatRelative(comment.createdAt)}</span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-[10px] text-ink-soft">（編集済み）</span>
            )}
          </div>

          {mode === "edit" ? (
            <div className="mt-3">
              <CommentForm
                commentId={comment.id}
                defaultBody={comment.body}
                onCancel={() => setMode("view")}
                onDone={() => setMode("view")}
              />
            </div>
          ) : (
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">{comment.body}</p>
          )}

          {mode === "view" && (
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {allowReply && !comment.parentId && (
                <button
                  type="button"
                  onClick={() => setMode("reply")}
                  className="inline-flex items-center gap-1 text-ink-soft hover:text-mint-dark"
                >
                  <Reply className="h-3.5 w-3.5" />返信
                </button>
              )}
              {canModify && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("edit")}
                    className="inline-flex items-center gap-1 text-ink-soft hover:text-mint-dark"
                  >
                    <Pencil className="h-3.5 w-3.5" />編集
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 text-ink-soft hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {isPending ? "削除中..." : "削除"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* 返信フォーム */}
        {mode === "reply" && (
          <div className="mt-3">
            <CommentForm
              contentType={comment.contentType}
              contentId={comment.contentId}
              parentId={comment.id}
              placeholder={`${author?.name ?? "この人"} へ返信…`}
              onCancel={() => setMode("view")}
              onDone={() => setMode("view")}
            />
          </div>
        )}
      </div>
    </div>
  );
}
