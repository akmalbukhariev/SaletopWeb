import { ENDPOINTS } from "@/core/auth/api/endpoints";
import usefetchBaseQueryWithAuth from "@/shared/hooks/usefetchBaseQueryWithAuth";
import { createApi } from "@reduxjs/toolkit/query/react";

const companyAPI = createApi({
  reducerPath: "companyAPI",
  baseQuery: usefetchBaseQueryWithAuth,
  tagTypes: ["CompanyItems"],
  endpoints: builder => ({
    getAllCompanies: builder.query({
      query: (data: { offset: number; pageSize: number }) => ({
        url: ENDPOINTS.COMPANIES.PAGINATED_LIST,
        method: "POST",
        body: data,
      }),
      providesTags: ["CompanyItems"],
    }),

    getCompanyByPhoneNum: builder.query({
      query: (phone_number: string | number) => ({
        url: ENDPOINTS.COMPANIES.BY_PHONE_NUM(phone_number),
        method: "GET",
      }),
      providesTags: ["CompanyItems"],
    }),

    changeCompanyDeletionStatus: builder.mutation({
      query: (data: { deleted: boolean; phone_number: string }) => ({
        url: ENDPOINTS.COMPANIES.CHANGE_DELETION_STATUS,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CompanyItems"],
    }),

    changeCompanyStatus: builder.mutation({
      query: (data: { phone_number: string; status: string }) => ({
        url: ENDPOINTS.COMPANIES.CHANGE_STATUS,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["CompanyItems"],
    }),
  }),
});

export default companyAPI;

export const {
  useGetAllCompaniesQuery,
  useGetCompanyByPhoneNumQuery,
  useChangeCompanyDeletionStatusMutation,
  useChangeCompanyStatusMutation,
} = companyAPI;
