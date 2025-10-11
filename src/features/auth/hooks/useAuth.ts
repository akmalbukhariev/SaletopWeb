import { IUserState } from "@/shared/types/IUserState" 
import { useAppDispatch, useAppSelector } from "@/store/hooks" 
import { login, logout } from "@/store/slices/userSlice" 
import { useLoginUserMutation } from "@/features/auth/api/authAPI" 
import { ROUTES } from "@/shared/constants/routes"
import { useEffect } from "react"



export const useAuth = () => {
  const dispatch = useAppDispatch() 
  const user = useAppSelector(state => state.user) 
  const [loginUser] = useLoginUserMutation() 
  const APP_PREFIX = import.meta.env.VITE_APP_NAME || "default"
  const TOKEN_KEY = `${APP_PREFIX}_token`

  const signIn = async (
    data: { admin_id: string, password: string },
    isRememberMe: boolean
  ) => {
    try {
      // Call API to login, expect response to include user and token
      const response = (await loginUser(data)) 

      if (response?.data?.resultData) {
        const payload: IUserState = {
          id: String(response?.data?.resultData?.id ?? "") || null,
          admin_id: String(response?.data?.resultData.admin_id ?? "") || null,
          admin_role:
            String(response?.data?.resultData.admin_role ?? "") || null,
          isAuthenticated: true,
        } 

        dispatch(login(payload)) 
        
        const token = response?.data.accessToken 
        if (token) {
          localStorage.setItem(TOKEN_KEY, token) 
        }
        // }
      }

      return response 
    } catch (error) {
      console.error("Login error:", error) 
      throw error 
    }
  } 

  const signOut = () => {
    // Storage'dan token va user ma'lumotlarini o'chirish
    dispatch(logout()) 
    window.location.href = "/admin-page" + ROUTES.AUTH.LOGIN 
  } 

  return {
    ...user,
    isAuth: user.isAuthenticated,
    signIn,
    signOut,
  } 
} 
