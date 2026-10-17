"use client";

import { SecurityCheckIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/features/marketing/components/section-header";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "For people who ship or drive once in a while.",
    features: [
      "Post as many shipments as you like",
      "Send up to 10 offers a month",
      "Share space on 2 trips a month",
      "8% fee per booking",
      "Email support",
    ],
    cta: { label: "Get started", href: "/signup" },
  },
  {
    name: "Pro Driver",
    badge: "Most popular",
    featured: true,
    price: { monthly: 29, yearly: 23 },
    description: "For drivers who want more jobs and lower fees.",
    features: [
      "Unlimited offers",
      "Share space on unlimited trips",
      "5% fee per booking",
      "Featured placement in search results",
      "Pro badge on your profile",
      "Priority support",
    ],
    cta: { label: "Start 14-day free trial", href: "/signup?plan=pro" },
  },
  {
    name: "Business",
    price: { monthly: 99, yearly: 79 },
    description: "For companies that ship every week.",
    features: [
      "Everything in Pro Driver",
      "3% fee per booking",
      "Post many shipments at once",
      "Team accounts for up to 10 people",
      "Monthly invoices",
      "A dedicated account manager",
    ],
    cta: { label: "Talk to sales", href: "/contact" },
  },
];

const trust = ["Secure payments", "Cancel anytime", "No hidden fees"];

function Price({ amount, billing }: { amount: number; billing: Billing }) {
  const note =
    amount === 0
      ? "forever"
      : billing === "yearly"
        ? "per month, billed yearly"
        : "per month";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-14 items-end overflow-hidden">
        <span className="font-heading text-5xl font-semibold tracking-tight">
          $
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={amount}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-5xl font-semibold tracking-tight tabular-nums"
          >
            {amount}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="text-sm opacity-60">{note}</p>
    </div>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="pricing"
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-16 md:pb-24"
      >
        <SectionHeader title="Simple pricing, no surprises">
          <Tabs
            value={billing}
            onValueChange={(value) => setBilling(value as Billing)}
          >
            <TabsList
              aria-label="Billing period"
              className="group-data-horizontal/tabs:h-9"
            >
              <TabsTrigger value="monthly" className="px-3">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="gap-2 px-3">
                Yearly
                <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  Save 20%
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </SectionHeader>

        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col gap-8 rounded-2xl p-6 md:p-8",
                plan.featured
                  ? "bg-foreground text-background shadow-xl shadow-foreground/10"
                  : "bg-card text-card-foreground ring-1 ring-foreground/10",
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.badge && (
                    <span className="rounded-full bg-background/15 px-2.5 py-1 text-xs font-medium">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm opacity-70">{plan.description}</p>
              </div>

              <Price amount={plan.price[billing]} billing={billing} />

              <Link
                href={plan.cta.href}
                className={cn(
                  buttonVariants({
                    variant: plan.featured ? "default" : "outline",
                    size: "lg",
                  }),
                  "w-full",
                  plan.featured &&
                    "bg-background text-foreground hover:bg-background/90",
                )}
              >
                {plan.cta.label}
              </Link>

              <ul className="flex flex-col gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className="mt-0.5 size-4 shrink-0 opacity-60"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <p className="flex flex-col items-center gap-2 text-pretty sm:flex-row">
            <HugeiconsIcon
              icon={SecurityCheckIcon}
              strokeWidth={2}
              className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            Every booking includes payment protection. Drivers are paid only
            after the delivery is confirmed.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:gap-x-3">
            {trust.map((item) => (
              <li
                key={item}
                className="sm:not-first:before:mr-3 sm:not-first:before:content-['·']"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}
