import { createBrowserRouter, RouterProvider } from "react-router"
import React from "react"
import { ROUTES } from "@/shared/constants/routes"
import { Box } from "@mui/material"
import AuthGuard from "@/core/auth/AuthGuard"

const MainLayout =  React.lazy(() => import("@app/layouts/MainLayout"))
const AuthLayout = React.lazy(() => import("@app/layouts/AuthLayout"))

const AdminPage  = React.lazy(() => import("@features/admin/AdminPage"))  
const DashboardPage = React.lazy(() => import("@features/dashboard/MainPage"))
const UserPage = React.lazy(() => import("@features/user/UserPage"))  
const CompanyPage = React.lazy(() => import("@features/company/CompanyPage"))
const ModerationPage = React.lazy(() => import("@features/moderation/ModerationPage"))
const NotificationPage = React.lazy(() => import("@features/notification/NotificationPage"))
const LoginPage = React.lazy(()=>  import("@/features/auth/pages/LoginPage"))
const RegisterPage = React.lazy(() => import("@/features/auth/pages/RegisterPage"))

const NotFound = React.lazy(() => import("@/pages/NotFound"))

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: 
        <AuthGuard>
          <MainLayout/>
        </AuthGuard>,
    children: [
      {
        path: ROUTES.ADMIN.DASHBOARD,
        element:
          <AuthGuard> 
            <DashboardPage/>
          </AuthGuard>
      },
      {
        path: ROUTES.ADMIN.ADMINS,
        element:  
            <AuthGuard> 
              <AdminPage/> 
            </AuthGuard> 
      },
      {
        path: ROUTES.ADMIN.USERS,
        element:
          <AuthGuard>
            <UserPage/>
          </AuthGuard>
      },
      {
        path: ROUTES.ADMIN.COMPANIES,
        element:
          <AuthGuard>
            <CompanyPage/>
          </AuthGuard>
      },
      {
        path: ROUTES.ADMIN.MODERATION,
        element:
          <AuthGuard>
            <ModerationPage/>
          </AuthGuard>
      },
      {
        path: ROUTES.ADMIN.NOTIFICATIONS,
        element:
          <AuthGuard>
            <NotificationPage/>
          </AuthGuard>
      },
      {
        path:  ROUTES.ADMIN.SETTINGS,
        element:
          <AuthGuard>
            {/* TODO: Add Settings page component when available */} 
            <Box />
          </AuthGuard>
      }
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        element: <LoginPage />
      },
      {
        path: ROUTES.AUTH.REGISTER,
        element: 
          <AuthGuard>
            <RegisterPage />
          </AuthGuard>
      },
    ]
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFound />
  }
])  


function Router() {
  return (
    <RouterProvider router={router} />
  )
}

export default Router