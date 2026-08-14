"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllFields } from "@/app/actions/fields";
import { Pagination } from "@/components/shared/pagination";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination";
import type { Field } from "@/types/field";
import { Plus, Search } from "lucide-react";
import { FieldDialog } from "./_components/field-dialog";
import { FieldTable } from "./_components/field-table";

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadFields = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllFields();
      setFields(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast.error("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  const filteredFields = useMemo(() => {
    if (!searchTerm.trim()) return fields;
    const lower = searchTerm.toLowerCase();
    return fields.filter(
      (field) =>
        field.name.toLowerCase().includes(lower) ||
        field.description.toLowerCase().includes(lower),
    );
  }, [searchTerm, fields]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFields.length / LIST_PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedFields = useMemo(() => {
    const start = (safePage - 1) * LIST_PAGE_SIZE;
    return filteredFields.slice(start, start + LIST_PAGE_SIZE);
  }, [filteredFields, safePage]);

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
          Manage Fields
        </h1>
        <Button
          onClick={() => setDialogOpen(true)}
          className="w-full gap-2 rounded-sm bg-yellow-500 px-6 text-white hover:bg-yellow-600 sm:w-auto"
        >
          <Plus size={18} /> Add Field
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="rounded-sm border-gray-200 pl-10 focus:border-gray-400"
        />
      </div>

      {!isLoading && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {paginatedFields.length} of {filteredFields.length} fields ·
          Page {safePage} · {LIST_PAGE_SIZE} per page
        </p>
      )}

      {isLoading ? (
        <div className="py-10 text-center text-gray-500">Loading fields...</div>
      ) : (
        <>
          <FieldTable fields={paginatedFields} onFieldChanged={loadFields} />
          {filteredFields.length > 0 && (
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filteredFields.length}
              itemsPerPage={LIST_PAGE_SIZE}
              onPageChange={setPage}
              itemNme="Fields"
            />
          )}
        </>
      )}

      <FieldDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onFieldSaved={loadFields}
      />
    </div>
  );
}
