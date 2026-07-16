import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

/** 複数行の入力欄。FAQ回答やメモなど長文入力用。 */
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-input border bg-white px-3 py-2 text-sm",
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
Textarea.displayName = "Textarea";
