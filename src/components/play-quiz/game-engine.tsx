"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Quiz, GameResults } from "@/app/play/[id]/page";
import { FillBlankQuestion } from "@/components/question-type/fill-blank";
import Image from "next/image";
import { FaCircle, FaSquare } from 'react-icons/fa';
import { IoTriangle } from 'react-icons/io5';
import { FaDiamond  } from 'react-icons/fa6';

interface GameEngineProps {
  quiz: Quiz;
  onGameComplete: (results: GameResults) => void;
  playerNickname: string;
}

export function GameEngine({ quiz, onGameComplete, playerNickname }: GameEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.questions[0]?.timeLimit || 30);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<GameResults["answers"]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [gameStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showTimeUpAlert, setShowTimeUpAlert] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false); 

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  useEffect(() => {
    setIsMounted(true); // Set to true after mount
  }, []);

  const getCorrectAnswer = useCallback((question: typeof currentQuestion) => {
    if (question.type === "MCQ" || question.type === "TF" || question.type === "FB") {
      const correctOption = question.options.find((opt) => opt.isCorrected);
      return correctOption ? correctOption.optionText : "";
    }
    return "";
  }, []);

  const renderIcon = (icon?: string) => {
    switch (icon) {
      case "circle":
        return <FaCircle size={36} className="text-white mr-2" />;
      case "triangle":
        return <IoTriangle size={36} className="text-white mr-2" />;
      case "square":
        return <FaSquare size={36} className="text-white mr-2" />;
      case "diamond":
        return <FaDiamond  size={36} className="text-white mr-2" />;
      default:
        return null;
    }
  };

  const isAnswerCorrect = useCallback((userAnswer: string | number, question: typeof currentQuestion) => {
    if (question.type === "MCQ") {
      const selectedOption = question.options[userAnswer as number];
      return selectedOption?.isCorrected || false;
    } else if (question.type === "TF") {
      const selectedOption = question.options.find(
        (opt) => opt.optionText.toLowerCase() === String(userAnswer).toLowerCase(),
      );
      return selectedOption?.isCorrected || false;
    } else if (question.type === "FB") {
      const selectedOption = question.options[userAnswer as number];
      return selectedOption?.isCorrected || false;
    }
    return false;
  }, []);

  const handleAnswer = useCallback(
    (userAnswer: string | number) => {
      const timeSpent = Date.now() - questionStartTime;
      const isCorrect = isAnswerCorrect(userAnswer, currentQuestion);
      const correctAns = getCorrectAnswer(currentQuestion);

      setLastAnswerCorrect(isCorrect && userAnswer !== "");
      setCorrectAnswer(correctAns);
      setShowFeedback(true);

      if (isCorrect) {
        setScore((prev) => prev + currentQuestion.points);
      }

      const answerRecord = {
        questionId: currentQuestion.id,
        userAnswer,
        correct: isCorrect,
        timeSpent,
      };

      setAnswers((prev) => [...prev, answerRecord]);

      // Show feedback for 1.5 seconds before moving to the next question
     setTimeout(() => {
  if (isLastQuestion) {
    // Calculate the total time spent in the game
    const totalTimeSpent = Date.now() - gameStartTime;
    
    // Create the result object with score, total questions, and answers
    const results: GameResults = {
      score: isCorrect ? score + currentQuestion.points : score,
      totalQuestions: quiz.questions.length,
      timeSpent: totalTimeSpent,
      answers: [...answers, answerRecord],
    };

        // Complete the game and return results
        onGameComplete(results);
    } else {
          // Move to the next question after a delay
          setCurrentQuestionIndex((prev) => prev + 1);

          // Set the time left for the next question, with a fallback of 30 seconds
          setTimeLeft(quiz.questions[currentQuestionIndex + 1]?.timeLimit || 30);

          // Reset feedback display and prepare for the next question
          setShowFeedback(false);

          // Set the start time for the next question
          setQuestionStartTime(Date.now());
        }
      }, 1500); // Wait 1.5 seconds before transitioning to the next question

    },
    [
      currentQuestion,
      questionStartTime,
      score,
      answers,
      isLastQuestion,
      quiz,
      onGameComplete,
      gameStartTime,
      isAnswerCorrect,
      getCorrectAnswer,
    ],
  );

  // Timer countdown
  useEffect(() => {
    if (showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowTimeUpAlert(true); // Show time up alert
          handleAnswer(""); // Time's up, submit empty answer
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleAnswer, showFeedback]);

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const totalPossiblePoints = quiz.questions.reduce((acc, q) => acc + q.points, 0);

  if (!isMounted) return null; // Ensure client-side rendering

  if (showFeedback) {
    return (
      <div className="container sm:px-2 lg:px-8 py-4 sm:py-2 lg:py-8 flex items-center justify-center min-h-screen">
        <Card
          className={`w-full max-w-md text-center bg-white ${lastAnswerCorrect ? "animate-pulse-success border-green-500" : "animate-shake-error border-red-500"}`}
        >
         <CardContent className="p-4 sm:p-6 lg:p-8">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              lastAnswerCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {showTimeUpAlert ? (
              <Image className="mx-auto mb-0" src="time-up.svg" alt="Time's Up" width={80} height={80} />
            ) : lastAnswerCorrect ? (
              <Image className="mx-auto mb-0" src="correct.svg" alt="Banner" width={80} height={80} />
            ) : (
              <Image className="mx-auto mb-0" src="wrong.svg" alt="Banner" width={80} height={80} />
            )}
          </div>
          <h2 className={`text-3xl font-bold mb-4 ${lastAnswerCorrect ? "text-green-600" : "text-red-600"}`}>
            {showTimeUpAlert ? "Time's Up!" : lastAnswerCorrect ? "Correct!" : "Incorrect!"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {showTimeUpAlert
              ? "You ran out of time. No points were awarded."
              : lastAnswerCorrect
              ? `Great job! +${currentQuestion.points} points`
              : `The correct answer was: ${correctAnswer}`}
          </p>
        </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center min-h-screen justify-center">
      <div className="container mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <Card className="bg-white shadow-xl rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-orange-400">{quiz.title}</h1>
              <p className="text-lg text-slate-900 mt-2.5">
                <span>Participant</span> <span className="text-slate-900">{playerNickname}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="px-4 py-2 text-white btn-secondary rounded-full shadow-md">
                {score}/{totalPossiblePoints}
              </Badge>
            </div>
          </div>

          {/* Progress + Timer */}
          <div className="flex justify-between mt-[-20px] items-center text-xl text-slate-900 font-medium">
            <span>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-slate-900" />
              <span className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-gray-800"}`}>
                {timeLeft}
              </span>
            </div>
          </div>
          <Progress
            value={progress}
            className="h-2 rounded-full bg-gray-300 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500"
          />
        </Card>

        {/* Question */}
        <Card className="bg-white shadow-lg rounded-2xl p-6">
         <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 btn-secondary text-white rounded-full text-sm font-bold mr-3">
            {currentQuestionIndex + 1}
          </span>
          {currentQuestion.text.replace(/_/g, " ")}
        </h2>
          <div className="flex gap-3 text-sm mt-[-25px] text-white mb-6">
            <Badge variant="secondary" className=" py-1.5 btn-secondary text-white rounded-full">
              {currentQuestion.points} pts
            </Badge>
            <Badge variant="outline" className=" py-1.5 text-slate-900 rounded-full">
              {currentQuestion.timeLimit}s
            </Badge>
          </div>

          {/* Answer Options */}
          {currentQuestion.type === "MCQ" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 mt-[-25px] gap-6">
              {currentQuestion.options.map((opt, index) => {
                const styles = [
                  { color: "bg-yellow-600", icon: "circle" },
                  { color: "bg-red-600", icon: "triangle" },
                  { color: "bg-blue-600", icon: "square" },
                  { color: "bg-green-600", icon: "diamond" },
                ];
                const { color, icon } = styles[index % styles.length];

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`flex items-center justify-start gap-3 text-white text-lg font-semibold py-6 px-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 ${color}`}
                  >
                    {renderIcon(icon)} {/* Rendering the icon here */}
                    <span>{opt.optionText}</span>
                  </button>
                );
              })}
            </div>
          )}

         {currentQuestion.type === "TF" && (
          <div className="grid grid-cols-2 gap-6">
            {currentQuestion.options.map((opt, index) => {
              const isTrue = opt.optionText.toLowerCase() === "true";
              const styles = [
                { color: "bg-green-600", icon: "circle" },  // True option, green
                { color: "bg-red-600", icon: "triangle" },  // False option, red
              ];
              const { color, icon } = styles[index % styles.length];

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(opt.optionText)}
                  className={`flex items-center justify-start gap-3 text-white text-xl font-semibold py-6 px-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 ${color}`}
                >
                  {renderIcon(icon)} {/* Render the correct icon */}
                  <span>{opt.optionText}</span>
                </button>
              );
            })}
          </div>
        )}


          {currentQuestion.type === "FB" && (
            <FillBlankQuestion question={currentQuestion} onAnswer={handleAnswer} timeLeft={timeLeft} />
          )}
        </Card>
      </div>
    </div>
  );
}
