import Link from "next/link";
import { Camera, MessageCircle, Send, MapPin, Phone, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { getSiteSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  return (
    <footer className="mt-24 bg-forest text-cream">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-serif text-2xl font-bold text-cream">کافه ماچا</h3>
          <p className="mt-3 text-sm leading-7 text-cream/60">
            کافه‌ای تخصصی برای عاشقان ماچا و قهوه؛ تجربه‌ای گرم، ارگانیک و اصیل از فنجان تا فروشگاه.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={settings.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="اینستاگرام کافه ماچا"
              className="focus-ring flex size-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-amber"
            >
              <Camera className="size-4" />
            </a>
            <a
              href={settings.social.telegram}
              target="_blank"
              rel="noreferrer"
              aria-label="تلگرام کافه ماچا"
              className="focus-ring flex size-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-amber"
            >
              <Send className="size-4" />
            </a>
            <a
              href={settings.social.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="واتساپ کافه ماچا"
              className="focus-ring flex size-10 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-amber"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-cream">دسترسی سریع</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-cream/70">
            <li><Link className="transition-colors hover:text-amber-light" href="/menu">منوی کافه</Link></li>
            <li><Link className="transition-colors hover:text-amber-light" href="/shop">فروشگاه</Link></li>
            <li><Link className="transition-colors hover:text-amber-light" href="/blog">بلاگ</Link></li>
            <li><Link className="transition-colors hover:text-amber-light" href="/about">درباره ما</Link></li>
            <li><Link className="transition-colors hover:text-amber-light" href="/contact">تماس با ما</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-cream">حساب کاربری</h4>
          <ul className="flex flex-col gap-2.5 text-sm text-cream/70">
            <li><Link className="transition-colors hover:text-amber-light" href="/account/orders">سفارش‌های من</Link></li>
            <li><Link className="transition-colors hover:text-amber-light" href="/account/addresses">آدرس‌ها</Link></li>
            <li><Link className="transition-colors hover:text-amber-light" href="/cart">سبد خرید</Link></li>
            <li><Link className="transition-colors hover:text-amber-light" href="/login">ورود / ثبت‌نام</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-cream">اطلاعات تماس</h4>
          <ul className="flex flex-col gap-3 text-sm text-cream/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-sage" />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-sage" />
              <span dir="ltr">{settings.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-sage" />
              <span>{settings.workingHours}</span>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} کافه ماچا. تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
