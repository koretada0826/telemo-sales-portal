import { z } from "zod";

/** コメント投稿・編集共通のスキーマ */
export const commentSchema = z.object({
  body: z.string().trim().min(1, "本文は必須です").max(2000, "2000文字以内で入力してください"),
  parentId: z.string().nullable().optional(),
});
export type CommentFormValues = z.infer<typeof commentSchema>;
