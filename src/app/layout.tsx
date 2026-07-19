import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "کافه ماچا | Cafe Macha",
  description:
    "کافه تخصصی ماچا و قهوه — تجربه‌ای گرم و ارگانیک از طعم‌های اصیل ژاپنی و ایتالیایی، همراه با فروشگاه آنلاین محصولات ویژه.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream font-sans text-forest antialiased">
        {children}
        <Toaster
          position="top-center"
          dir="rtl"
          richColors
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
              textAlign: "right",
            },
          }}
        />
      </body>
    </html>
  );
}
