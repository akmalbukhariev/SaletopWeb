import React from "react"
import { ROUTES } from "./routes"
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded" 
import HomeRoundedIcon from "@mui/icons-material/HomeRounded" 
import StoreRoundedIcon from "@mui/icons-material/StoreRounded" 
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded" 
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded" 
import TuneRoundedIcon from "@mui/icons-material/TuneRounded" 
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings" 
import { useTranslation } from "react-i18next"


export const useSideBarList = () => {
  
  const { t } = useTranslation("sidebar")
  
  console.log("t", t)
  return [
    {
      id: 1,
      name: t('Dashboard'),
      path: ROUTES.HOME || ROUTES.ADMIN.DASHBOARD,
      selected: false,
      icon: HomeRoundedIcon,
    },
    {
      id: 2,
      name: t("Admins"),
      path: ROUTES.ADMIN.ADMINS,
      selected: false,
      icon: AdminPanelSettingsIcon,
    },
    {
      id: 3,
      name: t("Users"),
      path: ROUTES.ADMIN.USERS,
      selected: false,
      icon: PeopleRoundedIcon,
    },
    {
      id: 4,
      name: t("Companies"),
      path: ROUTES.ADMIN.COMPANIES,
      selected: false,
      icon: StoreRoundedIcon,
    },
    {
      id: 5,
      name: t("Moderation"),
      path: ROUTES.ADMIN.MODERATION,
      selected: false,
      icon: VerifiedUserRoundedIcon,
    },
    {
      id: 6,
      name: t("Notifications"),
      path: ROUTES.ADMIN.NOTIFICATIONS.HOME,
      selected: false,
      icon: NotificationsRoundedIcon,
    },
    // {
    //   id: 7,
    //   name: "Settings",
    //   path: ROUTES.ADMIN.SETTINGS,
    //   selected: false,
    //   icon: TuneRoundedIcon,
    // },
  ] 
}

