import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/shipments/new",
    label: "Post a shipment",
    className: "bg-black text-white hover:bg-black/85",
  },
  {
    href: "/loads",
    label: "Find truck space",
    className: "bg-white text-black hover:bg-white/90",
  },
];

/**
 * Home page hero: a Haulr truck on the highway, with the pitch set over the
 * motion-blurred road below it so the truck itself stays clear. The photo is
 * pinned to its bottom edge so the truck stays in frame at every aspect ratio.
 */
export function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-2rem)] flex-col overflow-hidden rounded-xl">
      <Image
        src="/haulr-truck-demo.jpg"
        alt="White Haulr semi truck driving along a highway under a blue sky"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[12%_100%] grayscale md:object-bottom"
      />
      {/* Shade behind the navbar, and a deeper one over the blurred road for the copy. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-linear-to-b from-black/55 md:h-40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-black/80 md:h-3/5 via-black/40 to-transparent" />

      {/*
        Phones: headline in the sky above the truck, buttons on the road below.
        Desktop: everything on the road, headline left and actions right.
      */}
      <div className="flex flex-1 flex-col p-6 pt-24 text-white md:mt-auto md:grid md:flex-none md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] md:items-end md:gap-x-12 md:gap-y-5 md:p-12">
        <h1 className="max-w-3xl text-balance text-3xl font-medium tracking-tight duration-700 fill-mode-both animate-in fade-in slide-in-from-bottom-4 md:row-span-2 md:text-5xl motion-reduce:animate-none">
          The easier way to ship cars, furniture, and freight
        </h1>
        <p className="mt-4 text-pretty text-base text-white/80 delay-100 duration-700 fill-mode-both animate-in fade-in slide-in-from-bottom-4 md:col-start-2 md:row-start-1 md:mt-0 motion-reduce:animate-none">
          Tell us what you’re sending, and drivers across the country compete
          for the job.
        </p>
        <div className="mt-auto flex flex-wrap gap-3 delay-200 duration-700 fill-mode-both animate-in fade-in slide-in-from-bottom-4 md:col-start-2 md:row-start-2 md:mt-0 motion-reduce:animate-none">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                buttonVariants({ size: "lg" }),
                "group gap-2",
                action.className,
              )}
            >
              {action.label}
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                strokeWidth={2}
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
