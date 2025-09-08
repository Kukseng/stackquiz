"use client";

import { useState } from "react";
import { QuizSidebar } from "./quizsidebar";
import  QuizMainContent from "./quizmaincontent";
import { QuizHeader } from "./quizheader";
import  {ThemeSidebar}  from "./themeSidebar"; 
import { useQuizStore } from "./hooks/useQuizbuilder";
import { QuestionTypeModal } from "./modal/question_type";
import DeleteQuestionModal from "./modal/deleteqquestion";
import PublishModal from "./modal/publice_modal";

export function QuizBuilderLayout() {
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

  // NEW: theme state
  const [selectedTheme, setSelectedTheme] = useState("pink");

  // Handle delete
  const handleDelete = (id: number) => {
    const remaining = questions.filter((q) => q.id !== id);
    deleteQuestion(id);
    setActiveQuestionId(remaining.length ? remaining[0].id : null);
  };

  // Mapping theme -> Tailwind gradient
  const themeGradients: Record<string, string> = {
    blue: "from-blue-50 to-blue-100",
    pink: "from-pink-50 to-purple-50",
    purple: "from-purple-50 to-indigo-100",
    green: "from-green-50 to-emerald-100",
    gray: "from-gray-100 to-gray-200",
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br ${themeGradients[selectedTheme]} relative`}
    >
      {/* Navbar */}
      <QuizHeader
        questions={questions}
        onPublish={() => setShowPublishModal(true)}
        onSave={() => console.log("Save quiz", questions)}
        onExit={() => console.log("Exit clicked")}
      />

      <div className="flex w-full">
        {/* Sidebar Left */}
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
          onDeleteQuestion={() => setShowDeleteModal(true)}
          onDuplicateQuestion={duplicateQuestion}
          theme={selectedTheme}
        />

        {/* Sidebar Right (Themes) */}
        <ThemeSidebar
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
        />
      </div>

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
    </div>
  );
}
