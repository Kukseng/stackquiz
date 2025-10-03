"use client";

import { QuizBuilderLayout } from "@/components/quizBuilder/quizbuilderlayout";
import * as React from "react";

interface QuizBuilderPageProps {
  params: { quizId: string } | Promise<{ quizId: string }>;
}

export default function QuizBuilderPage({ params }: QuizBuilderPageProps) {
  const unwrappedParams = React.use(params); 
  const { quizId } = unwrappedParams;

  if (!quizId) return <p>Invalid quiz</p>;

  return <QuizBuilderLayout quizId={quizId} />;
}
