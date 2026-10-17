import type { Metadata } from "next";
import { BrandingPage } from "@/features/brand/components/branding-page";

export const metadata: Metadata = {
  title: "Branding · Haulr",
  description:
    "Haulr brand images for social posts, covers, and link previews.",
  robots: { index: false },
};

export default function Page() {
  return <BrandingPage />;
}
