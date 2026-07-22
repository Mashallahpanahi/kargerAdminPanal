"use server";

import { auth } from "@/lib/auth/auth";
import { API_ENDPOINTS } from "@/lib/config/api-endpoints";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function adminFetch<T>(
  url: string,
  method: RequestMethod,
  body?: unknown,
): Promise<T> {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error("Authentication required");
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

export async function getDashboardStats() {
  return adminFetch(API_ENDPOINTS.ADMIN.DASHBOARD_STATS, "GET");
}

export async function listAdmins() {
  return adminFetch(API_ENDPOINTS.ADMIN.LIST_ALL, "GET");
}

export async function createAdmin(payload: {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}) {
  return adminFetch(API_ENDPOINTS.ADMIN.CREATE, "POST", payload);
}

export async function deleteAdmin(adminId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.DELETE(adminId), "DELETE");
}

export async function getAdminProfile() {
  return adminFetch(API_ENDPOINTS.ADMIN.PROFILE, "GET");
}

export async function updateAdminProfile(payload: {
  name?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}) {
  return adminFetch(API_ENDPOINTS.ADMIN.PROFILE, "PATCH", payload);
}

export async function listEmployees() {
  return adminFetch<{ success: boolean; count: number; data: unknown[] }>(
    API_ENDPOINTS.ADMIN.EMPLOYEES,
    "GET",
  );
}

export async function listEmployers() {
  return adminFetch<{ success: boolean; count: number; data: unknown[] }>(
    API_ENDPOINTS.ADMIN.EMPLOYERS,
    "GET",
  );
}
export async function getEmployeeById(employeeId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.GET_EMPLOYEE_BY_ID(employeeId), "GET");
}
export async function getEmployerById(employerId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.GET_EMPLOYER_BY_ID(employerId), "GET");
}
export async function deleteEmployee(employeeId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.DELETE_EMPLOYEE(employeeId), "DELETE");
}

export async function deleteEmployer(employerId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.DELETE_EMPLOYER(employerId), "DELETE");
}

export async function banEmployee(employeeId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.BAN_EMPLOYEE(employeeId), "PATCH");
}

export async function unbanEmployee(employeeId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.UNBAN_EMPLOYEE(employeeId), "PATCH");
}

export async function banEmployer(employerId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.BAN_EMPLOYER(employerId), "PATCH");
}

export async function unbanEmployer(employerId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.UNBAN_EMPLOYER(employerId), "PATCH");
}

export async function deletePost(postId: string) {
  return adminFetch(API_ENDPOINTS.ADMIN.DELETE_POST(postId), "DELETE");
}
