"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Quiz, Question, Option } from "@/types/quiz";
import { FillBlankQuestion } from "@/components/question-type/fill-blank";
import Image from "next/image";
import { FaCircle, FaSquare } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { FaDiamond } from "react-icons/fa6";
import { useAudio } from "@/providers/AudioProvider";

export interface GameAnswer {
  questionId: string;
  userAnswer: string | number;
  correct: boolean;
  timeSpent: number;
}

export interface GameResults {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: GameAnswer[];
}

interface GameEngineProps {
  quiz: Quiz;
  onGameComplete: (results: GameResults) => void;
  playerNickname: string;
}

export function GameEngine({
  quiz,
  onGameComplete,
  playerNickname,
}: GameEngineProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    typeof quiz.questions[0] === "object" &&
      quiz.questions[0] !== null &&
      "timeLimit" in quiz.questions[0]
      ? (quiz.questions[0] as Question).timeLimit
      : 30
  );
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<GameResults["answers"]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [gameStartTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  const { playClick, playCorrect, playWrong, playTimeUp } = useAudio();

  const currentQuestion =
    typeof quiz.questions[currentQuestionIndex] === "object" &&
    quiz.questions[currentQuestionIndex] !== null
      ? (quiz.questions[currentQuestionIndex] as Question)
      : quiz.questions[currentQuestionIndex];

  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getCorrectAnswer = useCallback(
    (question: Question | string | undefined) => {
      if (!question) return "";
      if (typeof question === "string") return question;

      const correctOption = question.options.find(
        (opt: any) =>
          typeof opt === "object" &&
          opt !== null &&
          "isCorrected" in opt &&
          !!(opt as any).isCorrected
      );
      if (!correctOption) return "";
      if (
        typeof correctOption === "object" &&
        correctOption !== null &&
        "optionText" in correctOption
      ) {
        return (correctOption as { optionText: string }).optionText;
      }
      return String(correctOption);
    },
    []
  );

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

  const isAnswerCorrect = useCallback(
    (userAnswer: string | number, question: Question) => {
      if (userAnswer === "" || userAnswer === null || userAnswer === undefined)
        return false;

      if (question.type === "MCQ") {
        const index =
          typeof userAnswer === "number" ? userAnswer : Number(userAnswer);
        if (
          !Number.isInteger(index) ||
          index < 0 ||
          index >= question.options.length
        )
          return false;
        const selectedOption = question.options[index];
        if (
          typeof selectedOption === "object" &&
          selectedOption !== null &&
          "isCorrected" in selectedOption
        ) {
          return (selectedOption as Option).isCorrected || false;
        }
        return false;
      } else if (question.type === "TF") {
        const selectedOption = question.options.find((opt) => {
          if (typeof opt === "string") {
            return opt.toLowerCase() === String(userAnswer).toLowerCase();
          }
          return (
            (opt as Option).optionText.toLowerCase() ===
            String(userAnswer).toLowerCase()
          );
        });
        if (!selectedOption) return false;
        if (typeof selectedOption === "string") return true;
        return (selectedOption as Option).isCorrected || false;
      } else if (question.type === "FB") {
        const index =
          typeof userAnswer === "number" ? userAnswer : Number(userAnswer);
        if (
          !Number.isInteger(index) ||
          index < 0 ||
          index >= question.options.length
        )
          return false;
        const selectedOption = question.options[index];
        if (
          typeof selectedOption === "object" &&
          selectedOption !== null &&
          "isCorrected" in selectedOption
        ) {
          return (selectedOption as Option).isCorrected || false;
        }
        return false;
      }
      return false;
    },
    []
  );

  const handleAnswer = useCallback(
    (userAnswer: string | number) => {
      // 🖱️ Click sound when choosing an answer
      playClick();

      const timeSpent = Date.now() - questionStartTime;
      const isTimedOut =
        userAnswer === "" || userAnswer === null || userAnswer === undefined;
      const isCorrect =
        !isTimedOut && isAnswerCorrect(userAnswer, currentQuestion as Question);
      const correctAns = getCorrectAnswer(currentQuestion);

      // 🔊 Play appropriate sound based on result
      if (isTimedOut) {
        playTimeUp();
      } else if (isCorrect) {
        playCorrect();
      } else {
        playWrong();
      }

      setLastAnswerCorrect(isCorrect);
      setCorrectAnswer(correctAns);
      setIsTimeUp(isTimedOut);
      setShowFeedback(true);

      if (isCorrect && typeof currentQuestion !== "string") {
        setScore((prev) => prev + (currentQuestion as Question).points);
      }

      const answerRecord = {
        questionId:
          typeof currentQuestion === "object" &&
          currentQuestion !== null &&
          "id" in currentQuestion
            ? currentQuestion.id
            : "",
        userAnswer: isTimedOut ? "" : userAnswer,
        correct: isCorrect,
        timeSpent,
      };

      setAnswers((prev) => [...prev, answerRecord]);

      setTimeout(() => {
        if (isLastQuestion) {
          const totalTimeSpent = Date.now() - gameStartTime;

          const results: GameResults = {
            score:
              isCorrect && typeof currentQuestion !== "string"
                ? score + currentQuestion.points
                : score,
            totalQuestions: quiz.questions.length,
            timeSpent: totalTimeSpent,
            answers: [...answers, answerRecord],
          };

          onGameComplete(results);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setTimeLeft(
            typeof quiz.questions[currentQuestionIndex + 1] === "object" &&
              quiz.questions[currentQuestionIndex + 1] !== null &&
              "timeLimit" in
                (quiz.questions[currentQuestionIndex + 1] as unknown as object)
              ? (
                  quiz.questions[
                    currentQuestionIndex + 1
                  ] as unknown as Question
                ).timeLimit
              : 30
          );
          setShowFeedback(false);
          setIsTimeUp(false);
          setQuestionStartTime(Date.now());
        }
      }, 1500);
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
      currentQuestionIndex,
      isAnswerCorrect,
      getCorrectAnswer,
      playClick,
      playCorrect,
      playWrong,
      playTimeUp,
    ]
  );

  // ⏳ Timer countdown
  useEffect(() => {
    if (showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playTimeUp(); // 🔔 time up sound here
          handleAnswer("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleAnswer, showFeedback, playTimeUp]);

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const totalPossiblePoints = quiz.questions.reduce((acc, q) => {
    return typeof q === "object" && q !== null && "points" in q
      ? acc + (q as Question).points
      : acc;
  }, 0);

  if (!isMounted) return null;

  // 🟡 FEEDBACK screen (after answering or time up)
  if (showFeedback) {
    return (
      <div className="container sm:px-2 lg:px-8 py-4 sm:py-2 lg:py-8 flex items-center justify-center min-h-screen">
        <Card
          className={`w-full max-w-md text-center bg-white ${
            isTimeUp
              ? "animate-shake-error border-orange-500"
              : lastAnswerCorrect
              ? "animate-pulse-success border-green-500"
              : "animate-shake-error border-red-500"
          }`}
        >
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div>
              {isTimeUp ? (
                <Image
                  className="mx-auto mb-0"
                  src="timeup.svg"
                  alt="Time's Up"
                  width={100}
                  height={100}
                />
              ) : lastAnswerCorrect ? (
                <Image
                  className="mx-auto mb-0"
                  src="correct.svg"
                  alt="Correct"
                  width={100}
                  height={100}
                />
              ) : (
                <Image
                  className="mx-auto mb-0"
                  src="wrong.svg"
                  alt="Incorrect"
                  width={80}
                  height={80}
                />
              )}
            </div>
            <h2
              className={`text-3xl font-bold mb-4 ${
                isTimeUp
                  ? "text-orange-600"
                  : lastAnswerCorrect
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {isTimeUp
                ? "Time's Up!"
                : lastAnswerCorrect
                ? "Correct!"
                : "Incorrect!"}
            </h2>
            <p className="text-muted-foreground text-lg">
              {isTimeUp
                ? "You ran out of time. No points were awarded."
                : lastAnswerCorrect
                ? `Great job! +${
                    typeof currentQuestion === "object" &&
                    "points" in currentQuestion
                      ? currentQuestion.points
                      : 0
                  } points`
                : `The correct answer was: ${correctAnswer}`}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🟢 MAIN Question UI
  return (
    <div className="flex items-center min-h-screen justify-center">
      <div className="container mx-auto max-w-3xl space-y-8">
        {/* Header */}
        <Card className="bg-white shadow-xl rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-orange-400">
                {quiz.title}
              </h1>
              <p className="text-lg text-slate-900 mt-2.5">
                <span>Participant</span>{" "}
                <span className="text-slate-900">{playerNickname}</span>
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
              <span
                className={`text-3xl font-bold ${
                  timeLeft <= 10
                    ? "text-red-500 animate-pulse"
                    : "text-gray-800"
                }`}
              >
                {timeLeft}
              </span>
            </div>
          </div>
          <Progress
            value={progress}
            className="h-2 rounded-full bg-gray-300 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500"
          />
        </Card>

        {/* Question + Options */}
        <Card className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 btn-secondary text-white rounded-full text-sm font-bold mr-3">
              {currentQuestionIndex + 1}
            </span>
            {typeof currentQuestion === "object" &&
            currentQuestion !== null &&
            "text" in currentQuestion
              ? currentQuestion.text.replace(/_/g, " ")
              : ""}
          </h2>

          {/* MCQ */}
          {typeof currentQuestion === "object" &&
            currentQuestion !== null &&
            "type" in currentQuestion &&
            currentQuestion.type === "MCQ" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 mt-[-25px] gap-6">
                {(currentQuestion.options as Option[]).map((opt, index) => {
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
                      {renderIcon(icon)}
                      <span>{opt.optionText}</span>
                    </button>
                  );
                })}
              </div>
            )}

          {/* True/False */}
          {typeof currentQuestion === "object" &&
            currentQuestion !== null &&
            "type" in currentQuestion &&
            currentQuestion.type === "TF" && (
              <div className="grid grid-cols-2 gap-6">
                {(currentQuestion.options as (Option | string)[]).map(
                  (opt, index) => {
                    const styles = [
                      { color: "bg-green-600", icon: "circle" },
                      { color: "bg-red-600", icon: "triangle" },
                    ];
                    const { color, icon } = styles[index % styles.length];

                    return (
                      <button
                        key={index}
                        onClick={() =>
                          handleAnswer(
                            typeof opt === "object" &&
                              opt !== null &&
                              "optionText" in opt
                              ? (opt as Option).optionText
                              : opt
                          )
                        }
                        className={`flex items-center justify-start gap-3 text-white text-xl font-semibold py-6 px-4 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 ${color}`}
                      >
                        {renderIcon(icon)}
                        <span>
                          {typeof opt === "object" &&
                          opt !== null &&
                          "optionText" in opt
                            ? (opt as Option).optionText
                            : String(opt)}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            )}

          {/* Fill Blank */}
          {typeof currentQuestion === "object" &&
            currentQuestion !== null &&
            "type" in currentQuestion &&
            currentQuestion.type === "FB" && (
              <FillBlankQuestion
                question={currentQuestion}
                onAnswer={handleAnswer}
                timeLeft={timeLeft}
              />
            )}
        </Card>
      </div>
    </div>
  );
}
