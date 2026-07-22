"use client";

import {
  activateField,
  deactivateField,
  deleteField,
} from "@/app/actions/fields";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { showToast } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Field } from "@/types/field";
import { Edit, Eye, Power, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldDialog } from "./field-dialog";
import { FieldViewDialog } from "./field-view-dialog";

interface FieldTableProps {
  fields: Field[];
  onFieldChanged: () => void;
}

export function FieldTable({ fields, onFieldChanged }: FieldTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const handleViewClick = (field: Field) => {
    setSelectedField(field);
    setViewDialogOpen(true);
  };

  const handleEditClick = (field: Field) => {
    setSelectedField(field);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (field: Field) => {
    setSelectedField(field);
    setDeleteDialogOpen(true);
  };

  const handleStatusClick = (field: Field) => {
    setSelectedField(field);
    setStatusDialogOpen(true);
  };

  const handleAuthError = (message: string) => {
    if (
      message.includes("Authentication failed") ||
      message.includes("Authentication required") ||
      message.includes("No access token")
    ) {
      showToast.error("Session Expired", "Please log in again.");
      setTimeout(() => router.push("/login"), 2000);
      return true;
    }
    return false;
  };

  const confirmDelete = async () => {
    if (!selectedField) return;
    try {
      await deleteField(selectedField.id);
      showToast.success("Deleted", "Field removed successfully.");
      onFieldChanged();
    } catch (error) {
      const message =
        (error as Error).message ?? "An unexpected error occurred.";
      if (handleAuthError(message)) return;
      showToast.error("Delete failed", message);
    } finally {
      setSelectedField(null);
      setDeleteDialogOpen(false);
    }
  };

  const confirmStatusChange = async () => {
    if (!selectedField) return;
    const isActive = selectedField.isActive !== false;
    try {
      if (isActive) {
        await deactivateField(selectedField.id);
      } else {
        await activateField(selectedField.id);
      }
      showToast.success(
        isActive ? "Unactive" : "Active",
        `Field ${isActive ? "set to unactive" : "set to active"} successfully.`,
      );
      onFieldChanged();
    } catch (error) {
      const message =
        (error as Error).message ?? "An unexpected error occurred.";
      if (handleAuthError(message)) return;
      showToast.error("Status update failed", message);
    } finally {
      setSelectedField(null);
      setStatusDialogOpen(false);
    }
  };

  const selectedFieldIsActive = selectedField?.isActive !== false;
  const selectedFieldActionLabel = selectedFieldIsActive
    ? "Unactive"
    : "Active";

  return (
    <>
      <div className="border border-gray-200 rounded-none overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 border-gray-200">
              <TableHead className="text-center font-semibold py-4 text-gray-700 uppercase text-xs tracking-wide">
                Name
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                Description
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                Status
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                Created At
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {fields.length > 0 ? (
              fields.map((field) => (
                <TableRow key={field.id} className="border-gray-200">
                  <TableCell className="text-center py-4 text-gray-800">
                    {field.name}
                  </TableCell>
                  <TableCell className="text-center text-gray-700 max-w-md truncate">
                    {field.description.length > 80
                      ? `${field.description.substring(0, 80)}...`
                      : field.description}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {field.isActive ? "Active" : "Unactive"}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {new Date(field.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClick(field)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(field)}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusClick(field)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Power className="h-4 w-4 mr-1" />
                        {field.isActive === false ? "Active" : "Unactive"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(field)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-400"
                >
                  No fields found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Field"
        description="Are you sure you want to delete this field? This action cannot be undone."
      />

      <DeleteConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={confirmStatusChange}
        title={`${selectedFieldActionLabel} Field`}
        description={`Are you sure you want to set this field as ${selectedFieldActionLabel.toLowerCase()}?`}
        confirmLabel={selectedFieldActionLabel}
      />

      <FieldDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onFieldSaved={onFieldChanged}
        field={selectedField}
      />

      <FieldViewDialog
        field={selectedField}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </>
  );
}
