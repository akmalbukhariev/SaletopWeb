import { createBrowserRouter, RouterProvider } from "react-router"
import React from "react"

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
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: 'admin/dashboard',
        Component: DashboardPage
      },
      {
        path: 'admin/admins',
        Component: AdminPage
      },
      {
        path: 'admin/users',
        Component: UserPage
      },
      {
        path: 'admin/companies',
        Component: CompanyPage
      },
      {
        path: 'admin/moderation',
        Component: ModerationPage
      },
      {
        path: 'admin/notifications',
        Component: NotificationPage
      },
      {
        path: 'admin/settings',
      }
    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])  

function Router() {
  return (
    <RouterProvider router={router} />
  )
}

export default Router