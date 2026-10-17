import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FaqAccordion,
  type FaqItem,
} from "@/features/marketing/components/faq-accordion";

const tips = [
  "Choose flexible dates.",
  "Pick an open trailer if you don’t need extra protection.",
  "Meet the driver near a major highway.",
  "Post 1–2 weeks ahead.",
];

const faqs: FaqItem[] = [
  {
    q: "Is this the final price?",
    a: "No. It’s a range based on recent shipments. Your final price depends on the offer you accept.",
  },
  {
    q: "Why do prices change?",
    a: "Prices change with fuel costs, season, and how many drivers are on your route.",
  },
  {
    q: "Do I need an account?",
    a: "No. You only need an account when you post your shipment.",
  },
];

function AdviceTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
      {children}
    </h2>
  );
}

/** Quick ways to bring the price down, shown under the calculator. */
export function SavingTips() {
  return (
    <section className="flex flex-col gap-6">
      <AdviceTitle>Tips to save money</AdviceTitle>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-3 rounded-2xl bg-muted/50 p-5"
          >
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            />
            <span className="text-pretty">{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EstimateFaq() {
  return (
    <section className="grid gap-6 lg:grid-cols-[2fr_3fr] lg:gap-16">
      <AdviceTitle>Frequently asked questions</AdviceTitle>
      <FaqAccordion items={faqs} />
    </section>
  );
}
