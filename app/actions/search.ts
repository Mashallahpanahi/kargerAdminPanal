"use server";

import { auth } from "@/lib/auth/auth";
import { API_ENDPOINTS } from "@/lib/config/api-endpoints";
import type {
  SearchCombinedParams,
  SearchJob,
  SearchJobsParams,
  SearchUser,
  SearchUserType,
} from "@/types/search";

type UserTypeFilter = SearchUserType | "all";

function buildUrl(base: string, params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value?.trim()) query.set(key, value.trim());
  }
  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

async function searchFetch<T>(url: string): Promise<T> {
  const session = await auth();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message;
    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : message || "Search request failed",
    );
  }

  return (await response.json()) as T;
}

function normalizeUsers(
  data: unknown,
  userType?: SearchUserType,
): SearchUser[] {
  let users: SearchUser[] = [];
  if (Array.isArray(data)) users = data as SearchUser[];
  else if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    users = Array.isArray(inner) ? (inner as SearchUser[]) : [];
  }

  return users.map((user) => ({
    ...user,
    userType: user.userType ?? userType,
  }));
}

function normalizeJobs(data: unknown): SearchJob[] {
  if (Array.isArray(data)) return data as SearchJob[];
  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    return Array.isArray(inner) ? (inner as SearchJob[]) : [];
  }
  return [];
}

async function fetchUsers(
  endpoint: string,
  params: Record<string, string | undefined>,
  userType: SearchUserType,
): Promise<SearchUser[]> {
  const url = buildUrl(endpoint, { ...params, userType });
  const data = await searchFetch<unknown>(url);
  return normalizeUsers(data, userType);
}

async function searchForUserTypes(
  endpoint: string,
  params: Record<string, string | undefined>,
  userType: UserTypeFilter,
): Promise<SearchUser[]> {
  if (userType === "all") {
    const [employers, employees] = await Promise.all([
      fetchUsers(endpoint, params, "employer"),
      fetchUsers(endpoint, params, "employee"),
    ]);
    return [...employers, ...employees];
  }
  return fetchUsers(endpoint, params, userType);
}

export async function searchUsersByName(name: string, userType: UserTypeFilter) {
  return searchForUserTypes(API_ENDPOINTS.SEARCH.BY_NAME, { name }, userType);
}

export async function searchUsersByField(
  field: string,
  userType: UserTypeFilter,
) {
  return searchForUserTypes(API_ENDPOINTS.SEARCH.BY_FIELD, { field }, userType);
}

export async function searchUsersByLocation(
  location: string,
  userType: UserTypeFilter,
) {
  return searchForUserTypes(
    API_ENDPOINTS.SEARCH.BY_LOCATION,
    { location },
    userType,
  );
}

export async function searchUsersCombined(
  params: SearchCombinedParams,
  userType: UserTypeFilter,
) {
  return searchForUserTypes(
    API_ENDPOINTS.SEARCH.COMBINED,
    {
      name: params.name,
      field: params.field,
      location: params.location,
    },
    userType,
  );
}

export async function searchJobs(params: SearchJobsParams) {
  const url = buildUrl(API_ENDPOINTS.SEARCH.JOBS, { title: params.title });
  const data = await searchFetch<unknown>(url);
  return normalizeJobs(data);
}
