"use client";

import type React from "react";

import { useBookingStore } from "@/lib/stores/bookingStore";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface CancelBooking {
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  bookingId?: number | null;
}

function CancelOpenDialog({ open, onChangeOpen, bookingId }: CancelBooking) {
  const [canceledBy, setCanceledBy] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { cancelBooking } = useBookingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!canceledBy) {
      setError("Please select who is canceling the booking");
      return;
    }

    if (!selectedReason) {
      setError("Please select a cancellation reason");
      return;
    }

    if (selectedReason === "Other" && !otherReason.trim()) {
      setError("Description is required");
      return;
    }

    // Process cancellation
    if (bookingId) {
      const reason = selectedReason === "Other" ? otherReason : selectedReason;
      const initiator = canceledBy === "User" ? "user" : "provider";

      cancelBooking(bookingId, reason, initiator);

      // Reset form and close dialog
      setCanceledBy("");
      setSelectedReason("");
      setOtherReason("");
      setError("");
      onChangeOpen(false);
    }
  };

  const handleClose = () => {
    setCanceledBy("");
    setSelectedReason("");
    setOtherReason("");
    setError("");
    onChangeOpen(false);
  };

  const getUserReasons = () => [{ value: "Other", label: "Other" }];

  const getProviderReasons = () => [
    { value: "Customer asked to cancel", label: "Customer asked to cancel" },
    {
      value: "Customer is not at the location",
      label: "Customer is not at the location",
    },
    { value: "Other", label: "Other" },
  ];

  const reasons =
    canceledBy === "User" ? getUserReasons() : getProviderReasons();

  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className="bg-white dark:bg-[#171d37] border-gray-200 dark:border-gray-600 max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="relative">
            <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white border-b pb-4 border-gray-200 dark:border-gray-600">
              Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 pt-4">
              You can cancel the Booking on behalf of the user or provider by
              using the following reasons
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900 dark:text-white">
                Canceled by
              </Label>
              <Select
                value={canceledBy}
                onValueChange={(value) => {
                  setCanceledBy(value);
                  setSelectedReason("");
                  setOtherReason("");
                  setError("");
                }}
              >
                <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-[#171d37]">
                  <SelectValue placeholder="Choice Option" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#171d37] border-gray-200 dark:border-gray-600">
                  <SelectItem
                    value="User"
                    className="hover:bg-blue-600 focus:bg-blue-600 hover:text-white focus:text-white cursor-pointer"
                  >
                    User
                  </SelectItem>
                  <SelectItem
                    value="Service Provider"
                    className="hover:bg-blue-600 focus:bg-blue-600 hover:text-white focus:text-white cursor-pointer"
                  >
                    Service Provider
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {canceledBy && (
              <div className="space-y-3">
                <RadioGroup
                  value={selectedReason}
                  onValueChange={(value) => {
                    setSelectedReason(value);
                    if (value !== "Other") {
                      setOtherReason("");
                    }
                    setError("");
                  }}
                  className="space-y-3"
                >
                  {reasons.map((reason) => (
                    <div
                      key={reason.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={reason.value}
                        id={reason.value}
                        className="border-2 border-yellow-500 text-yellow-500 cursor-pointer"
                      />
                      <Label
                        htmlFor={reason.value}
                        className="text-sm text-gray-900 dark:text-white cursor-pointer"
                      >
                        {reason.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {selectedReason === "Other" && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Other reasons"
                      value={otherReason}
                      onChange={(e) => {
                        setOtherReason(e.target.value);
                        setError("");
                      }}
                      className="min-h-[100px] border-gray-300 dark:border-gray-600 bg-white dark:bg-[#171d37] text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    />
                  </div>
                )}
              </div>
            )}

            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-2 border-yellow-500 dark:border-yellow-500 rounded-full bg-white dark:bg-[#171d37] text-yellow-500 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10 px-6 py-2 cursor-pointer"
                onClick={handleClose}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="border-2 border-yellow-500 dark:border-yellow-500 rounded-full bg-yellow-500 dark:bg-yellow-500 hover:bg-yellow-600 dark:hover:bg-yellow-600 text-white px-6 py-2 cursor-pointer"
            >
              Proceed
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CancelOpenDialog;
