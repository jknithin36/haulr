import type { Metadata } from "next";
import { VerificationView } from "@/features/admin/components/verification/verification-view";

export const metadata: Metadata = { title: "Verification" };

export default function AdminVerificationPage() {
  return <VerificationView />;
}
