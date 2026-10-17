import type { Metadata } from "next";
import { ShareTripFlow } from "@/features/trip/components/share-trip-flow";

export const metadata: Metadata = {
  title: "Share truck space · Haulr",
  description:
    "Post your route and the space you have left. Shippers book spots on your trip.",
};

export default function NewTripPage() {
  return <ShareTripFlow />;
}
