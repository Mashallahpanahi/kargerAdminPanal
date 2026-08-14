"use client";

import {
  getDashboardStats,
  listAdmins,
  listEmployees,
  listEmployers,
} from "@/app/actions/admin";
import { getAllFields } from "@/app/actions/fields";
import { showToast } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import type { DashboardData } from "@/types/dashboard";
import type { Employee } from "@/types/employee";
import type { Employer } from "@/types/employer";
import type { Field } from "@/types/field";
import type { Post } from "@/types/post";
import {
  Activity,
  Building2,
  FileText,
  RefreshCw,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DashboardSkeleton } from "./_components/dashboard/dashboard-skeleton";
import { PlatformHealth } from "./_components/dashboard/platform-health";
import { RecentPosts } from "./_components/dashboard/recent-posts";
import { StatCard } from "./_components/dashboard/stat-card";
import { UserDistributionChart } from "./_components/dashboard/user-distribution-chart";

function countActiveUsers(users: { isActive?: boolean }[]) {
  return users.filter((user) => user.isActive !== false).length;
}

function countInactiveUsers(users: { isActive?: boolean }[]) {
  return users.filter((user) => user.isActive === false).length;
}

function getLatestPosts(posts: Post[], limit = 3): Post[] {
  return [...posts]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [
        statsResult,
        adminsResult,
        fieldsResult,
        employeesResult,
        employersResult,
      ] = await Promise.all([
        getDashboardStats(),
        listAdmins(),
        getAllFields(),
        listEmployees(),
        listEmployers(),
      ]);

      const stats = statsResult as DashboardData;
      const admins = (adminsResult as unknown[]) ?? [];
      const fields = (fieldsResult as Field[]) ?? [];
      const employees =
        (employeesResult as { data: Employee[] }).data ?? [];
      const employers =
        (employersResult as { data: Employer[] }).data ?? [];

      const activeFields = fields.filter((field) => field.isActive).length;
      const activeUsers =
        countActiveUsers(employees) + countActiveUsers(employers);
      const inactiveUsers =
        countInactiveUsers(employees) + countInactiveUsers(employers);

      setData({
        ...stats,
        activeUsers,
        inactiveUsers,
        recentPosts: getLatestPosts((stats.recentPosts ?? []) as Post[]),
        totalAdmins: admins.length,
        totalFields: fields.length,
        activeFields,
      });
    } catch (error) {
      showToast.error("Failed to load dashboard", (error as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">Unable to load dashboard data.</p>
        <Button onClick={() => loadDashboard()}>Try again</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Dashboard
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadDashboard(true)}
          disabled={refreshing}
          className="gap-2 rounded-sm"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Employers"
          value={data.totalEmployers}
          description="Registered employer accounts"
          icon={Building2}
          iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
        />
        <StatCard
          title="Employees"
          value={data.totalEmployees}
          description="Registered employee accounts"
          icon={Users}
          iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
        />
        <StatCard
          title="Total Users"
          value={data.totalUsers}
          description="All platform users combined"
          icon={Activity}
          iconClassName="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
        />
        <StatCard
          title="Job Posts"
          value={data.totalPosts}
          description="Published posts on the platform"
          icon={FileText}
          iconClassName="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
        />
        <StatCard
          title="Active Users"
          value={data.activeUsers}
          description={`${data.inactiveUsers} inactive`}
          icon={UserCheck}
          iconClassName="bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
        />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Admins"
          value={data.totalAdmins}
          description="Admin team members"
          icon={Shield}
          iconClassName="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
        />
        <StatCard
          title="Professional Fields"
          value={data.totalFields}
          description={`${data.activeFields} active`}
          icon={Building2}
          iconClassName="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
        />
        <StatCard
          title="Engagement"
          value={
            data.totalPosts > 0 && data.totalUsers > 0
              ? (data.totalPosts / data.totalUsers).toFixed(1)
              : "0"
          }
          description="Posts per user average"
          icon={Activity}
          iconClassName="bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
        />
      </div>

      {/* Charts & platform health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserDistributionChart
          employers={data.totalEmployers}
          employees={data.totalEmployees}
        />
        <PlatformHealth
          totalAdmins={data.totalAdmins}
          totalFields={data.totalFields}
          activeFields={data.activeFields}
          inactiveUsers={data.inactiveUsers}
          activeUsers={data.activeUsers}
          totalUsers={data.totalUsers}
        />
      </div>

      {/* Recent posts */}
      <RecentPosts
        posts={data.recentPosts}
        onPostDeleted={() => loadDashboard(true)}
      />
    </div>
  );
}
