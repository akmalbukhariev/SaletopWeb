import { ENDPOINTS } from "@/core/auth/api/endpoints"
import usefetchBaseQueryWithAuth from "@/shared/hooks/usefetchBaseQueryWithAuth"
import { createApi } from "@reduxjs/toolkit/query/react"
import { DeleteAnnouncementType, RegisterAnnouncementType } from "../types/RequestTypes"
import { GetAnnouncementType } from "../types/RequestTypes"

const announcementAPI = createApi({
  reducerPath: "announcementAPI",
  baseQuery: usefetchBaseQueryWithAuth,
  tagTypes: ["Announcements"],
  endpoints: (builder) => ({
    createAnnouncement: builder.mutation({
      query: (
        data: RegisterAnnouncementType
      ) => ({
        url: ENDPOINTS.ANNOUNCEMENTS.CREATE_ANNOUNCEMENT,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      }),
      invalidatesTags: ["Announcements"],
    }),
    getAnnouncementsByActor: builder.mutation({
      query: (data: GetAnnouncementType) => ({
        url: ENDPOINTS.ANNOUNCEMENTS.GET_ANNOUNCEMENTS_BY_ACTOR,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      }),
      invalidatesTags: ["Announcements"],
    }),
    getAllAnnouncements: builder.mutation({
      query: (data: { pageSize: number, offset: number }) => ({
        url: ENDPOINTS.ANNOUNCEMENTS.GET_ALL_ANNOUNCEMENTS,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: data
      }),
      invalidatesTags: ["Announcements"],
    }),
    deleteAnnouncement: builder.mutation({
      query: (data: DeleteAnnouncementType) => ({
        url: ENDPOINTS.ANNOUNCEMENTS.DELETE_ANNOUNCEMENT_BY_IDLIST,
        method: "DELETE",
        body: data
      }),
      invalidatesTags: ["Announcements"],
    }),
  }),
})

export const { 
  useCreateAnnouncementMutation, 
  useGetAnnouncementsByActorMutation,
  useGetAllAnnouncementsMutation,
  useDeleteAnnouncementMutation
} = announcementAPI

export default announcementAPI