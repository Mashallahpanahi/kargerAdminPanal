"use client";

import { deletePost } from "@/app/actions/post";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { showToast } from "@/components/shared/toasterlogin";
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
import type { Post } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PostEditDialog } from "./post-edit-dialog";
import { PostViewDialog } from "./post-view-dialog";

interface PostTableProps {
  posts: Post[];
  onPostsChanged: () => void;
}

function getAuthorInfo(post: Post) {
  if (post.employer) {
    return {
      name: `${post.employer.name} ${post.employer.lastName}`,
      email: post.employer.email,
      type: "employer" as const,
    };
  }
  if (post.employee) {
    return {
      name: `${post.employee.name} ${post.employee.lastName}`,
      email: post.employee.email,
      type: "employee" as const,
    };
  }
  if (post.employerId) {
    return { name: "Employer", email: "—", type: "employer" as const };
  }
  return { name: "Unknown", email: "—", type: "employee" as const };
}

export function PostTable({ posts, onPostsChanged }: PostTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handleViewClick = (post: Post) => {
    setSelectedPost(post);
    setViewDialogOpen(true);
  };

  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete);
      showToast.success("Deleted", "Post removed successfully.");
      onPostsChanged();
    } catch (error) {
      const message =
        (error as Error).message ?? "An unexpected error occurred.";
      if (
        message.includes("Authentication failed") ||
        message.includes("No access token")
      ) {
        showToast.error("Session Expired", "Please log in again.");
        setTimeout(() => router.push("/login"), 2000);
        return;
      }
      showToast.error("Delete failed", message);
    } finally {
      setPostToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[240px]">Description</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Likes</TableHead>
              <TableHead className="text-center">Comments</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => {
                const author = getAuthorInfo(post);
                return (
                  <TableRow key={post.id}>
                    <TableCell className="max-w-xs">
                      <p className="line-clamp-2 font-medium">
                        {post.description}
                      </p>
                      {post.status && (
                        <Badge variant="outline" className="mt-1 capitalize">
                          {post.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {author.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          author.type === "employer" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {author.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {post.likesCount ?? 0}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {post.commentsCount ?? 0}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClick(post)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(post)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(post.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  No posts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />

      <PostViewDialog
        post={selectedPost}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
      />

      <PostEditDialog
        post={selectedPost}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onPostUpdated={onPostsChanged}
      />
    </>
  );
}
