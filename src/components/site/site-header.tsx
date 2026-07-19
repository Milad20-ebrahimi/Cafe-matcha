"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const NAV_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/menu", label: "منوی کافه" },
  { href: "/shop", label: "فروشگاه" },
  { href: "/blog", label: "بلاگ" },
  { href: "/about", label: "درباره ما" },
  { href: "/contact", label: "تماس با ما" },
];

export function SiteHeader({ userName }: { userName?: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const count = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const bump = useCartStore((s) => s.lastAddedAt);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (bump) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 350);
      return () => clearTimeout(t);
    }
  }, [bump]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled ? "border-forest/10 bg-cream/90 backdrop-blur-md" : "border-transparent bg-cream/70 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg">
          <span className="flex size-9 items-center justify-center rounded-full bg-forest text-sage">
            <Leaf className="size-4" />
          </span>
          <span className="font-serif text-xl font-bold text-forest">کافه ماچا</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-amber-dark" : "text-forest/70 hover:text-forest",
                )}
              >
                {link.label}
                {active && <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-amber" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href={userName ? "/account" : "/login"}
            className="focus-ring hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-forest/80 transition-colors hover:bg-forest/5 sm:flex"
          >
            <User2 className="size-[18px]" />
            {userName ? userName.split(" ")[0] : "ورود"}
          </Link>
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="focus-ring relative flex size-11 items-center justify-center rounded-xl text-forest transition-colors hover:bg-forest/5"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -left-1 flex size-5 items-center justify-center rounded-full bg-amber text-[11px] font-bold text-white",
                  pop && "animate-pop",
                )}
              >
                {count > 9 ? "9+" : count}
              </span>
            )}
          </Link>
          <button
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring flex size-11 items-center justify-center rounded-xl text-forest transition-colors hover:bg-forest/5 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-in-up border-t border-forest/10 bg-cream px-4 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "focus-ring flex h-12 items-center rounded-xl px-3 text-sm font-medium transition-colors",
                  pathname === link.href ? "bg-forest text-cream" : "text-forest/80 hover:bg-forest/5",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={userName ? "/account" : "/login"}
              className="focus-ring flex h-12 items-center gap-2 rounded-xl px-3 text-sm font-medium text-forest/80 hover:bg-forest/5"
            >
              <User2 className="size-[18px]" />
              {userName ? `حساب کاربری (${userName.split(" ")[0]})` : "ورود / ثبت‌نام"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
