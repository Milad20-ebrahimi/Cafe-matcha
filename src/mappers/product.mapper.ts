import type { products } from "@/db/schema";
import type { ProductDTO, ProductVariant } from "@/types";


export function toProductDTO(
  row: typeof products.$inferSelect,
  categoryName?: string | null,
  categorySlug?: string | null
): ProductDTO {

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,

    description: row.description ?? "",
    shortDescription: row.shortDescription ?? "",

    categoryId: row.categoryId,
    categoryName: categoryName ?? null,
    categorySlug: categorySlug ?? null,

    type: row.type,

    price: Number(row.price),

    compareAtPrice:
      row.compareAtPrice
        ? Number(row.compareAtPrice)
        : null,

    stock: row.stock,

    images:
      (row.images as string[]) ?? [],

    variants:
      (row.variants as ProductVariant[]) ?? [],

    tags:
      (row.tags as string[]) ?? [],

    isFeatured: row.isFeatured,

    isActive: row.isActive,

    rating:
      row.rating
        ? Number(row.rating)
        : 4.8,

    createdAt:
      row.createdAt.toISOString(),

    updatedAt:
      row.updatedAt.toISOString(),
  };
}