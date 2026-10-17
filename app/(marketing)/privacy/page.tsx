import type { Metadata } from "next";
import { Suspense } from "react";
import {
  LegalPage,
  LegalPageSkeleton,
} from "@/features/legal/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy policy · Haulr",
  description: "What Haulr collects about you and how we use it.",
};

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col px-4">
      <Suspense fallback={<LegalPageSkeleton />}>
        <LegalPage id="privacy" />
      </Suspense>
    </main>
  );
}
