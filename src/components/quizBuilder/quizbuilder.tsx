"use client"

import { useState } from "react"
import { QuizSidebar } from "./quizsidebar"
import { QuizMainContent } from "./quizmaincontent"
import { QuestionTypeModal } from "./modal/question_type"
import DeleteQuestionModal from "./modal/deleteqquestion"
import PublishModal from "./modal/publice_modal"

interface Option {
  id: number
  text: string
  correct: boolean
  color: string
  icon?: string
}

interface Question {
  id: number
  type: string
  question: string
  options: Option[]
}

export default function QuizBuilder() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null)
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  // Add new question
  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: Date.now(),
      type,
      question:
        type === "multiple"
          ? "New multiple choice question"
          : type === "truefalse"
          ? "New true/false question"
          : "New fill blank question",
      options:
        type === "multiple"
          ? [
              { id: 1, text: "Option 1", correct: false, color: "bg-red-500" },
              { id: 2, text: "Option 2", correct: false, color: "bg-green-500" },
              { id: 3, text: "Option 3", correct: false, color: "bg-blue-500" },
              { id: 4, text: "Option 4", correct: false, color: "bg-yellow-500" },
            ]
          : type === "truefalse"
          ? [
              { id: 1, text: "True", correct: false, color: "bg-green-500" },
              { id: 2, text: "False", correct: false, color: "bg-red-500" },
            ]
          : [{ id: 1, text: "Your answer", correct: false, color: "bg-blue-500" }],
    }
    setQuestions([...questions, newQuestion])
    setActiveQuestionId(newQuestion.id)
  }

  // Delete question
  const deleteQuestion = (id: number) => {
    const remaining = questions.filter(q => q.id !== id)
    setQuestions(remaining)
    setActiveQuestionId(remaining.length ? remaining[0].id : null)
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 to-purple-50 relative">
      {/* Sidebar */}
      <QuizSidebar
        questions={questions}
        activeQuestionId={activeQuestionId}
        onQuestionSelect={setActiveQuestionId}
        onAddQuestion={() => setShowAddQuestionModal(true)}
      />

      {/* Main Content */}
      <QuizMainContent
        questions={questions}
        activeQuestionId={activeQuestionId}
        setActiveQuestionId={setActiveQuestionId}
        onUpdateQuestionText={(id, text) =>
          setQuestions(questions.map(q => (q.id === id ? { ...q, question: text } : q)))
        }
        onUpdateOptionText={(qid, oid, text) =>
          setQuestions(
            questions.map(q =>
              q.id === qid
                ? { ...q, options: q.options.map(o => (o.id === oid ? { ...o, text } : o)) }
                : q
            )
          )
        }
        onToggleCorrectAnswer={(qid, oid) =>
          setQuestions(
            questions.map(q =>
              q.id === qid
                ? {
                    ...q,
                    options: q.options.map(o => ({ ...o, correct: o.id === oid ? !o.correct : o.correct })),
                  }
                : q
            )
          )
        }
        onDeleteQuestion={() => setShowDeleteModal(true)}
        onDuplicateQuestion={(q) => {
          const copy = { ...q, id: Date.now(), options: q.options.map(o => ({ ...o })) }
          setQuestions([...questions, copy])
        }}
        onAddQuestion={() => setShowAddQuestionModal(true)}
      />

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <QuestionTypeModal onClose={() => setShowAddQuestionModal(false)} addQuestion={addQuestion} />
      )}

      {/* Delete Question Modal */}
      {showDeleteModal && activeQuestionId && (
        <DeleteQuestionModal
          questionId={activeQuestionId}
          onClose={() => setShowDeleteModal(false)}
          onDelete={deleteQuestion}
        />
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal onClose={() => setShowPublishModal(false)} quizData={questions} />
      )}

      {/* Publish Button */}
      <button
        onClick={() => setShowPublishModal(true)}
        className="fixed bottom-8 right-8 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600"
      >
        Publish Quiz
      </button>
    </div>
  )
}
