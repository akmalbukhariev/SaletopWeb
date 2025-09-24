import { ENDPOINTS } from '@/core/auth/api/endpoints';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userAPI =  createApi({
    reducerPath: 'userAPI',
    baseQuery: fetchBaseQuery({
      baseUrl: "http://95.182.118.233:8088/ecoplatesadmin/api/v1",
      prepareHeaders: (headers: Headers) => {
        const token = localStorage.getItem("token");
        if (token) {
          headers.set("Authorization", "Bearer " + token);
        }
        return headers;
      }
    }),
    tagTypes: ['UserItems'],
    endpoints: (builder) => ({
          getAllUsers: builder.query({
              query: (data: { offset: number; pageSize: number }) => ({
                url: ENDPOINTS.USERS.PAGINATED_LIST,
                method: 'POST',
                body: data
              }),
              providesTags: ['UserItems']
            }),

          getUserByPhoneNum: builder.query({
            query: (phone_number: string | number) => ({
              url: ENDPOINTS.USERS.BY_PHONE_NUM(phone_number),
              method: 'GET',
            }),
            providesTags: ['UserItems'],
          }),

          changeUserDeletionStatus: builder.mutation({
            query: (data: { deleted: boolean; phone_number: string }) => ({
              url: ENDPOINTS.USERS.CHANGE_DELETION_STATUS,
              method: 'PUT',
              body: data,
            }),
            invalidatesTags: ['UserItems'],
          }),

          changeUserStatus: builder.mutation({
            query: (data: { phone_number: string; status: string }) => ({
              url: ENDPOINTS.USERS.CHANGE_STATUS,
              method: 'PUT',
              body: data,
            }),
            invalidatesTags: ['UserItems'],
          }),
})});

export default userAPI;

export const {
  useGetAllUsersQuery,
  useGetUserByPhoneNumQuery,
  useChangeUserDeletionStatusMutation,
  useChangeUserStatusMutation,
} = userAPI;

 

