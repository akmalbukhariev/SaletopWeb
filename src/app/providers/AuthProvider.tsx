import { useAppDispatch } from "@/store/hooks" 
import { login, logout } from "@/store/slices/userSlice" 
import React, { useEffect, useState } from "react" 

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch() 
  const [isLoading, setIsLoading] = useState(true) 

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = localStorage.getItem("user") 
        const token = localStorage.getItem("token") 
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
  }, [dispatch]) 

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
