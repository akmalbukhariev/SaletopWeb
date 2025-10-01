import { ENDPOINTS } from "@/core/auth/api/endpoints" 
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react" 

const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_API_URL as string,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token") 
      if (token) {
        headers.set("Authorization", "Bearer " + token) 
      }
      return headers 
    },
  }),
  tagTypes: ["AuthItems"],
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: (data: { admin_id: string, password: string }) => ({
        url: ENDPOINTS.AUTH.LOGIN, 
        method: "POST",
        body: data,
      }),
      transformResponse: (response, meta) => {
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
        body: data,
      }),
    }),
  }),
}) 

export const { useLoginUserMutation, useRegisterUserMutation } = authAPI 

export default authAPI 