import type { ID } from "./common";

/** お気に入り登録できるコンテンツ種別 */
export type FavoriteContentType =
  | "faq"
  | "script"
  | "product"
  | "material"
  | "proposal";

export type Favorite = {
  id: ID;
  userId: ID;
  contentType: FavoriteContentType;
  contentId: ID;
  createdAt: string;
};
