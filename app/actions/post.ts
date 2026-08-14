"use server";

import { getEmployeeById, getEmployerById } from "@/app/actions/admin";
import { auth } from "@/lib/auth/auth";
import { API_ENDPOINTS } from "@/lib/config/api-endpoints";
import {
  POSTS_PAGE_SIZE,
  type PaginatedPosts,
  type Post,
  type PostAuthor,
  type PostComment,
  type PostsListResponse,
} from "@/types/post";

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

function parsePaginatedResponse(
  response: unknown,
  page: number,
  limit: number,
): PaginatedPosts {
  const posts = normalizePosts(response);
  const payload =
    response && typeof response === "object"
      ? (response as PostsListResponse)
      : null;

  const nested = payload?.pagination;
  const totalFromApi =
    nested?.total ?? payload?.total ?? payload?.count;
  const totalPagesFromApi = nested?.totalPages ?? payload?.totalPages;
  const pageFromApi = nested?.page ?? payload?.page ?? page;
  const limitFromApi = nested?.limit ?? payload?.limit ?? limit;

  if (totalFromApi !== undefined) {
    return {
      posts,
      total: totalFromApi,
      page: pageFromApi,
      limit: limitFromApi,
      totalPages:
        totalPagesFromApi ??
        Math.max(1, Math.ceil(totalFromApi / limitFromApi)),
    };
  }

  if (totalPagesFromApi !== undefined) {
    return {
      posts,
      total: totalPagesFromApi * limitFromApi,
      page: pageFromApi,
      limit: limitFromApi,
      totalPages: totalPagesFromApi,
    };
  }

  // Fallback when API omits totals
  if (posts.length < limit) {
    const total = (page - 1) * limit + posts.length;
    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.max(1, page),
    };
  }

  return {
    posts,
    total: page * limit + 1,
    page,
    limit,
    totalPages: page + 1,
  };
}

async function fetchPostsPage(
  baseUrl: string,
  page: number,
  limit: number,
): Promise<PaginatedPosts> {
  const url = `${baseUrl}?page=${page}&limit=${limit}`;
  const response = await postFetch<unknown>(url, "GET");
  return parsePaginatedResponse(response, page, limit);
}

async function fetchAllPaginatedPosts(baseUrl: string): Promise<Post[]> {
  const allPosts: Post[] = [];
  const limit = 50;
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages && page <= 100) {
    const result = await fetchPostsPage(baseUrl, page, limit);
    allPosts.push(...result.posts);
    totalPages = result.totalPages;
    if (result.posts.length === 0) break;
    page += 1;
  }

  return allPosts;
}

function getPostsBaseUrl(
  type: "all" | "employer" | "employee" = "all",
): string {
  switch (type) {
    case "employer":
      return API_ENDPOINTS.ADMIN.EMPLOYER_POSTS;
    case "employee":
      return API_ENDPOINTS.ADMIN.EMPLOYEE_POSTS;
    default:
      return API_ENDPOINTS.ADMIN.POSTS;
  }
}

export async function getPostsPaginated(options: {
  type?: "all" | "employer" | "employee";
  page?: number;
  limit?: number;
}): Promise<PaginatedPosts> {
  const type = options.type ?? "all";
  const page = Math.max(1, options.page ?? 1);
  const limit = options.limit ?? POSTS_PAGE_SIZE;
  return fetchPostsPage(getPostsBaseUrl(type), page, limit);
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

export async function getPostsByAuthor(options: {
  employeeId?: string;
  employerId?: string;
}): Promise<Post[]> {
  const { employeeId, employerId } = options;

  if (employeeId) {
    return fetchAllPaginatedPosts(
      API_ENDPOINTS.ADMIN.POSTS_BY_EMPLOYEE(employeeId),
    );
  }

  if (employerId) {
    return fetchAllPaginatedPosts(
      API_ENDPOINTS.ADMIN.POSTS_BY_EMPLOYER(employerId),
    );
  }

  return [];
}

export async function getPostById(postId: string): Promise<Post> {
  const response = await postFetch<Post | { data: Post }>(
    API_ENDPOINTS.ADMIN.POST_BY_ID(postId),
    "GET",
  );
  if (response && typeof response === "object" && "data" in response) {
    return response.data;
  }
  return response as Post;
}

function normalizeComments(data: unknown): PostComment[] {
  if (Array.isArray(data)) return data as PostComment[];
  if (data && typeof data === "object") {
    const response = data as { data?: PostComment[]; comments?: PostComment[] };
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.comments)) return response.comments;
  }
  return [];
}

function toPostAuthor(user: unknown): PostAuthor | null {
  if (!user || typeof user !== "object") return null;
  const data =
    "data" in user && user.data && typeof user.data === "object"
      ? (user.data as Record<string, unknown>)
      : (user as Record<string, unknown>);

  if (typeof data.id !== "string" || typeof data.name !== "string") {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    email: typeof data.email === "string" ? data.email : "",
    phoneNumber:
      typeof data.phoneNumber === "string" ? data.phoneNumber : undefined,
    profilePicture:
      typeof data.profilePicture === "string" || data.profilePicture === null
        ? (data.profilePicture as string | null)
        : undefined,
    role: typeof data.role === "string" ? data.role : undefined,
  };
}

export async function enrichPostComments(
  comments: PostComment[],
): Promise<PostComment[]> {
  const missingEmployerIds = [
    ...new Set(
      comments
        .filter((c) => c.employerId && !c.employer)
        .map((c) => c.employerId as string),
    ),
  ];
  const missingEmployeeIds = [
    ...new Set(
      comments
        .filter((c) => c.employeeId && !c.employee)
        .map((c) => c.employeeId as string),
    ),
  ];

  const [employers, employees] = await Promise.all([
    Promise.all(
      missingEmployerIds.map(async (id) => {
        try {
          const author = toPostAuthor(await getEmployerById(id));
          return [id, author] as const;
        } catch {
          return [id, null] as const;
        }
      }),
    ),
    Promise.all(
      missingEmployeeIds.map(async (id) => {
        try {
          const author = toPostAuthor(await getEmployeeById(id));
          return [id, author] as const;
        } catch {
          return [id, null] as const;
        }
      }),
    ),
  ]);

  const employerMap = new Map(employers);
  const employeeMap = new Map(employees);

  return comments.map((comment) => ({
    ...comment,
    employer:
      comment.employer ??
      (comment.employerId
        ? employerMap.get(comment.employerId) ?? null
        : null),
    employee:
      comment.employee ??
      (comment.employeeId
        ? employeeMap.get(comment.employeeId) ?? null
        : null),
  }));
}

export async function getPostComments(postId: string): Promise<PostComment[]> {
  const response = await postFetch<unknown>(
    API_ENDPOINTS.ADMIN.POST_COMMENTS(postId),
    "GET",
  );
  const comments = normalizeComments(response);
  return enrichPostComments(comments);
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
