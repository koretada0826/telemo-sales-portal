import type { LucideIcon } from "lucide-react";

/** サイドバーに並ぶ1つのメニュー項目の型 */
export type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  fixed?: boolean;
};

/** 大分類（個人・研修・営業・設定）の型 */
export type MenuGroup = {
  id: "personal" | "training" | "sales" | "settings";
  label: string;
  icon: LucideIcon;
  items: MenuItem[];
  /** true のときは admin ロールにだけ表示 */
  adminOnly?: boolean;
};
