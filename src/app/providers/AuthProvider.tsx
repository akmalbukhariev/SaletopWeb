import { ROUTES } from "@/shared/constants/routes"
import { useAppDispatch } from "@/store/hooks" 
import { login, logout } from "@/store/slices/userSlice" 
import React, { useEffect, useState } from "react" 

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch() 
  const [isLoading, setIsLoading] = useState(true) 

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const APP_PREFIX = import.meta.env.VITE_APP_NAME || "default"
        const TOKEN_KEY = `${APP_PREFIX}_token`
        const USER_KEY = `${APP_PREFIX}_user`
  
        const user = localStorage.getItem(USER_KEY) 
        const token = localStorage.getItem(TOKEN_KEY) 

        if (user && token) {
          const userData = JSON.parse(user) 
          // Token yo'q bo'lsa ham, user ma'lumotlarini ko'rsatish (lekin authenticated emas)
          dispatch(login({ ...userData, isAuthenticated: true })) 
        } else {
          dispatch(logout()) 
        }
      } catch (error) {
        console.error("Auth initialization error:", error) 
      } finally {
        setIsLoading(false) 
      }
    } 

    initializeAuth() 
  }, []) 

  // Loading holatida spinner ko'rsatish
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    ) 
  }

  return <>{children}</> 
}

export default AuthProvider 
