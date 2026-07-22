"use server";

import { API_ENDPOINTS } from "@/lib/config/api-endpoints";
import { ApiResponse, authenticatedFetch } from "@/lib/utils/api-utils";

export type AdminRole = "ADMIN" | "CUSTOMER" | "PRO";

export interface AdminUser {
  id: string;
  role: AdminRole;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CurrentAdmin {
  id: string;
  email: string;
  role: AdminRole;
}
// Fetch all admin users with optional filtering, pagination, and ordering
export async function fetchAllAdminUsers(params?: {
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string; // e.g., "createdAt:desc"
  role?: AdminRole;
}): Promise<
  ApiResponse<{
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
  }>
> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.orderBy) queryParams.append("orderBy", params.orderBy);
    if (params?.role) queryParams.append("role", params.role);

    const url = `${API_ENDPOINTS.USERS.GET_ALL}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await authenticatedFetch(url, {
      method: "GET",
    });

    const apiResponse = await response.json(); // This is the full API response object

    if (!response.ok) {
      return {
        success: false,
        error: apiResponse.message || "Failed to fetch users.",
      };
    }

    // CORRECTED: Accessing pagination data from the nested 'pagination' object
    const users = apiResponse.data || [];
    const total = apiResponse.pagination?.total || 0;
    const page = apiResponse.pagination?.page || 1;
    const limit = apiResponse.pagination?.limit || 10;

    return {
      success: true,
      data: {
        users: users,
        total: total,
        page: page,
        limit: limit,
      },
    };
  } catch (error) {
    console.error("Error in fetchAllAdminUsers:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

// Get a single admin user by ID
export async function getAdminUserById(
  userId: string
): Promise<ApiResponse<AdminUser>> {
  try {
    const response = await authenticatedFetch(
      API_ENDPOINTS.USERS.GET_BY_ID(userId),
      {
        method: "GET",
      }
    );

    const resultData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: resultData.message || "Failed to fetch user details.",
      };
    }

    const user = resultData.data || resultData;

    if (!user) {
      return { success: false, error: "User data not found in API response." };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error in getAdminUserById:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

// Create a new admin user (using auth endpoints for registration)
export async function createAdminUser(userData: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: AdminRole;
}): Promise<ApiResponse> {
  try {
    const endpoint =
      userData.role === "ADMIN"
        ? API_ENDPOINTS.AUTH.REGISTER_ADMIN
        : API_ENDPOINTS.AUTH.REGISTER_CUSTOMER_OR_TASKER;

    const requestBody = {
      email: userData.email,
      password: userData.password,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    };

    const response = await authenticatedFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to create user.",
      };
    }

    return {
      success: true,
      data: data,
      message: `${userData.role} user created successfully`,
    };
  } catch (error) {
    console.error("Error in createAdminUser:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

// Update an admin user (general user details)
export async function updateAdminUser(
  userId: string,
  userData: Partial<{
    firstName: string;
    lastName: string;
    phone: string;
  }>
): Promise<ApiResponse> {
  try {
    const response = await authenticatedFetch(
      API_ENDPOINTS.USERS.UPDATE(userId),
      {
        method: "PATCH",
        body: JSON.stringify(userData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to update user.",
      };
    }

    return {
      success: true,
      data: data,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Error in updateAdminUser:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

// Update admin user role
export async function updateAdminUserRole(
  userId: string,
  role: AdminRole
): Promise<ApiResponse> {
  try {
    const response = await authenticatedFetch(
      API_ENDPOINTS.USERS.UPDATE_ROLE(userId),
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to update user role.",
      };
    }

    return {
      success: true,
      data: data,
      message: "Role updated successfully",
    };
  } catch (error) {
    console.error("Error in updateAdminUserRole:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

// Delete an admin user
export async function deleteAdminUser(userId: string): Promise<ApiResponse> {
  try {
    const response = await authenticatedFetch(
      API_ENDPOINTS.USERS.DELETE(userId),
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response
        .json()
        .catch(() => ({ message: "Failed to delete user." }));
      return {
        success: false,
        error: data.message || "Failed to delete user.",
      };
    }

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error in deleteAdminUser:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

//change amdin password
export async function changeAdminPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse> {
  try {
    const response = await authenticatedFetch(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD(userId),
      {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to change password.",
      };
    }
    return {
      success: true,
      data: data,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Error in changeAdminPassword:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

//Request email change (sends OPT to new email)
export async function requestEmailChange(
  userId: string,
  currentPassword: string,
  newEmail: string
): Promise<ApiResponse> {
  try {
    const response = await authenticatedFetch(
      API_ENDPOINTS.AUTH.CHANGE_EMAIL(userId),
      {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newEmail,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to request email change.",
      };
    }
    return {
      success: true,
      data: data,
      message: "OTP sent to new email address",
    };
  } catch (error) {
    console.error("Error in requestEmailChange:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

//Confirm email change with OPT
export async function confirmEmailChange(
  otp: string,
  newEmail?: string
): Promise<ApiResponse> {
  try {
    const response = await authenticatedFetch(
      API_ENDPOINTS.AUTH.CONFIRM_EMAIL_CHANGE_OTP,
      {
        method: "POST",
        body: JSON.stringify({ otp, newEmail }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to confirm email change.",
      };
    }
    return {
      success: true,
      data: data,
      message: "Email changed successfully",
    };
  } catch (error) {
    console.error("Error in confirmEmailChange:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}

// Get the current admin user
export async function getCurrentAdminUser(): Promise<
  ApiResponse<CurrentAdmin>
> {
  try {
    const response = await authenticatedFetch(API_ENDPOINTS.AUTH.GET_STATE, {
      method: "GET",
    });

    const resultData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: resultData.message || "Failed to fetch current admin details.",
      };
    }

    // Map the API response to the CurrentAdmin interface
    const currentAdmin: CurrentAdmin = {
      id: resultData.userId,
      email: resultData.email,
      role: resultData.role,
    };

    return { success: true, data: currentAdmin };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: errorMessage };
  }
}
