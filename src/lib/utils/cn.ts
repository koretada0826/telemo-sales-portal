import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn（class name）ヘルパー：
 * Tailwindのクラス名を安全に結合し、重複や衝突を自動解決する。
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
