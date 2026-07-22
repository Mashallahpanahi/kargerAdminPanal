"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Field } from "@/types/field";

interface FieldViewDialogProps {
  field: Field | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FieldViewDialog({
  field,
  open,
  onOpenChange,
}: FieldViewDialogProps) {
  if (!field) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden bg-white max-w-lg">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            View Field
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              ID
            </p>
            <p className="mt-1 break-all text-gray-900">{field.id}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Name
            </p>
            <p className="mt-1 text-gray-900">{field.name}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description
            </p>
            <p className="mt-1 whitespace-pre-wrap text-gray-700">
              {field.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Status
              </p>
              <p className="mt-1 text-gray-900">
                {field.isActive ? "Active" : "Unactive"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Created At
              </p>
              <p className="mt-1 text-gray-900">
                {new Date(field.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Updated At
              </p>
              <p className="mt-1 text-gray-900">
                {new Date(field.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
