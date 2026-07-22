"use server";

import { API_ENDPOINTS } from "@/lib/config/api-endpoints";

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function requestPasswordReset(
  email: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.ADMIN.FORGOT_PASSWORD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.status === 201 || response.ok) {
      return {
        success: true,
        message:
          data.message ||
          "If an account exists, a verification code has been sent.",
      };
    }
    return {
      success: false,
      error: data.message || "Failed to send verification code.",
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// Modified resetPassword to accept email, otp, and newPassword
export async function resetPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.ADMIN.RESET_PASSWORD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          data.message ||
          "Failed to reset password. The code may be invalid or expired.",
      };
    }
    return {
      success: true,
      message: data.message || "Password reset successfully.",
    };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

export async function verifyResetCode(
  email: string,
  code: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.ADMIN.VERIFY_RESET_CODE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Invalid or expired reset code.",
      };
    }

    return {
      success: true,
      message: data.message || "Code verified successfully.",
    };
  } catch (error) {
    console.error("Error verifying code:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
