import type { DashboardStats } from "@/types/dashboard";

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const data = await getStatsAction();
  return data as DashboardStats;
}

export async function removePost(postId: string): Promise<void> {
  await deletePostAction(postId);
}
