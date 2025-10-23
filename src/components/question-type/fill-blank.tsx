"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface QuizOption {
  id: string;
  optionText: string;
  isCorrected: boolean;
}

interface Question {
  id: string;
  text: string;
  options: QuizOption[];
}

interface FillBlankQuestionProps {
  question: Question;
  onAnswer: (answer: string | number) => void;
  timeLeft: number;
}

export function FillBlankQuestion({
  question,
  onAnswer,
  timeLeft,
}: FillBlankQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerSelect = (index: number) => {
    if (isAnswered) return; // 🛑 prevent double submission
    setSelectedAnswer(index);
    setIsAnswered(true);
    onAnswer(index);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {question.options?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          return (
            <Button
              key={option.id}
              onClick={() => handleAnswerSelect(index)}
              disabled={timeLeft === 0 || isAnswered}
              className={`h-16 text-lg font-semibold transition-all duration-200 ${
                isSelected
                  ? "bg-primary text-primary-foreground scale-105"
                  : "bg-secondary hover:bg-secondary/80 text-secondary-foreground hover:scale-105 active:scale-95"
              }`}
              variant={isSelected ? "default" : "secondary"}
            >
              <span className="mr-3 w-8 h-8 rounded-full bg-background/20 flex items-center justify-center text-sm font-bold">
                {String.fromCharCode(65 + index)}
              </span>
              {option.optionText}
            </Button>
          );
        })}
      </div>

      <p className="text-center text-muted-foreground">
        Select the correct answer to fill in the blank
      </p>
    </div>
  );
}
