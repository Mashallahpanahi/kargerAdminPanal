"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaUrl } from "@/lib/utils/media";
import type { Post } from "@/types/post";
import {
  getFieldName,
  type EmployerDetails,
} from "@/types/profile";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  ExternalLink,
  FileText,
  Globe,
  Heart,
  ImageIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  User,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EmployerDetailProps {
  employer: EmployerDetails;
  posts: Post[];
}

function countValue(
  list: unknown[] | undefined,
  count: number | undefined,
): number {
  if (typeof count === "number") return count;
  return Array.isArray(list) ? list.length : 0;
}

function JobPostCard({ post }: { post: Post }) {
  const imageUrl = getMediaUrl(post.image);

  return (
    <Link
      href={`/admin/posts/${post.id}`}
      className="flex flex-col gap-4 rounded-sm border border-gray-200 bg-white p-4 shadow-none transition-colors hover:border-gray-400 sm:flex-row"
    >
      <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-sm bg-gray-50 sm:h-24 sm:w-32">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title || "Job post"}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <ImageIcon className="h-8 w-8" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="line-clamp-1 text-sm font-medium text-gray-900">
          {post.title || "Untitled post"}
        </p>
        <p className="line-clamp-2 text-sm text-gray-700">
          {post.description || "No description"}
        </p>
        {post.location && (
          <p className="text-xs text-gray-500">{post.location}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            {post.likesCount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.commentsCount ?? 0}
          </span>
          {post.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-sm border border-gray-100 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-none">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-sm bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold tabular-nums text-gray-900">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function EmployerDetail({ employer, posts }: EmployerDetailProps) {
  const initials = `${employer.name?.charAt(0) ?? ""}${employer.lastName?.charAt(0) ?? ""}`;
  const profileImage = getMediaUrl(employer.profilePicture);
  const fieldName = getFieldName(employer.field);
  const location = employer.currentLocation || employer.location || null;
  const followersCount = countValue(
    employer.followers,
    employer.followersCount,
  );
  const followingCount = countValue(
    employer.following,
    employer.followingCount,
  );
  const postsCount = Array.isArray(employer.posts)
    ? employer.posts.length
    : posts.length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild className="rounded-sm text-gray-600">
        <Link href="/admin/employers">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Employers
        </Link>
      </Button>

      <div className="rounded-sm border border-gray-200 bg-white p-6 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20 rounded-sm">
            <AvatarImage src={profileImage || undefined} alt={employer.name} />
            <AvatarFallback className="rounded-sm bg-yellow-100 text-xl text-yellow-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {employer.name} {employer.lastName}
                </h1>
                <Badge variant="outline" className="rounded-sm capitalize">
                  {employer.role || "employer"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                ID: {employer.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {employer.isActive !== false ? (
                <Badge className="rounded-sm bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="rounded-sm">
                  <XCircle className="mr-1 h-3 w-3" />
                  Inactive
                </Badge>
              )}
              {employer.isEmailVerified ? (
                <Badge className="rounded-sm bg-blue-100 text-blue-800 hover:bg-blue-100">
                  <Shield className="mr-1 h-3 w-3" />
                  Email verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="rounded-sm text-orange-700"
                >
                  Email not verified
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              {fieldName && (
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {fieldName}
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {location}
                </span>
              )}
              {employer.companyName && (
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {employer.companyName}
                </span>
              )}
              {employer.createdAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Member since{" "}
                  {new Date(employer.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="Total Posts" value={postsCount} />
        <StatCard icon={Users} label="Followers" value={followersCount} />
        <StatCard icon={UserPlus} label="Following" value={followingCount} />
      </div>

      <div className="rounded-sm border border-gray-200 bg-white p-6 shadow-none">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Employer information
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailItem icon={User} label="First name" value={employer.name || "—"} />
          <DetailItem
            icon={User}
            label="Last name"
            value={employer.lastName || "—"}
          />
          <DetailItem icon={Mail} label="Email" value={employer.email || "—"} />
          <DetailItem
            icon={Phone}
            label="Phone"
            value={employer.phoneNumber || "—"}
          />
          <DetailItem
            icon={MapPin}
            label="Location"
            value={location || "—"}
          />
          <DetailItem
            icon={Briefcase}
            label="Field"
            value={fieldName || "—"}
          />
          <DetailItem
            icon={Briefcase}
            label="Company"
            value={employer.companyName || "—"}
          />
          <DetailItem
            icon={Briefcase}
            label="Industry"
            value={employer.industry || "—"}
          />
          <DetailItem
            icon={Shield}
            label="Role"
            value={employer.role || "employer"}
          />
          <DetailItem
            icon={Calendar}
            label="Last updated"
            value={
              employer.updatedAt
                ? new Date(employer.updatedAt).toLocaleDateString()
                : "—"
            }
          />
        </div>

        {employer.companyWebsite && (
          <div className="mt-4">
            <a
              href={
                employer.companyWebsite.startsWith("http")
                  ? employer.companyWebsite
                  : `https://${employer.companyWebsite}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
            >
              <Globe className="h-4 w-4" />
              {employer.companyWebsite}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {employer.bio && (
          <div className="mt-4">
            <p className="mb-1 text-xs text-muted-foreground">Bio</p>
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {employer.bio}
            </p>
          </div>
        )}
      </div>

      <div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Posts by {employer.name || "Employer"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Job listings and updates shared on Karger
          </p>
        </div>
        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <JobPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-gray-200 py-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              No posts available yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
