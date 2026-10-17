import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FaqAccordion,
  type FaqItem,
} from "@/features/marketing/components/faq-accordion";
import { SectionTitle } from "@/features/marketing/components/section-header";
import { cn } from "@/lib/utils";

const groups: { value: string; label: string; items: FaqItem[] }[] = [
  {
    value: "shipping",
    label: "Shipping",
    items: [
      {
        q: "How much does it cost to ship something?",
        a: (
          <>
            It depends on what you’re shipping, how far it’s going, and your
            dates. Use our <Link href="/estimate">free estimate tool</Link> for
            a quick price range, or post your shipment to get real offers.
          </>
        ),
      },
      {
        q: "How long does shipping take?",
        a: "Most cross-country shipments take 5 to 8 days. Shorter trips usually take 1 to 3 days.",
      },
      {
        q: "Do I have to accept the lowest offer?",
        a: "No. You can choose any offer. Many people pick a driver based on ratings, reviews, or delivery time.",
      },
      {
        q: "What if I don’t like any of the offers?",
        a: "You don’t have to accept any. You can change your budget or dates and post again for free.",
      },
      {
        q: "Is my item protected during shipping?",
        a: "Verified drivers carry their own insurance, and you can see their coverage before you book. Drivers also take photos at pickup and delivery.",
      },
    ],
  },
  {
    value: "driving",
    label: "Driving",
    items: [
      {
        q: "Who can send offers on shipments?",
        a: "Anyone with a Haulr account who has added a vehicle. Verified drivers get a badge that helps them stand out.",
      },
      {
        q: "How do I get verified?",
        a: "Upload your driver’s license and insurance in your settings. Our team usually reviews them within 24 hours.",
      },
      {
        q: "Can I share space on a trip I’m already making?",
        a: "Yes. Post your route, dates, and available space, and people can book a spot on your trip.",
      },
      {
        q: "Is there a cost to send offers?",
        a: "No. Sending offers is free. A small fee is taken only when a job is booked.",
      },
    ],
  },
  {
    value: "payments",
    label: "Payments",
    items: [
      {
        q: "When do I pay?",
        a: "You pay a deposit when you book. The rest is paid after your item is delivered.",
      },
      {
        q: "When do drivers get paid?",
        a: "Within 2 business days after the delivery is confirmed.",
      },
      {
        q: "Can I cancel a booking?",
        a: "Yes. You can cancel for free up to 48 hours before pickup. After that, a small fee may apply.",
      },
      {
        q: "What if something goes wrong?",
        a: "Open a dispute from your dashboard. Our team will review the details and photos and help you resolve it.",
      },
    ],
  },
];

function SupportCta({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-4 gap-y-3", className)}
    >
      <p className="font-medium">Still have questions?</p>
      <Link
        href="/contact"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        Contact support
      </Link>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto w-full max-w-6xl pb-16 md:pb-24">
      <Tabs
        defaultValue="shipping"
        className="grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16"
      >
        <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <SectionTitle>Frequently asked questions</SectionTitle>
          <TabsList className="group-data-horizontal/tabs:h-9">
            {groups.map((group) => (
              <TabsTrigger
                key={group.value}
                value={group.value}
                className="px-3"
              >
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <SupportCta className="mt-6 hidden lg:flex" />
        </div>

        <div>
          {groups.map((group) => (
            <TabsContent key={group.value} value={group.value}>
              <FaqAccordion items={group.items} />
            </TabsContent>
          ))}
          <SupportCta className="mt-10 lg:hidden" />
        </div>
      </Tabs>
    </section>
  );
}
