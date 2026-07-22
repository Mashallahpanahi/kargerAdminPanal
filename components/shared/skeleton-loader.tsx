"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Table Skeleton for pages with tables
export function TableSkeleton() {
  return (
    <Card className="bg-white dark:bg-[#0e142f] border-gray-300 dark:border-amber-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table Skeleton */}
        <div className="hidden md:block">
          <div className="space-y-3">
            {/* Table Header */}
            <div className="flex space-x-4 border-b pb-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4 py-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Cards Skeleton */}
        <div className="md:hidden space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="border border-gray-300 dark:border-amber-100"
            >
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard Skeleton for stats cards
export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="bg-white dark:bg-[#0e142f]">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Simple Page Skeleton for basic pages
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-24" />
      </div>

      <Card className="bg-white dark:bg-[#0e142f] border-gray-300 dark:border-amber-100">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    </div>
  );
}
