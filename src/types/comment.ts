import type { ID } from "./common";

/** どのコンテンツ種別にコメントが紐付くか */
export type CommentContentType =
  | "faq"
  | "script"
  | "meeting"
  | "product"
  | "material"
  | "proposal";

/**
 * コメント1件。
 * parentId があれば返信（スレッド1階層のみ）。
 * mentionUserIds は @メンション用（現状はUIのみ）。
 */
export type Comment = {
  id: ID;
  contentType: CommentContentType;
  contentId: ID;
  parentId: ID | null;
  body: string;
  authorId: ID;
  mentionUserIds: ID[];
  createdAt: string;
  updatedAt: string;
};

export type CommentInput = {
  contentType: CommentContentType;
  contentId: ID;
  parentId?: ID | null;
  body: string;
};
