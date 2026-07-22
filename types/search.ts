export type SearchUserType = "employer" | "employee";
export type SearchUserTypeFilter = SearchUserType | "all";

export type SearchUser = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  userType?: SearchUserType;
  professionalField?: string;
  currentLocation?: string;
  isActive?: boolean;
  profilePicture?: string | null;
};

export type SearchJob = {
  id: string;
  description: string;
  title?: string;
  createdAt: string;
  employerId?: string;
  employer?: {
    id: string;
    name: string;
    lastName: string;
  };
  likesCount?: number;
  commentsCount?: number;
};

export type SearchByNameParams = { name: string };
export type SearchByFieldParams = { field: string };
export type SearchByLocationParams = { location: string };
export type SearchCombinedParams = {
  name?: string;
  field?: string;
  location?: string;
  userType?: SearchUserTypeFilter;
};
export type SearchJobsParams = { title: string };
