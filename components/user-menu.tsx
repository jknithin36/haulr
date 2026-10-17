"use client";

import {
  DashboardSquare01Icon,
  Logout03Icon,
  Message01Icon,
  PackageIcon,
  Settings01Icon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { signOut } from "@/features/user/user-actions";
import type { SessionUser } from "@/lib/demo-data/dashboard/user";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Admin dashboard", icon: DashboardSquare01Icon },
  { href: "/admin/users", label: "Users", icon: UserMultipleIcon },
  { href: "/admin/disputes", label: "Disputes", icon: Message01Icon },
  { href: "/admin/settings", label: "Admin settings", icon: Settings01Icon },
];

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardSquare01Icon },
  { href: "/dashboard/shipments", label: "My shipments", icon: PackageIcon },
  { href: "/dashboard/messages", label: "Messages", icon: Message01Icon },
  { href: "/dashboard/settings", label: "Settings", icon: Settings01Icon },
];

/** Avatar button with account links, shown in place of "Log in" when signed in. */
export function UserMenu({
  user,
  className,
}: {
  user: SessionUser;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className={cn(
          "flex rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
      >
        <GradientAvatar seed={user.name} className="size-8" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="flex items-center gap-2 text-sm text-foreground">
              {user.name}
              {user.role === "admin" && (
                <span className="rounded-full bg-muted px-1.5 text-[11px] font-medium">
                  Admin
                </span>
              )}
            </span>
            <span className="font-normal">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {(user.role === "admin" ? adminLinks : userLinks).map((link) => (
            <DropdownMenuItem
              key={link.href}
              render={<Link href={link.href} />}
            >
              <HugeiconsIcon icon={link.icon} strokeWidth={2} />
              {link.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <HugeiconsIcon icon={Logout03Icon} strokeWidth={2} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
