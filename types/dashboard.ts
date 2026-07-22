import type { Post } from "@/types/post";

export interface DashboardStats {
  totalEmployers: number;
  totalEmployees: number;
  totalUsers: number;
  totalPosts: number;
  activeUsers: number;
  recentPosts: Post[];
}

export interface DashboardExtraStats {
  totalAdmins: number;
  totalFields: number;
  activeFields: number;
  inactiveUsers: number;
}

export interface DashboardData extends DashboardStats, DashboardExtraStats {}
