"use client";

import { resetPassword, verifyResetCode } from "@/app/actions/auth";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    code: z.string().length(6, "Code must be 6 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!email) {
      showToast.error("Missing email", "Go back and start again.");
      return;
    }
    setLoading(true);
    const verify = await verifyResetCode(email, data.code);
    if (!verify.success) {
      setLoading(false);
      showToast.error("Invalid code", verify.error || "Please try again.");
      return;
    }
    const result = await resetPassword(email, data.code, data.password);
    setLoading(false);
    if (!result.success) {
      showToast.error("Reset failed", result.error || "Please try again.");
      return;
    }
    showToast.success("Password reset", "You can log in now.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-xl border shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        <p className="text-sm text-gray-600 mb-4">{email}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="6-digit code" {...register("code")} />
          <Input type="password" placeholder="New password" {...register("password")} />
          <Input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword")}
          />
          {Object.values(formState.errors).length > 0 && (
            <p className="text-xs text-red-500">
              {formState.errors.code?.message ||
                formState.errors.password?.message ||
                formState.errors.confirmPassword?.message}
            </p>
          )}
          <Button className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset"}
          </Button>
        </form>
        <Link href="/login" className="text-sm text-orange-600 mt-4 inline-block">
          Back to login
        </Link>
      </div>
    </div>
  );
}
