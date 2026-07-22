"use client";

import { getAllFields } from "@/app/actions/fields";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Field } from "@/types/field";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FieldDialog } from "./_components/field-dialog";
import { FieldTable } from "./_components/field-table";

export default function FieldsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [filteredFields, setFilteredFields] = useState<Field[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadFields = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllFields();
      setFields(data);
      setFilteredFields(data);
    } catch (error) {
      showToast.error("Error", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFields(fields);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = fields.filter(
      (field) =>
        field.name.toLowerCase().includes(lower) ||
        field.description.toLowerCase().includes(lower),
    );
    setFilteredFields(filtered);
  }, [searchTerm, fields]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Toaster />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Manage Fields
        </h1>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-6 gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> Add Field
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-gray-200 focus:border-gray-400"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">
          Loading fields...
        </div>
      ) : (
        <FieldTable fields={filteredFields} onFieldChanged={loadFields} />
      )}

      <FieldDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onFieldSaved={loadFields}
      />
    </div>
  );
}
