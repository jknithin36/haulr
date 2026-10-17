"use client";

import {
  ArrowRight01Icon,
  DeliveryTruck01Icon,
  PackageIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AuthLogo } from "@/features/user/components/auth-layout";
import { firstName } from "@/lib/format";

const options = [
  {
    href: "/shipments/new",
    icon: PackageIcon,
    title: "Ship something",
    text: "Post what you’re sending and get offers from drivers.",
  },
  {
    href: "/loads/new",
    icon: DeliveryTruck01Icon,
    title: "Start driving",
    text: "Add your vehicle and find shipments on your route.",
  },
  {
    href: "/dashboard",
    icon: Search01Icon,
    title: "Just looking",
    text: "Head to your dashboard and look around first.",
  },
];

/** Shown right after signup so new people land somewhere useful. */
export function OnboardingStep({ name }: { name: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const greetingName = firstName(name);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    heading.current?.focus();
  }, []);

  return (
    <main className="flex min-h-svh flex-1 flex-col px-6 py-6 md:px-10">
      <AuthLogo />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 py-12">
        <div className="flex flex-col gap-2">
          {greetingName && (
            <p className="text-sm font-medium text-muted-foreground">
              You’re in, {greetingName}.
            </p>
          )}
          <h1
            ref={heading}
            tabIndex={-1}
            className="text-balance text-3xl font-semibold tracking-tight outline-none md:text-4xl"
          >
            What would you like to do first?
          </h1>
          <p className="text-pretty text-muted-foreground">
            One account does both, so you can switch anytime.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-3">
          {options.map((o) => (
            <li key={o.href}>
              <Link
                href={o.href}
                className="group flex h-full items-start gap-4 rounded-2xl bg-muted/50 p-5 md:flex-col md:gap-10 md:p-6 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 md:min-h-56"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background">
                  <HugeiconsIcon
                    icon={o.icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                </span>
                <span className="flex flex-col gap-1 md:mt-auto">
                  <span className="flex items-center gap-1 font-semibold">
                    {o.title}
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      strokeWidth={2}
                      className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="text-pretty text-muted-foreground">
                    {o.text}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
