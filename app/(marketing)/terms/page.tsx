import type { Metadata } from "next";
import { Suspense } from "react";
import {
  LegalPage,
  LegalPageSkeleton,
} from "@/features/legal/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of service · Haulr",
  description: "The rules for using Haulr to ship items and drive for others.",
};

export default function TermsPage() {
  return (
    <main className="flex flex-1 flex-col px-4">
      <Suspense fallback={<LegalPageSkeleton />}>
        <LegalPage id="terms" />
      </Suspense>
    </main>
  );
}
