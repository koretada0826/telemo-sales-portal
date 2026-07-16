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
        "relative p-5",
        // href ありの時はホバー効果を追加
        href && "cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:border-mint/40 hover:shadow-cardHover",
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">{label}</p>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
            accent === "mint"
              ? "bg-mint-softer text-mint-dark"
              : "bg-line/70 text-ink-soft",
            href && "group-hover:bg-mint group-hover:text-white",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-ink sm:text-3xl">
          {formatNumber(value)}
        </span>
        {suffix && <span className="text-sm text-ink-soft">{suffix}</span>}
      </div>
      {trend && (
        <p
          className={cn(
            "mt-2 text-xs",
            trend.diff >= 0 ? "text-success" : "text-danger",
          )}
        >
          {trend.diff >= 0 ? "▲" : "▼"} {Math.abs(trend.diff)} {trend.label}
        </p>
      )}

      {/* href ありのときだけ右下に「詳細を見る」矢印を表示 */}
      {href && (
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-0.5 text-[10px] font-medium text-mint-dark opacity-0 transition-opacity group-hover:opacity-100">
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
