"use client";

import { create } from "zustand";

export type IconType = "circle" | "triangle" | "square" | "diamond";

export interface QuizOption {
  id: number | string;
  text: string;
  correct: boolean;
  color: string;
  icon?: IconType;
}

export interface Question {
  id: number | string;
  type: string;
  question: string;
  options: QuizOption[];
}

interface QuizState {
  questions: Question[];
  activeQuestionId: number | string | null;

  setQuestions: (questions: Question[]) => void;
  setActiveQuestionId: (id: number | string | null) => void;
  addQuestion: (type: string) => void;
  deleteQuestion: (id: number | string) => void;
  duplicateQuestion: (question: Question) => void;
  updateQuestionText: (questionId: number | string, newText: string) => void;
  updateOptionText: (questionId: number | string, optionId: number | string, newText: string) => void;
  toggleCorrectAnswer: (questionId: number | string, optionId: number | string) => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  activeQuestionId: null,

  setQuestions: (questions) => set({ questions }),
  setActiveQuestionId: (id) => set({ activeQuestionId: id }),

  addQuestion: (type: string) => {
    const newQuestion: Question = {
      id: Date.now(),
      type,
      question: "",
      options:
        type === "multiple"
          ? [
              { id: 1, text: "", correct: false, color: "#e21a3b", icon: "circle" },
              { id: 2, text: "", correct: false, color: "#e77f42", icon: "triangle" },
              { id: 3, text: "", correct: false, color: "#1355b4", icon: "square" },
              { id: 4, text: "", correct: true, color: "#27890d", icon: "diamond" },
            ]
          : type === "truefalse"
          ? [
              { id: 1, text: "True", correct: false, color: "#e21a3b", icon: "circle" },
              { id: 2, text: "False", correct: true, color: "#27890d", icon: "diamond" },
            ]
          : [{ id: 1, text: "", correct: true, color: "#1355b4" }],
    };
    set({ questions: [...get().questions, newQuestion], activeQuestionId: newQuestion.id });
  },

  deleteQuestion: (id) => {
    const remaining = get().questions.filter((q) => q.id !== id);
    set({
      questions: remaining,
      activeQuestionId: remaining.length ? remaining[0].id : null,
    });
  },

  duplicateQuestion: (question) => {
    const duplicate = { ...question, id: Date.now(), options: question.options.map((o) => ({ ...o })) };
    set({ questions: [...get().questions, duplicate], activeQuestionId: duplicate.id });
  },

  updateQuestionText: (questionId, newText) => {
    set({
      questions: get().questions.map((q) => (q.id === questionId ? { ...q, question: newText } : q)),
    });
  },

  updateOptionText: (questionId, optionId, newText) => {
    set({
      questions: get().questions.map((q) =>
        q.id === questionId
          ? { ...q, options: q.options.map((o) => (o.id === optionId ? { ...o, text: newText } : o)) }
          : q
      ),
    });
  },

  toggleCorrectAnswer: (questionId, optionId) => {
    set({
      questions: get().questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) => ({
                ...o,
                correct: q.type === "truefalse" || q.type === "fillblank" ? o.id === optionId : o.id === optionId ? !o.correct : o.correct,
              })),
            }
          : q
      ),
    });
  },
}));
