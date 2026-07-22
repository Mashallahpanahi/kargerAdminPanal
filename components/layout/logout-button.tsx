"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="flex items-center gap-2 bg-transparent cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
