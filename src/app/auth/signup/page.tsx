import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="px-4 pb-20 pt-28">
      <AuthForm mode="signup" />
    </div>
  );
}
