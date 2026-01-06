import { useAuth } from "@/pages/auth/hooks/useAuth" 
import { ReactNode, useEffect } from "react"

interface AuthGuardProps {
  children: ReactNode 
}

function AuthGuard({ children }: AuthGuardProps) {

  const { isAuth, signOut } = useAuth() 
   
  const APP_PREFIX = import.meta.env.VITE_APP_NAME || "default"
  const TOKEN_KEY = `${APP_PREFIX}_token`

  const token = localStorage.getItem(TOKEN_KEY) 

  if (!token || !isAuth) {
    signOut()
  }

  return <>{children}</> 
}

export default AuthGuard 
