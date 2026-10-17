"use client";

import {
  Calendar03Icon,
  Logout03Icon,
  Notification01Icon,
  Search01Icon,
  Settings01Icon,
  UnfoldMoreIcon,
  UserSwitchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
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
import { LogoMark } from "@/components/ui/logo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  adminAlerts,
  adminNav,
  adminSearchIndex,
} from "@/features/admin/admin-nav";
import {
  type AdminRange,
  AdminRangeProvider,
  adminRanges,
  useAdminRange,
} from "@/features/admin/components/admin-range";
import { signOut } from "@/features/user/user-actions";
import { adminUser } from "@/lib/demo-data/admin/admin-user";

function isActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return adminNav.map((group) => (
    <SidebarGroup key={group.label}>
      <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={isActive(pathname, item.href)}
                render={
                  <Link href={item.href} onClick={() => setOpenMobile(false)} />
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
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

function AccountMenu({ compact = false }: { compact?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Admin account menu"
        render={
          compact ? (
            <button
              type="button"
              className="flex rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          ) : (
            <SidebarMenuButton
              size="lg"
              className="data-popup-open:bg-sidebar-accent"
            />
          )
        }
      >
        <GradientAvatar seed={adminUser.name} className="size-8" />
        {!compact && (
          <>
            <span className="grid flex-1 text-left leading-tight">
              <span className="truncate font-medium">{adminUser.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {adminUser.role}
              </span>
            </span>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              strokeWidth={2}
              className="ml-auto text-muted-foreground"
            />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={compact ? "bottom" : "top"}
        align={compact ? "end" : "start"}
        className="w-60"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="text-sm text-foreground">{adminUser.name}</span>
            <span className="font-normal">
              {adminUser.title} · {adminUser.role}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <HugeiconsIcon icon={UserSwitchIcon} strokeWidth={2} />
          Switch to user view
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/admin/settings" />}>
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

function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };
  const groups = ["Users", "Shipments", "Jobs", "Disputes"] as const;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg bg-muted/60 px-3 md:max-w-md text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <HugeiconsIcon icon={Search01Icon} strokeWidth={2} className="size-4" />
        <span className="truncate">
          Search users, shipments, IDs, or emails…
        </span>
        <kbd className="ml-auto hidden rounded bg-background px-1.5 font-sans text-[11px] sm:inline">
          ⌘K
        </kbd>
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search users, shipments, IDs, or emails"
      >
        <Command>
          <CommandInput placeholder="Search users, shipments, IDs, or emails…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {adminNav
                .flatMap((g) => g.items)
                .map((item) => (
                  <CommandItem key={item.href} onSelect={() => go(item.href)}>
                    <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                    {item.label}
                  </CommandItem>
                ))}
            </CommandGroup>
            {groups.map((group) => (
              <CommandGroup key={group} heading={group}>
                {adminSearchIndex
                  .filter((entry) => entry.group === group)
                  .map((entry) => (
                    <CommandItem
                      key={entry.label}
                      value={`${entry.label} ${entry.hint}`}
                      onSelect={() => go(entry.href)}
                    >
                      {entry.label}
                      <CommandShortcut className="tracking-normal">
                        {entry.hint}
                      </CommandShortcut>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

function RangePicker() {
  const { range, setRange } = useAdminRange();
  return (
    <Select
      items={adminRanges.map((r) => ({ value: r, label: r }))}
      value={range}
      onValueChange={(value) => setRange(value as AdminRange)}
    >
      <SelectTrigger aria-label="Date range" className="h-9 max-md:hidden">
        <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {adminRanges.map((r) => (
          <SelectItem key={r} value={r}>
            {r}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AlertsBell() {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Notifications, ${adminAlerts.length} new`}
            className="relative"
          />
        }
      >
        <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background tabular-nums">
          {adminAlerts.length}
        </span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <p className="px-4 pt-3 pb-2 text-sm font-medium">Alerts</p>
        <ul className="flex flex-col pb-2">
          {adminAlerts.map((alert) => (
            <li key={alert.text}>
              <Link
                href={alert.href}
                className="flex items-start justify-between gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted"
              >
                <span className="text-pretty">{alert.text}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {alert.time}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminRangeProvider>
      <SidebarProvider>
        <Sidebar variant="inset">
          <SidebarHeader>
            <Link
              href="/admin"
              className="flex h-10 items-center gap-2 px-2 font-semibold tracking-tight"
            >
              <LogoMark />
              Haulr Admin
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <NavLinks />
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <AccountMenu />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 rounded-t-xl bg-background/80 px-4 backdrop-blur md:px-6">
            <SidebarTrigger className="-ml-1" />
            <GlobalSearch />
            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <RangePicker />
              <AlertsBell />
              <AccountMenu compact />
            </div>
          </header>
          <div className="flex flex-1 flex-col px-4 pt-4 pb-16 md:px-8 md:pt-6">
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminRangeProvider>
  );
}
