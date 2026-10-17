import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Full-height photo hero at the top of the home page. */
export function Hero() {
  return (
    <section className="relative flex h-[calc(100svh-2rem)] min-h-130 items-end overflow-hidden rounded-xl">
      <Image
        src="/hero.jpg"
        alt="Two couriers loading boxes into a delivery van"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/35 via-50% to-black/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/50 to-transparent" />

      <div className="relative z-10 flex w-full flex-col gap-8 p-6 text-white md:flex-row md:items-end md:justify-between md:gap-12 md:p-12">
        <h1 className="max-w-3xl text-balance text-3xl font-medium tracking-tight md:text-5xl">
          The easier way to ship cars, furniture, and freight
        </h1>

        <div className="flex shrink-0 flex-col gap-5 md:max-w-sm">
          <p className="text-pretty text-base text-white/80">
            Tell us what you’re sending, and drivers across the country will
            compete for the job.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shipments/new"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-black hover:bg-white/90",
              )}
            >
              Post a shipment
            </Link>
            <Link
              href="/loads"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white dark:border-white/40 dark:bg-white/10 dark:hover:bg-white/20",
              )}
            >
              Find truck space
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
