"use client";

import { banEmployer, unbanEmployer } from "@/app/actions/admin";
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
import type { Employer } from "@/types/employer";
import { Eye, Power } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ViewEmployerDialog } from "./view-employer-dialog";

interface EmployerTableProps {
  employers: Employer[];
  onEmployerStatusChanged: () => void;
}

export function EmployerTable({
  employers,
  onEmployerStatusChanged,
}: EmployerTableProps) {
  const router = useRouter();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [employerToUpdate, setEmployerToUpdate] = useState<Employer | null>(
    null,
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string | null>(
    null,
  );

  const handleViewClick = (id: string) => {
    setSelectedEmployerId(id);
    setViewDialogOpen(true);
  };

  const handleStatusClick = (employer: Employer) => {
    setEmployerToUpdate(employer);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!employerToUpdate) return;
    const isActive = employerToUpdate.isActive !== false;
    try {
      if (isActive) {
        await banEmployer(employerToUpdate.id);
      } else {
        await unbanEmployer(employerToUpdate.id);
      }
      showToast.success(
        isActive ? "Unactive" : "Active",
        `Employer ${isActive ? "set to unactive" : "set to active"} successfully.`,
      );
      onEmployerStatusChanged();
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
      showToast.error("Status update failed", message);
    } finally {
      setEmployerToUpdate(null);
      setStatusDialogOpen(false);
    }
  };

  const selectedEmployerIsActive = employerToUpdate?.isActive !== false;
  const selectedEmployerActionLabel = selectedEmployerIsActive
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
                Email
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                Phone
              </TableHead>
              <TableHead className="text-center font-semibold text-gray-700 uppercase text-xs tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {employers.length > 0 ? (
              employers.map((employer) => (
                <TableRow key={employer.id} className="border-gray-200">
                  <TableCell className="text-center py-4 text-gray-800">
                    {employer.name} {employer.lastName}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {employer.email}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {employer.phoneNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClick(employer.id)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusClick(employer)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Power className="h-4 w-4 mr-1" />
                        {employer.isActive === false ? "Active" : "Unactive"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-gray-400"
                >
                  No employers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={confirmStatusChange}
        title={`${selectedEmployerActionLabel} Employer`}
        description={`Are you sure you want to set this employer as ${selectedEmployerActionLabel.toLowerCase()}?`}
        confirmLabel={selectedEmployerActionLabel}
      />

      <ViewEmployerDialog
        employerId={selectedEmployerId}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </>
  );
}
