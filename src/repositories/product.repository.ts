import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { toProductDTO } from "@/mappers/product.mapper";





export async function findAll(opts: {
  type?: "menu" | "shop";
  categorySlug?: string;
  featured?: boolean;
  onlyActive?: boolean;
} = {}) {
  const conditions = [];
  if (opts.type) conditions.push(eq(products.type, opts.type));
  if (opts.featured) conditions.push(eq(products.isFeatured, true));
  if (opts.onlyActive !== false) conditions.push(eq(products.isActive, true));


  if (opts.categorySlug) {
    const [cat] = await db.select().from(categories).where(eq(categories.slug, opts.categorySlug));
    if (!cat) return [];
    conditions.push(eq(products.categoryId, cat.id));
  }

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(products.createdAt));

  return rows.map((r) => toProductDTO(r.product, r.category?.name, r.category?.slug));
}
export async function findBySlug(slug: string) {
  const [row] = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug));
  if (!row) return null;
  return toProductDTO(row.product, row.category?.name, row.category?.slug);
}
export async function findRelated(categoryId: string | null, excludeId: string, type: "menu" | "shop") {
  if (!categoryId) return [];
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.categoryId, categoryId),eq(products.type, type), eq(products.isActive, true)))
    .limit(5);
  return rows
    .filter((r) => r.product.id !== excludeId)
    .slice(0, 4)
    .map((r) => toProductDTO(r.product, r.category?.name, r.category?.slug));
}