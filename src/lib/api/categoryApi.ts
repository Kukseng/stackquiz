import { baseApi } from "./baseApi";

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryRequest {
  name: string;
  description?: string;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/categories - Get all categories
    getCategories: builder.query<Category[], void>({
      query: () => `/categories`,
      providesTags: ["Category"],
    }),

    // POST /api/v1/categories - Create category
    createCategory: builder.mutation<Category, CategoryRequest>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),

    // POST /api/v1/categories/batch - Create categories in batch
    createCategoriesBatch: builder.mutation<Category[], CategoryRequest[]>({
      query: (body) => ({
        url: "/categories/batch",
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