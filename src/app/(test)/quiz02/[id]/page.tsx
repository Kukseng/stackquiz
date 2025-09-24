"use client";

import { useGetQuizByIdQuery } from "@/lib/api/quizApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export default function QuizPage({ params }: { params: { id: string } }) {
  const { data: quiz, error, isLoading, isError } = useGetQuizByIdQuery(params.id);

  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (isError) {
    let message = "Something went wrong.";

    if (error && "status" in error) {
      const err = error as FetchBaseQueryError;
      if (err.status === 404) message = "Quiz not found.";
      else if (err.status === 500) message = "Server error. Try again later.";
    }

    return <p className="text-center mt-10 text-red-500">⚠️ {message}</p>;
  }

  if (!quiz) return <p className="text-center mt-10 text-gray-500">No quiz found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md mt-10">
      {/* Thumbnail */}
      {quiz.thumbnailUrl && (
        <img
          src={quiz.thumbnailUrl}
          alt={quiz.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{quiz.title}</h1>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-6">{quiz.description}</p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded-full">
          {quiz.visibility}
        </span>
        <span className="px-3 py-1 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100 rounded-full">
          {quiz.difficulty}
        </span>
        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
          Created: {new Date(quiz.createdAt).toLocaleDateString()}
        </span>
        <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
          Updated: {new Date(quiz.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {/* Quiz ID */}
      <p className="text-xs text-gray-400 dark:text-gray-500">Quiz ID: {quiz.id}</p>
    </div>
  );
}
