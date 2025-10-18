"use client";

import { useEffect, useState } from "react";
import { useQuizStore } from "./hooks/useQuizbuilder";
import { QuizSidebar } from "./quizsidebar";
import QuizMainContent from "./quizmaincontent";
import { QuizHeader } from "./quizheader";
import ThemeSidebar from "./themeSidebar";
import { QuestionTypeModal } from "./modal/question_type";
import DeleteQuestionModal from "./modal/deleteqquestion";
import PublishModal from "./modal/publice_modal";
import { useGetQuizByIdQuery } from "@/lib/api/quizApi";
import { AIChatbot } from "./AIChatbot";

interface QuizBuilderLayoutProps {
  quizId?: string;
}

const OPTION_COLORS = {
  0: "#e21a3b",
  1: "#e77f42",
  2: "#1355b4",
  3: "#27890d",
};

const OPTION_ICONS = {
  0: "circle",
  1: "triangle",
  2: "square",
  3: "diamond",
} as const;

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

  const { data: quiz, isLoading, error, refetch } = useGetQuizByIdQuery(quizId!, {
    skip: !quizId,
  });

  useEffect(() => {
    if (!quiz || isDataLoaded) return;

    const formattedQuestions = quiz.questions.map((q: any) => {
      const questionType = q.type === "TF" ? "truefalse" : q.type.toLowerCase();
      
      const mappedOptions = q.options.map((o: any, index: number) => ({
        id: o.id || `${crypto.randomUUID()}-${index}`,
        text: o.optionText.replaceAll("_", " "),
        correct: o.isCorrected,
        color: OPTION_COLORS[index as keyof typeof OPTION_COLORS] || "#1355b4",
        icon: OPTION_ICONS[index as keyof typeof OPTION_ICONS] || "circle",
      }));

      return {
        id: q.id || crypto.randomUUID(),
        type: questionType,
        question: q.text.replaceAll("_", " "),
        options: mappedOptions,
        isNew: false,
      };
    });

    console.log("Loaded questions from API:", formattedQuestions);
    setQuestions(formattedQuestions);
    setActiveQuestionId(formattedQuestions[0]?.id ?? null);
    setIsDataLoaded(true);
  }, [quiz, isDataLoaded, setQuestions, setActiveQuestionId]);

  const handleDelete = (id: string) => {
    const remaining = questions.filter((q) => q.id !== id);
    deleteQuestion(id);
    setActiveQuestionId(remaining.length ? remaining[0].id : null);
    console.log("After delete, questions:", remaining);
  };

  const handleQuestionSelect = (id: string) => {
    setActiveQuestionId(id);
    setQuestions((prev) =>
      prev.map((q) => ({ ...q, isNew: false }))
    );
    console.log("Selected question ID:", id);
  };

  const handleAIQuestionsGenerated = (generatedQuestions: any[]) => {
    console.log("AI generated questions:", generatedQuestions);
    
    const newQuestions = generatedQuestions.map((q, index) => {
      const questionId = crypto.randomUUID();
      
      return {
        id: questionId,
        type: "multiplechoice",
        question: q.questionText || "Untitled Question",
        isNew: true,
        options: (q.options || []).map((opt: any, optIndex: number) => ({
          id: `${questionId}-${optIndex}`,
          text: opt.optionText || "Option",
          correct: opt.isCorrect || false,
          color: OPTION_COLORS[optIndex as keyof typeof OPTION_COLORS] || "#1355b4",
          icon: OPTION_ICONS[optIndex as keyof typeof OPTION_ICONS] || "circle",
        })),
      };
    });

    newQuestions.forEach((q) => {
      addQuestion(q.type, q);
    });

    console.log("After adding AI questions, questions:", questions);

    if (newQuestions.length > 0) {
      setActiveQuestionId(newQuestions[0].id);
      console.log("Set active question ID:", newQuestions[0].id);
    }
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
      />

      <div className="flex w-full">
        <QuizSidebar
          questions={questions}
          activeQuestionId={activeQuestionId}
          onQuestionSelect={handleQuestionSelect}
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

      <AIChatbot onQuestionsGenerated={handleAIQuestionsGenerated} />
    </div>
  );
}