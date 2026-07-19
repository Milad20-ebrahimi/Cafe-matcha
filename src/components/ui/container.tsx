import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}) {
  return (
    <div className={cn("mb-10 flex flex-col gap-3", align === "center" && "items-center text-center")}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-dark">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl font-bold text-forest sm:text-4xl">{title}</h2>
      {description && (
        <p className={cn("max-w-2xl text-forest/60", align === "center" && "mx-auto")}>{description}</p>
      )}
    </div>
  );
}
