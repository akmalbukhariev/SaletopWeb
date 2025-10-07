import { useAuth } from "@/features/auth/hooks/useAuth" 
import { ROUTES } from "@/shared/constants/routes" 
import { ReactNode } from "react"

interface AuthGuardProps {
  children: ReactNode 
}

function AuthGuard({ children }: AuthGuardProps) {
  const { isAuth } = useAuth() 
  if (!isAuth) {
    window.location.href = '/admin-page' + ROUTES.AUTH.LOGIN 
  }

  return <>{children}</> 
}

export default AuthGuard 
