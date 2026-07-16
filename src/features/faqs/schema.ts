import { z } from "zod";

/**
 * FAQフォーム入力の検証スキーマ（Zod）。
 * フロント側・サーバー側の両方で使う（★セキュリティ上必ず両方で検証）。
 */

/** フル登録用（既存の新規/編集フォーム） */
export const faqInputSchema = z.object({
  question: z.string().trim()
    .min(3, "質問は3文字以上で入力してください")
    .max(200, "質問は200文字以内で入力してください"),
  answer: z.string().trim()
    .max(5000, "回答は5000文字以内で入力してください")
    .default(""),
  categoryId: z.string().nullable(),
  tagIds: z.array(z.string()).max(10, "タグは10個までです"),
  visibility: z.enum(["draft", "public", "private"]),
  viewableBy: z.enum(["everyone", "member", "manager", "admin"]),
  relatedFaqIds: z.array(z.string()).max(10).optional(),
});
export type FaqFormValues = z.infer<typeof faqInputSchema>;

/** 質問だけ投稿するクイック投稿用（回答は後で誰かがつける） */
export const faqQuestionOnlySchema = z.object({
  question: z.string().trim()
    .min(3, "質問は3文字以上で入力してください")
    .max(200, "質問は200文字以内で入力してください"),
  categoryId: z.string().nullable(),
});
export type FaqQuestionOnlyValues = z.infer<typeof faqQuestionOnlySchema>;

/** 未回答FAQに回答を追記する用 */
export const faqAnswerOnlySchema = z.object({
  answer: z.string().trim()
    .min(3, "回答は3文字以上で入力してください")
    .max(5000, "回答は5000文字以内で入力してください"),
});
export type FaqAnswerOnlyValues = z.infer<typeof faqAnswerOnlySchema>;
