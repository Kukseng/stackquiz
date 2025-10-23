import { create } from "zustand";
import { useUpdateQuestionMutation, useUpdateOptionMutation } from "@/lib/api/quizApi";

interface Option {
  id: string | number;
  text: string;
  correct: boolean;
  color: string;
  icon?: string;
}

interface Question {
  id: string | number;
  type: string;
  question: string;
  options: Option[];
  imageUrl?: string;
  isNew?: boolean;
}

interface QuizState {
  questions: Question[];
  activeQuestionId: string | number | null;
  thumbnailUrl: string;
  quizId?: string;
  setQuestions: (questions: Question[]) => void;
  setActiveQuestionId: (id: string | number | null) => void;
  setThumbnailUrl: (url: string) => void;
  setQuizId: (id: string) => void;
  addQuestion: (type: string, questionData?: Partial<Question>) => void;
  deleteQuestion: (id: string | number) => void;
  duplicateQuestion: (question: Question) => void;
  updateQuestionText: (questionId: string | number, text: string) => void;
  updateQuestionImage: (questionId: string | number, imageUrl: string) => void;
  updateOptionText: (
    questionId: string | number,
    optionId: string | number,
    text: string
  ) => void;
  toggleCorrectAnswer: (
    questionId: string | number,
    optionId: string | number
  ) => void;
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

const createDefaultOptions = (type: string): Option[] => {
  if (type === "truefalse") {
    return [
      { id: 0, text: "True", correct: true, color: "#27890d", icon: "circle" },
      { id: 1, text: "False", correct: false, color: "#e21a3b", icon: "diamond" },
    ];
  }
  return [
    { id: 0, text: "Option 1", correct: false, color: OPTION_COLORS[0], icon: "circle" },
    { id: 1, text: "Option 2", correct: false, color: OPTION_COLORS[1], icon: "triangle" },
    { id: 2, text: "Option 3", correct: false, color: OPTION_COLORS[2], icon: "square" },
    { id: 3, text: "Option 4", correct: false, color: OPTION_COLORS[3], icon: "diamond" },
  ];
};

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  activeQuestionId: null,
  thumbnailUrl: "",
  quizId: undefined,

  setQuestions: (questions) => set({ questions }),

  setActiveQuestionId: (id) => set({ activeQuestionId: id }),

  setThumbnailUrl: (url) => set({ thumbnailUrl: url }),

  setQuizId: (id) => set({ quizId: id }),

  addQuestion: (type, questionData) => {
    const newQuestion: Question = {
      id: questionData?.id || Date.now(),
      type: questionData?.type || type,
      question: questionData?.question || "Untitled Question",
      options: questionData?.options || createDefaultOptions(type),
      imageUrl: questionData?.imageUrl || "",
      isNew: questionData?.isNew !== undefined ? questionData.isNew : true,
    };

    set((state) => ({
      questions: [...state.questions, newQuestion],
      activeQuestionId: newQuestion.id,
    }));
  },

  deleteQuestion: (id) => {
    set((state) => {
      const filtered = state.questions.filter((q) => q.id !== id);
      return {
        questions: filtered,
        activeQuestionId:
          state.activeQuestionId === id
            ? filtered.length > 0
              ? filtered[0].id
              : null
            : state.activeQuestionId,
      };
    });
  },

  duplicateQuestion: (question) => {
    const newQuestion: Question = {
      ...question,
      id: Date.now(),
      question: `${question.question} (Copy)`,
      options: question.options.map((opt, idx) => ({
        ...opt,
        id: `${Date.now()}-${idx}`,
      })),
      imageUrl: question.imageUrl || "",
    };

    set((state) => ({
      questions: [...state.questions, newQuestion],
      activeQuestionId: newQuestion.id,
    }));
  },

  updateQuestionText: async (questionId, text) => {
    // Update local state immediately
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, question: text } : q
      ),
    }));

    // If we have a quizId, update via API
    const state = get();
    if (state.quizId && typeof questionId === 'string') {
      try {
        const [updateQuestion] = useUpdateQuestionMutation();
        await updateQuestion({
          questionId,
          question: { text }
        }).unwrap();
        console.log('✅ Question text updated via API');
      } catch (error) {
        console.error('❌ Failed to update question text via API:', error);
        // Local state is already updated, so user sees the change
      }
    }
  },

  updateQuestionImage: async (questionId, imageUrl) => {
    // Update local state immediately
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, imageUrl } : q
      ),
    }));

    // If we have a quizId, update via API
    const state = get();
    if (state.quizId && typeof questionId === 'string') {
      try {
        const [updateQuestion] = useUpdateQuestionMutation();
        await updateQuestion({
          questionId,
          question: { imageUrl }
        }).unwrap();
        console.log('✅ Question image updated via API');
      } catch (error) {
        console.error('❌ Failed to update question image via API:', error);
        // Local state is already updated, so user sees the change
      }
    }
  },

  updateOptionText: async (questionId, optionId, text) => {
    // Update local state immediately
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text } : opt
              ),
            }
          : q
      ),
    }));

    // If we have a quizId, update via API
    const state = get();
    if (state.quizId && typeof optionId === 'string') {
      try {
        const [updateOption] = useUpdateOptionMutation();
        await updateOption({
          optionId,
          option: { optionText: text }
        }).unwrap();
        console.log('✅ Option text updated via API');
      } catch (error) {
        console.error('❌ Failed to update option text via API:', error);
        // Local state is already updated, so user sees the change
      }
    }
  },

  toggleCorrectAnswer: async (questionId, optionId) => {
    // Update local state immediately
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.id !== questionId) return q;

        // For true/false and fill_the_blank questions, only one can be correct
        if (q.type === "truefalse" || q.type === "fill_the_blank") {
          return {
            ...q,
            options: q.options.map((opt) => ({
              ...opt,
              correct: opt.id === optionId,
            })),
          };
        }

        // For multiple choice questions, multiple answers can be correct
        return {
          ...q,
          options: q.options.map((opt) =>
            opt.id === optionId ? { ...opt, correct: !opt.correct } : opt
          ),
        };
      }),
    }));

    // If we have a quizId, update via API
    const state = get();
    if (state.quizId && typeof optionId === 'string') {
      try {
        const [updateOption] = useUpdateOptionMutation();
        // Find the current option to determine the new correct state
        const question = state.questions.find(q => q.id === questionId);
        const option = question?.options.find(opt => opt.id === optionId);
        if (option) {
          const newCorrectState = !option.correct;
          await updateOption({
            optionId,
            option: { isCorrected: newCorrectState }
          }).unwrap();
          console.log('✅ Option correctness updated via API');
        }
      } catch (error) {
        console.error('❌ Failed to update option correctness via API:', error);
        // Local state is already updated, so user sees the change
      }
    }
  },
}));