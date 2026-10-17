import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Closing band at the end of a page: a short pitch and one action. */
export function CtaBand({
  children,
  href = "/shipments/new",
  action = "Post a shipment",
}: {
  children: React.ReactNode;
  href?: string;
  action?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl bg-muted/50 p-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
      {children}
      <Link
        href={href}
        className={cn(buttonVariants({ size: "lg" }), "shrink-0")}
      >
        {action}
      </Link>
    </div>
  );
}
