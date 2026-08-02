import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="px-4 pb-20 pt-28">
      <AuthForm mode="login" />
    </div>
  );
}
