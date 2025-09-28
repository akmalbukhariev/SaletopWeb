import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query" 
import { RESULTCODE } from "../utils/ResultCode" 
import { ROUTES } from "../constants/routes" 

export const rowBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_API_URL,
  prepareHeaders: (headers: Headers) => {   
    const token = localStorage.getItem("token") 
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
  if (result.data && typeof result.data === "object") {
    const code = (result.data as {resultCode: number, code: number}).resultCode 
    switch(Number(code)) {
      case RESULTCODE.TOKEN_INVALID:
        localStorage.removeItem("token") 
        localStorage.removeItem("user") 
        window.location.href = ROUTES.AUTH.LOGIN 
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
        localStorage.removeItem("token") 
        localStorage.removeItem("user") 
        window.location.href = ROUTES.AUTH.LOGIN 
        // Handle AUTHENTICATION_ERROR case
        break 
      case RESULTCODE.INTERNAL_ERROR:
        // Handle INTERNAL_ERROR case
        break 
      case RESULTCODE.SERVER_ERROR:
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

      localStorage.removeItem("token") 
      localStorage.removeItem("user") 

      // Agar Redux’da authSlice bo‘lsa:
      // api.dispatch(logout()) 

      // Sahifani login page’ga yuborish
      window.location.href = ROUTES.AUTH.LOGIN 
    }
  }

  return result 
}

export default usefetchBaseQueryWithAuth 
