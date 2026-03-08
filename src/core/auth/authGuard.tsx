import { useAuth } from "@/pages/auth/hooks/useAuth"
import { ROUTES } from "@/shared/constants/routes"
import { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"

interface AuthGuardProps {
  children: ReactNode 
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isAuth } = useAuth() 
  const location = useLocation()
   
  const APP_PREFIX = import.meta.env.VITE_APP_NAME || "default"
  const TOKEN_KEY = `${APP_PREFIX}_token`

  const token = localStorage.getItem(TOKEN_KEY) 

  if (!token || !isAuth) {
    // Use Navigate for proper React Router redirect (respects basename)
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</> 
}

export default AuthGuard 
