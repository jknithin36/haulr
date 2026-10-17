"use client";

import {
  ArrowRight01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogoLink } from "@/components/ui/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SessionUser } from "@/lib/demo-data/dashboard/user";
import { mainNav } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

/**
 * Full-screen menu for small screens. The top row mirrors the site header,
 * so opening it feels like the header expanding rather than a drawer.
 */
export function MobileNav({
  user,
  isActive,
  triggerClassName,
}: {
  user: SessionUser | null;
  isActive: (href: string) => boolean;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const home = user?.role === "admin" ? "/admin" : "/dashboard";
  const account = user
    ? {
        href: home,
        label: user.role === "admin" ? "Admin dashboard" : "Dashboard",
      }
    : { href: "/login", label: "Log in" };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", triggerClassName)}
          />
        }
      >
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
        <span className="sr-only">Open menu</span>
      </SheetTrigger>

      <SheetContent
        side="top"
        showCloseButton={false}
        className="gap-0 border-none shadow-none data-[side=top]:h-dvh data-[side=top]:border-b-0"
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          <LogoLink onClick={close} />
          <SheetClose render={<Button variant="ghost" size="icon" />}>
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            <span className="sr-only">Close menu</span>
          </SheetClose>
        </div>

        <SheetTitle className="sr-only">Menu</SheetTitle>

        <nav className="flex flex-col px-4 pt-6">
          {mainNav.map((item, index) => {
            const current = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={current ? "page" : undefined}
                style={{ animationDelay: `${60 + index * 40}ms` }}
                className="group flex items-center justify-between py-3 font-heading text-3xl font-semibold tracking-tight duration-300 fill-mode-both animate-in fade-in slide-in-from-top-2"
              >
                {item.label}
                {current ? (
                  <span className="flex size-5 items-center justify-center">
                    <span className="size-2 rounded-full bg-foreground" />
                  </span>
                ) : (
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={2}
                    className="size-5 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Link
            href={account.href}
            onClick={close}
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
          >
            {account.label}
          </Link>
          <Link
            href="/shipments/new"
            onClick={close}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Post a shipment
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
