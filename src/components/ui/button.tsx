import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "sage";
type Size = "sm" | "md" | "lg" | "icon";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-amber text-white hover:bg-amber-dark shadow-sm shadow-amber/30 disabled:hover:bg-amber",
  secondary: "bg-forest text-cream hover:bg-forest-light",
  outline: "border border-forest/20 text-forest hover:bg-forest/5 bg-transparent",
  ghost: "text-forest hover:bg-forest/5 bg-transparent",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  sage: "bg-sage text-forest hover:bg-sage-dark",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-[52px] px-7 text-base rounded-xl",
  icon: "h-11 w-11 rounded-xl",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "focus-ring inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
