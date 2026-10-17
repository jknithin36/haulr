import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { TripsView } from "@/features/dashboard/components/trips/trips-view";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My trips" };

export default function TripsPage() {
  return (
    <>
      <PageHeader
        title="My trips"
        description="Space you’ve shared on your routes."
        action={
          <Link
            href="/loads/new"
            className={cn(buttonVariants({ size: "lg" }), "w-fit px-3")}
          >
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Share truck space
          </Link>
        }
      />
      <TripsView />
    </>
  );
}
