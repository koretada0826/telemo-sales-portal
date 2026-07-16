import {
  BookOpen, MessageSquareText, BarChart3, Target, Award,
  Briefcase, Package, FileText, Star, Flag, Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CustomMenuIcon } from "@/types/custom-menu";

/** アイコン識別子 → lucide-react アイコンコンポーネント */
export const CUSTOM_MENU_ICON: Record<CustomMenuIcon, LucideIcon> = {
  book: BookOpen,
  message: MessageSquareText,
  chart: BarChart3,
  target: Target,
  award: Award,
  briefcase: Briefcase,
  package: Package,
  file: FileText,
  star: Star,
  flag: Flag,
  megaphone: Megaphone,
};

/** セレクト表示用 label */
export const CUSTOM_MENU_ICON_LABEL: Record<CustomMenuIcon, string> = {
  book: "本",
  message: "メッセージ",
  chart: "グラフ",
  target: "ターゲット",
  award: "アワード",
  briefcase: "ブリーフケース",
  package: "パッケージ",
  file: "ファイル",
  star: "スター",
  flag: "フラグ",
  megaphone: "メガホン",
};
