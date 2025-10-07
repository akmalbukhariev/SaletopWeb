import { ENDPOINTS } from "@/core/auth/api/endpoints"
import usefetchBaseQueryWithAuth from "@/shared/hooks/usefetchBaseQueryWithAuth"
import { createApi } from "@reduxjs/toolkit/query/react"

const notifyAPI = createApi({
  reducerPath: "notifyAPI",
  baseQuery: usefetchBaseQueryWithAuth,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: (data: {offset: number, pageSize: number}) => ({
        url: ENDPOINTS.NOTIFICATIONS.PAGINATED_LIST,
        method: "POST",
        body: data
      }),
      providesTags: ["Notifications"],
    }),       
    sendNotificationToUser: builder.mutation({
      query: (data: { title: string, message: string, phone_number: string, company: boolean }) => ({
        url: ENDPOINTS.NOTIFICATIONS.SEND_TO_USER,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),
    sendNotificationToAll: builder.mutation({
      query: (data: { title: string, message: string }) => ({
        url: ENDPOINTS.NOTIFICATIONS.SEND_TO_ALL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    })
  })
}) 

export const {
  useGetAllNotificationsQuery,
  useSendNotificationToUserMutation,
  useSendNotificationToAllMutation
} = notifyAPI   

export default notifyAPI 
