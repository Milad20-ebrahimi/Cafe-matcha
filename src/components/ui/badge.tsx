import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  tone = "default",
}: {
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "amber" | "sage" | "forest" | "outline";
}) {
  const tones: Record<string, string> = {
    default: "bg-forest/5 text-forest border-forest/10",
    amber: "bg-amber/10 text-amber-dark border-amber/20",
    sage: "bg-sage/20 text-forest-dark border-sage/40",
    forest: "bg-forest text-cream border-forest",
    outline: "bg-transparent text-forest border-forest/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
