import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { OffersView } from "@/features/dashboard/components/offers/offers-view";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My offers" };

export default function OffersPage() {
  return (
    <>
      <PageHeader
        title="My offers"
        description="Offers you’ve sent to shippers."
        action={
          <Link
            href="/shipments"
            className={cn(buttonVariants({ size: "lg" }), "w-fit px-3")}
          >
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Find shipments
          </Link>
        }
      />
      <OffersView />
    </>
  );
}
