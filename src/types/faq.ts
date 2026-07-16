import type { ID, Visibility, ViewableBy } from "./common";

/**
 * FAQ（よくある質問）1件分の型。
 * ID系は将来Supabaseと合わせやすいよう snake_case ではなく camelCase 統一。
 */
export type Faq = {
  id: ID;
  question: string; // 質問文
  answer: string; // 回答文（複数行対応）
  categoryId: ID | null; // カテゴリー
  tagIds: ID[]; // タグID配列
  visibility: Visibility; // 公開状態
  viewableBy: ViewableBy; // 閲覧権限
  attachmentIds: ID[]; // 添付ファイル（フェーズ4以降）
  relatedFaqIds: ID[]; // 関連FAQ
  authorId: ID; // 作成者
  updaterId: ID; // 更新者
  viewCount: number; // 閲覧数
  favoriteCount: number; // お気に入り数
  createdAt: string; // ISO文字列
  updatedAt: string; // ISO文字列
};

/** FAQ作成・更新時の入力型（idや集計値を除く） */
export type FaqInput = {
  question: string;
  answer: string;
  categoryId: ID | null;
  tagIds: ID[];
  visibility: Visibility;
  viewableBy: ViewableBy;
  relatedFaqIds?: ID[];
};

/** FAQカテゴリー */
export type FaqCategory = {
  id: ID;
  name: string;
  color?: string; // バッジ色（任意）
};
