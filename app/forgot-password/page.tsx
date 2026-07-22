"use client";

import { requestPasswordReset } from "@/app/actions/auth";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({ email: z.string().email("Valid email is required") });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await requestPasswordReset(data.email);
    setLoading(false);
    if (!result.success) {
      showToast.error("Request failed", result.error || "Try again.");
      return;
    }
    showToast.success("Code sent", "Use the code to reset your password.");
    router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-xl border shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="admin@email.com" {...register("email")} />
          {formState.errors.email && (
            <p className="text-xs text-red-500">{formState.errors.email.message}</p>
          )}
          <Button className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send code"}
          </Button>
        </form>
        <Link href="/login" className="text-sm text-orange-600 mt-4 inline-block">
          Back to login
        </Link>
      </div>
    </div>
  );
}
