import { useNavigate } from "react-router"
import { ROUTES } from "../constants/routes"
import { AnnouncementStateType } from "../../pages/announcement/types/RequestTypes"

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

    toNotificationsSend: (state?: SendNotificationParams) => {
      if (state) {
        navigate(ROUTES.ADMIN.NOTIFICATIONS.SEND, { state: state })
      } else {
        navigate(ROUTES.ADMIN.NOTIFICATIONS.SEND)
      }
    },

    // --- Announcements ---
    toAnnouncementsHome: () => navigate(ROUTES.ADMIN.ANNOUNCEMENTS.HOME),
    toAnnouncementsCreate: (state?: AnnouncementStateType) => {
      if (state) {
        navigate(ROUTES.ADMIN.ANNOUNCEMENTS.CREATE, { state: state })
      } else {
        navigate(ROUTES.ADMIN.ANNOUNCEMENTS.CREATE)
      }
    },

    // --- Error / Not Found ---
    toNotFound: () => navigate(ROUTES.NOT_FOUND),
  }
}
