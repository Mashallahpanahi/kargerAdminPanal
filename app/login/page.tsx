"use client";

import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        showToast.error("Login failed", "Invalid email or password.");
        return;
      }

      showToast.success("Login successful", "Welcome back.");
      router.push("/admin");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Toaster />
      <div className="w-full max-w-md bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="bg-orange-500 py-5 flex justify-center">
          <Image src="/images/kargerlogo.png" alt="Logo" width={90} height={90} />
        </div>
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-center">Admin Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input className="pl-9" {...register("email")} />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  className="pl-9 pr-9"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
              <div className="text-right mt-2">
                <Link href="/forgot-password" className="text-sm text-orange-600">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
