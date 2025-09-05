"use client"
import { useRouter } from "next/navigation"
import { useQuizStore } from "../hooks/useQuizbuilder"

interface Props {
  questionId: number
}

export default function DeleteQuestionModal({ questionId }: Props) {
  const router = useRouter()
  const { deleteQuestion } = useQuizStore()

  const handleDelete = () => {
    deleteQuestion(questionId)
    router.back()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-medium mb-4">Delete this question now</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this question? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
