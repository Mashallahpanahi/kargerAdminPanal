"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BarChart3Icon,
  BriefcaseBusinessIcon,
  FileTextIcon,
  MenuIcon,
  SearchIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";

const navigationItems = [
  { title: "Dashboard", icon: BarChart3Icon, url: "/admin" },
  { title: "Admins", icon: UsersIcon, url: "/admin/admins" },
  { title: "Employees", icon: UsersIcon, url: "/admin/employees" },
  { title: "Employers", icon: UsersIcon, url: "/admin/employers" },
  { title: "Posts", icon: FileTextIcon, url: "/admin/posts" },
  { title: "Search", icon: SearchIcon, url: "/admin/search" },
  { title: "Fields", icon: BriefcaseBusinessIcon, url: "/admin/fields" },
  { title: "Profile", icon: UserRoundIcon, url: "/admin/profile" },
];

export function AdminSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isActive = (url: string) =>
    pathname === url || (url !== "/admin" && pathname.startsWith(`${url}/`));

  return (
    <Sidebar
      collapsible="none"
      className="hidden border-r border-gray-300 md:block fixed left-0 top-0 h-screen z-30 bg-white"
      {...props}
    >
      <SidebarHeader className="border-b border-gray-300 px-8 py-[17.5px]">
        <div className="flex space-x-2">
          <Image src="/images/kargerlogo.png" alt="Logo" height={22} width={22} />
          <h2 className="text-lg font-semibold text-center">Karger Admin</h2>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto h-[calc(100vh-64px)]">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`w-full justify-start px-3 py-6 text-sm hover:bg-gray-50 ${
                  isActive(item.url) ? "bg-gray-50" : ""
                }`}
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export function MobileNavigation() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isActive = (url: string) =>
    pathname === url || (url !== "/admin" && pathname.startsWith(`${url}/`));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full p-0 bg-white">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="space-y-1 overflow-y-auto max-h-screen py-8">
          {navigationItems.map((item) => (
            <div key={item.title} className="px-3 py-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={`w-full justify-start gap-3 px-2 ${
                  isActive(item.url) ? "bg-gray-100" : ""
                }`}
              >
                <Link href={item.url} onClick={() => setOpen(false)}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
