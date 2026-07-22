"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import type { Employee } from "@/types/employee";
import { EmployeeTable } from "./_components/employee-table";
import { listEmployees } from "@/app/actions/admin";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listEmployees();
      // listEmployees returns { success, count, data: unknown[] }
      const data = (response as { data: Employee[] }).data || [];
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      showToast.error("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lower) ||
        emp.lastName.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower) ||
        emp.phoneNumber.includes(lower),
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Toaster />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Manage Employees
        </h1>
        {/* No Add button because createEmployee action doesn't exist yet */}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-gray-200 focus:border-gray-400"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">
          Loading employees...
        </div>
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          onEmployeeStatusChanged={loadEmployees}
        />
      )}
    </div>
  );
}
