"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { getAdminProfile, updateAdminProfile } from "@/app/actions/admin";
import {
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Key,
  Edit,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type AdminProfile = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = (await getAdminProfile()) as AdminProfile;
      setProfile(data);
      setFormData({
        name: data.name || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
      });
    } catch (error) {
      showToast.error("Error", (error as Error).message);
      if ((error as Error).message.includes("Authentication")) {
        setTimeout(() => router.push("/login"), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload: any = {
        name: formData.name,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      };
      if (password.trim()) {
        payload.password = password;
      }
      await updateAdminProfile(payload);
      showToast.success("Success", "Profile updated successfully");
      setPassword("");
      await loadProfile(); // refresh the displayed data
      setIsEditing(false); // exit edit mode after successful save
    } catch (error) {
      showToast.error("Update failed", (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile values
    if (profile) {
      setFormData({
        name: profile.name || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
      });
    }
    setPassword("");
    setErrors({});
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-1 py-2 flex justify-center items-center">
      <Toaster />
      <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-none">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing
                ? "Edit your personal information"
                : "View your profile details"}
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="gap-2 rounded-sm bg-yellow-500 px-4 text-white hover:bg-yellow-600"
            >
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>

        {!isEditing ? (
          // View mode – show data as plain text
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <User className="h-4 w-4" /> First Name
                </Label>
                <p className="text-gray-900 mt-1">{profile?.name || "—"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <User className="h-4 w-4" /> Last Name
                </Label>
                <p className="text-gray-900 mt-1">{profile?.lastName || "—"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email Address
                </Label>
                <p className="text-gray-900 mt-1">{profile?.email || "—"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Phone Number
                </Label>
                <p className="text-gray-900 mt-1">
                  {profile?.phoneNumber || "—"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Edit mode – show form
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> First Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`rounded-sm border-gray-300 focus:border-yellow-500 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className={`rounded-sm border-gray-300 focus:border-yellow-500 ${errors.lastName ? "border-red-500" : ""}`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`rounded-sm border-gray-300 focus:border-yellow-500 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" /> Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className={`rounded-sm border-gray-300 focus:border-yellow-500 ${errors.phoneNumber ? "border-red-500" : ""}`}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            {/* Password change */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 flex items-center gap-2"
              >
                <Key className="h-4 w-4" /> New Password (optional)
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="rounded-sm border-gray-300 pr-10 focus:border-yellow-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Only fill if you want to change your password
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="rounded-sm px-6"
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-sm bg-yellow-500 px-8 text-white hover:bg-yellow-600"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
