import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * テキスト入力欄。
 * 高さ・角丸・境界線色をテーマ規約に合わせる。
 * error prop で赤枠にできる。
 */
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-input border bg-white px-3 py-2 text-sm",
        "placeholder:text-ink-soft",
        "focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-danger focus:border-danger focus:ring-danger/30" : "border-line",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
