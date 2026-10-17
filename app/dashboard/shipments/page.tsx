import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ShipmentsView } from "@/features/dashboard/components/shipments/shipments-view";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My shipments" };

export default function ShipmentsPage() {
  return (
    <>
      <PageHeader
        title="My shipments"
        description="Everything you’ve posted or booked."
        action={
          <Link
            href="/shipments/new"
            className={cn(buttonVariants({ size: "lg" }), "w-fit")}
          >
            <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
            Post a shipment
          </Link>
        }
      />
      <ShipmentsView />
    </>
  );
}
