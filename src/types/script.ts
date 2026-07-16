import type { ID, Visibility } from "./common";

/**
 * トークスクリプト（営業トークの台本）
 * セクション別（冒頭、ヒアリング、クロージング等）に分かれる。
 */

/** 利用シーン */
export type ScriptScene =
  | "reception" // 受付突破
  | "connect" // 担当者接続
  | "appointment" // アポ打診
  | "callback" // 折り返し対応
  | "post-doc" // 資料送付後
  | "recall" // 再架電
  | "closing" // クロージング
  | "complaint"; // クレーム対応

/** 利用シーン用の日本語ラベル */
export const SCRIPT_SCENE_LABEL: Record<ScriptScene, string> = {
  reception: "受付突破",
  connect: "担当者接続",
  appointment: "アポ打診",
  callback: "折り返し対応",
  "post-doc": "資料送付後",
  recall: "再架電",
  closing: "クロージング",
  complaint: "クレーム対応",
};

export type Script = {
  id: ID;
  name: string; // スクリプト名
  productId: ID | null; // 対象商品
  industry: string; // 対象業界（自由入力）
  scene: ScriptScene; // 利用シーン
  opening: string; // 冒頭トーク
  hearing: string; // ヒアリング項目
  problemRaise: string; // 課題提起
  productPitch: string; // 商品説明
  closing: string; // クロージング
  objectionHandling: string; // 反論処理
  notes: string; // 注意事項
  tagIds: ID[];
  visibility: Visibility;
  authorId: ID;
  updaterId: ID;
  createdAt: string;
  updatedAt: string;
};

/** 作成・更新の入力型 */
export type ScriptInput = Omit<
  Script,
  "id" | "authorId" | "updaterId" | "createdAt" | "updatedAt"
>;
