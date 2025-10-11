import { ENDPOINTS } from "@/core/auth/api/endpoints" 
import usefetchBaseQueryWithAuth from "@/shared/hooks/usefetchBaseQueryWithAuth"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react" 

const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: usefetchBaseQueryWithAuth,
  tagTypes: ["AuthItems"],
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: (data: { admin_id: string, password: string }) => ({
        url: ENDPOINTS.AUTH.LOGIN, 
        method: "POST",
        contenType: "application/json",
        body: data,
      }),
      transformResponse: (response, meta: any) => {
        const accessToken = meta?.response?.headers.get("access-token") 
        if(accessToken){
          response.accessToken = accessToken 
        }
        return response 
      }
    }),
    registerUser: builder.mutation({
      query: (data: { admin_id: string, admin_role: string, password: string }) => ({
        url: ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        contenType: "application/json",
        body: data,
      }),
    }),
  }),
}) 

export const { useLoginUserMutation, useRegisterUserMutation } = authAPI 

export default authAPI 