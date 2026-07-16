import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * フォームラベル。
 * required=true で必須マーク（赤い*）を付ける。
 */
export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-ink",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-danger" aria-label="必須項目">
          *
        </span>
      )}
    </label>
  ),
);
Label.displayName = "Label";
