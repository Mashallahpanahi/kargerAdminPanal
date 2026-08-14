"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMediaUrl } from "@/lib/utils/media";
import {
  getFieldName,
  type CompletedWork,
  type EmployeeDetails,
  type PortfolioItem,
} from "@/types/profile";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  ImageIcon,
  Mail,
  MapPin,
  Phone,
  Shield,
  Star,
  User,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EmployeeDetailProps {
  employee: EmployeeDetails;
  portfolioItems: PortfolioItem[];
  verifiedJobs: CompletedWork[];
}

function countValue(
  list: unknown[] | undefined,
  count: number | undefined,
): number {
  if (typeof count === "number") return count;
  return Array.isArray(list) ? list.length : 0;
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const imageUrl = getMediaUrl(item.image);

  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 bg-white">
      <div className="relative aspect-video bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title || "Past job"}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <p className="line-clamp-1 text-sm font-medium text-gray-900">
          {item.title || "Untitled job"}
        </p>
        <p className="line-clamp-2 text-sm text-gray-600">
          {item.description || "No description"}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {item.clientOrPlatform && <span>{item.clientOrPlatform}</span>}
          {item.completedAt && (
            <span>{new Date(item.completedAt).toLocaleDateString()}</span>
          )}
        </div>
        {item.projectUrl && (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View project
          </a>
        )}
      </div>
    </div>
  );
}

function VerifiedJobCard({ work }: { work: CompletedWork }) {
  const imageUrl = getMediaUrl(work.workImage);
  const title = work.jobTitle || work.job?.title || "Verified job";

  return (
    <div className="overflow-hidden rounded-sm border border-gray-200 bg-white">
      <div className="relative aspect-video bg-gray-50">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="line-clamp-1 text-sm font-medium text-gray-900">
            {title}
          </p>
          <Badge className="rounded-sm bg-green-100 text-green-800 hover:bg-green-100">
            Verified
          </Badge>
        </div>
        {work.employerName && (
          <p className="text-xs text-muted-foreground">
            Homeowner: {work.employerName}
          </p>
        )}
        <p className="line-clamp-2 text-sm text-gray-600">
          {work.workDescription || "No description"}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {typeof work.rating === "number" && (
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              {work.rating}
            </span>
          )}
          {work.completedAt && (
            <span>{new Date(work.completedAt).toLocaleDateString()}</span>
          )}
        </div>
        {work.feedback && (
          <p className="line-clamp-2 text-xs italic text-gray-500">
            “{work.feedback}”
          </p>
        )}
      </div>
    </div>
  );
}

export function EmployeeDetail({
  employee,
  portfolioItems,
  verifiedJobs,
}: EmployeeDetailProps) {
  const initials = `${employee.name?.charAt(0) ?? ""}${employee.lastName?.charAt(0) ?? ""}`;
  const profileImage = getMediaUrl(employee.profilePicture);
  const fieldName = getFieldName(employee.field);
  const location = employee.currentLocation || employee.location || null;
  const followersCount = countValue(
    employee.followers,
    employee.followersCount,
  );
  const followingCount = countValue(
    employee.following,
    employee.followingCount,
  );
  const skills = Array.isArray(employee.skills) ? employee.skills : [];
  const rating =
    employee.averageRating !== null && employee.averageRating !== undefined
      ? String(employee.averageRating)
      : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild className="rounded-sm text-gray-600">
        <Link href="/admin/employees">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Employees
        </Link>
      </Button>

      <div className="rounded-sm border border-gray-200 bg-white p-6 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Avatar className="h-20 w-20 rounded-sm">
            <AvatarImage src={profileImage || undefined} alt={employee.name} />
            <AvatarFallback className="rounded-sm bg-yellow-100 text-xl text-yellow-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {employee.name} {employee.lastName}
                </h1>
                <Badge variant="outline" className="rounded-sm capitalize">
                  {employee.role || "employee"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                ID: {employee.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {employee.isActive !== false ? (
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
              {employee.isEmailVerified ? (
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
              {employee.hourlyRate && (
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" />
                  {employee.hourlyRate}
                </span>
              )}
              {employee.createdAt && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Member since{" "}
                  {new Date(employee.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {rating && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {rating}
                  {typeof employee.totalRatings === "number" &&
                    ` (${employee.totalRatings})`}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Users className="h-4 w-4" />
                {followersCount} followers
              </span>
              <span className="inline-flex items-center gap-1">
                <User className="h-4 w-4" />
                {followingCount} following
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-gray-200 bg-white p-6 shadow-none">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          About Services
        </h2>
        <div className="space-y-4">
          {employee.bio ? (
            <p className="whitespace-pre-wrap text-sm text-gray-700">
              {employee.bio}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No bio provided.</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-sm border border-gray-100 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-medium">
                <Mail className="h-3.5 w-3.5" />
                {employee.email || "—"}
              </p>
            </div>
            <div className="rounded-sm border border-gray-100 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-medium">
                <Phone className="h-3.5 w-3.5" />
                {employee.phoneNumber || "—"}
              </p>
            </div>
            <div className="rounded-sm border border-gray-100 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Years of experience</p>
              <p className="mt-1 font-medium">
                {employee.yearsOfExperience ?? "—"}
              </p>
            </div>
            <div className="rounded-sm border border-gray-100 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Hourly rate</p>
              <p className="mt-1 font-medium">{employee.hourlyRate || "—"}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Services offered
            </p>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills listed.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-gray-200 bg-white p-6 shadow-none">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Past jobs gallery
        </h2>
        {portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-gray-200 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No past jobs in this employee&apos;s gallery
            </p>
          </div>
        )}
      </div>

      <div className="rounded-sm border border-gray-200 bg-white p-6 shadow-none">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Verified on this platform
        </h2>
        {verifiedJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {verifiedJobs.map((work) => (
              <VerifiedJobCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-gray-200 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No verified platform jobs yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
