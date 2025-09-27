import { ENDPOINTS } from "@/core/auth/api/endpoints";
import usefetchBaseQueryWithAuth  from "@/shared/hooks/usefetchBaseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";

const notifyAPI = createApi({
  reducerPath: "notifyAPI",
  baseQuery: usefetchBaseQueryWithAuth,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
     getAllNotifications: builder.query({
        query: () => ({
            url: ENDPOINTS.NOTIFICATIONS.PAGINATED_LIST,
            method: "GET",
        }),
        providesTags: ["Notifications"],
    }),       
    registerNotification: builder.mutation({
        query: (data: { title: string; message: string; user_id: number | string }) => ({
            url: ENDPOINTS.NOTIFICATIONS.SEND,
            method: "POST",
            body: data,
        }),
        invalidatesTags: ["Notifications"],
    }), 
  })
});

export const {
    useGetAllNotificationsQuery,
    useRegisterNotificationMutation,
} = notifyAPI;  

export default notifyAPI;