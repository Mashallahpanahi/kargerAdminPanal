"use client";

import { createField, updateField } from "@/app/actions/fields";
import { showToast } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Field, FieldFormData, FieldFormErrors } from "@/types/field";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFieldSaved: () => void;
  field?: Field | null;
}

const EMPTY_FORM: FieldFormData = {
  name: "",
  description: "",
};

function fieldClass(error?: string) {
  return [
    "bg-white py-5",
    "border rounded-sm",
    "text-gray-700 placeholder:text-gray-400",
    "focus:!border-black focus:!outline-none focus:!ring-0",
    error ? "!border-red-500" : "border-gray-300",
  ].join(" ");
}

export function FieldDialog({
  open,
  onOpenChange,
  onFieldSaved,
  field,
}: FieldDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<FieldFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(field);

  useEffect(() => {
    if (!open) return;
    setForm(
      field
        ? { name: field.name, description: field.description }
        : EMPTY_FORM,
    );
    setErrors({});
  }, [field, open]);

  const set =
    (formField: keyof FieldFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [formField]: e.target.value }));

  const validate = (): boolean => {
    const next: FieldFormErrors = {};
    if (!form.name.trim()) next.name = "Field name is required.";
    if (!form.description.trim()) {
      next.description = "Description is required.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) reset();
    onOpenChange(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (field) {
        await updateField(field.id, form);
        showToast.success("Success", "Field updated successfully.");
      } else {
        await createField(form);
        showToast.success("Success", "Field created successfully.");
      }

      reset();
      onFieldSaved();
      onOpenChange(false);
    } catch (error) {
      const message =
        (error as Error).message ?? "An unexpected error occurred.";

      if (
        message.includes("Authentication failed") ||
        message.includes("Authentication required") ||
        message.includes("No access token")
      ) {
        showToast.error("Session Expired", "Please log in again.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }

      showToast.error(isEdit ? "Update failed" : "Create failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden bg-white max-w-md">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Field" : "Add New Field"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Field name"
              value={form.name}
              onChange={set("name")}
              disabled={isSubmitting}
              className={fieldClass(errors.name)}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Field description"
              value={form.description}
              onChange={set("description")}
              disabled={isSubmitting}
              className={`${fieldClass(errors.description)} min-h-28 resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 rounded-full cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEdit ? "Updating..." : "Creating..."}
                </span>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Field"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
