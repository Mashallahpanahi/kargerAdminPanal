"use client";

import { use, useCallback, useEffect, useState } from "react";
import {
  enrichPostComments,
  getPostById,
  getPostComments,
} from "@/app/actions/post";
import { Toaster, showToast } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import type { Post, PostComment } from "@/types/post";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { PostDetail } from "../_components/post-detail";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPostById(id);
      setPost(data);

      try {
        const fetchedComments = await getPostComments(id);
        if (fetchedComments.length > 0) {
          setComments(fetchedComments);
        } else {
          setComments(await enrichPostComments(data.comments ?? []));
        }
      } catch {
        setComments(await enrichPostComments(data.comments ?? []));
      }
    } catch (err) {
      const message = (err as Error).message || "Failed to load post";
      setError(message);
      showToast.error("Error", message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return (
    <>
      <Toaster />
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      ) : error || !post ? (
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <p className="mb-4 text-gray-600">{error || "No post data found."}</p>
          <Button variant="outline" asChild className="rounded-sm">
            <Link href="/admin/posts">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Posts
            </Link>
          </Button>
        </div>
      ) : (
        <PostDetail post={post} comments={comments} />
      )}
    </>
  );
}
