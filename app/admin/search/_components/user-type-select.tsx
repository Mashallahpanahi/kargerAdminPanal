"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SearchUserTypeFilter } from "@/types/search";

type UserTypeSelectProps = {
  value: SearchUserTypeFilter;
  onChange: (value: SearchUserTypeFilter) => void;
};

export function UserTypeSelect({ value, onChange }: UserTypeSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="user-type">User type</Label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v as SearchUserTypeFilter)}
      >
        <SelectTrigger id="user-type" className="w-full rounded-sm sm:w-56">
          <SelectValue placeholder="Select user type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All users</SelectItem>
          <SelectItem value="employer">Employers only</SelectItem>
          <SelectItem value="employee">Employees only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
