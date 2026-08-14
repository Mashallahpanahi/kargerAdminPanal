"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listEmployers } from "@/app/actions/admin";
import { Pagination } from "@/components/shared/pagination";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Input } from "@/components/ui/input";
import { USERS_PAGE_SIZE } from "@/lib/constants/pagination";
import type { Employer } from "@/types/employer";
import { Search } from "lucide-react";
import { EmployerTable } from "./_components/employer-table";

export default function EmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listEmployers();
      const data = (response as { data: Employer[] }).data || [];
      setEmployers(data);
    } catch (error) {
      showToast.error("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployers();
  }, [loadEmployers]);

  const filteredEmployers = useMemo(() => {
    if (!searchTerm.trim()) return employers;
    const lower = searchTerm.toLowerCase();
    return employers.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lower) ||
        emp.lastName.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower) ||
        emp.phoneNumber.includes(lower),
    );
  }, [searchTerm, employers]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployers.length / USERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedEmployers = useMemo(() => {
    const start = (safePage - 1) * USERS_PAGE_SIZE;
    return filteredEmployers.slice(start, start + USERS_PAGE_SIZE);
  }, [filteredEmployers, safePage]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Toaster />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Manage Employers
        </h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="rounded-sm border-gray-200 pl-10 focus:border-gray-400"
        />
      </div>

      {!isLoading && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {paginatedEmployers.length} of {filteredEmployers.length}{" "}
          employers · Page {safePage} · {USERS_PAGE_SIZE} per page
        </p>
      )}

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">
          Loading employers...
        </div>
      ) : (
        <>
          <EmployerTable
            employers={paginatedEmployers}
            onEmployerStatusChanged={loadEmployers}
          />
          {filteredEmployers.length > 0 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filteredEmployers.length}
              itemsPerPage={USERS_PAGE_SIZE}
              onPageChange={setPage}
              itemNme="Employers"
            />
          )}
        </>
      )}
    </div>
  );
}
