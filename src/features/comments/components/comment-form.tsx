"use client";

// コメント投稿フォーム（新規・返信・編集共用）

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { CommentContentType } from "@/types/comment";
import {
  postCommentAction,
  editCommentAction,
} from "@/features/comments/actions";

type Props = {
  /** 新規投稿の場合、対象コンテンツを指定 */
  contentType?: CommentContentType;
  contentId?: string;
  /** 返信の場合、親コメントIDを指定 */
  parentId?: string | null;
  /** 編集の場合、コメントIDと初期本文を指定 */
  commentId?: string;
  defaultBody?: string;
  /** placeholderをカスタム */
  placeholder?: string;
  /** キャンセルボタン押下時（返信/編集モード時のみ） */
  onCancel?: () => void;
  /** 送信成功後のコールバック */
  onDone?: () => void;
};

export function CommentForm({
  contentType,
  contentId,
  parentId = null,
  commentId,
  defaultBody = "",
  placeholder = "コメントを入力…",
  onCancel,
  onDone,
}: Props) {
  const router = useRouter();
  const [body, setBody] = useState(defaultBody);
  const [isPending, startTransition] = useTransition();
  const isEdit = Boolean(commentId);

  const submit = () => {
    if (!body.trim()) {
      toast.error("本文を入力してください");
      return;
    }
    startTransition(async () => {
      const result = isEdit
        ? await editCommentAction(commentId!, { body })
        : await postCommentAction(contentType!, contentId!, { body, parentId });
      if (result.ok) {
        toast.success(isEdit ? "コメントを更新しました" : "コメントを投稿しました");
        if (!isEdit) setBody("");
        onDone?.();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={3}
        disabled={isPending}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
            <X className="h-4 w-4" />キャンセル
          </Button>
        )}
        <Button type="button" size="sm" onClick={submit} disabled={isPending}>
          <Send className="h-4 w-4" />
          {isPending ? "送信中..." : isEdit ? "更新" : "投稿"}
        </Button>
      </div>
    </div>
  );
}
