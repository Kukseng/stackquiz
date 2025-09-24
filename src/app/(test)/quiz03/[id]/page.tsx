"use client";

import { useGetQuizByIdQuery, useDeleteQuizMutation } from "@/lib/api/quizApi";
import { useRouter } from "next/navigation";

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: quiz, isLoading, isError, error } = useGetQuizByIdQuery(params.id);
  const [deleteQuiz, { isLoading: isDeleting }] = useDeleteQuizMutation();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteQuiz(params.id).unwrap();
      alert("Quiz deleted successfully!");
      router.push("/quizzes"); // Redirect to quizzes list after deletion
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz. Please try again.");
    }
  };

  if (isLoading)
    return <p className="text-center mt-10 text-gray-500">Loading quiz...</p>;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        {error && "status" in error && error.status === 404
          ? "Quiz not found."
          : "Error loading quiz."}
      </p>
    );

  if (!quiz)
    return <p className="text-center mt-10 text-gray-500">No quiz found.</p>;

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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {quiz.title}
      </h1>

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

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`mt-4 px-6 py-2 rounded font-semibold text-white ${
          isDeleting ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
        } transition-colors`}
      >
        {isDeleting ? "Deleting..." : "Delete Quiz"}
      </button>
    </div>
  );
}
