import { Suspense } from "react";
import { SessionHeader } from "@/components/session-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Public pages: site header (aware of the signed-in user) and footer. */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<SiteHeader user={null} />}>
        <SessionHeader />
      </Suspense>
      {children}
      <SiteFooter />
    </>
  );
}
