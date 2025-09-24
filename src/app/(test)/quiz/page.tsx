"use client";

import React from "react";
import { useGetAllQuizzesQuery } from "@/lib/api/quizApi";

function Page() {
  const { data: quizzes, error, isLoading } = useGetAllQuizzesQuery({ active: true });

  if (error) return <p className="text-red-500 text-center mt-10">Something went wrong!</p>;
  if (isLoading) return <p className="text-gray-500 text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Quizzes
      </h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes?.map((quiz) => (
          <li
            key={quiz.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow"
          >
            {/* Thumbnail */}
            {quiz.thumbnailUrl && (
              <img
                src={quiz.thumbnailUrl}
                alt={quiz.title}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {quiz.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{quiz.description}</p>

            {/* Details */}
            <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 rounded-full">
                {quiz.visibility}
              </span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100 rounded-full">
                {quiz.difficulty}
              </span>
              <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full">
                {new Date(quiz.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Quiz ID */}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-auto">ID: {quiz.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page;
