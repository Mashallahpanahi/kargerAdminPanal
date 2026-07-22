import { AdminHeader } from "@/components/layout/header";
import { AdminSidebar } from "@/components/layout/sidebar";
import { Toaster } from "@/components/shared/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import type React from "react";

export default function SiteAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 md:ml-[16rem] bg-[#fffffa] dark:bg-[#171d37] min-w-0 relative">
          <AdminHeader />
          <main className="absolute inset-0 pt-16 overflow-y-auto  table-container">
            <div className="p-4 md:p-6 w-full">{children}</div>
            <Toaster />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
