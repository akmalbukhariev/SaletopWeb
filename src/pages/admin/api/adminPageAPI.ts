import { ENDPOINTS } from "@/core/auth/api/endpoints" 
import usefetchBaseQueryWithAuth from "@/shared/hooks/usefetchBaseQueryWithAuth" 
import { createApi } from "@reduxjs/toolkit/query/react" 

const adminPageAPI = createApi({
  reducerPath: "adminAPI",
  baseQuery: usefetchBaseQueryWithAuth,
  tagTypes: ["AdminItems"],
  endpoints: (builder) => ({
    getAllAdmin: builder.query({
      query: () => ({
        url: ENDPOINTS.ADMIN.ADMINS,
        method: "GET",
      }),
      providesTags: ["AdminItems"],
    }),
    getAdminById: builder.query({
      query: (adminId) => ({
        url: ENDPOINTS.ADMIN.ADMIN_BY_ID(adminId),
        method: "GET",
      }),
      providesTags: ["AdminItems"],
    }),
    deleteAdminById: builder.mutation({
      query: (adminId) => ({
        url: ENDPOINTS.ADMIN.DELETE_BY_ID(adminId),
        method: "DELETE",
      }),
      invalidatesTags: ["AdminItems"],
    })
  }),
}) 

export const {
  useGetAllAdminQuery,
  useGetAdminByIdQuery,
  useDeleteAdminByIdMutation,
} = adminPageAPI 


export default adminPageAPI 
