
"use client"
import { useRouter } from "next/navigation"
import { useQuizStore } from "../hooks/useQuizbuilder"

export function QuestionTypeModal() {
  const router = useRouter()
  const { addQuestion } = useQuizStore()

  const questionTypes = [
    { id: "multiple", label: "Multiple choice", icon: "○" },
    { id: "truefalse", label: "True/false", icon: "✓" },
    { id: "fillblank", label: "Fill the blank", icon: "___" },
  ]

  const handleAddQuestion = (type: string) => {
    addQuestion(type)
    router.back()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h3 className="text-lg font-medium mb-4">Type of quiz</h3>
        <div className="space-y-3">
          {questionTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleAddQuestion(type.id)}
              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <span className="mr-3 text-lg">{type.icon}</span>
              <span>{type.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
