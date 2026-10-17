import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/components/admin-shell";

export const metadata: Metadata = {
  title: { default: "Admin · Haulr", template: "%s · Haulr Admin" },
  robots: { index: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminShell>{children}</AdminShell>;
}
