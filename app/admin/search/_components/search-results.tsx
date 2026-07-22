"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SearchJob, SearchUser } from "@/types/search";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function UserSearchResults({
  users,
  isLoading,
}: {
  users: SearchUser[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Searching users...
      </p>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No users found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try a different search term or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const manageUrl =
              user.userType === "employer"
                ? "/admin/employers"
                : "/admin/employees";

            return (
              <TableRow key={`${user.userType ?? "user"}-${user.id}`}>
                <TableCell className="font-medium">
                  {user.name} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {user.userType ?? "user"}
                  </Badge>
                </TableCell>
                <TableCell>{user.professionalField ?? "—"}</TableCell>
                <TableCell>{user.currentLocation ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.isActive === false ? "destructive" : "secondary"
                    }
                  >
                    {user.isActive === false ? "Inactive" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={manageUrl}>
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Manage
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function JobSearchResults({
  jobs,
  isLoading,
}: {
  jobs: SearchJob[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Searching jobs...
      </p>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No job posts found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try a different job title keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <p className="font-medium leading-snug">
              {job.title || job.description}
            </p>
            {job.title && job.description && (
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {job.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {job.employer && (
                <Badge variant="outline">
                  {job.employer.name} {job.employer.lastName}
                </Badge>
              )}
              <span>
                {formatDistanceToNow(new Date(job.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/admin/posts">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              View posts
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
