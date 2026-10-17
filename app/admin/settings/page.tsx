import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { AdminSettingsView } from "@/features/admin/components/settings/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Fees, marketplace rules and who on the team can do what."
      />
      <AdminSettingsView />
    </>
  );
}
