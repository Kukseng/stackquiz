import { QuizBuilderLayout } from "@/components/quizBuilder/quizbuilderlayout";

interface QuizBuilderPageProps {
  params: Promise<{ quizId: string }>;
}

export default async function QuizBuilderPage({ params }: QuizBuilderPageProps) {
  const { quizId } = await params;
  
  // example: const quiz = await fetchQuiz(quizId);
  return <QuizBuilderLayout quizId={quizId} />;
}