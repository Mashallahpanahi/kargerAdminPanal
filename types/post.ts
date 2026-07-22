export type PostAuthor = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string | null;
};

export type Post = {
  id: string;
  description: string;
  image?: string | null;
  employeeId?: string | null;
  employee?: PostAuthor | null;
  employerId?: string | null;
  employer?: PostAuthor | null;
  likesCount: number;
  commentsCount: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
};

export type PostsListResponse = {
  data?: Post[];
  posts?: Post[];
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};
