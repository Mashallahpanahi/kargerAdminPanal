"use server";

import { auth } from "@/lib/auth/auth";
import { API_ENDPOINTS } from "@/lib/config/api-endpoints";
import type { Field, FieldFormData } from "@/types/field";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function fieldsFetch<T>(
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

export async function getAllFields(): Promise<Field[]> {
  return fieldsFetch<Field[]>(API_ENDPOINTS.ADMIN.FIELDS, "GET");
}

export async function getFieldById(fieldId: string): Promise<Field> {
  return fieldsFetch<Field>(API_ENDPOINTS.ADMIN.FIELD_BY_ID(fieldId), "GET");
}

export async function createField(payload: FieldFormData): Promise<Field> {
  return fieldsFetch<Field>(API_ENDPOINTS.ADMIN.FIELDS, "POST", payload);
}

export async function updateField(
  fieldId: string,
  payload: FieldFormData,
): Promise<Field> {
  return fieldsFetch<Field>(
    API_ENDPOINTS.ADMIN.FIELD_BY_ID(fieldId),
    "PATCH",
    payload,
  );
}

export async function deleteField(fieldId: string): Promise<void> {
  return fieldsFetch<void>(API_ENDPOINTS.ADMIN.FIELD_BY_ID(fieldId), "DELETE");
}

export async function activateField(fieldId: string): Promise<Field> {
  return fieldsFetch<Field>(
    API_ENDPOINTS.ADMIN.ACTIVATE_FIELD(fieldId),
    "PATCH",
  );
}

export async function deactivateField(fieldId: string): Promise<Field> {
  return fieldsFetch<Field>(
    API_ENDPOINTS.ADMIN.DEACTIVATE_FIELD(fieldId),
    "PATCH",
  );
}
