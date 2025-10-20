
import { baseApi } from "./baseApi";
import { CategoryRequest, CategoryResponse } from "./types/common";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getCategories: b.query<CategoryResponse[], void>({
      query: () => "categories",
      providesTags: (res) =>
        res
          ? [
              ...res.map((c) => ({ type: "Category" as const, id: c.id })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),
    createCategory: b.mutation<CategoryResponse, CategoryRequest>({
      query: (body) => ({ url: "categories", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    createCategoriesBatch: b.mutation<CategoryResponse[], CategoryRequest[]>({
      query: (body) => ({ url: "categories/batch", method: "POST", body }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
  }),
});
export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useCreateCategoriesBatchMutation,
} = categoryApi;
