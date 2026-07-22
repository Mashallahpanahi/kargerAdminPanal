"use client";

import React, { useRef, type ChangeEvent, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled,
  className,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 1) {
      const newOtp = value.split("");
      newOtp[index] = newValue;
      onChange(newOtp.join(""));

      // Move to next input if a digit is entered
      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, length);
    if (/^\d*$/.test(pasteData)) {
      onChange(pasteData);
      // Focus the last input if paste data fills all fields
      if (pasteData.length === length) {
        inputRefs.current[length - 1]?.focus();
      } else {
        inputRefs.current[pasteData.length]?.focus();
      }
    }
  };

  return (
    <div
      className={cn("flex items-center justify-center space-x-2", className)}
    >
      {Array.from({ length }).map((_, index) => (
        <React.Fragment key={index}>
          <Input
            type="text"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            disabled={disabled}
            className="w-8 h-8 text-center text-sm font-semibold border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-500"
          />
          {index === 2 && index < length - 1 && (
            <span className="text-gray-400 text-2xl">-</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
