import type { Metadata } from "next";
import {
  EstimateFaq,
  SavingTips,
} from "@/features/estimate/components/estimate-advice";
import { EstimateCalculator } from "@/features/estimate/components/estimate-calculator";

export const metadata: Metadata = {
  title: "Shipping cost calculator · Haulr",
  description:
    "Get a free price estimate in seconds for shipping a car, furniture, a heavy item, or freight. No account needed.",
};

export default function EstimatePage() {
  return (
    <main className="flex flex-1 flex-col px-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 pt-10 pb-16 md:gap-24 md:pt-16 md:pb-24">
        <div className="flex flex-col gap-10 md:gap-12">
          <header className="flex max-w-2xl flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              Estimate
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight md:text-5xl">
              How much will it cost to ship?
            </h1>
            <p className="text-pretty text-muted-foreground md:text-lg">
              Get a free price estimate in seconds. No account needed.
            </p>
          </header>

          <EstimateCalculator />
        </div>

        <SavingTips />
        <EstimateFaq />
      </div>
    </main>
  );
}
