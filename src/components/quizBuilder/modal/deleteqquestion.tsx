"use client"

interface DeleteQuestionModalProps {
  questionId: number
  onClose: () => void
  onDelete: (id: number) => void
}

export default function DeleteQuestionModal({ questionId, onClose, onDelete }: DeleteQuestionModalProps) {
  const handleDelete = () => {
    onDelete(questionId) // <-- Remove question from state
    onClose()            // <-- Close modal
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-medium mb-4">Delete this question?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this question? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
