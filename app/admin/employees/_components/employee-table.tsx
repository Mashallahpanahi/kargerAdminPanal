"use client";

import { banEmployee, unbanEmployee } from "@/app/actions/admin";
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
import type { Employee } from "@/types/employee";
import { Eye, Power } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ViewEmployeeDialog } from "./view-employee-dialog";

interface EmployeeTableProps {
  employees: Employee[];
  onEmployeeStatusChanged: () => void;
}

export function EmployeeTable({
  employees,
  onEmployeeStatusChanged,
}: EmployeeTableProps) {
  const router = useRouter();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [employeeToUpdate, setEmployeeToUpdate] = useState<Employee | null>(
    null,
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null,
  );

  const handleViewClick = (id: string) => {
    setSelectedEmployeeId(id);
    setViewDialogOpen(true);
  };

  const handleStatusClick = (employee: Employee) => {
    setEmployeeToUpdate(employee);
    setStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!employeeToUpdate) return;
    const isActive = employeeToUpdate.isActive !== false;
    try {
      if (isActive) {
        await banEmployee(employeeToUpdate.id);
      } else {
        await unbanEmployee(employeeToUpdate.id);
      }
      showToast.success(
        isActive ? "Unactive" : "Active",
        `Employee ${isActive ? "set to unactive" : "set to active"} successfully.`,
      );
      onEmployeeStatusChanged();
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
      setEmployeeToUpdate(null);
      setStatusDialogOpen(false);
    }
  };

  const selectedEmployeeIsActive = employeeToUpdate?.isActive !== false;
  const selectedEmployeeActionLabel = selectedEmployeeIsActive
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
            {employees.length > 0 ? (
              employees.map((employee) => (
                <TableRow key={employee.id} className="border-gray-200">
                  <TableCell className="text-center py-4 text-gray-800">
                    {employee.name} {employee.lastName}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {employee.email}
                  </TableCell>
                  <TableCell className="text-center text-gray-700">
                    {employee.phoneNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClick(employee.id)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusClick(employee)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      >
                        <Power className="h-4 w-4 mr-1" />
                        {employee.isActive === false ? "Active" : "Unactive"}
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
                  No employees found
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
        title={`${selectedEmployeeActionLabel} Employee`}
        description={`Are you sure you want to set this employee as ${selectedEmployeeActionLabel.toLowerCase()}?`}
        confirmLabel={selectedEmployeeActionLabel}
      />

      <ViewEmployeeDialog
        employeeId={selectedEmployeeId}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />
    </>
  );
}
