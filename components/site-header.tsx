"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { LogoLink } from "@/components/ui/logo";
import { UserMenu } from "@/components/user-menu";
import type { SessionUser } from "@/lib/demo-data/dashboard/user";
import { mainNav } from "@/lib/site-nav";
import { cn } from "@/lib/utils";

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  // On the home page the navbar sits on top of the hero image.
  const overlay = pathname === "/";

  return (
    <header
      className={cn(
        "z-40 w-full",
        overlay
          ? "absolute inset-x-0 top-4 text-white"
          : "sticky top-0 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-14 w-full max-w-296 items-center gap-6 px-4",
          overlay && "mt-2 max-w-none px-10 md:px-16",
        )}
      >
        <LogoLink />

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "text-muted-foreground aria-[current=page]:text-foreground",
                overlay &&
                  "text-white/75 hover:bg-white/10 hover:text-white aria-[current=page]:text-white dark:hover:bg-white/10",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <UserMenu
              user={user}
              className={cn(overlay && "ring-2 ring-white/40")}
            />
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "hidden md:inline-flex",
                overlay &&
                  "text-white hover:bg-white/10 hover:text-white dark:hover:bg-white/10",
              )}
            >
              Log in
            </Link>
          )}
          <Link
            href="/shipments/new"
            className={cn(
              buttonVariants({ size: "lg" }),
              "hidden md:inline-flex",
              overlay && "bg-white text-black hover:bg-white/90",
            )}
          >
            Post a shipment
          </Link>

          <MobileNav
            user={user}
            isActive={isActive}
            triggerClassName={cn(
              overlay &&
                "text-white hover:bg-white/10 hover:text-white aria-expanded:bg-white/10 aria-expanded:text-white",
            )}
          />
        </div>
      </div>
    </header>
  );
}
