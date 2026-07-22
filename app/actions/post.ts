"use server";

import { auth } from "@/lib/auth/auth";
import { API_ENDPOINTS } from "@/lib/config/api-endpoints";
import type { Post, PostsListResponse } from "@/types/post";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

async function postFetch<T>(
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
    const message = errorData.message;
    throw new Error(
      Array.isArray(message)
        ? message.join(", ")
        : message || "Request failed",
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}

function normalizePosts(data: unknown): Post[] {
  if (Array.isArray(data)) return data as Post[];
  if (data && typeof data === "object") {
    const response = data as PostsListResponse;
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.posts)) return response.posts;
  }
  return [];
}

function getTotalPages(data: unknown, batchSize: number, limit: number): number {
  if (data && typeof data === "object") {
    const response = data as PostsListResponse;
    if (response.totalPages) return response.totalPages;
    const total = response.total ?? response.count;
    if (total !== undefined) return Math.ceil(total / limit);
  }
  return batchSize < limit ? 1 : 2;
}

async function fetchAllPaginatedPosts(baseUrl: string): Promise<Post[]> {
  const allPosts: Post[] = [];
  const limit = 50;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 100) {
    const url = `${baseUrl}?page=${page}&limit=${limit}`;
    const response = await postFetch<unknown>(url, "GET");
    const batch = normalizePosts(response);
    allPosts.push(...batch);
    totalPages = getTotalPages(response, batch.length, limit);
    if (batch.length === 0) break;
    page += 1;
  }

  return allPosts;
}

export async function getAllPosts(): Promise<Post[]> {
  return fetchAllPaginatedPosts(API_ENDPOINTS.ADMIN.POSTS);
}

export async function getEmployerPosts(): Promise<Post[]> {
  return fetchAllPaginatedPosts(API_ENDPOINTS.ADMIN.EMPLOYER_POSTS);
}

export async function getEmployeePosts(): Promise<Post[]> {
  return fetchAllPaginatedPosts(API_ENDPOINTS.ADMIN.EMPLOYEE_POSTS);
}

export async function getPostById(postId: string): Promise<Post> {
  return postFetch<Post>(API_ENDPOINTS.ADMIN.POST_BY_ID(postId), "GET");
}

export async function deletePost(postId: string): Promise<void> {
  return postFetch<void>(API_ENDPOINTS.ADMIN.DELETE_POST(postId), "DELETE");
}

export async function updatePost(
  postId: string,
  payload: Partial<{ description: string; image: string }>,
) {
  return postFetch<Post>(
    API_ENDPOINTS.ADMIN.POST_BY_ID(postId),
    "PATCH",
    payload,
  );
}

export async function createPost(payload: {
  description: string;
  image?: string;
}) {
  return postFetch<Post>(API_ENDPOINTS.ADMIN.POSTS, "POST", payload);
}
