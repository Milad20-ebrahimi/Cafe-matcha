import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "کافه ماچا | Cafe Macha",
  description:
    "کافه تخصصی ماچا و قهوه — تجربه‌ای گرم و ارگانیک از طعم‌های اصیل ژاپنی و ایتالیایی، همراه با فروشگاه آنلاین محصولات ویژه.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
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