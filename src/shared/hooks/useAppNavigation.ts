import { useNavigate } from "react-router"
import { ROUTES } from "../constants/routes"
import { useEffect } from "react"

// Typing (query params for notifications send)
type SendNotificationParams = {
  company?: number | string;
  phone_number?: string;
};

export function useAppNavigation() {
  const navigate = useNavigate()
  return {
    // --- General Routes ---
    toHome: () => navigate(ROUTES.HOME),

    // --- Auth Routes ---
    toLogin: () => navigate("/admin-page" + ROUTES.AUTH.LOGIN),
    toRegister: () => navigate(ROUTES.AUTH.REGISTER),

    // --- Admin Routes ---
    toAdminDashboard: () => navigate(ROUTES.ADMIN.DASHBOARD),
    toAdminAdmins: () => navigate(ROUTES.ADMIN.ADMINS),
    toAdminUsers: () => navigate(ROUTES.ADMIN.USERS),
    toAdminCompanies: () => navigate(ROUTES.ADMIN.COMPANIES),
    toAdminModeration: () => navigate(ROUTES.ADMIN.MODERATION),
    toAdminSettings: () => navigate(ROUTES.ADMIN.SETTINGS),

    // --- Notifications ---
    toNotificationsHome: () => navigate(ROUTES.ADMIN.NOTIFICATIONS.HOME),

    toNotificationsSend: (params?: SendNotificationParams) => {
      if (params) {
        const query = new URLSearchParams({
          ...(params.company !== undefined && { company: params.company.toString() }),
          ...(params.phone_number && { phone_number: params.phone_number }),
        })
        navigate(`${ROUTES.ADMIN.NOTIFICATIONS.SEND}?${query.toString()}`)
      } else {
        navigate(ROUTES.ADMIN.NOTIFICATIONS.SEND)
      }
    },

    // --- Error / Not Found ---
    toNotFound: () => navigate(ROUTES.NOT_FOUND),
  }
}
