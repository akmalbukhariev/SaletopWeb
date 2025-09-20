import { IUserState } from "@/shared/types/IUserState";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, logout } from "@/store/slices/userSlice";
import { post } from "@/core/auth/api/apiClient";
import { ENDPOINTS } from "@/core/auth/api/endpoints";

export  const useAuth = ()=> {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.user);

    const signIn = async (data: { admin_id: string; password: string }, isRememberMe: boolean) => {
        try {
            // Call API to login, expect response to include user and token
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await post(ENDPOINTS.AUTH.LOGIN, data) as any
            console.log('Login response:', response)
            
            if(response?.data?.resultData){
                // Save token if present
                const token = response?.headers["access-token"];
                if (token) {
                    if (isRememberMe) {
                        localStorage.setItem("token", token)
                    } else {
                        sessionStorage.setItem("token", token)
                    }
                }
                
                // Map API response to IUserState; adjust keys as per backend
                const payload: IUserState = {
                    id: String(response?.data?.resultData?.id ?? '' ) || null,
                    admin_id: String(response?.data?.resultData.admin_id ?? '' ) || null,
                    admin_role: String(response?.data?.resultData.admin_role ??  '' ) || null,
                    isAuthenticated: true,
                }

                // Save user data if remember me is checked
                if (isRememberMe) {
                    localStorage.setItem('user', JSON.stringify(payload))
                }

                dispatch(login(payload))
            }
        
            return response?.data
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const signOut = () => {
        dispatch(logout())
    }
  return {
    ...user,
    isAuth: user.isAuthenticated,
    signIn,
    signOut
  }
}