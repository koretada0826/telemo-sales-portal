"use server";

/**
 * FAQ用のServer Actions。
 * "use server" によりサーバー上でのみ実行される。
 *
 * 各Actionは：
 * 1. Zodで再検証（フロント検証をバイパスした不正リクエストへの対策）
 * 2. current-user取得
 * 3. data-source層を呼ぶ
 * 4. revalidatePath でキャッシュ無効化
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  faqInputSchema,
  faqQuestionOnlySchema,
  faqAnswerOnlySchema,
  type FaqFormValues,
  type FaqQuestionOnlyValues,
  type FaqAnswerOnlyValues,
} from "./schema";
import { getCurrentUser } from "@/lib/current-user";
import {
  createFaq as dsCreate,
  updateFaq as dsUpdate,
  deleteFaq as dsDelete,
  getFaq as dsGet,
} from "@/lib/data-source/faqs";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** FAQ フル新規作成（既存フォームから） */
export async function createFaqAction(values: FaqFormValues): Promise<ActionResult> {
  const parsed = faqInputSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "入力に不備があります", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const user = await getCurrentUser();
  if (user.role === "viewer") return { ok: false, error: "投稿権限がありません" };
  const created = await dsCreate(parsed.data, user.id);
  revalidatePath("/knowledge/faqs");
  revalidatePath("/dashboard");
  return { ok: true, id: created.id };
}

/** FAQ 更新 */
export async function updateFaqAction(id: string, values: FaqFormValues): Promise<ActionResult> {
  const parsed = faqInputSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "入力に不備があります", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const user = await getCurrentUser();
  if (user.role === "viewer") return { ok: false, error: "編集権限がありません" };
  const updated = await dsUpdate(id, parsed.data, user.id);
  if (!updated) return { ok: false, error: "対象のFAQが見つかりません" };
  revalidatePath("/knowledge/faqs");
  revalidatePath(`/knowledge/faqs/${id}`);
  revalidatePath("/dashboard");
  return { ok: true, id };
}

/** FAQ 削除（redirect込み） */
export async function deleteFaqAction(id: string): Promise<void> {
  const user = await getCurrentUser();
  if (user.role === "viewer") throw new Error("削除権限がありません");
  const removed = await dsDelete(id);
  if (!removed) throw new Error("削除対象が見つかりません");
  revalidatePath("/knowledge/faqs");
  revalidatePath("/dashboard");
  redirect("/knowledge/faqs");
}

/**
 * 質問だけをクイック投稿する（回答は空・未回答状態）。
 * 「答えを持たない人が質問だけ投げる」ユースケース用。
 */
export async function postQuestionAction(
  values: FaqQuestionOnlyValues,
): Promise<ActionResult> {
  const parsed = faqQuestionOnlySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "入力に不備があります", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const user = await getCurrentUser();
  if (user.role === "viewer") return { ok: false, error: "投稿権限がありません" };

  // 未回答状態で保存：answer は空文字、タグ空、公開・全員閲覧可
  const created = await dsCreate(
    {
      question: parsed.data.question,
      answer: "",
      categoryId: parsed.data.categoryId,
      tagIds: [],
      visibility: "public",
      viewableBy: "everyone",
      relatedFaqIds: [],
    },
    user.id,
  );
  revalidatePath("/knowledge/faqs");
  revalidatePath("/dashboard");
  return { ok: true, id: created.id };
}

/**
 * 未回答FAQに回答を追記する。
 * 「質問だけ投稿」で作られた未回答項目に、他の人が答える用途。
 */
export async function answerFaqAction(
  id: string,
  values: FaqAnswerOnlyValues,
): Promise<ActionResult> {
  const parsed = faqAnswerOnlySchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "入力に不備があります", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const user = await getCurrentUser();
  if (user.role === "viewer") return { ok: false, error: "回答権限がありません" };

  // 現在のFAQを取得して、他フィールドはそのまま answer だけ差し替え
  const current = await dsGet(id);
  if (!current) return { ok: false, error: "対象のFAQが見つかりません" };

  const updated = await dsUpdate(
    id,
    {
      question: current.question,
      answer: parsed.data.answer,
      categoryId: current.categoryId,
      tagIds: current.tagIds,
      visibility: current.visibility,
      viewableBy: current.viewableBy,
      relatedFaqIds: current.relatedFaqIds,
    },
    user.id,
  );
  if (!updated) return { ok: false, error: "更新に失敗しました" };

  revalidatePath("/knowledge/faqs");
  revalidatePath(`/knowledge/faqs/${id}`);
  revalidatePath("/dashboard");
  return { ok: true, id };
}
