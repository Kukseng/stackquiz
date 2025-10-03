"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "./hooks/useQuizbuilder";
import { QuizSidebar } from "./quizsidebar";
import QuizMainContent from "./quizmaincontent";
import { QuizHeader } from "./quizheader";
import { ThemeSidebar } from "./themeSidebar";
import { QuestionTypeModal } from "./modal/question_type";
import DeleteQuestionModal from "./modal/deleteqquestion";
import PublishModal from "./modal/publice_modal";
import { useGetQuizByIdQuery } from "@/lib/api/quizApi";

interface QuizBuilderLayoutProps {
  quizId?: string;
}

export function QuizBuilderLayout({ quizId }: QuizBuilderLayoutProps) {
  const {
    questions,
    setQuestions,
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
  const [selectedTheme, setSelectedTheme] = useState("pink");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Use RTK Query to fetch quiz data - only when in edit mode
  const { data: quiz, isLoading, error, refetch } = useGetQuizByIdQuery(quizId!, {
    skip: !quizId,
  });

  // Load quiz data when fetched - only once
  useEffect(() => {
    // Skip if no quiz data or already loaded
    if (!quiz || isDataLoaded) return;

    const formattedQuestions = quiz.questions.map((q: any) => ({
      id: q.id,
      type: q.type === "TF" ? "truefalse" : q.type.toLowerCase(),
      // Fix text formatting: replace underscores with spaces and properly format
      question: q.text.replaceAll("_", " "),
      options: q.options.map((o: any) => ({
        id: o.id,
        text: o.optionText.replaceAll("_", " "),
        correct: o.isCorrected,
        color: "#1355b4",
      })),
    }));

    setQuestions(formattedQuestions);
    setActiveQuestionId(formattedQuestions[0]?.id ?? null);
    setIsDataLoaded(true);
  }, [quiz, isDataLoaded, setQuestions, setActiveQuestionId]);

  const handleDelete = (id: number | string) => {
    const remaining = questions.filter((q) => q.id !== id);
    deleteQuestion(id);
    setActiveQuestionId(remaining.length ? remaining[0].id : null);
  };

  const themeGradients: Record<string, string> = {
    blue: "from-blue-50 to-blue-100",
    pink: "from-pink-50 to-purple-50",
    purple: "from-purple-50 to-indigo-100",
    green: "from-green-50 to-emerald-100",
    gray: "from-gray-100 to-gray-200",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg mb-4">Failed to load quiz</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br ${themeGradients[selectedTheme]} relative`}
    >
      <QuizHeader
        questions={questions}
        onPublish={() => setShowPublishModal(true)}
        onSave={() => console.log("Save quiz", questions)}
      />

      <div className="flex w-full">
        <QuizSidebar
          questions={questions}
          activeQuestionId={typeof activeQuestionId === "string" ? Number(activeQuestionId) : activeQuestionId}
          onQuestionSelect={setActiveQuestionId}
          onAddQuestion={() => setShowAddQuestionModal(true)}
        />

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

        <ThemeSidebar selectedTheme={selectedTheme} onThemeChange={setSelectedTheme} />
      </div>

      {showAddQuestionModal && (
        <QuestionTypeModal onClose={() => setShowAddQuestionModal(false)} addQuestion={addQuestion} />
      )}

      {showDeleteModal && activeQuestionId && (
        <DeleteQuestionModal
          questionId={activeQuestionId}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDelete}
        />
      )}

      {showPublishModal && (
        <PublishModal
          onClose={() => setShowPublishModal(false)}
          quizData={questions}
          quizId={quizId}
          defaultValues={
            quiz
              ? {
                  title: quiz.title,
                  description: quiz.description,
                  categoryIds: quiz.categoryIds,
                  difficulty: quiz.difficulty,
                  visibility: quiz.visibility,
                  thumbnailUrl: quiz.thumbnailUrl,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}