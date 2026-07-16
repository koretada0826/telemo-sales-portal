import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * ボタンの見た目バリエーションを cva で定義。
 * variant: 色（primary=ミント / secondary=白枠 / ghost=枠なし / danger=赤）
 * size: 大きさ（sm / md / lg / icon）
 */
const buttonVariants = cva(
  // 共通スタイル
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn text-sm font-medium",
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/60 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ),
  {
    variants: {
      variant: {
        primary: "bg-mint text-white shadow-sm hover:bg-mint-dark",
        secondary: "border border-line bg-white text-ink hover:bg-mint-softer",
        ghost: "text-ink hover:bg-mint-softer",
        outline: "border border-mint text-mint-dark hover:bg-mint-softer",
        danger: "bg-danger text-white hover:bg-danger/90",
        subtle: "bg-mint-softer text-mint-dark hover:bg-mint-soft",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** true にすると <button> ではなく子要素にスタイルを継承させる（Linkに使う） */
    asChild?: boolean;
  };

/**
 * 汎用ボタン。
 * asChild を使うと、<Link> に対して同じスタイルを付けられる。
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
