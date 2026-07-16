import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * タグ・ステータス表示用の小さなラベル。
 * variant で色を切り替える（デフォルトはミント系、gray、success、danger、warning）
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        mint: "bg-mint-softer text-mint-dark ring-1 ring-mint/30",
        gray: "bg-line/60 text-ink-soft",
        success: "bg-success/10 text-success ring-1 ring-success/20",
        danger: "bg-danger/10 text-danger ring-1 ring-danger/20",
        warning: "bg-warning/10 text-warning ring-1 ring-warning/20",
        outline: "border border-line text-ink-soft",
      },
    },
    defaultVariants: {
      variant: "mint",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
