import { loginPost } from "@/core/auth/api/apiClient";
import { ENDPOINTS } from "@/core/auth/api/endpoints";
import { IUserState } from "@/shared/types/IUserState";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, logout } from "@/store/slices/userSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);


  const signIn = async (
    data: { admin_id: string; password: string },
    isRememberMe: boolean
  ) => {
    try {
      // Call API to login, expect response to include user and token
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = (await loginPost(ENDPOINTS.AUTH.LOGIN, data)) as any;
      console.log("Login response:", response);

      if (response?.data?.resultData) {
      
        const payload: IUserState = {
          id: String(response?.data?.resultData?.id ?? "") || null,
          admin_id: String(response?.data?.resultData.admin_id ?? "") || null,
          admin_role:
            String(response?.data?.resultData.admin_role ?? "") || null,
          isAuthenticated: true,
        };
        
        dispatch(login(payload));
         
        // Save user data if remember me is checked
        if (isRememberMe) {
            // Save token if present
            localStorage.setItem("user", JSON.stringify(payload));

            const token = response?.headers["access-token"];
            if (token) {
                localStorage.setItem("token", token);
                sessionStorage.setItem("token", token);
              }
            }
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signOut = () => {
    // Storage'dan token va user ma'lumotlarini o'chirish
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    dispatch(logout());
  };

  return {
    ...user,
    isAuth: user.isAuthenticated,
    signIn,
    signOut,
  };
};
