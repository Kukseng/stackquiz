"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Edit,
  Heart,
  MoreHorizontal,
  X,
  Play,
  Users,
  Eye,
  EyeOff,
  UserPlus,
  Settings,
  Share2,
  Download,
  ChevronDown,
  Trophy,
} from "lucide-react";

// Types
interface QuizOption {
  id: string;
  optionText: string;
  isCorrected: boolean;
}

interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  questions: QuizQuestion[];
  category?: string;
  plays?: number;
  participants?: number;
}



// Constants
const OPTION_COLORS = ['bg-red-500', 'bg-blue-500', 'bg-orange-500', 'bg-green-500'] as const;
const API_ENDPOINTS = {
  QUIZZES: `${process.env.NEXT_PUBLIC_API_URL}/quizzes?active=true`,
} as const;

// API Functions
const fetchQuizById = async (id: string): Promise<QuizData | null> => {
  try {
    const res = await fetch(API_ENDPOINTS.QUIZZES, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const quizzes: QuizData[] = await res.json();
    return quizzes.find((quiz) => quiz.id === id) || null;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

// Components
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
      <p className="text-slate-600">Loading quiz...</p>
    </div>
  </div>
);

const QuizNotFound: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Quiz Not Found</h1>
      <p className="text-slate-600 mb-4">
        The quiz you&apos;re looking for doesn&apos;t exist.
      </p>
      <button
        onClick={onGoBack}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      >
        Go Back
      </button>
    </div>
  </div>
);

const QuizThumbnail: React.FC<{ quiz: QuizData }> = ({ quiz }) => (
  <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
    {quiz.thumbnailUrl ? (
      <Image
        src={quiz.thumbnailUrl}
        alt={quiz.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 66vw"
        priority
      />
    ) : (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600" />
    )}
  </div>
);

const DropdownMenu: React.FC = () => (
  <div className="relative group">
    <button 
      className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
      aria-label="More options"
    >
      <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">Option</span>
    </button>
    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
        <Share2 className="w-4 h-4" />
        Share Quiz
      </button>
      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
        <Download className="w-4 h-4" />
        Export
      </button>
      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
        <Settings className="w-4 h-4" />
        Settings
      </button>
    </div>
  </div>
);

const QuestionCard: React.FC<{
  question: QuizQuestion;
  index: number;
  totalQuestions: number;
  selectedAnswers: Record<string, string>;
  showAnswers: boolean;
  onAnswerSelect: (questionId: string, optionId: string) => void;
}> = ({ question, index, totalQuestions, selectedAnswers, showAnswers, onAnswerSelect }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
    {/* Question Header */}
    <div className="relative h-24 sm:h-32 bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative bg-white rounded-lg px-3 py-2 shadow-sm max-w-[90%]">
        <p className="text-xs sm:text-sm font-medium text-slate-800 text-center line-clamp-2">
          {question.text?.replaceAll("_", " ")}
        </p>
      </div>
    </div>

    {/* Answer Options */}
    <div className="p-3 sm:p-4">
      <div className="grid grid-cols-2 gap-2">
        {question.options?.map((option, optionIndex) => {
          const bgColor = OPTION_COLORS[optionIndex % OPTION_COLORS.length];
          const isSelected = selectedAnswers[question.id] === option.id;
          const isCorrect = option.isCorrected && showAnswers;

          return (
            <button
              key={option.id}
              onClick={() => onAnswerSelect(question.id, option.id)}
              className={`relative p-2 rounded-lg text-xs font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 ${bgColor} ${
                isSelected ? 'ring-2 ring-white ring-offset-2' : ''
              } ${
                isCorrect ? 'ring-2 ring-green-400 ring-offset-2' : ''
              }`}
            >
              <span className="relative z-10 line-clamp-2">{option.optionText}</span>
              {isCorrect && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Question Number */}
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-slate-500">
          Question {index + 1}/{totalQuestions}
        </span>
        {selectedAnswers[question.id] && (
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </div>
    </div>
  </div>
);

// Main Component
const QuizDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;

  // State
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  // Memoized values
  const progressPercentage = useMemo(() => {
    if (!quizData?.questions?.length) return 0;
    return (Object.keys(selectedAnswers).length / quizData.questions.length) * 100;
  }, [selectedAnswers, quizData?.questions?.length]);

  const answeredCount = useMemo(() => Object.keys(selectedAnswers).length, [selectedAnswers]);

  // Callbacks
  const loadQuizData = useCallback(async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchQuizById(quizId);
      setQuizData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quiz");
      console.error("Error loading quiz:", err);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  const handleAnswerSelect = useCallback((questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }, []);

  const toggleFavorite = useCallback(() => {
    setIsFavorited((prev) => !prev);
  }, []);

  const toggleShowAnswers = useCallback(() => {
    setShowAnswers((prev) => !prev);
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // Effects
  useEffect(() => {
    loadQuizData();
  }, [loadQuizData]);

  // Render loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render error/not found state
  if (error || !quizData) {
    return <QuizNotFound onGoBack={handleGoBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-sm sm:text-lg">E</span>
            </div>
            
            {/* User Info and Actions */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h2 className="font-semibold text-slate-800 text-sm sm:text-base">Evano</h2>
                <div className="flex items-center gap-2">
                  <button 
                    className="flex items-center gap-1 px-2 py-1 text-xs sm:text-sm text-slate-600 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    aria-label="Edit quiz"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button 
                    onClick={toggleFavorite}
                    className={`flex items-center gap-1 px-2 py-1 text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded ${
                      isFavorited ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                    }`}
                    aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    <span className="hidden sm:inline">Add to favorite</span>
                  </button>
                  <DropdownMenu />
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button 
            onClick={handleGoBack}
            className="self-start p-2 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close quiz details"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
          </button>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          {/* Quiz Info */}
          <main className="xl:col-span-2">
            <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 sm:mb-8">
              <QuizThumbnail quiz={quizData} />

              {/* Quiz Content */}
              <div className="p-4 sm:p-6">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-3">
                    StackQuiz
                  </span>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-3">
                    {quizData.title}
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {quizData.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 sm:gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    <span className="font-medium">{quizData.plays || "5K"}</span>
                    <span>plays</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">{quizData.participants || "15.5K"}</span>
                    <span>participants</span>
                  </div>
                </div>
              </div>
            </article>
          </main>

          {/* Action Panel */}
          <aside className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 sticky top-6">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm sm:text-base">StackQuiz Session</h3>
              <div className="space-y-3 mb-6">
                <Link
                  href={`/startquiz_org/${quizId}`}
                  className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span className="font-medium">Host live</span>
                  </div>
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </Link>

                <button className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    <span className="font-medium">Assign</span>
                  </div>
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </button>
              </div>

              <h4 className="font-semibold text-slate-800 mb-3 text-sm">StackQuiz Self-Study</h4>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">Play solo</span>
                </div>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </button>
            </div>
          </aside>
        </div>

        {/* Questions Section */}
        <section className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              Questions ({quizData.questions?.length || 0})
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleShowAnswers}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {showAnswers ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAnswers ? 'Hide answers' : 'Show answers'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Edit
              </button>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {quizData.questions?.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                totalQuestions={quizData.questions?.length || 0}
                selectedAnswers={selectedAnswers}
                showAnswers={showAnswers}
                onAnswerSelect={handleAnswerSelect}
              />
            ))}
          </div>
        </section>

        {/* Progress Bar */}
        <section className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold text-slate-800">Quiz Progress</h3>
            <span className="text-sm text-slate-600">
              {answeredCount} of {quizData.questions?.length || 0} answered
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Quiz progress: ${progressPercentage.toFixed(0)}% complete`}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuizDetailPage;