import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export type GeneralSettings = {
  siteName: string;
  phone: string;
  mobile: string;
  email: string;
  address: string;
  workingHours: string;
  social: { instagram: string; telegram: string; whatsapp: string };
  banners: { title: string; subtitle: string; image: string }[];
};

export const DEFAULT_SETTINGS: GeneralSettings = {
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
};

export async function getSiteSettings(): Promise<GeneralSettings> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "general"))
      .limit(1);
    if (!row) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(row.value as Partial<GeneralSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
