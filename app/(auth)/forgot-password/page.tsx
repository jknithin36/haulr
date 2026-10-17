import type { Metadata } from "next";
import { AuthLayout } from "@/features/user/components/auth-layout";
import { ForgotPasswordForm } from "@/features/user/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password · Haulr",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
