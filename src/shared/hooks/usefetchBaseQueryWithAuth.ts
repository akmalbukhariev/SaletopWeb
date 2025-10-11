import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { RESULTCODE } from "../utils/ResultCode"
import { logout } from "@/store/slices/userSlice"
import { ROUTES } from "../constants/routes"

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_API_URL_DEV
    : import.meta.env.VITE_BACKEND_API_URL_PROD

export const rowBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers: Headers) => {   
    const APP_PREFIX = import.meta.env.VITE_APP_NAME || "default"
    const TOKEN_KEY = `${APP_PREFIX}_token`
    const token = localStorage.getItem(TOKEN_KEY) 
    if (token) {    
      headers.set("Authorization", "Bearer " + token) 
    }
    return headers 
  },
}) 


export const usefetchBaseQueryWithAuth: BaseQueryFn<
string | FetchArgs,
unknown,
FetchBaseQueryError> = async (args, api, extraOptions) => {

  const result = await rowBaseQuery(args, api, extraOptions) 
  console.log("API Response:", result)

  if (result.data && typeof result.data === "object") {

    const code = (result.data as {resultCode: number, code: number}).resultCode 
    switch(Number(code)) {
      case RESULTCODE.TOKEN_INVALID:
        api.dispatch(logout())
        window.location.href = "/admin-page" + ROUTES.AUTH.LOGIN 
        console.error("Token invalid. Redirecting to login...", result.data)
        break 
      case RESULTCODE.LOGIN_DUPLICATE:
        // Handle LOGIN_DUPLICATE case
        break 
      case RESULTCODE.LOGIN_INACTIVE:
        // Handle LOGIN_INACTIVE case
        break 
      case RESULTCODE.LOGIN_BANNED:
        // Handle LOGIN_BANNED case
        break 
      case RESULTCODE.PASSWORD_IS_NOT_MATCHED:
        // Handle PASSWORD_IS_NOT_MATCHED case
        break 
      case RESULTCODE.VERIFY_PHONE_NUMBER_FAILED:
        // Handle VERIFY_PHONE_NUMBER_FAILED case
        break 
      case RESULTCODE.AUTHENTICATION_ERROR:
        api.dispatch(logout())
        window.location.href = "/admin-page" + ROUTES.AUTH.LOGIN 
        console.error("Authentication error. Redirecting to login...", result.data)
        // Handle AUTHENTICATION_ERROR case
        break 
      case RESULTCODE.INTERNAL_ERROR:
        // Handle INTERNAL_ERROR case
        break 
      case RESULTCODE.SERVER_ERROR:
        // signOut()
        console.error("Server error. Redirecting to login...", result.data)
        // Handle SERVER_ERROR case
        break 
      case RESULTCODE.TOKEN_EMPTY:
        // Handle TOKEN_EMPTY case
        break 
      case RESULTCODE.ROLE_INVALID:
        // Handle ROLE_INVALID case
        break 
      default:
        // Handle other cases
        break 
    }
  }

  if (result.error) {
    const status = result.error.status 

    if (status === 401 || status === 403) {
      // Token invalid
      console.error("Token expired or invalid. Redirecting to login...") 
      api.dispatch(logout())
      window.location.href = "/admin-page" + ROUTES.AUTH.LOGIN 
    }
  }

  return result 
}

export default usefetchBaseQueryWithAuth 
