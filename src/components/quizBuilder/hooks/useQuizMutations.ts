
import { useQueryClient } from '@tanstack/react-query';
import { 
  useCreateQuizMutation, 
  useUpdateQuizMutation,
  useDeleteQuizMutation 
} from '@/lib/api/quizApi';

export function useQuizMutations() {
  const queryClient = useQueryClient();

  const createQuiz = useCreateQuizMutation();
  const updateQuiz = useUpdateQuizMutation();
  const deleteQuiz = useDeleteQuizMutation();

  return { createQuiz, updateQuiz, deleteQuiz };
}