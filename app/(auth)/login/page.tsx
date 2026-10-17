import type { Metadata } from "next";
import { AuthLayout } from "@/features/user/components/auth-layout";
import { LoginForm } from "@/features/user/components/login-form";

export const metadata: Metadata = {
  title: "Log in · Haulr",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
