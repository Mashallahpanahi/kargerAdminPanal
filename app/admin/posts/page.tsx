"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllPosts,
  getEmployeePosts,
  getEmployerPosts,
} from "@/app/actions/post";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Post } from "@/types/post";
import { FileText, RefreshCw, Search } from "lucide-react";
import { PostTable } from "./_components/post-tabl";

type PostFilter = "all" | "employer" | "employee";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<PostFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPosts = useCallback(async (activeFilter: PostFilter, refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      let data: Post[];
      switch (activeFilter) {
        case "employer":
          data = await getEmployerPosts();
          break;
        case "employee":
          data = await getEmployeePosts();
          break;
        default:
          data = await getAllPosts();
      }
      setPosts(data);
    } catch (error) {
      showToast.error("Error", (error as Error).message);
      setPosts([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(filter);
  }, [filter, loadPosts]);

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const lower = searchTerm.toLowerCase();
    return posts.filter((post) => {
      if (post.description.toLowerCase().includes(lower)) return true;
      if (post.employee) {
        const name =
          `${post.employee.name} ${post.employee.lastName}`.toLowerCase();
        if (name.includes(lower) || post.employee.email.toLowerCase().includes(lower)) {
          return true;
        }
      }
      if (post.employer) {
        const name =
          `${post.employer.name} ${post.employer.lastName}`.toLowerCase();
        if (name.includes(lower) || post.employer.email.toLowerCase().includes(lower)) {
          return true;
        }
      }
      if (post.id.toLowerCase().includes(lower)) return true;
      return false;
    });
  }, [posts, searchTerm]);

  const stats = useMemo(() => {
    const employerCount = posts.filter(
      (p) => p.employer || p.employerId,
    ).length;
    const employeeCount = posts.filter(
      (p) => p.employee || p.employeeId,
    ).length;
    return {
      total: posts.length,
      employer: employerCount,
      employee: employeeCount,
      likes: posts.reduce((sum, p) => sum + (p.likesCount ?? 0), 0),
      comments: posts.reduce((sum, p) => sum + (p.commentsCount ?? 0), 0),
    };
  }, [posts]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Toaster />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manage Posts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, edit, and delete all job posts on the platform.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadPosts(filter, true)}
          disabled={isRefreshing}
          className="gap-2 self-start"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total posts", value: stats.total },
          { label: "Employer posts", value: stats.employer },
          { label: "Employee posts", value: stats.employee },
          { label: "Total engagement", value: stats.likes + stats.comments },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as PostFilter)}
      >
        <TabsList>
          <TabsTrigger value="all" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            All Posts
          </TabsTrigger>
          <TabsTrigger value="employer">Employer Posts</TabsTrigger>
          <TabsTrigger value="employee">Employee Posts</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by description, author, email, or post ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{filteredPosts.length} posts shown</Badge>
        {searchTerm && <span>matching &quot;{searchTerm}&quot;</span>}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground">
          Loading posts...
        </div>
      ) : (
        <PostTable
          posts={filteredPosts}
          onPostsChanged={() => loadPosts(filter, true)}
        />
      )}
    </div>
  );
}
