"use client";

import { use, useCallback, useEffect, useState } from "react";
import { getEmployeePublicProfile } from "@/app/actions/admin";
import { Toaster, showToast } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import type {
  CompletedWork,
  EmployeeDetails,
  PortfolioItem,
} from "@/types/profile";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { EmployeeDetail } from "../_components/employee-detail";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [verifiedJobs, setVerifiedJobs] = useState<CompletedWork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployee = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { employee: profile, portfolioItems: portfolio } =
        await getEmployeePublicProfile(id);
      setEmployee(profile);
      setPortfolioItems(portfolio);
      setVerifiedJobs(
        Array.isArray(profile.platformCompletedWork)
          ? profile.platformCompletedWork
          : [],
      );
    } catch (err) {
      const message = (err as Error).message || "Failed to load employee";
      setError(message);
      showToast.error("Error", message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEmployee();
  }, [loadEmployee]);

  return (
    <>
      <Toaster />
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      ) : error || !employee ? (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <p className="mb-4 text-gray-600">
            {error || "No employee data found."}
          </p>
          <Button variant="outline" asChild className="rounded-sm">
            <Link href="/admin/employees">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Employees
            </Link>
          </Button>
        </div>
      ) : (
        <EmployeeDetail
          employee={employee}
          portfolioItems={portfolioItems}
          verifiedJobs={verifiedJobs}
        />
      )}
    </>
  );
}
