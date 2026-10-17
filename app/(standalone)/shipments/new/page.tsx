import type { Metadata } from "next";
import { PostShipmentFlow } from "@/features/shipment/components/post-shipment-flow";

export const metadata: Metadata = {
  title: "Post a shipment · Haulr",
  description:
    "Tell drivers what you’re shipping, where, and when. Get offers in hours.",
};

export default function NewShipmentPage() {
  return <PostShipmentFlow />;
}
