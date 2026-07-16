import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * ネイティブ<select>のスタイル調整版。
 * カスタムセレクトより軽量で、スマホでOSのピッカーが使える利点がある。
 */
export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-input border bg-white px-3 py-2 text-sm",
        "focus:border-mint focus:outline-none focus:ring-2 focus:ring-mint/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        error ? "border-danger" : "border-line",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
