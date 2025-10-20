"use client";

import { useState } from "react";

// Icon type
export type IconType = "circle" | "triangle" | "square" | "diamond";

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
  color: string;
  icon?: IconType;
}

export interface Question {
  id: string;
  type: string;
  question: string;
  options: QuizOption[];
  isNew?: boolean; // Added for AI-generated question highlighting
  imageUrl?: string;
  timeLimit?: number;
}

export function useQuizStore() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Add new question
  const addQuestion = (type: string, questionData?: Partial<Question>) => {
    const newQuestion: Question = questionData?.id
      ? {
          ...questionData,
          id: questionData.id,
          type: questionData.type || type,
          question: questionData.question || "",
          options: questionData.options || [],
          isNew: questionData.isNew || false,
        }
      : {
          id: crypto.randomUUID(),
          type,
          question: "",
          options:
            type === "mcq"
              ? [
                  { id: crypto.randomUUID(), text: "", correct: false, color: "#e21a3b", icon: "circle" },
                  { id: crypto.randomUUID(), text: "", correct: false, color: "#e77f42", icon: "triangle" },
                  { id: crypto.randomUUID(), text: "", correct: false, color: "#1355b4", icon: "square" },
                  { id: crypto.randomUUID(), text: "", correct: true, color: "#27890d", icon: "diamond" },
                ]
              : type === "tf"
              ? [
                  { id: crypto.randomUUID(), text: "True", correct: false, color: "#e21a3b", icon: "circle" },
                  { id: crypto.randomUUID(), text: "False", correct: true, color: "#27890d", icon: "diamond" },
                ]
              : [{ id: crypto.randomUUID(), text: "", correct: true, color: "#1355b4" }],
          isNew: false,
        };
    setQuestions((prev) => [...prev, newQuestion]);
    setActiveQuestionId(newQuestion.id);
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    const newQuestions = questions.filter((q) => q.id !== id);
    setQuestions(newQuestions);
    setActiveQuestionId(newQuestions.length ? newQuestions[0].id : null);
  };

  // Duplicate question
  const duplicateQuestion = (question: Question) => {
    const duplicate: Question = {
      ...question,
      id: crypto.randomUUID(),
      options: question.options.map((opt) => ({ ...opt, id: crypto.randomUUID() })),
      isNew: false,
    };
    setQuestions((prev) => [...prev, duplicate]);
    setActiveQuestionId(duplicate.id);
  };

  // Update question text
  const updateQuestionText = (questionId: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, question: newText } : q))
    );
  };

  // Update option text
  const updateOptionText = (questionId: string, optionId: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optionId ? { ...opt, text: newText } : opt
            ),
          };
        }
        return q;
      })
    );
  };

  // Toggle correct answer
  const toggleCorrectAnswer = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((opt) => ({
              ...opt,
              correct:
                opt.id === optionId
                  ? !opt.correct
                  : q.type === "tf" || q.type === "fill_the_blank"
                  ? false
                  : opt.correct,
            })),
          };
        }
        return q;
      })
    );
  };

  return {
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
  };
}