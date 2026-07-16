"use server";

import { revalidatePath } from "next/cache";
import { commentSchema, type CommentFormValues } from "./schema";
import { getCurrentUser } from "@/lib/current-user";
import type { CommentContentType } from "@/types/comment";
import {
  createComment as dsCreate,
  updateComment as dsUpdate,
  deleteComment as dsDelete,
  getComment as dsGet,
} from "@/lib/data-source/comments";

export type CommentActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

/**
 * コンテンツ種別ごとの再検証パスを返す。
 * 詳細ページ・一覧ページ両方を再取得させる。
 */
function pathsFor(contentType: CommentContentType, contentId: string): string[] {
  const map: Record<CommentContentType, [string, string]> = {
    faq: ["/knowledge/faqs", `/knowledge/faqs/${contentId}`],
    script: ["/training/scripts", `/training/scripts/${contentId}`],
    meeting: ["/meetings", `/meetings/${contentId}`],
    product: ["/sales/products", `/sales/products/${contentId}`],
    material: ["/sales/materials", `/sales/materials/${contentId}`],
    proposal: ["/sales/proposals", `/sales/proposals/${contentId}`],
  };
  return map[contentType];
}

/** コメント投稿（返信含む） */
export async function postCommentAction(
  contentType: CommentContentType,
  contentId: string,
  values: CommentFormValues,
): Promise<CommentActionResult> {
  const parsed = commentSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "入力に不備があります" };
  const user = await getCurrentUser();
  if (user.role === "viewer") return { ok: false, error: "コメント権限がありません" };
  const c = await dsCreate({ contentType, contentId, ...parsed.data }, user.id);
  for (const p of pathsFor(contentType, contentId)) revalidatePath(p);
  return { ok: true, id: c.id };
}

/** コメント編集（自分の投稿のみ、adminは何でも可） */
export async function editCommentAction(
  commentId: string,
  values: CommentFormValues,
): Promise<CommentActionResult> {
  const parsed = commentSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "入力に不備があります" };
  const user = await getCurrentUser();
  const cur = await dsGet(commentId);
  if (!cur) return { ok: false, error: "対象のコメントが見つかりません" };
  if (user.role !== "admin" && cur.authorId !== user.id) {
    return { ok: false, error: "自分のコメントのみ編集できます" };
  }
  const updated = await dsUpdate(commentId, parsed.data.body);
  if (!updated) return { ok: false, error: "更新に失敗しました" };
  for (const p of pathsFor(cur.contentType, cur.contentId)) revalidatePath(p);
  return { ok: true, id: commentId };
}

/** コメント削除（自分の投稿 or admin。返信も同時削除） */
export async function deleteCommentAction(commentId: string): Promise<CommentActionResult> {
  const user = await getCurrentUser();
  const cur = await dsGet(commentId);
  if (!cur) return { ok: false, error: "対象が見つかりません" };
  if (user.role !== "admin" && cur.authorId !== user.id) {
    return { ok: false, error: "自分のコメントのみ削除できます" };
  }
  await dsDelete(commentId);
  for (const p of pathsFor(cur.contentType, cur.contentId)) revalidatePath(p);
  return { ok: true };
}
