"use client";
import { Toaster as SonnerToaster, toast } from "sonner";

export const Toaster = () => (
  <SonnerToaster position="top-right" richColors expand={true} closeButton />
);

type ToastOptions = {
  description?: string;
  duration?: number;
};

export const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, options),
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, options),
  info: (message: string, options?: ToastOptions) => toast(message, options),
  warning: (message: string, options?: ToastOptions) =>
    toast.warning(message, options),
};
