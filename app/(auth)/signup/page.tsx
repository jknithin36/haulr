import type { Metadata } from "next";
import { SignupFlow } from "@/features/user/components/signup-flow";

export const metadata: Metadata = {
  title: "Sign up · Haulr",
  description:
    "Create your free Haulr account to ship items and drive for others.",
};

export default function SignupPage() {
  return <SignupFlow />;
}
