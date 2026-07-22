"use client";

import { deleteAdmin } from "@/app/actions/admin";
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

import type { Admin } from "@/types/admin";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminTableProps {
  admins: Admin[];
  onAdminDeleted: () => void;
  isLoading?: boolean;
}

export function AdminTable({ admins, onAdminDeleted }: AdminTableProps) {
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setAdminToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
    try {
      await deleteAdmin(adminToDelete);
      showToast.success("Deleted", "Admin removed successfully.");
      onAdminDeleted();
    } catch (error) {
      const message =
        (error as Error).message ?? "An unexpected error occurred.";

      if (
        message.includes("Authentication failed") ||
        message.includes("No access token")
      ) {
        showToast.error("Session Expired", "Please log in again.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      showToast.error("Delete failed", message);
    } finally {
      setAdminToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="">
        <div className="border border-gray-200 rounded-none overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 border-gray-200">
                <TableHead className="text-center font-semibold py-4 text-gray-700 uppercase text-xs tracking-wide">
                  Name
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Email
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Phone
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                  Delete
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <TableRow key={admin.id} className="border-gray-200">
                    <TableCell className="text-center py-4 text-gray-800">
                      {admin.name} {admin.lastName}
                    </TableCell>
                    <TableCell className="text-center text-gray-700">
                      {admin.email}
                    </TableCell>
                    <TableCell className="text-center text-gray-700">
                      {admin.phoneNumber}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(admin.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-gray-400"
                  >
                    No admins found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Admin"
        description="Are you sure you want to delete this admin? This action cannot be undone."
      />
    </>
  );
}
