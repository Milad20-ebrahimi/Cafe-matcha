import type { ReactNode } from "react";
import { getSession } from "@/lib/session";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CartHydration } from "@/components/site/cart-hydration";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  return (
    <div className="flex min-h-screen flex-col">
      <CartHydration />
      <SiteHeader userName={session?.name} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
