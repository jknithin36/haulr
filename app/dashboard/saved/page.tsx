import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { SavedView } from "@/features/dashboard/components/saved/saved-view";

export const metadata: Metadata = { title: "Saved" };

export default function SavedPage() {
  return (
    <>
      <PageHeader
        title="Saved"
        description="Shipments and trips you want to come back to."
      />
      <SavedView />
    </>
  );
}
