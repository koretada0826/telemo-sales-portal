import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * 白背景・角丸・薄い影のカード。
 * ページの各ブロックの入れ物として使う。
 */
export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-card border border-line bg-card shadow-card",
        "transition-shadow hover:shadow-cardHover",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

/** カードの上部（タイトル領域）。padding付きの枠。 */
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5 p-5", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

/** カード本文領域。*/
export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5 pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

/** カード下部（フッターや操作ボタン領域）。 */
export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-2 p-5 pt-0", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

/** カードのタイトル文。 */
export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-base font-semibold text-ink", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

/** カードの説明文（タイトル下）。 */
export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-ink-soft", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";
