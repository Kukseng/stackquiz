"use client"

interface Question {
  id: number
  type: string
  question: string
  options: unknown[]
}

interface QuizSidebarProps {
  questions: Question[]
  activeQuestionId: number | null
  onQuestionSelect: (id: number) => void
  onAddQuestion: () => void
}

export function QuizSidebar({ questions, activeQuestionId, onQuestionSelect, onAddQuestion }: QuizSidebarProps) {
  // Function to get number of bars based on question type
  const getBarCount = (type: string) => {
    switch (type) {
      case "multiple":
        return 4
      case "truefalse":
        return 2
      case "fillblank":
        return 1
      default:
        return 3
    }
  }

  return (
    <div className="w-64 bg-gradient-to-b from-pink-50 to-purple-50 h-screen overflow-y-auto p-4 border-r border-gray-200">
      <div className="space-y-3">
        {questions.map((question) => (
          <div
            key={question.id}
            onClick={() => onQuestionSelect(question.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              activeQuestionId === question.id
                ? "bg-white shadow-md border border-blue-200"
                : "bg-white/60 hover:bg-white hover:shadow-sm"
            }`}
          >
            <div className="text-gray-600 text-sm mb-3 font-medium">Question</div>
            <div className="space-y-2">
              {Array.from({ length: getBarCount(question.type) }).map((_, i) => (
                <div key={i} className="h-1.5 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={onAddQuestion}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Add question
        </button>
      </div>
    </div>
  )
}
