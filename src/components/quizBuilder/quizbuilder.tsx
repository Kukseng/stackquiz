"use client";

import { useState } from "react";
import { QuizSidebar } from "./quizsidebar";
import  QuizMainContent  from "./quizmaincontent";
import { QuestionTypeModal } from "./modal/question_type";
import DeleteQuestionModal from "./modal/deleteqquestion";
import PublishModal from "./modal/publice_modal";
import { useQuizStore } from "./hooks/useQuizbuilder";

export default function QuizBuilder() {
  const {
    questions,
    activeQuestionId,
    setActiveQuestionId,
    addQuestion,
    deleteQuestion,
    duplicateQuestion,
    updateQuestionText,
    updateOptionText,
    toggleCorrectAnswer,
  } = useQuizStore();

  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleDelete = (id: number) => {
    deleteQuestion(id);
  };

  return (
    <div
      className={`min-h-screen flex relative transition-colors duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-pink-50 to-purple-50"
          : "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
      }`}
    >
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
        onUpdateQuestionText={updateQuestionText}
        onUpdateOptionText={updateOptionText}
        onToggleCorrectAnswer={toggleCorrectAnswer}
        onDeleteQuestion={handleDelete}
        onDuplicateQuestion={duplicateQuestion}
      />

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <QuestionTypeModal
          onClose={() => setShowAddQuestionModal(false)}
          addQuestion={addQuestion}
        />
      )}

      {/* Delete Question Modal */}
      {showDeleteModal && activeQuestionId && (
        <DeleteQuestionModal
          questionId={activeQuestionId}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
        />
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          quizData={questions}
        />
      )}

      {/* Publish Button */}
      <button
        onClick={() => setShowPublishModal(true)}
        className="fixed bottom-8 right-8 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600"
      >
        Publish Quiz
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="fixed bottom-8 left-8 px-6 py-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
      >
        Toggle Theme
      </button>
    </div>
  );
}
