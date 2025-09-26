import { ENDPOINTS } from "@/core/auth/api/endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://95.182.118.233:8088/ecoplatesadmin/api/v1",
  }),
    tagTypes: ["AuthItems"],
    endpoints: builder => ({
        login: builder.mutation({
            query: (data: { admin_id: string; password: string }) => ({
                url: ENDPOINTS.AUTH.LOGIN, 
                method: "POST",
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data: { admin_id: string; admin_role: 'SUPER_ADMIN' | 'ADMIN'; password: string }) => ({
                url: ENDPOINTS.AUTH.REGISTER,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export default authAPI;

export const {
    useLoginMutation,
    useRegisterMutation,
} = authAPI;

