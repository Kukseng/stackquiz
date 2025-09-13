
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseApi } from "./baseApi";
export interface Option {
  id: string;
  optionText: string;
  optionOrder: number;
  createdAt: string;
  isCorrected: boolean;
}

export interface CreateOptionRequest {
  optionText: string;
  optionOrder: number;
  isCorrected: boolean;
  questionId: string;
}

export interface UpdateOptionRequest {
  optionText?: string;
  optionOrder?: number;
  isCorrected?: boolean;
}

export const optionApi =  baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all 
    getOptions: builder.query<Option[], void>({
      query: () => `/options`,
      providesTags: ["Option"],
    }),

    //Get options 
    getOptionsByQuestion: builder.query<Option[], string>({
      query: (questionId) => `/options/questions/${questionId}/public`,
      providesTags: (result, error, questionId) => [{ type: "Option", id: questionId }],
    }),

    //Add options
    addOptionsToQuestion: builder.mutation<Option[], { questionId: string; data: CreateOptionRequest[] }>({
      query: ({ questionId, data }) => ({
        url: `/options/questions/${questionId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Option"],
    }),

    //Update an option
    updateOption: builder.mutation<Option, { optionId: string; data: UpdateOptionRequest }>({
      query: ({ optionId, data }) => ({
        url: `/options/${optionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { optionId }) => [{ type: "Option", id: optionId }],
    }),

    //Delete an option
    deleteOption: builder.mutation<void, string>({
      query: (optionId) => ({
        url: `/options/${optionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, optionId) => [{ type: "Option", id: optionId }],
    }),
  }),
});

export const {
  useGetOptionsQuery,
  useGetOptionsByQuestionQuery,
  useAddOptionsToQuestionMutation,
  useUpdateOptionMutation,
  useDeleteOptionMutation,
} = optionApi;
