import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Coffee, Leaf, Truck, ShieldCheck, Clock3 } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/site/category-card";
import { ProductCard } from "@/components/site/product-card";
import {getFeaturedProducts,} from "@/services/product.service";
import { findAll as findCategories } from "@/repositories/category.repository";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
const [menuCategories, settings, featuredMenu, featuredShop] = await Promise.all([
  findCategories("menu"),
  getSiteSettings(),
  getFeaturedProducts("menu"),
  getFeaturedProducts("shop"),
]);

  const banner = settings.banners[0];

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={banner?.image || "/images/hero-cafe.jpg"}
            alt="فضای داخلی کافه ماچا"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark via-forest-dark/70 to-forest-dark/20" />
        </div>
        <Container className="relative flex min-h-[560px] flex-col items-start justify-center gap-6 py-24 sm:min-h-[620px]">
          <span className="animate-fade-in-up inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-1.5 text-xs font-medium text-sage-light backdrop-blur-sm">
            <Leaf className="size-3.5" />
            کافه تخصصی ماچا و قهوه
          </span>
          <h1 className="animate-fade-in-up max-w-2xl font-serif text-4xl font-bold leading-[1.25] text-cream sm:text-5xl lg:text-6xl">
            {banner?.title || "طعم اصیل ماچای ژاپنی"}
          </h1>
          <p className="animate-fade-in-up max-w-lg text-base leading-8 text-cream/75 sm:text-lg">
            {banner?.subtitle || "از مزرعه تا فنجان شما، با عشق دم‌آوری می‌شود"}
          </p>
          <div className="animate-fade-in-up flex flex-wrap items-center gap-3 pt-2">
            <Link href="/menu">
              <Button size="lg">مشاهده منوی کافه</Button>
            </Link>
            <Link href="/shop">
              <Button size="lg" variant="outline" className="border-cream/30 text-cream hover:bg-cream/10">
                خرید از فروشگاه
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-b border-forest/10 bg-white py-10">
        <Container className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { icon: Coffee, title: "برشته‌کاری تازه", desc: "هفتگی و مستقیم از منبع" },
            { icon: Leaf, title: "ماچای اصل ژاپنی", desc: "وارداتی از منطقه اوجی" },
            { icon: Truck, title: "ارسال سریع", desc: "به سراسر کشور" },
            { icon: ShieldCheck, title: "ضمانت کیفیت", desc: "بازگشت وجه در صورت نارضایتی" },
          ].map((f) => (
            <div key={f.title} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-start">
              <span className="flex size-11 items-center justify-center rounded-xl bg-sage/20 text-forest">
                <f.icon className="size-5" />
              </span>
              <h3 className="text-sm font-semibold text-forest">{f.title}</h3>
              <p className="text-xs text-forest/50">{f.desc}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* About */}
      <section className="py-20">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-3xl lg:order-1">
            <Image src="/images/about-cafe.jpg" alt="آماده‌سازی ماچا در کافه ماچا" fill className="object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-dark">درباره ما</span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-forest sm:text-4xl">
              داستان کافه ماچا از دل عشق به فرهنگ چای شروع شد
            </h2>
            <p className="mt-4 leading-8 text-forest/65">
              ما در کافه ماچا باور داریم که هر فنجان باید داستانی برای گفتن داشته باشد. پودر ماچای ما مستقیم از
              مزارع سایه‌پرورش‌یافته ژاپن وارد می‌شود و دانه‌های قهوه به‌صورت هفتگی و تازه برشته‌کاری می‌شوند تا
              بهترین تجربه ممکن را برای شما رقم بزنند.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-forest/70">
                <Clock3 className="size-4 text-amber-dark" />
                {settings.workingHours}
              </div>
            </div>
            <Link href="/about" className="mt-6 inline-block">
              <Button variant="secondary">بیشتر بدانید</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Menu categories */}
      <section className="bg-forest py-20">
        <Container>
          <SectionHeading
            eyebrow="منوی کافه"
            title="دسته‌بندی‌های منو را کشف کنید"
            description="از ماچا لاته گرفته تا دسرهای خانگی، هرچه دوست دارید در کافه ماچا پیدا می‌کنید."
          />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {menuCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} href={`/menu#${cat.slug}`} />
            ))}
          </div>
        </Container>
      </section>

      {/* Featured menu */}
      {featuredMenu.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading eyebrow="پرطرفدار" title="محبوب‌ترین آیتم‌های منو" />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {featuredMenu.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Featured shop */}
      {featuredShop.length > 0 && (
        <section className="bg-white py-20">
          <Container>
            <SectionHeading
              eyebrow="فروشگاه"
              title="محصولات ویژه برای خانه شما"
              description="پودر ماچا، دانه قهوه و لوازم جانبی که تجربه کافه را به خانه شما می‌آورد."
            />
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {featuredShop.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/shop">
                <Button variant="outline">مشاهده همه محصولات فروشگاه</Button>
              </Link>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
