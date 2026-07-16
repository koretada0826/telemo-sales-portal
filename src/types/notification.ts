import type { ID } from "./common";

/** 通知の種類（アイコン・色分けに使う） */
export type NotificationType =
  | "comment" // 自分の投稿にコメントが付いた
  | "mention" // メンションされた
  | "new-content" // 新しいコンテンツが追加された
  | "content-updated" // 投稿が更新された
  | "reminder" // リマインド（次回架電・商談）
  | "system"; // システム通知

export type Notification = {
  id: ID;
  userId: ID; // 通知を受け取るユーザー
  type: NotificationType;
  title: string;
  body: string;
  linkUrl: string | null; // 対象ページへのリンク
  read: boolean;
  createdAt: string;
};
