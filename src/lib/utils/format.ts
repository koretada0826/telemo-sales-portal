import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * ISO文字列を「2026/07/15」の形にする
 */
export function formatDate(iso: string): string {
  return format(parseISO(iso), "yyyy/MM/dd", { locale: ja });
}

/**
 * ISO文字列を「2026/07/15 14:30」の形にする
 */
export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "yyyy/MM/dd HH:mm", { locale: ja });
}

/**
 * 「3日前」「5分前」の相対時間表示
 */
export function formatRelative(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true, locale: ja });
}

/**
 * 電話番号を一部マスクする（要件13：一覧では一部マスク）
 * 例: "080-1234-5678" → "080-****-5678"
 */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return "***";
  const head = digits.slice(0, 3);
  const tail = digits.slice(-4);
  return `${head}-****-${tail}`;
}

/**
 * 長い文字列を最大文字数で切り詰めて「…」を付ける
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "…";
}

/**
 * 数字を「12,345」のカンマ区切りに
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("ja-JP");
}
