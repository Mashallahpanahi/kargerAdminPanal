export const POSTS_PAGE_SIZE = 10;

export type PostAuthor = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string | null;
  currentLocation?: string;
  field?: string;
  role?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  bio?: string | null;
  skills?: string[] | null;
  yearsOfExperience?: number | null;
  hourlyRate?: string | null;
};

export type PostComment = {
  id: string;
  content: string;
  postId: string;
  employerId?: string | null;
  employeeId?: string | null;
  employer?: PostAuthor | null;
  employee?: PostAuthor | null;
  createdAt: string;
  updatedAt?: string;
};

export type Post = {
  id: string;
  description: string;
  image?: string | null;
  title?: string | null;
  location?: string | null;
  gender?: string | null;
  experience?: string | null;
  vacancyNumber?: string | null;
  numberOfJobs?: number | null;
  salary?: string | null;
  jobType?: string | null;
  education?: string | null;
  jobStatus?: string | null;
  applicationsCount?: number;
  employeeId?: string | null;
  employee?: PostAuthor | null;
  employerId?: string | null;
  employer?: PostAuthor | null;
  comments?: PostComment[];
  likesCount: number;
  commentsCount: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
};

export type PostsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export type PostsListResponse = {
  success?: boolean;
  data?: Post[];
  posts?: Post[];
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  pagination?: PostsPagination;
};

export type PaginatedPosts = {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
