import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-forest/15 bg-white/60 px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-1 flex size-16 items-center justify-center rounded-full bg-sage/20 text-forest">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl font-semibold text-forest">{title}</h3>
      {description && <p className="max-w-sm text-sm leading-7 text-forest/60">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
