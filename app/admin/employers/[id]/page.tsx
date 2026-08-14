"use client";

import { use, useCallback, useEffect, useState } from "react";
import { getEmployerById } from "@/app/actions/admin";
import { getPostsByAuthor } from "@/app/actions/post";
import { Toaster, showToast } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/post";
import type { EmployerDetails } from "@/types/profile";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { EmployerDetail } from "../_components/employer-detail";

function normalizePosts(value: unknown): Post[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is Post => !!item && typeof item === "object" && "id" in item,
  );
}

export default function EmployerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [employer, setEmployer] = useState<EmployerDetails | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEmployer = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEmployerById(id);
      setEmployer(data);

      const embeddedPosts = normalizePosts(data.posts);
      if (embeddedPosts.length > 0) {
        setPosts(embeddedPosts);
      } else {
        const authorPosts = await getPostsByAuthor({ employerId: id });
        setPosts(authorPosts);
      }
    } catch (err) {
      const message = (err as Error).message || "Failed to load employer";
      setError(message);
      showToast.error("Error", message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEmployer();
  }, [loadEmployer]);

  return (
    <>
      <Toaster />
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      ) : error || !employer ? (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <p className="mb-4 text-gray-600">
            {error || "No employer data found."}
          </p>
          <Button variant="outline" asChild className="rounded-sm">
            <Link href="/admin/employers">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Employers
            </Link>
          </Button>
        </div>
      ) : (
        <EmployerDetail employer={employer} posts={posts} />
      )}
    </>
  );
}
