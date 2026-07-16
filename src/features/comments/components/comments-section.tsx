// コメントセクション（Server Component）。
// 各コンテンツ詳細ページの末尾に配置する。

import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CommentContentType } from "@/types/comment";
import { listComments } from "@/lib/data-source/comments";
import { getCurrentUser } from "@/lib/current-user";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";

type Props = {
  contentType: CommentContentType;
  contentId: string;
};

export async function CommentsSection({ contentType, contentId }: Props) {
  const comments = await listComments(contentType, contentId);
  const user = await getCurrentUser();

  // 親コメントを先に、その下に返信を並べる（親でグループ化）
  const parents = comments.filter((c) => !c.parentId);
  const repliesByParent = comments.reduce<Record<string, typeof comments>>((acc, c) => {
    if (c.parentId) {
      (acc[c.parentId] ??= []).push(c);
    }
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-mint" />
          コメント（{comments.length}件）
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 新規投稿フォーム（viewerは非表示） */}
        {user.role !== "viewer" ? (
          <CommentForm contentType={contentType} contentId={contentId} placeholder="コメントを入力…" />
        ) : (
          <p className="rounded-btn border border-line bg-bg p-3 text-xs text-ink-soft">
            閲覧のみの権限のため、コメントは投稿できません。
          </p>
        )}

        {/* 一覧 */}
        {parents.length === 0 ? (
          <p className="text-sm text-ink-soft">まだコメントはありません。最初の1件を投稿してみましょう。</p>
        ) : (
          <div className="space-y-4">
            {parents.map((p) => (
              <div key={p.id} className="space-y-3">
                <CommentItem comment={p} currentUser={user} />
                {repliesByParent[p.id]?.map((r) => (
                  <CommentItem key={r.id} comment={r} currentUser={user} allowReply={false} />
                ))}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
