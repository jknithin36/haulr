"use client";

import { MotionConfig, motion } from "motion/react";
import { Stars } from "@/components/ui/data-display";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { RouteLabel } from "@/components/ui/route-label";
import { SectionHeader } from "@/features/marketing/components/section-header";
import { cn } from "@/lib/utils";

type Testimonial = {
  name: string;
  role: string;
  /** Where they're based, or the route they shipped on. */
  place?: string | { from: string; to: string };
  quote: [before: string, highlight: string, after: string];
  featured?: boolean;
};

const testimonials: Testimonial[] = [
  {
    name: "Sarah M.",
    role: "Shipped a car",
    place: { from: "Los Angeles", to: "New York" },
    quote: [
      "I got six offers in one day and ",
      "saved almost $400",
      ". My car arrived a day early and in perfect condition.",
    ],
    featured: true,
  },
  {
    name: "Mike R.",
    role: "Driver",
    place: "Phoenix, AZ",
    quote: [
      "I used to drive home with an empty trailer. Now I share my space and ",
      "fill it on almost every trip",
      ".",
    ],
  },
  {
    name: "Priya K.",
    role: "Shipped furniture",
    place: { from: "Seattle", to: "Denver" },
    quote: [
      "I was nervous about sending my grandmother’s dresser. The driver sent photos at pickup and delivery, and ",
      "it arrived safely",
      ".",
    ],
  },
  {
    name: "James T.",
    role: "Driver",
    place: "Dallas, TX",
    quote: [
      "Payments are quick and simple. I’ve finished ",
      "more than 80 jobs",
      " on Haulr this year.",
    ],
  },
  {
    name: "Elena G.",
    role: "Shipped a motorcycle",
    place: { from: "Miami", to: "Chicago" },
    quote: [
      "Messaging drivers before choosing one made it ",
      "easy to trust",
      " who I picked.",
    ],
  },
  {
    name: "David L.",
    role: "Owner, Lane Home Goods",
    quote: [
      "We ship pallets every week now. The Business plan ",
      "saves us time and money",
      ".",
    ],
  },
];

export function Testimonials() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="testimonials"
        className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-16 md:pb-24"
      >
        <SectionHeader title="Trusted by shippers and drivers across the US">
          <div className="flex items-center gap-4">
            <p className="font-heading text-5xl font-semibold tracking-tight">
              4.8
            </p>
            <div className="flex flex-col gap-1">
              <Stars value={5} />
              <p className="text-sm text-muted-foreground">
                out of 5 · Based on 3,200+ reviews
              </p>
            </div>
          </div>
        </SectionHeader>

        <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t, i) => (
            <motion.li
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: (i % 3) * 0.08,
              }}
              className="mb-4 break-inside-avoid"
            >
              <figure
                className={cn(
                  "flex flex-col gap-6 rounded-2xl bg-muted/50 p-6",
                  t.featured && "md:p-8",
                )}
              >
                <blockquote
                  className={cn(
                    "text-pretty text-foreground/70",
                    t.featured
                      ? "font-heading text-2xl leading-snug font-medium tracking-tight"
                      : "text-base leading-relaxed",
                  )}
                >
                  “{t.quote[0]}
                  <strong className="font-semibold text-foreground">
                    {t.quote[1]}
                  </strong>
                  {t.quote[2]}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <GradientAvatar seed={t.name} />
                  <div className="min-w-0">
                    <p className="font-semibold">{t.name}</p>
                    <p className="flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        {t.role}
                      </span>
                      {t.place && (
                        <span className="inline-flex items-center gap-1">
                          <span aria-hidden>·</span>
                          {typeof t.place === "string" ? (
                            t.place
                          ) : (
                            <RouteLabel
                              from={t.place.from}
                              to={t.place.to}
                              className="gap-x-1"
                            />
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </motion.li>
          ))}
        </ul>
      </section>
    </MotionConfig>
  );
}
