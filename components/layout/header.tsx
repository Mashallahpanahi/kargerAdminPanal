"use client";

import { MobileNavigation } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

import Image from "next/image";
import { LogoutButton } from "./logout-button";

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between bg-white border-b border-gray-300 px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center  gap-4">
        <MobileNavigation />
        <div className="flex space-x-2 md:hidden">
          <Image src="/images/kargerlogo.png" alt="Icon" height={16} width={16} />
          <h2 className="text-sm font-semibold text-foreground text-center">
            Karger Admin
          </h2>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="hidden gap-2 md:flex"
          asChild
        >
          <Link href="/admin">
            <ExternalLinkIcon className="h-5 w-5 cursor-pointer " />
            Dashboard
          </Link>
        </Button>

        <LogoutButton />
      </div>
    </header>
  );
}
