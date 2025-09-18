// src/lib/api/categoryApi.ts
import { baseApi } from "./baseApi";

export interface Category { id: string; name: string; description: string; }
export interface CategoryRequest { name: string; description?: string; }

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Category"],
    }),
    createCategoriesBatch: builder.mutation<Category[], CategoryRequest[]>({
      query: (body) => ({ url: "/categories/batch", method: "POST", body }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useCreateCategoriesBatchMutation,
} = categoryApi;
