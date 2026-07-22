"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Post } from "@/types/post";

interface PostViewDialogProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  const normalizedPath = imagePath.replace(/\\/g, "/");
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  if (normalizedPath.startsWith("http")) return normalizedPath;
  return `${baseUrl}/${normalizedPath}`;
}

export function PostViewDialog({
  post,
  open,
  onOpenChange,
}: PostViewDialogProps) {
  const [imgError, setImgError] = useState(false);

  if (!post) return null;

  const author = post.employer ?? post.employee;
  const authorName = author
    ? `${author.name} ${author.lastName}`
    : "Unknown";
  const authorEmail = author?.email ?? "No email";
  const authorType = post.employer || post.employerId ? "employer" : "employee";
  const imageUrl = getImageUrl(post.image);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Post Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author?.profilePicture || undefined} />
              <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{authorName}</p>
                <Badge variant="outline" className="capitalize">
                  {authorType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{authorEmail}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Description
            </h3>
            <p className="whitespace-pre-wrap">{post.description}</p>
          </div>

          {imageUrl && !imgError && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Image
              </h3>
              <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={imageUrl}
                  alt="Post image"
                  fill
                  className="object-contain"
                  onError={() => setImgError(true)}
                />
              </div>
            </div>
          )}

          {imgError && (
            <p className="text-center text-sm text-muted-foreground">
              Image could not be loaded
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="flex items-center gap-2 text-sm">
              <Heart className="h-4 w-4 text-red-500" />
              <span>{post.likesCount ?? 0} likes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageCircle className="h-4 w-4 text-blue-500" />
              <span>{post.commentsCount ?? 0} comments</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              ID: {post.id}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
