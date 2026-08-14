"use client";

import { deletePost } from "@/app/actions/post";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { showToast } from "@/components/shared/toasterlogin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Post, PostComment } from "@/types/post";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  GraduationCap,
  Heart,
  ImageIcon,
  MapPin,
  MessageCircle,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  const normalizedPath = imagePath.replace(/\\/g, "/");
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  if (normalizedPath.startsWith("http")) return normalizedPath;
  return `${baseUrl}/${normalizedPath}`;
}

function formatLabel(value?: string | null) {
  if (!value) return "—";
  return value.replace(/_/g, " ");
}

function getCommentAuthor(comment: PostComment) {
  const author = comment.employer ?? comment.employee;
  const type =
    comment.employer || comment.employerId
      ? ("employer" as const)
      : comment.employee || comment.employeeId
        ? ("employee" as const)
        : ("user" as const);
  const profileId =
    author?.id ?? comment.employerId ?? comment.employeeId ?? null;
  const profileHref =
    profileId && type === "employer"
      ? `/admin/employers/${profileId}`
      : profileId && type === "employee"
        ? `/admin/employees/${profileId}`
        : null;

  if (author) {
    return {
      name: `${author.name} ${author.lastName}`.trim(),
      email: author.email || null,
      type,
      profileHref,
    };
  }

  return {
    name: type === "employer" ? "Employer" : type === "employee" ? "Employee" : "Unknown",
    email: null,
    type,
    profileHref,
  };
}

interface PostDetailProps {
  post: Post;
  comments: PostComment[];
}

export function PostDetail({ post, comments }: PostDetailProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const author = post.employer ?? post.employee;
  const authorName = author
    ? `${author.name} ${author.lastName}`
    : "Unknown";
  const authorEmail = author?.email ?? "No email";
  const authorType = post.employer || post.employerId ? "employer" : "employee";
  const imageUrl = getImageUrl(post.image);
  const status = post.jobStatus || post.status;

  const jobFields = [
    { label: "Location", value: post.location, icon: MapPin },
    { label: "Salary", value: post.salary, icon: Wallet },
    { label: "Job Type", value: formatLabel(post.jobType), icon: Briefcase },
    { label: "Experience", value: post.experience, icon: Briefcase },
    { label: "Education", value: post.education, icon: GraduationCap },
    { label: "Gender", value: formatLabel(post.gender), icon: Users },
    { label: "Vacancy Number", value: post.vacancyNumber, icon: Briefcase },
    {
      label: "Number of Jobs",
      value:
        post.numberOfJobs !== null && post.numberOfJobs !== undefined
          ? String(post.numberOfJobs)
          : null,
      icon: Briefcase,
    },
    {
      label: "Applications",
      value:
        post.applicationsCount !== undefined
          ? String(post.applicationsCount)
          : null,
      icon: Users,
    },
  ];

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(post.id);
      showToast.success("Deleted", "Post removed successfully.");
      router.push("/admin/posts");
      router.refresh();
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
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild className="rounded-sm text-gray-600">
          <Link href="/admin/posts">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={isDeleting}
          className="rounded-sm"
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete Post
        </Button>
      </div>

      <div className="space-y-6 rounded-sm border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <Avatar className="h-10 w-10 rounded-sm">
            <AvatarImage src={author?.profilePicture || undefined} />
            <AvatarFallback className="rounded-sm">
              {authorName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{authorName}</p>
              <Badge variant="outline" className="rounded-sm capitalize">
                {authorType}
              </Badge>
              {status && (
                <Badge variant="secondary" className="rounded-sm capitalize">
                  {formatLabel(status)}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{authorEmail}</p>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {post.title || "Untitled post"}
          </h1>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            Job Details
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {jobFields.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-start gap-2 rounded-sm border border-gray-100 p-3 text-sm"
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-medium capitalize text-gray-900">
                    {value || "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Description
          </h3>
          <p className="whitespace-pre-wrap text-gray-900">
            {post.description || "No description"}
          </p>
        </div>

        {imageUrl && !imgError ? (
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Image
            </h3>
            <div className="relative h-64 w-full overflow-hidden rounded-sm border bg-muted">
              <Image
                src={imageUrl}
                alt={post.title || "Post image"}
                fill
                className="object-contain"
                onError={() => setImgError(true)}
                unoptimized
              />
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-sm border border-dashed bg-gray-50 text-gray-300">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-red-500" />
            <span>{post.likesCount ?? 0} likes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            <span>{comments.length || post.commentsCount || 0} comments</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleString()
                : "—"}
            </span>
          </div>
          <div className="text-sm text-muted-foreground">ID: {post.id}</div>
        </div>
      </div>

      <div className="space-y-4 rounded-sm border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Comments ({comments.length})
          </h2>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment) => {
              const commentAuthor = getCommentAuthor(comment);
              return (
                <div
                  key={comment.id}
                  className="rounded-sm border border-gray-100 p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {commentAuthor.profileHref ? (
                      <Link
                        href={commentAuthor.profileHref}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        {commentAuthor.name}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">
                        {commentAuthor.name}
                      </p>
                    )}
                    <Badge variant="outline" className="rounded-sm capitalize">
                      {commentAuthor.type}
                    </Badge>
                    {commentAuthor.email && (
                      <span className="text-xs text-muted-foreground">
                        {commentAuthor.email}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString()
                        : "—"}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-gray-800">
                    {comment.content || "—"}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-gray-200 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No comments on this post
            </p>
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />
    </div>
  );
}
