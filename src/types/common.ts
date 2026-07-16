/**
 * 全コンテンツで共通する型（公開状態、閲覧権限など）
 */

/** 公開状態：下書き/公開中/非公開 */
export type Visibility = "draft" | "public" | "private";

/** 閲覧権限：誰までがそのコンテンツを見られるか */
export type ViewableBy = "everyone" | "member" | "manager" | "admin";

/** ID型（将来UUIDに切り替えても呼び出し側は変えないで済む） */
export type ID = string;

/** タグ */
export type Tag = {
  id: ID;
  name: string;
};

/** 一覧取得時の絞り込み条件 */
export type ListParams = {
  q?: string; // 検索キーワード
  categoryId?: string; // カテゴリー絞り込み
  authorId?: string; // 投稿者絞り込み
  sort?: "newest" | "oldest" | "most-viewed" | "most-favorited";
  page?: number; // 1始まり
  perPage?: number;
};

/** 一覧取得の結果 */
export type ListResult<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};
