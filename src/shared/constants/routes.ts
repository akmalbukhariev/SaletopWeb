export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  ADMIN: {
    DASHBOARD: "/",
    ADMINS: "/admin/admins",
    USERS: "/admin/users",
    COMPANIES: "/admin/companies",
    MODERATION: "/admin/moderation",
    NOTIFICATIONS: {
      HOME: "/admin/notifications",
      SEND: "/admin/notifications/send",
    },
    ANNOUNCEMENTS: {
      HOME: "/admin/announcements",
      CREATE: "/admin/announcements/create",
    },
    SETTINGS: "/admin/settings",
  },
  NOT_FOUND: "*",
} 
