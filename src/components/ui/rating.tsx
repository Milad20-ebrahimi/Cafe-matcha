import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`امتیاز ${value} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= rounded;
        const half = !filled && i + 0.5 === rounded;
        return (
          <Star
            key={i}
            size={size}
            className={cn(
              filled || half ? "fill-amber text-amber" : "fill-transparent text-forest/20",
            )}
          />
        );
      })}
    </div>
  );
}
