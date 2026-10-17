"use client";

import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { SegmentMeter } from "@/components/ui/segment-meter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/features/marketing/components/section-header";
import {
  Lane,
  Perforation,
  ShipmentTicket,
  Tag,
  Ticket,
} from "@/features/shipment/components/shipment-ticket";
import type { Shipment } from "@/lib/demo-data/shipments";
import type { TruckSpace } from "@/lib/demo-data/truck-spaces";
import { cn } from "@/lib/utils";

const tabs = {
  shipments: {
    label: "Shipments",
    cta: "Browse all shipments",
    href: "/shipments",
  },
  space: { label: "Truck space", cta: "Find truck space", href: "/loads" },
} as const;

type Tab = keyof typeof tabs;

function TruckSpaceTicket({ space: t }: { space: TruckSpace }) {
  return (
    <Ticket href={`/loads/${t.id}`} label={`View truck space: ${t.driver}`}>
      <div className="flex flex-col gap-6 p-5 pb-4">
        <div className="flex items-center gap-2">
          <Tag>{t.vehicle}</Tag>
          <span className="text-xs text-muted-foreground">
            Departs {t.departs}
          </span>
        </div>
        <Lane from={t.from} to={t.to} />
        <div className="flex items-center gap-3">
          <GradientAvatar seed={t.driver} />
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{t.driver}</h3>
            <p className="inline-flex items-center gap-1 text-muted-foreground">
              <HugeiconsIcon
                icon={StarIcon}
                strokeWidth={2}
                className="size-3.5 fill-foreground text-foreground"
              />
              {t.rating.toFixed(1)} rating
            </p>
          </div>
        </div>
      </div>
      <Perforation />
      <div className="mt-auto flex flex-col gap-3 p-5 pt-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs text-muted-foreground">Space</p>
          <p className="text-xs font-medium">{t.spaceLeft}</p>
        </div>
        <SegmentMeter segments={t.segments} filled={t.filled} />
        <p className="pt-1 font-heading text-xl font-semibold">{t.price}</p>
      </div>
    </Ticket>
  );
}

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
  exit: { transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } },
} as const;

const itemClass = "w-[82%] shrink-0 snap-start sm:w-auto";

export function LiveBoardClient({
  shipments,
  truckSpaces,
}: {
  shipments: Shipment[];
  truckSpaces: TruckSpace[];
}) {
  const [tab, setTab] = useState<Tab>("shipments");

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="live-loads"
        className="mx-auto w-full max-w-6xl pb-16 md:pb-24"
      >
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as Tab)}
          className="gap-8"
        >
          <SectionHeader
            title="Happening right now"
            description="Real shipments looking for drivers, and drivers with space to share."
          >
            <TabsList className="group-data-horizontal/tabs:h-9">
              {(Object.keys(tabs) as Tab[]).map((key) => (
                <TabsTrigger key={key} value={key} className="px-3">
                  {tabs[key].label}
                </TabsTrigger>
              ))}
            </TabsList>
          </SectionHeader>

          <div role="tabpanel" aria-label={tabs[tab].label}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={tab}
                variants={list}
                initial="hidden"
                animate="show"
                exit="exit"
                className="scrollbar-none -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-1 pb-6 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4"
              >
                {tab === "shipments"
                  ? shipments.map((s) => (
                      <motion.li
                        key={s.id}
                        variants={item}
                        className={itemClass}
                      >
                        <ShipmentTicket shipment={s} />
                      </motion.li>
                    ))
                  : truckSpaces.map((t) => (
                      <motion.li
                        key={t.id}
                        variants={item}
                        className={itemClass}
                      >
                        <TruckSpaceTicket space={t} />
                      </motion.li>
                    ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          <Link
            href={tabs[tab].href}
            className={cn(buttonVariants({ size: "lg" }), "mx-auto")}
          >
            {tabs[tab].cta}
          </Link>
        </Tabs>
      </section>
    </MotionConfig>
  );
}
