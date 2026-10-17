import type { Metadata } from "next";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export const metadata: Metadata = {
  title: { default: "Dashboard · Haulr", template: "%s · Haulr" },
  robots: { index: false },
};

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return <DashboardShell>{children}</DashboardShell>;
}
