"use client";

import Image from "next/image";
import { Question, QuizOption } from "./hooks/useQuizbuilder";

interface QuizSidebarProps {
  questions: Question[];
  activeQuestionId: string | null;
  onQuestionSelect: (id: string) => void;
  onAddQuestion: () => void;
}

export function QuizSidebar({ questions, activeQuestionId, onQuestionSelect, onAddQuestion }: QuizSidebarProps) {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "mcq":
        return "Quiz";
      case "tf":
        return "True or False";
      case "fill_the_blank":
        return "Type Answer";
      default:
        return "Quiz";
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "mcq":
        return "🎯";
      case "tf":
        return "✓✗";
      case "fill_the_blank":
        return "✏️";
      default:
        return "❓";
    }
  };

  console.log("QuizSidebar - questions:", questions);
  console.log("QuizSidebar - activeQuestionId:", activeQuestionId);

  return (
    <div className="w-72 h-screen bg-white overflow-y-auto border-r border-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-lg font-bold text-gray-800">Quiz</h2>
        <p className="text-sm text-gray-600">{questions.length} question{questions.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="p-3 space-y-3">
        {questions.map((question, index) => (
          <div
            key={question.id}
            onClick={() => onQuestionSelect(question.id)}
            className={`group relative rounded-xl cursor-pointer transition-all duration-200 overflow-hidden ${
              activeQuestionId === question.id
                ? "ring-2 ring-blue-500 shadow-lg"
                : "hover:shadow-md hover:ring-1 hover:ring-gray-300"
            } ${question.isNew ? "animate-pulse bg-blue-50" : ""}`}
          >
            <div className="absolute top-2 left-2 z-10 bg-white px-2.5 py-1 rounded-full shadow-sm">
              <span className="text-xs font-bold text-gray-700">{index + 1}</span>
            </div>

            <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
              <span className="text-xs font-medium text-gray-600">
                {getQuestionTypeIcon(question.type)}
              </span>
            </div>

            <div className={`min-h-32 relative ${
              question.imageUrl 
                ? "bg-gray-100" 
                : "bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400"
            }`}>
              {question.imageUrl ? (
                <Image
                  src={question.imageUrl}
                  alt="Question preview"
                  className="w-full h-32 object-cover"
                  width={288}
                  height={128}
                  style={{ width: "auto", height: "auto" }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl opacity-20">
                    {getQuestionTypeIcon(question.type)}
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-sm font-medium line-clamp-3 drop-shadow-md">
                  {question.question || "Untitled Question"}
                </p>
              </div>
            </div>

            <div className="bg-white p-2.5 border-t border-gray-100">
              <div className="text-sm text-gray-800 mb-2">
                <p className="font-medium">Options:</p>
                <ul className="list-none space-y-1">
                  {question.options.length > 0 ? (
                    question.options.map((option, optIndex) => (
                      <li
                        key={option.id}
                        className="text-xs text-gray-600 truncate"
                      >
                        {String.fromCharCode(65 + optIndex)}. {option.text || "Empty Option"}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-500">No options available</li>
                  )}
                </ul>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {question.timeLimit || 20}s
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {question.options?.length || 0} options
                </span>
              </div>
            </div>

            {activeQuestionId === question.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
            )}
          </div>
        ))}

        <button
          onClick={onAddQuestion}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Question
        </button>
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Click any question to edit
        </div>
      </div>
    </div>
  );
}