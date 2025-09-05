
"use client"
import { QuizSidebar } from "./quizsidebar"
import { QuizMainContent } from "./quizmaincontent"
import { QuizHeader } from "./quizheader"
import { useQuizStore } from "./hooks/useQuizbuilder"

export function QuizBuilderLayout() {
  const {
    questions,
    activeQuestionId,
    setActiveQuestionId,
    // addQuestion,
    // deleteQuestion,
    duplicateQuestion,
    updateQuestionText,
    updateOptionText,
    toggleCorrectAnswer,
  } = useQuizStore()

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 to-purple-50">
      <QuizHeader />

      <div className="flex w-full pt-20">
        <QuizSidebar
          questions={questions}
          activeQuestionId={activeQuestionId}
          onQuestionSelect={setActiveQuestionId}
          onAddQuestion={() => {
            // This will be handled by route interception
            window.history.pushState({}, "", "/quiz-builder/add-question")
          }}
        />

        <QuizMainContent
          questions={questions}
          activeQuestionId={activeQuestionId}
          onUpdateQuestionText={updateQuestionText}
          onUpdateOptionText={updateOptionText}
          onToggleCorrectAnswer={toggleCorrectAnswer}
          onDeleteQuestion={(id) => {
            window.history.pushState({}, "", `/quiz-builder/delete/${id}`)
          }}
          onDuplicateQuestion={duplicateQuestion}
        />
      </div>
    </div>
  )
}
