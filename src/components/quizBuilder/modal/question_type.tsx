"use client"

import { FaCircle, FaCheck, FaRegSquare } from "react-icons/fa"

interface QuestionTypeModalProps {
  onClose: () => void
  addQuestion: (type: string) => void
}

export function QuestionTypeModal({ onClose, addQuestion }: QuestionTypeModalProps) {
  const questionTypes = [
    {
      id: "mcq",
      label: "Multiple choice",
      icon: <FaCircle className="w-6 h-6 text-blue-500" />,
      
    },
    {
      id: "tf",
      label: "True/false",
      icon: <FaCheck className="w-6 h-6 text-green-500" />,

    },
    {
      id: "fill_the_blank",
      label: "Fill the blank",
      icon: <FaRegSquare className="w-6 h-6 text-purple-500" />,
  
    },
  ]

  const handleAddQuestion = (type: string) => {
    addQuestion(type) // Add question
    onClose()         // Close modal
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 animate-fadeIn">
        <h3 className="text-xl font-semibold mb-5 text-center">Choose Question Type</h3>
        <div className="space-y-4">
          {questionTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleAddQuestion(type.id)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center mb-2">
                <span className="mr-3">{type.icon}</span>
                <span className="text-lg font-medium text-gray-900">{type.label}</span>
              </div>
              <p className="text-sm text-gray-600 ml-9">{type.description}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
