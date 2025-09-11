import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://stackquiz-api.stackquiz.me/api/v1" }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    //Get all 
    getCategories: builder.query<Category[], void>({
      query: () => `/categories`,
      // providesTags: ["Category"],
    }),

    //Create 
    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (body) => ({
        url: `/categories`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    //Create  (batch)
    createCategoriesBatch: builder.mutation<Category[], CategoryRequest[]>({
      query: (body) => ({
        url: `/categories/batch`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useCreateCategoriesBatchMutation,
} = categoryApi;
