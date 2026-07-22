"use client";

import { createAdmin } from "@/app/actions/admin";
import { showToast } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { AdminFormData, AdminFormErrors } from "@/types/admin";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdminCreated: () => void;
}

const EMPTY_FORM: AdminFormData = {
  name: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  password: "",
};

function fieldClass(error?: string) {
  return [
    "bg-white py-5",
    "border rounded-sm",
    "text-gray-700 placeholder:text-gray-400",
    "focus:!border-black focus:!outline-none focus:!ring-0",
    error ? "!border-red-500" : "border-gray-300",
  ].join(" ");
}

export function AddAdminDialog({
  open,
  onOpenChange,
  onAdminCreated,
}: AddAdminDialogProps) {
  const router = useRouter();

  const [form, setForm] = useState<AdminFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<AdminFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set =
    (field: keyof AdminFormData) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: AdminFormErrors = {};
    if (!form.name.trim()) next.name = "First name is required.";
    if (!form.lastName.trim()) next.lastName = "Last name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.phoneNumber.trim())
      next.phoneNumber = "Phone number is required.";
    if (!form.password.trim()) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setShowPassword(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) reset();
    onOpenChange(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await createAdmin(form);
      showToast.success("Success", "Admin created successfully.");
      reset();
      onAdminCreated();
      onOpenChange(false);
    } catch (error) {
      const message =
        (error as Error).message ?? "An unexpected error occurred.";

      // Mirror the auth-error redirect pattern used across the codebase
      if (
        message.includes("Authentication failed") ||
        message.includes("No access token")
      ) {
        showToast.error("Session Expired", "Please log in again.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      showToast.error("Create failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden bg-white max-w-md">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add New Admin
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* First Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              First Name
            </Label>
            <Input
              id="name"
              placeholder="First name"
              value={form.name}
              onChange={set("name")}
              disabled={isSubmitting}
              className={fieldClass(errors.name)}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={set("lastName")}
              disabled={isSubmitting}
              className={fieldClass(errors.lastName)}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={set("email")}
              disabled={isSubmitting}
              className={fieldClass(errors.email)}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label
              htmlFor="phoneNumber"
              className="text-sm font-medium text-gray-700"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 202-555-0134"
              value={form.phoneNumber}
              onChange={set("phoneNumber")}
              disabled={isSubmitting}
              className={fieldClass(errors.phoneNumber)}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={set("password")}
                disabled={isSubmitting}
                className={fieldClass(errors.password)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 rounded-full cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Add Admin"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
