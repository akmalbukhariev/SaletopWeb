// Backend API URL pathlari (server-side endpoints)
// Axios yoki Fetch orqali serverga so‘rov yuborishda ishlatiladi.
// API’larni markazlashtirish uchun (apiClient.ts bilan birga).

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "admin/login",
    REGISTER: "admin/register",
    REFRESH: "admin/refresh",
    VALIDATE_TOKEN: "admin/validate-token",
  },
  ADMIN: {
    ADMINS: "admin/getAllAdmins",
    ADMIN_BY_ID: (id: string | number) => `admin/getAdminById/${id}`,
    DELETE_BY_ID: (adminId: string) => `admin/deleteAdminById/${adminId}`,
  },
  USERS: {
    PAGINATED_LIST: "user/getPaginatedUsers",
    CHANGE_STATUS: "user/changeUserStatus",
    CHANGE_DELETION_STATUS: "user/changeUserDeletionStatus", //{  "deleted": true, "phone_number": "string" }
    BY_PHONE_NUM: (phone: string | number) => `user/getUserByPhone/${phone}`,
  },

  COMPANIES: {
    CHANGE_STATUS: "company/changeUserStatus",
    PAGINATED_LIST: `company/getPaginatedUsers`,
    CHANGE_DELETION_STATUS: "company/changeUserDeletionStatus",
    BY_PHONE: (phone: string | number) => `company/getUserByPhone/${phone}`,
  },
} as const;

export type Endpoints = typeof ENDPOINTS;
