"use client";

import {
  Add01Icon,
  Logout03Icon,
  Notification01Icon,
  Settings01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { LogoMark } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { dashboardNav } from "@/features/dashboard/dashboard-nav";
import { signOut } from "@/features/user/user-actions";
import { cn } from "@/lib/utils";

function NavLinks() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return dashboardNav.map((group) => (
    <SidebarGroup key={group.label}>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={active}
                  render={
                    <Link
                      href={item.href}
                      onClick={() => setOpenMobile(false)}
                    />
                  }
                >
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
                {item.badge ? (
                  <SidebarMenuBadge className="tabular-nums">
                    {item.badge}
                  </SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

type Account = { name: string; plan: string };

function AccountButton({ account }: { account: Account }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton
            size="lg"
            className="data-popup-open:bg-sidebar-accent"
          />
        }
      >
        <GradientAvatar seed={account.name} className="size-8" />
        <span className="grid flex-1 text-left leading-tight">
          <span className="truncate font-medium">{account.name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {account.plan}
          </span>
        </span>
        <HugeiconsIcon
          icon={UnfoldMoreIcon}
          strokeWidth={2}
          className="ml-auto text-muted-foreground"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuItem render={<Link href="/dashboard/settings" />}>
          <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <HugeiconsIcon icon={Logout03Icon} strokeWidth={2} />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardShellClient({
  account,
  children,
}: {
  account: Account;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <Link
            href="/"
            className="flex h-10 items-center gap-2 px-2 font-semibold tracking-tight"
          >
            <LogoMark />
            Haulr
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <NavLinks />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <AccountButton account={account} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 rounded-t-xl bg-background/80 px-4 backdrop-blur md:px-6">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/dashboard/notifications"
              aria-label="Notifications, 3 unread"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "relative",
              )}
            >
              <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-foreground ring-2 ring-background" />
            </Link>
            <Link
              href="/shipments/new"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
              Post a shipment
            </Link>
          </div>
        </header>
        <div className="flex flex-1 flex-col px-4 pt-4 pb-16 md:px-8 md:pt-6">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
