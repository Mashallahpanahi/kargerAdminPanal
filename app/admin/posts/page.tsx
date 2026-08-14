"use client";

import { useCallback, useEffect, useState } from "react";
import { getEmployerPosts, getPostsPaginated } from "@/app/actions/post";
import { Pagination } from "@/components/shared/pagination";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POSTS_PAGE_SIZE, type Post } from "@/types/post";
import { RefreshCw, Search } from "lucide-react";
import { PostTable } from "./_components/post-tabl";

function matchesSearch(post: Post, lower: string): boolean {
  if (post.title?.toLowerCase().includes(lower)) return true;
  if (post.location?.toLowerCase().includes(lower)) return true;
  if (post.description?.toLowerCase().includes(lower)) return true;
  if (post.jobType?.toLowerCase().includes(lower)) return true;
  if (post.jobStatus?.toLowerCase().includes(lower)) return true;
  if (post.employer) {
    const name =
      `${post.employer.name} ${post.employer.lastName}`.toLowerCase();
    if (
      name.includes(lower) ||
      post.employer.email.toLowerCase().includes(lower)
    ) {
      return true;
    }
  }
  if (post.id.toLowerCase().includes(lower)) return true;
  return false;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isSearching = searchTerm.trim().length > 0;

  const loadPosts = useCallback(
    async (activePage: number, activeSearch: string, refresh = false) => {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      try {
        const trimmed = activeSearch.trim();

        if (trimmed) {
          const all = await getEmployerPosts();
          const lower = trimmed.toLowerCase();
          const filtered = all.filter((post) => matchesSearch(post, lower));
          const pages = Math.max(1, Math.ceil(filtered.length / POSTS_PAGE_SIZE));
          const safePage = Math.min(activePage, pages);
          const start = (safePage - 1) * POSTS_PAGE_SIZE;
          setPosts(filtered.slice(start, start + POSTS_PAGE_SIZE));
          setTotalItems(filtered.length);
          setTotalPages(pages);
          if (safePage !== activePage) setPage(safePage);
        } else {
          const result = await getPostsPaginated({
            type: "employer",
            page: activePage,
            limit: POSTS_PAGE_SIZE,
          });
          setPosts(result.posts);
          setTotalItems(result.total);
          setTotalPages(Math.max(1, result.totalPages));
          if (result.page !== activePage) setPage(result.page);
        }
      } catch (error) {
        showToast.error("Error", (error as Error).message);
        setPosts([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadPosts(page, searchTerm);
  }, [page, searchTerm, loadPosts]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Toaster />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manage Posts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and delete employer job posts on the platform.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => loadPosts(page, searchTerm, true)}
          disabled={isRefreshing}
          className="gap-2 self-start rounded-sm"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title, location, description, employer, or post ID..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="rounded-sm pl-10"
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary" className="rounded-sm">
          {posts.length} of {totalItems} posts
        </Badge>
        <span>
          Page {page} · {POSTS_PAGE_SIZE} per page
        </span>
        {isSearching && <span>matching &quot;{searchTerm.trim()}&quot;</span>}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-muted-foreground">
          Loading posts...
        </div>
      ) : (
        <>
          <PostTable
            posts={posts}
            onPostsChanged={() => loadPosts(page, searchTerm, true)}
          />
          {totalItems > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={POSTS_PAGE_SIZE}
              onPageChange={setPage}
              itemNme="Posts"
            />
          )}
        </>
      )}
    </div>
  );
}
