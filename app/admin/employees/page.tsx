"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { listEmployees } from "@/app/actions/admin";
import { Pagination } from "@/components/shared/pagination";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Input } from "@/components/ui/input";
import { USERS_PAGE_SIZE } from "@/lib/constants/pagination";
import type { Employee } from "@/types/employee";
import { Search } from "lucide-react";
import { EmployeeTable } from "./_components/employee-table";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listEmployees();
      const data = (response as { data: Employee[] }).data || [];
      setEmployees(data);
    } catch (error) {
      showToast.error("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const lower = searchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lower) ||
        emp.lastName.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower) ||
        emp.phoneNumber.includes(lower),
    );
  }, [searchTerm, employees]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / USERS_PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedEmployees = useMemo(() => {
    const start = (safePage - 1) * USERS_PAGE_SIZE;
    return filteredEmployees.slice(start, start + USERS_PAGE_SIZE);
  }, [filteredEmployees, safePage]);

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
          Manage Employees
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
          Showing {paginatedEmployees.length} of {filteredEmployees.length}{" "}
          employees · Page {safePage} · {USERS_PAGE_SIZE} per page
        </p>
      )}

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">
          Loading employees...
        </div>
      ) : (
        <>
          <EmployeeTable
            employees={paginatedEmployees}
            onEmployeeStatusChanged={loadEmployees}
          />
          {filteredEmployees.length > 0 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filteredEmployees.length}
              itemsPerPage={USERS_PAGE_SIZE}
              onPageChange={setPage}
              itemNme="Employees"
            />
          )}
        </>
      )}
    </div>
  );
}
