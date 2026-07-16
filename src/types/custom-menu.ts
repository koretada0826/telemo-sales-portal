import type { ID } from "./common";

/** 動的メニューが所属できる大分類 */
export type CustomMenuGroup = "training" | "sales" | "personal";

/** アイコン識別子（lucide-reactのアイコン名から限定） */
export type CustomMenuIcon =
  | "book" | "message" | "chart" | "target" | "award"
  | "briefcase" | "package" | "file" | "star" | "flag" | "megaphone";

export type CustomMenu = {
  id: ID;
  name: string;
  icon: CustomMenuIcon;
  href: string; // 表示先URL（現状は静的ページへのリンク or ダミー）
  group: CustomMenuGroup;
  order: number;
  isPublished: boolean;
  viewableRoles: ("admin" | "manager" | "member" | "viewer")[];
  createdAt: string;
  updatedAt: string;
  authorId: ID;
};

export type CustomMenuInput = Omit<CustomMenu, "id" | "createdAt" | "updatedAt" | "authorId">;
