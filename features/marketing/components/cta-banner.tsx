"use client";

import { MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Arch rising from the bottom of the banner, with fine white grain.
const arch =
  "M-60 721C-60 538.6 15.9 363.6 150.9 234.5 285.9 105.5 469 33 660 33c191 0 374.1 72.5 509.1 201.5C1304.1 363.6 1380 538.6 1380 721H-60Z";

export function CtaBanner() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id="get-started"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl bg-card px-6 py-20 text-card-foreground md:py-28"
      >
        <svg
          viewBox="0 0 1321 444"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-0 size-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="cta-arch-fill"
              x1="688"
              y1="40"
              x2="688"
              y2="464"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#a1a1aa" />
            </linearGradient>
            <filter
              id="cta-arch-grain"
              x="-60"
              y="33"
              width="1440"
              height="688"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="1"
                numOctaves="3"
                seed="5363"
                stitchTiles="stitch"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="luminanceToAlpha"
                result="alphaNoise"
              />
              <feComponentTransfer in="alphaNoise" result="grain">
                <feFuncA
                  type="discrete"
                  tableValues="0 0 0 0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                />
              </feComponentTransfer>
              <feComposite
                operator="in"
                in="grain"
                in2="SourceGraphic"
                result="grainClipped"
              />
              <feFlood floodColor="#ffffff" />
              <feComposite
                operator="in"
                in2="grainClipped"
                result="whiteGrain"
              />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="whiteGrain" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={arch}
            fill="url(#cta-arch-fill)"
            fillOpacity="0.4"
            filter="url(#cta-arch-grain)"
          />
        </svg>

        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
            Ready to move something?
          </h2>
          <p className="text-pretty text-muted-foreground md:text-lg">
            Post your shipment for free and start getting offers from drivers
            today.
          </p>
          <div className="mt-3 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/shipments/new"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Post a shipment
            </Link>
            <Link
              href="/estimate"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Get a free estimate
            </Link>
          </div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}
