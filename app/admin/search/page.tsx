"use client";

import {
  searchJobs,
  searchUsersByField,
  searchUsersByLocation,
  searchUsersByName,
  searchUsersCombined,
} from "@/app/actions/search";
import { showToast, Toaster } from "@/components/shared/toasterlogin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SearchJob, SearchUser, SearchUserTypeFilter } from "@/types/search";
import { Briefcase, MapPin, Search, User, Users } from "lucide-react";
import { useState } from "react";
import {
  JobSearchResults,
  UserSearchResults,
} from "./_components/search-results";
import { UserTypeSelect } from "./_components/user-type-select";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("name");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [jobs, setJobs] = useState<SearchJob[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [nameQuery, setNameQuery] = useState("");
  const [fieldQuery, setFieldQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [combinedName, setCombinedName] = useState("");
  const [combinedField, setCombinedField] = useState("");
  const [combinedLocation, setCombinedLocation] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [userType, setUserType] = useState<SearchUserTypeFilter>("all");

  const runSearch = async (fn: () => Promise<SearchUser[] | SearchJob[]>) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await fn();
      if (activeTab === "jobs") {
        setJobs(results as SearchJob[]);
        setUsers([]);
      } else {
        setUsers(results as SearchUser[]);
        setJobs([]);
      }
    } catch (error) {
      showToast.error("Search failed", (error as Error).message);
      setUsers([]);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    switch (activeTab) {
      case "name":
        if (!nameQuery.trim()) {
          showToast.error("Required", "Enter a name to search.");
          return;
        }
        runSearch(() => searchUsersByName(nameQuery, userType));
        break;
      case "field":
        if (!fieldQuery.trim()) {
          showToast.error("Required", "Enter a professional field.");
          return;
        }
        runSearch(() => searchUsersByField(fieldQuery, userType));
        break;
      case "location":
        if (!locationQuery.trim()) {
          showToast.error("Required", "Enter a location.");
          return;
        }
        runSearch(() => searchUsersByLocation(locationQuery, userType));
        break;
      case "combined": {
        if (
          !combinedName.trim() &&
          !combinedField.trim() &&
          !combinedLocation.trim()
        ) {
          showToast.error("Required", "Enter at least one filter.");
          return;
        }
        runSearch(() =>
          searchUsersCombined(
            {
              name: combinedName,
              field: combinedField,
              location: combinedLocation,
            },
            userType,
          ),
        );
        break;
      }
      case "jobs":
        if (!jobTitle.trim()) {
          showToast.error("Required", "Enter a job title keyword.");
          return;
        }
        runSearch(() => searchJobs({ title: jobTitle }));
        break;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Toaster />

      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Platform Search
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Find users and job posts across the Karger job portal using the
          platform search API.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </CardTitle>
          <CardDescription>
            Search by name, field, location, combined filters, or job title.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setHasSearched(false);
              setUsers([]);
              setJobs([]);
            }}
          >
            <TabsList className="mb-6 flex h-auto w-full flex-wrap">
              <TabsTrigger value="name" className="gap-1.5">
                <User className="h-3.5 w-3.5" />
                By Name
              </TabsTrigger>
              <TabsTrigger value="field" className="gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                By Field
              </TabsTrigger>
              <TabsTrigger value="location" className="gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                By Location
              </TabsTrigger>
              <TabsTrigger value="combined" className="gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Combined
              </TabsTrigger>
              <TabsTrigger value="jobs" className="gap-1.5">
                <Briefcase className="h-3.5 w-3.5" />
                Jobs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="name" className="space-y-4">
              <UserTypeSelect value={userType} onChange={setUserType} />
              <div className="space-y-2">
                <Label htmlFor="name">User name</Label>
                <Input
                  id="name"
                  placeholder="e.g. John Smith"
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </TabsContent>

            <TabsContent value="field" className="space-y-4">
              <UserTypeSelect value={userType} onChange={setUserType} />
              <div className="space-y-2">
                <Label htmlFor="field">Professional field</Label>
                <Input
                  id="field"
                  placeholder="e.g. Software Engineering"
                  value={fieldQuery}
                  onChange={(e) => setFieldQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              <UserTypeSelect value={userType} onChange={setUserType} />
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Berlin, Germany"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </TabsContent>

            <TabsContent value="combined" className="space-y-4">
              <UserTypeSelect value={userType} onChange={setUserType} />
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="combined-name">Name</Label>
                  <Input
                    id="combined-name"
                    placeholder="Optional"
                    value={combinedName}
                    onChange={(e) => setCombinedName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="combined-field">Field</Label>
                  <Input
                    id="combined-field"
                    placeholder="Optional"
                    value={combinedField}
                    onChange={(e) => setCombinedField(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="combined-location">Location</Label>
                  <Input
                    id="combined-location"
                    placeholder="Optional"
                    value={combinedLocation}
                    onChange={(e) => setCombinedLocation(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job title</Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </TabsContent>

            <Button onClick={handleSearch} disabled={isLoading} className="mt-4">
              <Search className="mr-2 h-4 w-4" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </Tabs>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {activeTab === "jobs"
                ? `${jobs.length} job post${jobs.length === 1 ? "" : "s"} found`
                : `${users.length} user${users.length === 1 ? "" : "s"} found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === "jobs" ? (
              <JobSearchResults jobs={jobs} isLoading={isLoading} />
            ) : (
              <UserSearchResults users={users} isLoading={isLoading} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
