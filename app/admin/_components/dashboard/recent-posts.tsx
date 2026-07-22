"use client";

import { deletePost } from "@/app/actions/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { showToast } from "@/components/shared/toasterlogin";
import type { Post } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type RecentPostsProps = {
  posts: Post[];
  onPostDeleted: () => void;
};

export function RecentPosts({ posts, onPostDeleted }: RecentPostsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (postId: string) => {
    setDeletingId(postId);
    try {
      await deletePost(postId);
      showToast.success("Deleted", "Post deleted successfully.");
      onPostDeleted();
    } catch (error) {
      showToast.error("Delete failed", (error as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>3 latest job posts across the platform</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/posts">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No posts yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              New job posts will appear here as users publish them.
            </p>
          </div>
        ) : (
          <div className="divide-y rounded-lg border">
            {posts.map((post) => {
              const author =
                post.employer?.name || post.employee?.name
                  ? `${post.employer?.name ?? post.employee?.name} ${post.employer?.lastName ?? post.employee?.lastName ?? ""}`.trim()
                  : null;

              return (
                <div
                  key={post.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="line-clamp-2 font-medium leading-snug">
                      {post.description || "No description"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {author && <Badge variant="outline">{author}</Badge>}
                      <span>
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {post.likesCount ?? 0}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {post.commentsCount ?? 0}
                      </span>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingId === post.id}
                        className="shrink-0"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. The post will be
                          permanently removed from the platform.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post.id)}
                          className="bg-destructive text-white hover:bg-destructive/90"
                        >
                          Delete post
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
