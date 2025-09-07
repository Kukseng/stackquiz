"use client";

import { QuizOption, Question } from "./hooks/useQuizbuilder";
import { FaCircle, FaSquare, FaDiamond } from "react-icons/fa6";
import { IoTriangle } from "react-icons/io5";
import { ImCheckmark2 } from "react-icons/im";

interface QuizMainContentProps {
  questions: Question[];
  activeQuestionId: number | null;
  onUpdateQuestionText: (questionId: number, text: string) => void;
  onUpdateOptionText: (
    questionId: number,
    optionId: number,
    text: string
  ) => void;
  onToggleCorrectAnswer: (questionId: number, optionId: number) => void;
  onDeleteQuestion: (id: number) => void;
  onDuplicateQuestion: (question: Question) => void;
}

const renderIcon = (icon?: string) => {
  switch (icon) {
    case "circle":
      return <FaCircle size={36} className="text-white mr-2" />;
    case "triangle":
      return <IoTriangle size={36} className="text-white mr-2" />;
    case "square":
      return <FaSquare size={36} className="text-white mr-2" />;
    case "diamond":
      return <FaDiamond size={36} className="text-white mr-2" />;
    default:
      return null;
  }
};

export function QuizMainContent({
  questions,
  activeQuestionId,
  onUpdateQuestionText,
  onUpdateOptionText,
  onToggleCorrectAnswer,
  onDeleteQuestion,
  onDuplicateQuestion,
}: QuizMainContentProps) {
  const activeQuestion = questions.find((q) => q.id === activeQuestionId);
  if (!activeQuestion) return <div className="p-8">No question selected</div>;

  return (
    <div className="flex-1 bg-blue-100 p-8 relative">
      <div className="max-w-4xl mx-auto mt-16">
        <div className="bg-blue-700 rounded-2xl p-6 text-white relative shadow-xl">
          {/* Question */}
          <input
            type="text"
            value={activeQuestion.question}
            onChange={(e) =>
              onUpdateQuestionText(activeQuestion.id, e.target.value)
            }
            placeholder="Enter your question..."
            className="w-full text-center text-xl font-semibold p-3 mb-6 rounded border-2 border-yellow-400 bg-transparent placeholder-white/70 focus:outline-none"
          />

          {/* Options */}
          <div className="space-y-4">
            {activeQuestion.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-4 rounded-xl shadow-md cursor-pointer"
                style={{ backgroundColor: option.color }} // supports Tailwind or hex
              >
                <div className="flex items-center w-full">
                  {renderIcon(option.icon)}
                  <input
                  placeholder="Option"
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      
                      onUpdateOptionText(
                        activeQuestion.id,
                        option.id,
                        e.target.value
                      )
                      
                    }
                    className="bg-transparent w-full text-white text-lg font-semibold placeholder-white/70 border-none outline-none"
                  />
                </div>

                {/* Check mark */}
                <div
  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
    option.correct ? "bg-green-500 " : "bg-white/30 "
  } cursor-pointer`}
  onClick={() => onToggleCorrectAnswer(activeQuestion.id, option.id)}
>
  {option.correct && <ImCheckmark2 className="text-white w-5 h-5" />}
</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => onDeleteQuestion(activeQuestion.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium shadow-md"
            >
              Delete
            </button>
            <button
              onClick={() => onDuplicateQuestion(activeQuestion)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium shadow-md"
            >
              Duplicate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
