"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CheckCircle,
  XCircle,
  User,
  IdCard,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getEmployerById } from "@/app/actions/admin";
import { showToast } from "@/components/shared/toasterlogin";
import { Loader2 } from "lucide-react";

interface ViewEmployerDialogProps {
  employerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type EmployerDetails = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string | null;
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  role?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  posts?: any[];
  // Add other fields from your API response as needed
};

export function ViewEmployerDialog({
  employerId,
  open,
  onOpenChange,
}: ViewEmployerDialogProps) {
  const [employer, setEmployer] = useState<EmployerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && employerId) {
      const fetchEmployer = async () => {
        setIsLoading(true);
        try {
          const data = (await getEmployerById(employerId)) as EmployerDetails;
          setEmployer(data);
        } catch (error) {
          showToast.error("Error", (error as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmployer();
    }
  }, [open, employerId]);

  const getInitials = () => {
    if (!employer) return "";
    return `${employer.name.charAt(0)}${employer.lastName.charAt(0)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Employer Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          </div>
        ) : employer ? (
          <>
            <div className="p-6 space-y-6">
              {/* Header with avatar and basic info */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <Avatar className="h-16 w-16">
                  {employer.profilePicture ? (
                    <img src={employer.profilePicture} alt={employer.name} />
                  ) : (
                    <AvatarFallback className="bg-yellow-100 text-yellow-700 text-xl">
                      {getInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {employer.name} {employer.lastName}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <IdCard className="h-3 w-3" /> ID: {employer.id}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{employer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{employer.phoneNumber}</span>
                  </div>
                  {employer.companyName && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>Company: {employer.companyName}</span>
                    </div>
                  )}
                  {employer.industry && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>Industry: {employer.industry}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Account Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium capitalize">
                      {employer.role || "employer"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {employer.isActive ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-700">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">Inactive</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {employer.isEmailVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-green-700">Email Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-orange-700">
                          Email Not Verified
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Joined:</span>
                    <span>
                      {new Date(employer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close button at bottom */}
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              <Button
                onClick={() => onOpenChange(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No employer data found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
