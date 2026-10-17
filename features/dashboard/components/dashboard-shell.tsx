import { DashboardShellClient } from "@/features/dashboard/components/dashboard-shell-client";
import { getAccount } from "@/features/dashboard/dashboard-queries";

export async function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getAccount();
  return (
    <DashboardShellClient account={account}>{children}</DashboardShellClient>
  );
}
