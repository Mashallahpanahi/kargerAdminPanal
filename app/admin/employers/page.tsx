"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import type { Employer } from "@/types/employer";
import { EmployerTable } from "./_components/employer-table";
import { listEmployers } from "@/app/actions/admin";

export default function EmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [filteredEmployers, setFilteredEmployers] = useState<Employer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listEmployers();
      const data = (response as { data: Employer[] }).data || [];
      setEmployers(data);
      setFilteredEmployers(data);
    } catch (error) {
      showToast.error("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployers();
  }, [loadEmployers]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmployers(employers);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = employers.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lower) ||
        emp.lastName.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower) ||
        emp.phoneNumber.includes(lower),
    );
    setFilteredEmployers(filtered);
  }, [searchTerm, employers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Toaster />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Manage Employers
        </h1>
        {/* No Add button unless createEmployer action exists */}
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
          Loading employers...
        </div>
      ) : (
        <EmployerTable
          employers={filteredEmployers}
          onEmployerStatusChanged={loadEmployers}
        />
      )}
    </div>
  );
}
