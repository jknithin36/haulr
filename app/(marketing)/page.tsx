import { CtaBanner } from "@/features/marketing/components/cta-banner";
import { Faq } from "@/features/marketing/components/faq";
import { Hero } from "@/features/marketing/components/hero";
import { HowItWorks } from "@/features/marketing/components/how-it-works";
import { LiveBoard } from "@/features/marketing/components/live-board";
import { Pricing } from "@/features/marketing/components/pricing";
import { Testimonials } from "@/features/marketing/components/testimonials";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-4 pt-4 pb-4">
      <Hero />
      <HowItWorks />
      <LiveBoard />
      <Pricing />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </main>
  );
}
