import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

type Props = {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  trend?: {
    diff: number;
    label: string;
  };
  accent?: "mint" | "gray";
  /** 指定するとカード全体がリンクになり、ホバー時に持ち上がる */
  href?: string;
};

/**
 * ダッシュボード用の統計カード。
 * href があると <Link> で包み、クリックで対応ページに遷移する。
 * ホバーで軽く持ち上がる + 影が濃くなる + 右上に矢印。
 */
export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  trend,
  accent = "mint",
  href,
}: Props) {
  const body = (
    <Card
      className={cn(
        "relative p-3 sm:p-5",
        href && "cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:border-mint/40 hover:shadow-cardHover",
      )}
    >
      <div className="flex items-center gap-2 sm:justify-between">
        <div
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors sm:order-2 sm:h-9 sm:w-9",
            accent === "mint" ? "bg-mint-softer text-mint-dark" : "bg-line/70 text-ink-soft",
            href && "group-hover:bg-mint group-hover:text-white",
          )}
        >
          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
        <p className="min-w-0 truncate text-xs text-ink-soft sm:order-1 sm:text-sm">{label}</p>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1 sm:mt-3">
        <span className="text-lg font-bold text-ink sm:text-3xl">
          {formatNumber(value)}
        </span>
        {suffix && <span className="text-[11px] text-ink-soft sm:text-sm">{suffix}</span>}
      </div>
      {trend && (
        <p
          className={cn(
            "mt-1 text-[11px] sm:mt-2 sm:text-xs",
            trend.diff >= 0 ? "text-success" : "text-danger",
          )}
        >
          {trend.diff >= 0 ? "▲" : "▼"} {Math.abs(trend.diff)} {trend.label}
        </p>
      )}

      {href && (
        <span className="absolute bottom-3 right-3 hidden items-center gap-0.5 text-[10px] font-medium text-mint-dark opacity-0 transition-opacity group-hover:opacity-100 sm:inline-flex">
          一覧を見る
          <ArrowUpRight className="h-3 w-3" />
        </span>
      )}
    </Card>
  );

  if (!href) return body;
  return (
    // group クラスで内部要素がホバー状態を検知できるようにする
    <Link href={href} className="group block">
      {body}
    </Link>
  );
}
