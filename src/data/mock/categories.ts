import type { FaqCategory } from "@/types/faq";

/**
 * FAQ用のカテゴリー一覧（モック）。
 * 将来 faq_categories テーブルに置き換わる。
 */
export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: "cat-contract", name: "契約・料金" },
  { id: "cat-feature", name: "機能・使い方" },
  { id: "cat-support", name: "サポート" },
  { id: "cat-security", name: "セキュリティ" },
  { id: "cat-competitor", name: "競合比較" },
  { id: "cat-onboarding", name: "導入・オンボーディング" },
];

export function getFaqCategory(id: string | null): FaqCategory | undefined {
  if (!id) return undefined;
  return FAQ_CATEGORIES.find((c) => c.id === id);
}
