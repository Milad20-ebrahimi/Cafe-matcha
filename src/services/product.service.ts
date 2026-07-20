import {
  findAll,
  findBySlug,
  findRelated,
} from "@/repositories/product.repository";


// دریافت محصولات قابل نمایش
export async function getProducts(options?: {
  type?: "menu" | "shop";
  categorySlug?: string;
}) {
  return findAll({
    ...options,
    onlyActive: true,
  });
}


// دریافت محصولات ویژه
export async function getFeaturedProducts(
  type?: "menu" | "shop"
) {
  return findAll({
    type,
    featured: true,
    onlyActive: true,
  });
}


// دریافت یک محصول با slug
export async function getProductBySlug(
  slug: string
) {

  const product = await findBySlug(slug);


  // Business Rule:
  // محصول باید وجود داشته باشد
  if (!product) {
    throw new Error(
      "Product not found"
    );
  }


  // Business Rule:
  // محصول غیرفعال قابل نمایش نیست
  if (!product.isActive) {
    throw new Error(
      "Product is inactive"
    );
  }


  return product;
}


// دریافت محصولات مرتبط
export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string,
  type: "menu" | "shop"
) {

  return findRelated(
    categoryId,
    excludeId,
    type
  );

}
export async function getShopProductBySlug(
  slug: string
) {
  const product = await findBySlug(slug);


  if (!product) {
    throw new Error("Product not found");
  }


  if (product.type !== "shop") {
    throw new Error("Product is not a shop product");
  }


  if (!product.isActive) {
    throw new Error("Product is inactive");
  }


  return product;
}