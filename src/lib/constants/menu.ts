import {
  GraduationCap,
  Briefcase,
  Settings,
  BookOpen,
  MessageSquareText,
  Handshake,
  Package,
  FileText,
  LayoutList,
  Users,
  Tags,
  Bell,
  UserCog,
  ShieldCheck,
  Cog,
  Star,
  ListPlus,
  User,
} from "lucide-react";
import type { MenuGroup } from "@/types/menu";

/**
 * サイドバーに表示する固定メニュー定義。
 * 要件9で「削除不可」の7項目は fixed: true にしてある。
 */
export const MENU_GROUPS: MenuGroup[] = [
  {
    id: "personal",
    label: "個人",
    icon: User,
    items: [
      { href: "/favorites", label: "お気に入り", icon: Star },
      { href: "/notifications", label: "通知一覧", icon: Bell },
    ],
  },
  {
    id: "training",
    label: "研修",
    icon: GraduationCap,
    items: [
      { href: "/knowledge/faqs", label: "ナレッジ集(FAQ)", icon: BookOpen, fixed: true },
      { href: "/training/scripts", label: "トークスクリプト集", icon: MessageSquareText, fixed: true },
      { href: "/meetings", label: "商談ログ", icon: Handshake, fixed: true },
    ],
  },
  {
    id: "sales",
    label: "営業",
    icon: Briefcase,
    items: [
      { href: "/sales/products", label: "商品理解", icon: Package, fixed: true },
      { href: "/sales/materials", label: "提案資料", icon: FileText, fixed: true },
      { href: "/sales/proposals", label: "提案構成", icon: LayoutList, fixed: true },
    ],
  },
  {
    id: "settings",
    label: "設定",
    icon: Settings,
    items: [
      { href: "/settings/users", label: "ユーザー管理", icon: Users },
      { href: "/settings/categories", label: "カテゴリー管理", icon: Tags },
      { href: "/settings/menus", label: "動的メニュー管理", icon: ListPlus },
      { href: "/settings/notifications", label: "通知設定", icon: Bell },
      { href: "/settings/profile", label: "プロフィール設定", icon: UserCog },
      { href: "/settings/permissions", label: "権限管理", icon: ShieldCheck },
      { href: "/settings/system", label: "システム設定", icon: Cog },
    ],
  },
];
