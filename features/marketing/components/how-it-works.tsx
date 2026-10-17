import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seal } from "@/features/marketing/components/seal";
import { SectionHeader } from "@/features/marketing/components/section-header";
import { cn } from "@/lib/utils";

const flows = [
  {
    value: "shipping",
    label: "I’m shipping",
    seal: {
      org: "Northstar",
      title: "Top Rated",
      subtitle: "Customer Confidence",
    },
    title: "For shippers",
    description:
      "Post what you need moved and let drivers come to you. Compare real prices, pick the driver you trust, and follow your shipment all the way to the door.",
    cta: { label: "Post a shipment", href: "/shipments/new" },
    steps: [
      {
        title: "Post your shipment",
        description:
          "Tell us what you’re sending, where it’s going, and when you need it there.",
      },
      {
        title: "Compare offers",
        description:
          "Drivers send you their prices. Check their ratings, reviews, and delivery times.",
      },
      {
        title: "Choose your driver",
        description:
          "Book the offer that works best for you. You only pay when you book.",
      },
      {
        title: "Track your delivery",
        description: "Follow your shipment on the map until it arrives safely.",
      },
    ],
  },
  {
    value: "driving",
    label: "I’m driving",
    seal: {
      org: "Meridian",
      title: "Gold Standard",
      subtitle: "Service Excellence",
    },
    title: "For drivers",
    description:
      "Find jobs that match where you’re already headed. Fill empty space, set your own prices, and get paid fast for every delivery.",
    cta: { label: "Add your vehicle", href: "/vehicles/new" },
    steps: [
      {
        title: "Add your vehicle",
        description:
          "Add your truck or trailer, upload photos, and get verified.",
      },
      {
        title: "Find work that fits your route",
        description:
          "Send offers on shipments, or share the empty space on a trip you’re already making.",
      },
      {
        title: "Get booked",
        description:
          "When a shipper picks you, you’ll get the pickup details right away.",
      },
      {
        title: "Deliver and get paid",
        description:
          "Mark the job as delivered, and your payment arrives within 2 business days.",
      },
    ],
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto w-full max-w-6xl py-16 md:py-24"
    >
      <Tabs defaultValue="shipping" className="gap-8">
        <SectionHeader
          title={
            <>
              How <LogoMark className="h-[0.8em] translate-y-[0.08em]" />
              <span className="sr-only">Haulr</span> works
            </>
          }
          description="Shipping or driving, you can get started in minutes."
        >
          <TabsList className="group-data-horizontal/tabs:h-9">
            {flows.map((flow) => (
              <TabsTrigger key={flow.value} value={flow.value} className="px-3">
                {flow.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </SectionHeader>

        {flows.map((flow) => (
          <TabsContent
            key={flow.value}
            value={flow.value}
            className="duration-300 animate-in fade-in motion-reduce:animate-none"
          >
            <div className="grid gap-10 rounded-2xl bg-muted/50 p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16 md:p-12">
              <div className="flex flex-col items-start gap-4">
                <Seal {...flow.seal} className="w-28 text-foreground" />
                <h3 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                  {flow.title}
                </h3>
                <p className="max-w-md text-pretty text-muted-foreground md:text-lg">
                  {flow.description}
                </p>
                <Link
                  href={flow.cta.href}
                  className={cn(buttonVariants({ size: "lg" }), "mt-4")}
                >
                  {flow.cta.label}
                </Link>
              </div>

              <ol>
                {flow.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="group/step relative flex gap-5 pb-8 last:pb-0"
                  >
                    {/* Connector running down to the next step. */}
                    <span
                      aria-hidden
                      className="absolute top-10 bottom-2 left-4 w-px -translate-x-1/2 bg-foreground/10 group-last/step:hidden"
                    />
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-sm font-medium tabular-nums shadow-xs">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-1 pt-1">
                      <p className="font-medium">{step.title}</p>
                      <p className="text-pretty text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
