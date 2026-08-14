import type { Post } from "@/types/post";

export type ProfileField =
  | string
  | {
      id?: string;
      name?: string;
      description?: string;
    }
  | null;

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  clientOrPlatform?: string | null;
  projectUrl?: string | null;
  completedAt?: string | null;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CompletedWork = {
  id: string;
  jobId?: string;
  jobTitle?: string;
  employerName?: string;
  employerProfilePicture?: string | null;
  workDescription?: string;
  workImage?: string | null;
  status?: string;
  rating?: number;
  feedback?: string;
  completedAt?: string;
  createdAt?: string;
  job?: {
    id?: string;
    title?: string;
  };
};

export type EmployeeDetails = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string | null;
  currentLocation?: string | null;
  location?: string | null;
  field?: ProfileField;
  bio?: string | null;
  skills?: string[] | null;
  yearsOfExperience?: number | null;
  hourlyRate?: string | null;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  averageRating?: string | number | null;
  totalRatings?: number;
  followers?: unknown[];
  following?: unknown[];
  followersCount?: number;
  followingCount?: number;
  posts?: Post[];
  portfolioItems?: PortfolioItem[];
  platformCompletedWork?: CompletedWork[];
  createdAt?: string;
  updatedAt?: string;
};

export type EmployerDetails = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string | null;
  currentLocation?: string | null;
  location?: string | null;
  field?: ProfileField;
  companyName?: string | null;
  companyWebsite?: string | null;
  industry?: string | null;
  bio?: string | null;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  followers?: unknown[];
  following?: unknown[];
  followersCount?: number;
  followingCount?: number;
  posts?: Post[];
  createdAt?: string;
  updatedAt?: string;
};

export function getFieldName(field?: ProfileField): string | null {
  if (!field) return null;
  if (typeof field === "string") return field || null;
  return field.name || null;
}

export function sortPortfolioItems(items: PortfolioItem[]): PortfolioItem[] {
  return [...items].sort((a, b) => {
    const orderA = a.sortOrder ?? 0;
    const orderB = b.sortOrder ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return dateB - dateA;
  });
}

export function mergePortfolioItems(
  ...sources: PortfolioItem[][]
): PortfolioItem[] {
  const map = new Map<string, PortfolioItem>();
  for (const list of sources) {
    for (const item of list) {
      if (item?.id) map.set(item.id, item);
    }
  }
  return sortPortfolioItems([...map.values()]);
}
