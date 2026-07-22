// app/admin/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { showToast, Toaster } from "@/components/shared/toasterlogin";

import type { Admin } from "@/types/admin";
import { AdminTable } from "./_components/admin-table";
import { AddAdminDialog } from "./_components/admin-dialog";
import { listAdmins } from "@/app/actions/admin";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = (await listAdmins()) as Admin[];
      setAdmins(data);
      setFilteredAdmins(data);
    } catch (error) {
      showToast.error("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAdmins(admins);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(lower) ||
        admin.lastName.toLowerCase().includes(lower) ||
        admin.email.toLowerCase().includes(lower) ||
        admin.phoneNumber.includes(lower),
    );
    setFilteredAdmins(filtered);
  }, [searchTerm, admins]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Toaster />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Manage Admins
        </h1>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-6 gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> Add Admin
        </Button>
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

      <AdminTable
        admins={filteredAdmins}
        onAdminDeleted={loadAdmins} // fixed prop name
        isLoading={isLoading}
      />

      <AddAdminDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdminCreated={loadAdmins} // fixed prop name
      />
    </div>
  );
}
