import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BriefcaseBusinessIcon,
  FileTextIcon,
  SearchIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Manage Employers",
    description: "View, ban, or remove employer accounts",
    href: "/admin/employers",
    icon: UsersIcon,
  },
  {
    title: "Manage Employees",
    description: "View, ban, or remove employee accounts",
    href: "/admin/employees",
    icon: UsersIcon,
  },
  {
    title: "Review Posts",
    description: "Browse and moderate job posts",
    href: "/admin/posts",
    icon: FileTextIcon,
  },
  {
    title: "Platform Search",
    description: "Find users and jobs across the portal",
    href: "/admin/search",
    icon: SearchIcon,
  },
  {
    title: "Manage Fields",
    description: "Add or update professional fields",
    href: "/admin/fields",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Admin Team",
    description: "Create and manage admin accounts",
    href: "/admin/admins",
    icon: UserRoundIcon,
  },
];

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump to common management tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button
            key={action.href}
            variant="outline"
            className="h-auto w-full justify-start gap-3 px-3 py-3 text-left"
            asChild
          >
            <Link href={action.href}>
              <action.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="font-medium">{action.title}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
