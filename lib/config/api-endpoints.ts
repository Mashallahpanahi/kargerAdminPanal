const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export const API_ENDPOINTS = {
  ADMIN: {
    LOGIN: `${API_BASE_URL}/admin/login`,
    CREATE: `${API_BASE_URL}/admin/create`,
    LIST_ALL: `${API_BASE_URL}/admin/list/all`,
    DELETE: (adminId: string) => `${API_BASE_URL}/admin/${adminId}`,
    PROFILE: `${API_BASE_URL}/admin/profile`,
    DASHBOARD_STATS: `${API_BASE_URL}/admin/dashboard/stats`,
    EMPLOYEES: `${API_BASE_URL}/admin/users/employees`,
    GET_EMPLOYEE_BY_ID: (employeeId: string) =>
      `${API_BASE_URL}/employee/${employeeId}`,
    EMPLOYEE_PORTFOLIO: (employeeId: string) =>
      `${API_BASE_URL}/employee/${employeeId}/portfolio`,
    DELETE_EMPLOYEE: (employeeId: string) =>
      `${API_BASE_URL}/admin/users/employee/${employeeId}`,
    BAN_EMPLOYEE: (employeeId: string) =>
      `${API_BASE_URL}/admin/users/employee/${employeeId}/ban`,
    UNBAN_EMPLOYEE: (employeeId: string) =>
      `${API_BASE_URL}/admin/users/employee/${employeeId}/unban`,
    EMPLOYERS: `${API_BASE_URL}/admin/users/employers`,
    GET_EMPLOYER_BY_ID: (employerId: string) =>
      `${API_BASE_URL}/employer/${employerId}`,
    DELETE_EMPLOYER: (employerId: string) =>
      `${API_BASE_URL}/admin/users/employer/${employerId}`,
    BAN_EMPLOYER: (employerId: string) =>
      `${API_BASE_URL}/admin/users/employer/${employerId}/ban`,
    UNBAN_EMPLOYER: (employerId: string) =>
      `${API_BASE_URL}/admin/users/employer/${employerId}/unban`,
    FORGOT_PASSWORD: `${API_BASE_URL}/admin/forgot-password`,
    VERIFY_RESET_CODE: `${API_BASE_URL}/admin/verify-reset-code`,
    RESET_PASSWORD: `${API_BASE_URL}/admin/reset-password`,
    POSTS: `${API_BASE_URL}/posts`,
    EMPLOYER_POSTS: `${API_BASE_URL}/posts/employer-posts`,
    EMPLOYEE_POSTS: `${API_BASE_URL}/posts/employee-posts`,
    POSTS_BY_EMPLOYER: (employerId: string) =>
      `${API_BASE_URL}/posts/employer/${employerId}`,
    POSTS_BY_EMPLOYEE: (employeeId: string) =>
      `${API_BASE_URL}/posts/employee/${employeeId}`,
    POST_BY_ID: (postId: string) => `${API_BASE_URL}/posts/${postId}`,
    POST_COMMENTS: (postId: string) =>
      `${API_BASE_URL}/posts/${postId}/comments`,
    DELETE_POST: (postId: string) => `${API_BASE_URL}/admin/posts/${postId}`,
    FIELDS: `${API_BASE_URL}/fields`,
    FIELD_BY_ID: (fieldId: string) => `${API_BASE_URL}/fields/${fieldId}`,
    ACTIVATE_FIELD: (fieldId: string) =>
      `${API_BASE_URL}/fields/${fieldId}/activate`,
    DEACTIVATE_FIELD: (fieldId: string) =>
      `${API_BASE_URL}/fields/${fieldId}/deactivate`,
  },
  SEARCH: {
    BY_NAME: `${API_BASE_URL}/search/by-name`,
    BY_FIELD: `${API_BASE_URL}/search/by-field`,
    BY_LOCATION: `${API_BASE_URL}/search/by-location`,
    COMBINED: `${API_BASE_URL}/search/combined`,
    JOBS: `${API_BASE_URL}/search/jobs`,
  },
};
