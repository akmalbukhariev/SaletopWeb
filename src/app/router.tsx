import AuthGuard from "@/core/auth/authGuard"
import { ROUTES } from "@/shared/constants/routes"
import { Box, CircularProgress } from "@mui/material"
import React, { Suspense } from "react"
import { createBrowserRouter, RouterProvider } from "react-router"

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
)

const MainLayout = React.lazy(() => import("@app/layouts/MainLayout")) 
const AuthLayout = React.lazy(() => import("@app/layouts/AuthLayout")) 

const AdminPage = React.lazy(() => import("@/pages/admin/AdminPage")) 
const DashboardPage = React.lazy(() => import("@/pages/dashboard/MainPage")) 
const UserPage = React.lazy(() => import("@/pages/user/UserPage")) 
const CompanyPage = React.lazy(() => import("@/pages/company/CompanyPage")) 

const ModerationPage = React.lazy(
  () => import("@/pages/moderation/ModerationPage")
) 

const NotificationPage = React.lazy(
  () => import("@/pages/notification/NotificationPage")
) 

const LoginPage = React.lazy(() => import("@/pages/auth/pages/LoginPage")) 

const RegisterPage = React.lazy(
  () => import("@/pages/auth/pages/RegisterPage")
) 

const NotificationSend = React.lazy(
  () => import("@/pages/notification/components/NotificationSend"))

const AnnouncementPage = React.lazy(() => import("@/pages/announcement/AnnouncementPage"))
const CreateAnnouncementPage = React.lazy(
  () => import("@/pages/announcement/CreateAnnouncementPage")
)


const NotFound = React.lazy(() => import("@/pages/NotFound")) 

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: ROUTES.ADMIN.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.ADMIN.ADMINS,
        element: <AdminPage />,
      },
      {
        path: ROUTES.ADMIN.USERS,
        element: <UserPage />,
      },
      {
        path: ROUTES.ADMIN.COMPANIES,
        element: <CompanyPage />,
      },
      {
        path: ROUTES.ADMIN.MODERATION,
        element: <ModerationPage />,
      },
      {
        path: ROUTES.ADMIN.NOTIFICATIONS.HOME,
        element: <NotificationPage />,
      },
      {
        path: ROUTES.ADMIN.NOTIFICATIONS.SEND,
        element: <NotificationSend />,
      },
      {
        path: ROUTES.ADMIN.ANNOUNCEMENTS.HOME,
        element: <AnnouncementPage />,
      },
      {
        path: ROUTES.ADMIN.ANNOUNCEMENTS.CREATE,
        element: <CreateAnnouncementPage />,
      },
      {
        path: ROUTES.ADMIN.SETTINGS,
        element: <Box />,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.AUTH.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFound />,
  },
], 
{
  basename: "/admin-page/",
}) 

function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default Router 
