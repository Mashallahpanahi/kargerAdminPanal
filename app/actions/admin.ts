"use server";

import { auth } from "@/lib/auth/auth";
import { API_ENDPOINTS } from "@/lib/config/api-endpoints";
import {
  mergePortfolioItems,
  type EmployeeDetails,
  type EmployerDetails,
  type PortfolioItem,
} from "@/types/profile";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

function unwrapData<T>(response: unknown): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as { data: T }).data;
  }
  return response as T;
}

function normalizeList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const payload = data as { data?: unknown; items?: unknown };
    if (Array.isArray(payload.data)) return payload.data as T[];
    if (Array.isArray(payload.items)) return payload.items as T[];
  }
  return [];
}

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
export async function getEmployeeById(
  employeeId: string,
): Promise<EmployeeDetails> {
  const response = await adminFetch<unknown>(
    API_ENDPOINTS.ADMIN.GET_EMPLOYEE_BY_ID(employeeId),
    "GET",
  );
  return unwrapData<EmployeeDetails>(response);
}

export async function getEmployerById(
  employerId: string,
): Promise<EmployerDetails> {
  const response = await adminFetch<unknown>(
    API_ENDPOINTS.ADMIN.GET_EMPLOYER_BY_ID(employerId),
    "GET",
  );
  return unwrapData<EmployerDetails>(response);
}

export async function getEmployeePortfolio(
  employeeId: string,
): Promise<PortfolioItem[]> {
  try {
    const response = await adminFetch<unknown>(
      API_ENDPOINTS.ADMIN.EMPLOYEE_PORTFOLIO(employeeId),
      "GET",
    );
    return normalizeList<PortfolioItem>(response);
  } catch {
    return [];
  }
}

export async function getEmployeePublicProfile(employeeId: string): Promise<{
  employee: EmployeeDetails;
  portfolioItems: PortfolioItem[];
}> {
  const [employee, portfolioFromEndpoint] = await Promise.all([
    getEmployeeById(employeeId),
    getEmployeePortfolio(employeeId),
  ]);

  const portfolioItems = mergePortfolioItems(
    portfolioFromEndpoint,
    Array.isArray(employee.portfolioItems) ? employee.portfolioItems : [],
  );

  return {
    employee: {
      ...employee,
      portfolioItems,
      platformCompletedWork: Array.isArray(employee.platformCompletedWork)
        ? employee.platformCompletedWork
        : [],
    },
    portfolioItems,
  };
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
