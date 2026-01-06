import { ENDPOINTS } from "@/core/auth/api/endpoints"
import usefetchBaseQueryWithAuth from "@/shared/hooks/usefetchBaseQueryWithAuth"
import { createApi } from "@reduxjs/toolkit/query/react"


const dashboardAPI = createApi({
  reducerPath: "dashboardAPI",
  baseQuery: usefetchBaseQueryWithAuth,
  tagTypes: ["DashboardData"],
  endpoints: builder => ({
    getCompanyStatistics: builder.query({
      query: () => ({
        url: ENDPOINTS.DASHBOARD.COMPANY_STATISTICS,
        method: "GET",
      }),
      providesTags: ["DashboardData"],
    }), 
    getUserStatistics: builder.query({
      query: () => ({
        url: ENDPOINTS.DASHBOARD.USER_STATISTICS,
        method: "GET",
      }),
      providesTags: ["DashboardData"],
    }),
    getSystemStatus: builder.query({
      query: () => ({
        url: ENDPOINTS.DASHBOARD.SYSTEM_STATUS, 
        method: "GET",
      }),
      providesTags: ["DashboardData"],
    }),
  }),
})    

export const {
  useGetCompanyStatisticsQuery,
  useGetUserStatisticsQuery,
  useGetSystemStatusQuery,
} = dashboardAPI

export default dashboardAPI