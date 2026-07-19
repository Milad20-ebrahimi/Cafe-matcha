import "dotenv/config";
import bcrypt from "bcryptjs";
import { db, pool } from "./index";
import {
  roles,
  users,
  categories,
  products,
  coupons,
  blogPosts,
  siteSettings,
} from "./schema";
import { ROLE_DEFINITIONS } from "../lib/rbac";
import { sql } from "drizzle-orm";

async function main() {
  console.log("🌱 شروع پر کردن دیتابیس با داده‌های نمونه...");

  console.log("پاک‌سازی جداول قبلی...");
  await db.execute(sql`TRUNCATE TABLE
    audit_logs, payments, order_items, orders, addresses, otp_codes,
    coupons, blog_posts, products, categories, users, roles, site_settings
    RESTART IDENTITY CASCADE`);

  console.log("ایجاد نقش‌ها...");
  const roleRows = await db
    .insert(roles)
    .values(
      ROLE_DEFINITIONS.map((r) => ({
        key: r.key,
        name: r.name,
        permissions: r.permissions,
      })),
    )
    .returning();

  const roleId = (key: string) => roleRows.find((r) => r.key === key)!.id;

  console.log("ایجاد کاربران...");
  const passwordHash = await bcrypt.hash("admin123", 10);
  const [admin] = await db
    .insert(users)
    .values([
      {
        name: "مدیر کل",
        email: "admin@cafemacha.ir",
        phone: "09120000001",
        passwordHash,
        roleId: roleId("super_admin"),
      },
      {
        name: "سارا محتوایی",
        email: "content@cafemacha.ir",
        phone: "09120000002",
        passwordHash,
        roleId: roleId("content_manager"),
      },
      {
        name: "امیر سفارشی",
        email: "orders@cafemacha.ir",
        phone: "09120000003",
        passwordHash,
        roleId: roleId("order_manager"),
      },
      {
        name: "نیلوفر کارمند",
        email: "staff@cafemacha.ir",
        phone: "09120000004",
        passwordHash,
        roleId: roleId("staff"),
      },
      {
        name: "مریم رضایی",
        email: "customer@example.com",
        phone: "09121234567",
        passwordHash,
        roleId: roleId("customer"),
      },
    ])
    .returning();

  console.log("ایجاد دسته‌بندی‌ها...");
  const categoryRows = await db
    .insert(categories)
    .values([
      {
        name: "ماچا",
        slug: "matcha",
        type: "menu",
        description: "نوشیدنی‌های ماچا با پودر سرمونیال ژاپنی",
        imageUrl: "/images/matcha-category.jpg",
        sortOrder: 1,
      },
      {
        name: "قهوه",
        slug: "coffee",
        type: "menu",
        description: "قهوه‌های تخصصی از دانه‌های برشته‌شده تازه",
        imageUrl: "/images/coffee-category.jpg",
        sortOrder: 2,
      },
      {
        name: "دسر",
        slug: "dessert",
        type: "menu",
        description: "دسرهای خانگی با طعم ماچا و شکلات",
        imageUrl: "/images/dessert-category.jpg",
        sortOrder: 3,
      },
      {
        name: "صبحانه",
        slug: "breakfast",
        type: "menu",
        description: "صبحانه کامل و سالم در فضایی آرام",
        imageUrl: "/images/breakfast-category.jpg",
        sortOrder: 4,
      },
      {
        name: "پودر ماچا",
        slug: "matcha-powder",
        type: "shop",
        description: "پودر ماچای وارداتی مستقیم از ژاپن",
        imageUrl: "/images/product-matcha-powder.jpg",
        sortOrder: 1,
      },
      {
        name: "دانه و پودر قهوه",
        slug: "coffee-beans",
        type: "shop",
        description: "دانه‌های قهوه برشته‌کاری تازه",
        imageUrl: "/images/product-coffee-beans.jpg",
        sortOrder: 2,
      },
      {
        name: "لوازم جانبی",
        slug: "accessories",
        type: "shop",
        description: "ابزار مراسم ماچا و دم‌کردن قهوه",
        imageUrl: "/images/product-matcha-whisk-set.jpg",
        sortOrder: 3,
      },
    ])
    .returning();

  const catId = (slug: string) => categoryRows.find((c) => c.slug === slug)!.id;

  console.log("ایجاد آیتم‌های منو...");
  await db.insert(products).values([
    {
      name: "ماچا لاته کلاسیک",
      slug: "matcha-latte-classic",
      type: "menu",
      categoryId: catId("matcha"),
      price: "128000",
      shortDescription: "ماچا سرمونیال با شیر گرم و کف نرم",
      description:
        "ماچا لاته کلاسیک ما با پودر ماچای سرمونیال درجه‌یک ژاپنی و شیر تازه دم‌آوری می‌شود؛ طعمی متعادل بین تلخی ملایم و شیرینی طبیعی شیر.",
      images: ["/images/matcha-category.jpg"],
      stock: 999,
      isFeatured: true,
      rating: "4.9",
      variants: [
        { id: "sm", label: "کوچک", priceDiff: 0, stock: 999 },
        { id: "lg", label: "بزرگ", priceDiff: 18000, stock: 999 },
      ],
      tags: ["پرفروش", "گرم"],
    },
    {
      name: "ماچا لاته یخ",
      slug: "matcha-latte-iced",
      type: "menu",
      categoryId: catId("matcha"),
      price: "138000",
      shortDescription: "طراوت تابستانی با طعم اصیل ماچا",
      description: "نسخه یخ ماچا لاته، مناسب روزهای گرم با شیر سرد و یخ خردشده.",
      images: ["/images/matcha-category.jpg"],
      stock: 999,
      isFeatured: true,
      rating: "4.8",
      variants: [
        { id: "sm", label: "کوچک", priceDiff: 0, stock: 999 },
        { id: "lg", label: "بزرگ", priceDiff: 18000, stock: 999 },
      ],
      tags: ["سرد"],
    },
    {
      name: "هوجیچا لاته",
      slug: "hojicha-latte",
      type: "menu",
      categoryId: catId("matcha"),
      price: "132000",
      shortDescription: "چای برشته ژاپنی با طعمی گرم و آجیلی",
      description: "هوجیچا، چای سبز برشته‌شده ژاپنی است که طعمی گرم، ملایم و کمی آجیلی دارد.",
      images: ["/images/matcha-category.jpg"],
      stock: 999,
      rating: "4.6",
      variants: [
        { id: "sm", label: "کوچک", priceDiff: 0, stock: 999 },
        { id: "lg", label: "بزرگ", priceDiff: 15000, stock: 999 },
      ],
      tags: [],
    },
    {
      name: "ماچا اسپرسو تانیک",
      slug: "matcha-espresso-tonic",
      type: "menu",
      categoryId: catId("matcha"),
      price: "148000",
      shortDescription: "ترکیب هیجان‌انگیز ماچا و آب‌تانیک",
      description: "شات ماچا روی آب‌تانیک و یخ، نوشیدنی‌ای گازدار و طراوت‌بخش.",
      images: ["/images/matcha-category.jpg"],
      stock: 999,
      rating: "4.7",
      variants: [],
      tags: ["خاص"],
    },
    {
      name: "اسپرسو",
      slug: "espresso",
      type: "menu",
      categoryId: catId("coffee"),
      price: "78000",
      shortDescription: "شات غلیظ و معطر از دانه‌های تازه برشته",
      description: "اسپرسوی خانه با بلندترین دانه‌های برشته‌شده تازه در همان هفته.",
      images: ["/images/coffee-category.jpg"],
      stock: 999,
      isFeatured: true,
      rating: "4.8",
      variants: [
        { id: "single", label: "سینگل", priceDiff: 0, stock: 999 },
        { id: "double", label: "دوبل", priceDiff: 20000, stock: 999 },
      ],
      tags: ["پرفروش"],
    },
    {
      name: "آمریکانو",
      slug: "americano",
      type: "menu",
      categoryId: catId("coffee"),
      price: "88000",
      shortDescription: "اسپرسو رقیق‌شده با آب گرم",
      description: "طعمی ملایم‌تر از اسپرسو با حفظ عمق و آروماتیک قهوه.",
      images: ["/images/coffee-category.jpg"],
      stock: 999,
      rating: "4.5",
      variants: [],
      tags: [],
    },
    {
      name: "کاپوچینو",
      slug: "cappuccino",
      type: "menu",
      categoryId: catId("coffee"),
      price: "112000",
      shortDescription: "تعادل کامل اسپرسو، شیر و فوم",
      description: "کاپوچینوی کلاسیک ایتالیایی با لایه فوم ابریشمی.",
      images: ["/images/coffee-category.jpg"],
      stock: 999,
      isFeatured: true,
      rating: "4.9",
      variants: [],
      tags: ["پرفروش"],
    },
    {
      name: "لاته کارامل",
      slug: "caramel-latte",
      type: "menu",
      categoryId: catId("coffee"),
      price: "125000",
      shortDescription: "لاته شیرین با سس کارامل خانگی",
      description: "لاته کرمی همراه با سس کارامل دست‌ساز و کمی نمک دریایی.",
      images: ["/images/coffee-category.jpg"],
      stock: 999,
      rating: "4.6",
      variants: [],
      tags: [],
    },
    {
      name: "کلد برو",
      slug: "cold-brew",
      type: "menu",
      categoryId: catId("coffee"),
      price: "118000",
      shortDescription: "دم‌آوری سرد ۱۸ ساعته، ملایم و شیرین",
      description: "کلد برو با دم‌آوری آهسته و سرد که تلخی کمتر و شیرینی طبیعی بیشتری دارد.",
      images: ["/images/coffee-category.jpg"],
      stock: 999,
      rating: "4.7",
      variants: [],
      tags: ["سرد"],
    },
    {
      name: "تیرامیسو ماچا",
      slug: "matcha-tiramisu",
      type: "menu",
      categoryId: catId("dessert"),
      price: "165000",
      shortDescription: "نسخه ماچایی دسر ایتالیایی محبوب",
      description: "لایه‌های نرم مسکارپونه با پودر ماچا به‌جای کاکائو.",
      images: ["/images/dessert-category.jpg"],
      stock: 999,
      isFeatured: true,
      rating: "4.9",
      variants: [],
      tags: ["پرفروش"],
    },
    {
      name: "چیزکیک ماچا",
      slug: "matcha-cheesecake",
      type: "menu",
      categoryId: catId("dessert"),
      price: "158000",
      shortDescription: "چیزکیک نیویورکی با روکش ماچا",
      description: "بافت کرمی و نرم با طعم ملایم ماچا روی کیک پنیر کلاسیک.",
      images: ["/images/dessert-category.jpg"],
      stock: 999,
      rating: "4.7",
      variants: [],
      tags: [],
    },
    {
      name: "براونی شکلاتی",
      slug: "chocolate-brownie",
      type: "menu",
      categoryId: catId("dessert"),
      price: "98000",
      shortDescription: "براونی مغزدار با شکلات تلخ ۷۰٪",
      description: "بافت فادج و مرطوب با شکلات تلخ بلژیکی.",
      images: ["/images/dessert-category.jpg"],
      stock: 999,
      rating: "4.6",
      variants: [],
      tags: [],
    },
    {
      name: "کوکی بادام",
      slug: "almond-cookie",
      type: "menu",
      categoryId: catId("dessert"),
      price: "62000",
      shortDescription: "کوکی ترد با تکه‌های بادام",
      description: "کوکی خانگی با کره تازه و بادام برشته.",
      images: ["/images/dessert-category.jpg"],
      stock: 999,
      rating: "4.4",
      variants: [],
      tags: [],
    },
    {
      name: "تست آووکادو",
      slug: "avocado-toast",
      type: "menu",
      categoryId: catId("breakfast"),
      price: "142000",
      shortDescription: "نان ترش با آووکادوی تازه و تخم‌مرغ",
      description: "نان ترش کره‌ای، آووکادوی له‌شده با لیمو و فلفل، تخم‌مرغ پوشه.",
      images: ["/images/breakfast-category.jpg"],
      stock: 999,
      isFeatured: true,
      rating: "4.8",
      variants: [],
      tags: ["پرفروش"],
    },
    {
      name: "کروسان کره‌ای",
      slug: "butter-croissant",
      type: "menu",
      categoryId: catId("breakfast"),
      price: "76000",
      shortDescription: "کروسان فرانسوی لایه‌لایه و ترد",
      description: "کروسان تازه فر با کره فرانسوی اصل.",
      images: ["/images/breakfast-category.jpg"],
      stock: 999,
      rating: "4.7",
      variants: [],
      tags: [],
    },
    {
      name: "املت سبزیجات",
      slug: "veggie-omelette",
      type: "menu",
      categoryId: catId("breakfast"),
      price: "128000",
      shortDescription: "املت با سبزیجات فصل و پنیر فتا",
      description: "املت نرم با اسفناج، گوجه، فلفل دلمه‌ای و پنیر فتا.",
      images: ["/images/breakfast-category.jpg"],
      stock: 999,
      rating: "4.5",
      variants: [],
      tags: [],
    },
    {
      name: "گرانولا و ماست",
      slug: "granola-yogurt",
      type: "menu",
      categoryId: catId("breakfast"),
      price: "108000",
      shortDescription: "ماست یونانی، گرانولای خانگی و عسل",
      description: "لایه‌های ماست یونانی، گرانولای خانگی، عسل طبیعی و میوه‌های فصل.",
      images: ["/images/breakfast-category.jpg"],
      stock: 999,
      rating: "4.6",
      variants: [],
      tags: ["سالم"],
    },
  ]);

  console.log("ایجاد محصولات فروشگاه...");
  await db.insert(products).values([
    {
      name: "پودر ماچا سرمونیال ژاپنی",
      slug: "ceremonial-matcha-powder",
      type: "shop",
      categoryId: catId("matcha-powder"),
      price: "385000",
      compareAtPrice: "450000",
      shortDescription: "درجه‌یک، مناسب مراسم چای و ماچا لاته خانگی",
      description:
        "پودر ماچای سرمونیال وارداتی از منطقه اوجی ژاپن، آسیاب‌شده با سنگ سنتی. رنگ سبز درخشان، عطر تازه گیاهی و طعمی نرم بدون تلخی زیاد. مناسب برای مصرف خالص و مراسم چای سنتی.",
      images: ["/images/product-matcha-powder.jpg"],
      stock: 42,
      isFeatured: true,
      rating: "4.9",
      variants: [
        { id: "30g", label: "۳۰ گرم", priceDiff: 0, stock: 20 },
        { id: "50g", label: "۵۰ گرم", priceDiff: 180000, stock: 14 },
        { id: "100g", label: "۱۰۰ گرم", priceDiff: 420000, stock: 8 },
      ],
      tags: ["پرفروش", "ارگانیک"],
    },
    {
      name: "پودر ماچا کالینری",
      slug: "culinary-matcha-powder",
      type: "shop",
      categoryId: catId("matcha-powder"),
      price: "245000",
      shortDescription: "مناسب پخت‌وپز، لاته و دسرهای ماچایی",
      description: "پودر ماچای کالینری با طعمی قوی‌تر، مناسب برای ماچا لاته، دسر و پخت‌وپز خانگی.",
      images: ["/images/product-matcha-powder.jpg"],
      stock: 60,
      rating: "4.6",
      variants: [
        { id: "100g", label: "۱۰۰ گرم", priceDiff: 0, stock: 35 },
        { id: "250g", label: "۲۵۰ گرم", priceDiff: 320000, stock: 25 },
      ],
      tags: [],
    },
    {
      name: "ماچا لاته میکس آماده",
      slug: "matcha-latte-mix",
      type: "shop",
      categoryId: catId("matcha-powder"),
      price: "198000",
      shortDescription: "آماده‌سازی سریع ماچا لاته در خانه",
      description: "ترکیب آماده پودر ماچا و شیر خشک، فقط با آب گرم یا شیر مخلوط کنید.",
      images: ["/images/product-matcha-powder.jpg"],
      stock: 75,
      rating: "4.4",
      variants: [{ id: "200g", label: "۲۰۰ گرم", priceDiff: 0, stock: 75 }],
      tags: ["جدید"],
    },
    {
      name: "دانه قهوه اسپرسو بلند برشته",
      slug: "espresso-dark-roast-beans",
      type: "shop",
      categoryId: catId("coffee-beans"),
      price: "320000",
      compareAtPrice: "365000",
      shortDescription: "بلند رست، مناسب اسپرسو و دستگاه خانگی",
      description: "میکس دانه عربیکا و روبوستا با رست بلند، عطر شکلاتی و کاراملی، مناسب اسپرسوسازهای خانگی و حرفه‌ای.",
      images: ["/images/product-coffee-beans.jpg"],
      stock: 55,
      isFeatured: true,
      rating: "4.8",
      variants: [
        { id: "250g", label: "۲۵۰ گرم", priceDiff: 0, stock: 25 },
        { id: "500g", label: "۵۰۰ گرم", priceDiff: 270000, stock: 20 },
        { id: "1kg", label: "۱ کیلوگرم", priceDiff: 520000, stock: 10 },
      ],
      tags: ["پرفروش"],
    },
    {
      name: "قهوه فیلتر تک خاستگاه اتیوپی",
      slug: "ethiopia-single-origin",
      type: "shop",
      categoryId: catId("coffee-beans"),
      price: "410000",
      shortDescription: "نت‌های میوه‌ای و گلی، برشته‌کاری روشن",
      description: "قهوه تک خاستگاه اتیوپی با نت‌های توت و گل، مناسب دم‌آوری فیلتر و پوراُور.",
      images: ["/images/product-coffee-beans.jpg"],
      stock: 30,
      rating: "4.9",
      variants: [
        { id: "250g", label: "۲۵۰ گرم", priceDiff: 0, stock: 30 },
      ],
      tags: ["ویژه"],
    },
    {
      name: "قهوه کلد برو کیسه‌ای",
      slug: "cold-brew-bags",
      type: "shop",
      categoryId: catId("coffee-beans"),
      price: "175000",
      shortDescription: "۸ کیسه دم‌آوری آسان در خانه",
      description: "کیسه‌های کلد برو آماده، فقط در آب سرد به مدت ۱۲ ساعت خیس کنید.",
      images: ["/images/product-coffee-beans.jpg"],
      stock: 48,
      rating: "4.5",
      variants: [{ id: "8pack", label: "بسته ۸ عددی", priceDiff: 0, stock: 48 }],
      tags: [],
    },
    {
      name: "ست کامل مراسم ماچا",
      slug: "matcha-ceremony-set",
      type: "shop",
      categoryId: catId("accessories"),
      price: "980000",
      compareAtPrice: "1150000",
      shortDescription: "چاسن، چاشاکو و چاوان اصل ژاپنی",
      description: "ست کامل شامل همزن بامبو (چاسن)، قاشق بامبو (چاشاکو) و کاسه سرامیکی دست‌ساز (چاوان) برای تجربه اصیل مراسم ماچا.",
      images: ["/images/product-matcha-whisk-set.jpg"],
      stock: 18,
      isFeatured: true,
      rating: "5.00",
      variants: [],
      tags: ["پرفروش", "هدیه"],
    },
    {
      name: "همزن بامبو ماچا (چاسن)",
      slug: "bamboo-matcha-whisk",
      type: "shop",
      categoryId: catId("accessories"),
      price: "280000",
      shortDescription: "همزن دست‌ساز از بامبو طبیعی، ۸۰ شاخه",
      description: "همزن سنتی بامبو برای ایجاد کف یکنواخت و بدون کلوخه در ماچا.",
      images: ["/images/product-matcha-whisk-set.jpg"],
      stock: 40,
      rating: "4.7",
      variants: [],
      tags: [],
    },
    {
      name: "الک ماچا و قاشق چوبی",
      slug: "matcha-sifter-scoop",
      type: "shop",
      categoryId: catId("accessories"),
      price: "165000",
      shortDescription: "الک ریزدانه برای بافت یکدست ماچا",
      description: "الک استیل ضدزنگ همراه با قاشق چوبی برای اندازه‌گیری دقیق پودر ماچا.",
      images: ["/images/product-matcha-whisk-set.jpg"],
      stock: 33,
      rating: "4.5",
      variants: [],
      tags: [],
    },
    {
      name: "کاسه سرامیکی ماچا (چاوان)",
      slug: "ceramic-matcha-bowl",
      type: "shop",
      categoryId: catId("accessories"),
      price: "420000",
      shortDescription: "دست‌ساز، مناسب هم زدن راحت ماچا",
      description: "کاسه سرامیکی دست‌ساز با فرم سنتی ژاپنی، مناسب دم‌آوری و سرو ماچا.",
      images: ["/images/product-matcha-whisk-set.jpg"],
      stock: 22,
      rating: "4.8",
      variants: [],
      tags: ["هدیه"],
    },
    {
      name: "فرنچ پرس شیشه‌ای",
      slug: "glass-french-press",
      type: "shop",
      categoryId: catId("accessories"),
      price: "540000",
      shortDescription: "ظرفیت ۶۰۰ میلی‌لیتر، بدنه استیل و شیشه بروسیلیکات",
      description: "فرنچ پرس با کیفیت بالا برای دم‌آوری قهوه در خانه یا محل کار.",
      images: ["/images/product-coffee-beans.jpg"],
      stock: 27,
      rating: "4.6",
      variants: [],
      tags: [],
    },
    {
      name: "ماگ سرامیکی کافه ماچا",
      slug: "cafe-macha-mug",
      type: "shop",
      categoryId: catId("accessories"),
      price: "195000",
      shortDescription: "طرح اختصاصی کافه ماچا، ظرفیت ۳۵۰ میلی‌لیتر",
      description: "ماگ سرامیکی با طرح اختصاصی برند کافه ماچا، مناسب هدیه و استفاده روزانه.",
      images: ["/images/product-matcha-whisk-set.jpg"],
      stock: 65,
      rating: "4.7",
      variants: [],
      tags: ["جدید"],
    },
  ]);

  console.log("ایجاد کدهای تخفیف...");
  await db.insert(coupons).values([
    {
      code: "WELCOME10",
      type: "percent",
      value: "10",
      minOrderAmount: "200000",
      usageLimit: 200,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
      isActive: true,
    },
    {
      code: "MACHA50K",
      type: "fixed",
      value: "50000",
      minOrderAmount: "500000",
      usageLimit: 80,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      isActive: true,
    },
  ]);

  console.log("ایجاد مقالات بلاگ...");
  await db.insert(blogPosts).values([
    {
      title: "ماچا چیست و چگونه تهیه می‌شود؟",
      slug: "what-is-matcha",
      excerpt: "از برگ‌های سایه‌پرورش‌یافته تا پودر سبز درخشان؛ سفری کوتاه در دنیای ماچا.",
      content:
        "<p>ماچا نوعی چای سبز پودری است که از برگ‌های سایه‌پرورش‌یافته چای تنچا تهیه می‌شود. برخلاف چای‌های معمولی که برگ آن‌ها دم می‌شود و سپس دور ریخته می‌شود، در نوشیدن ماچا کل برگ به‌صورت پودر مصرف می‌شود.</p><h2>مراحل تولید ماچا</h2><p>برگ‌های چای حدود ۲۰ تا ۳۰ روز قبل از برداشت، از نور مستقیم خورشید پوشانده می‌شوند. این کار باعث افزایش کلروفیل و اسیدهای آمینه در برگ‌ها می‌شود که طعم اومامی و رنگ سبز درخشان ماچا را رقم می‌زند.</p><h2>چگونه ماچا را درست تهیه کنیم؟</h2><p>یک تا دو قاشق چایخوری پودر ماچا را الک کرده و با کمی آب داغ (نه جوش) با همزن بامبو به‌صورت زیگزاگ هم بزنید تا کف یکنواختی تشکیل شود.</p>",
      coverImage: "/images/blog-cover-1.jpg",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(),
      tags: ["ماچا", "آموزش"],
    },
    {
      title: "تفاوت قهوه اسپرسو و کلدبرو در چیست؟",
      slug: "espresso-vs-coldbrew",
      excerpt: "دو روش متفاوت دم‌آوری با دو تجربه کاملا متفاوت از طعم قهوه.",
      content:
        "<p>اسپرسو با فشار بالا و آب داغ در چند ثانیه استخراج می‌شود و طعمی غلیظ و پرکافئین دارد. کلدبرو در مقابل با آب سرد و طی ۱۲ تا ۲۴ ساعت دم می‌شود که تلخی کمتر و شیرینی طبیعی بیشتری به همراه دارد.</p><h2>کدام را انتخاب کنیم؟</h2><p>اگر به دنبال طعمی قوی و فوری هستید اسپرسو انتخاب بهتری است. اما اگر روزهای گرم تابستان طرفدار طعمی ملایم و شیرین هستید، کلدبرو را امتحان کنید.</p>",
      coverImage: "/images/coffee-category.jpg",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      tags: ["قهوه"],
    },
    {
      title: "فرهنگ کافه‌نشینی و رسم مراسم چای در ژاپن",
      slug: "japanese-tea-ceremony-culture",
      excerpt: "نگاهی به آیین چادو و ریشه‌های تاریخی نوشیدن ماچا در فرهنگ ژاپنی.",
      content:
        "<p>چادو یا «راه چای»، آیینی سنتی در ژاپن است که فراتر از نوشیدن چای، به آرامش ذهن و احترام متقابل می‌پردازد. این مراسم قرن‌ها پیش توسط راهبان بودایی ذن به ژاپن آورده شد.</p><h2>اصول چهارگانه چادو</h2><p>هماهنگی، احترام، خلوص و آرامش، چهار اصل بنیادین این آیین هستند که در هر حرکت میزبان و مهمان جاری است.</p>",
      coverImage: "/images/about-cafe.jpg",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
      tags: ["فرهنگ", "ماچا"],
    },
    {
      title: "راهنمای خرید بهترین پودر ماچا",
      slug: "how-to-buy-matcha-powder",
      excerpt: "نکاتی کلیدی برای تشخیص پودر ماچای باکیفیت از انواع بی‌کیفیت بازار.",
      content:
        "<p>رنگ سبز درخشان، بافت نرم و بدون کلوخه، و عطر تازه گیاهی از مهم‌ترین نشانه‌های ماچای باکیفیت هستند. ماچای سرمونیال برای مصرف خالص و ماچای کالینری برای پخت‌وپز و لاته مناسب‌تر است.</p><h2>نگهداری صحیح</h2><p>پودر ماچا را دور از نور و رطوبت، ترجیحاً در یخچال نگهداری کنید تا طراوت آن حفظ شود.</p>",
      coverImage: "/images/product-matcha-powder.jpg",
      authorId: admin.id,
      isPublished: true,
      publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
      tags: ["ماچا", "راهنما"],
    },
  ]);

  console.log("ایجاد تنظیمات سایت...");
  await db.insert(siteSettings).values([
    {
      key: "general",
      value: {
        siteName: "کافه ماچا",
        phone: "021-88776655",
        mobile: "0912-000-0000",
        email: "hello@cafemacha.ir",
        address: "تهران، خیابان ولیعصر، بالاتر از پارک ملت، پلاک ۱۲۴",
        workingHours: "همه روزه ۸ صبح تا ۱۱ شب",
        social: {
          instagram: "https://instagram.com/cafemacha",
          telegram: "https://t.me/cafemacha",
          whatsapp: "https://wa.me/989120000000",
        },
        banners: [
          {
            title: "طعم اصیل ماچای ژاپنی",
            subtitle: "از مزرعه تا فنجان شما، با عشق دم‌آوری می‌شود",
            image: "/images/hero-cafe.jpg",
          },
        ],
      },
    },
  ]);

  console.log("✅ داده‌های نمونه با موفقیت اضافه شدند.");
  console.log("---------------------------------------------");
  console.log("ورود ادمین: admin@cafemacha.ir / admin123");
  console.log("---------------------------------------------");
}

main()
  .catch((err) => {
    console.error("خطا در seed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
