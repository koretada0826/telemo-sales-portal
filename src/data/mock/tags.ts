import type { Tag } from "@/types/common";

/**
 * タグマスタ（モック）。全コンテンツで共有。
 * 将来 tags テーブルに置き換わる。
 */
export const TAGS: Tag[] = [
  { id: "tag-price", name: "料金" },
  { id: "tag-plan", name: "プラン" },
  { id: "tag-competitor", name: "競合" },
  { id: "tag-onboarding", name: "導入" },
  { id: "tag-api", name: "API" },
  { id: "tag-security", name: "セキュリティ" },
  { id: "tag-integration", name: "連携" },
  { id: "tag-billing", name: "請求" },
  { id: "tag-training", name: "研修" },
  { id: "tag-faq", name: "FAQ" },
];

export function getTag(id: string): Tag | undefined {
  return TAGS.find((t) => t.id === id);
}

export function getTags(ids: string[]): Tag[] {
  return ids.map((id) => getTag(id)).filter((t): t is Tag => Boolean(t));
}
