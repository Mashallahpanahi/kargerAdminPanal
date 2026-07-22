"use client";

import { toast, Toaster as SonnerToaster } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      position: "top-right",
    });
  },
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      position: "top-right",
    });
  },
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      position: "top-right",
    });
  },
};

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          color: "#374151",
        },
      }}
    />
  );
}
