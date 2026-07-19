import Image from "next/image";
import Link from "next/link";
import type { CategoryDTO } from "@/types";

export function CategoryCard({ category, href }: { category: CategoryDTO; href: string }) {
  return (
    <Link
      href={href}
      className="focus-ring group relative flex h-56 items-end overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1 sm:h-64"
    >
      {category.imageUrl && (
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/20 to-transparent" />
      <div className="relative z-10 p-5">
        <h3 className="font-serif text-xl font-bold text-cream">{category.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-cream/70">{category.description}</p>
      </div>
    </Link>
  );
}
