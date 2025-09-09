import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const sideBarList = [
  { 
    id: 1, 
    name: "Dashboard", 
    path: "/admin/dashboard", 
    selected: false, 
    icon: HomeRoundedIcon 
  },
   { 
    id: 2, 
    name: "Admins", 
    path: "/admin/admins", 
    selected: false, 
    icon: AdminPanelSettingsIcon
  },
  { 
    id: 3, 
    name: "Users", 
    path: "/admin/users", 
    selected: false, 
    icon: PeopleRoundedIcon
  },
  { 
    id: 4, 
    name: "Companies", 
    path: "/admin/companies", 
    selected: false, 
    icon: StoreRoundedIcon 
  },
  { 
    id: 5, 
    name: "Moderation", 
    path: "/admin/moderation", 
    selected: false, 
    icon: VerifiedUserRoundedIcon 
  },
  { 
    id: 6, 
    name: "Notifications", 
    path: "/admin/notifications", 
    selected: false,
    icon: NotificationsRoundedIcon 
  },
  { 
    id: 7, 
    name: "Settings", 
    path: "/admin/settings", 
    selected: false, 
    icon: TuneRoundedIcon 
  },
];

export { sideBarList };