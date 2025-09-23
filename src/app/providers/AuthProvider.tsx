import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { autoLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Auto login qilish - token server bilan tekshiriladi
        const isLoggedIn = await autoLogin();
        
        if (!isLoggedIn) {
          // Agar auto login ishlamasa, localStorage'dan user ma'lumotlarini olish
          const user = localStorage.getItem("user");
          if (user) {
            const userData = JSON.parse(user);
            // Token yo'q bo'lsa ham, user ma'lumotlarini ko'rsatish (lekin authenticated emas)
            dispatch(login({ ...userData, isAuthenticated: false }));
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch, autoLogin]);

  // Loading holatida spinner ko'rsatish
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthProvider;
