"use client";

import { useState } from "react";
import { QuizSelection } from "@/components/play-quiz/quiz_section";
import { GameEngine } from "@/components/play-quiz/game-engine";
import { ResultsSystem } from "@/components/play-quiz/result_system";
import { NicknameEntry } from "@/components/play-quiz/nickname_entry";
import { WebSocketProvider } from "@/context/websocket-context";
import { useParams } from "next/navigation";

import { MuteButton } from "@/components/play-quiz/mute_button";
import AudioProvider from "@/providers/AudioProvider";

export type Quiz = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: string;
  difficulty: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
};

export type Question = {
  id: string;
  text: string;
  type: "MCQ" | "TF" | "FB"; // Multiple Choice, True/False, Fill Blank
  questionOrder: number;
  timeLimit: number;
  points: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  options: Option[];
};

export type Option = {
  id: string;
  optionText: string;
  optionOrder: number;
  isCorrected: boolean;
  createdAt: string;
  participantAnswers: unknown[];
};

export type GameResults = {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    userAnswer: string | number;
    correct: boolean;
    timeSpent: number;
  }>;
};

export type GameState = "selection" | "playing" | "results" | "nickname";

export default function QuizApp() {
  const { id } = useParams() as { id: string };
  const [gameState, setGameState] = useState<GameState>("nickname");
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [gameResults, setGameResults] = useState<GameResults | null>(null);
  const [playerNickname, setPlayerNickname] = useState<string>("");

  /**
   * 🧑‍🎓 Nickname → Start Quiz → Unlock Audio + Fetch Quiz
   */
  const handleNicknameSet = async (nickname: string) => {
    setPlayerNickname(nickname);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch quiz: ${response.status}`);
      }

      const quizData: Quiz = await response.json();
      setSelectedQuiz(quizData);
      setGameState("playing");
    } catch (error) {
      console.error("Error loading quiz:", error);
      alert("Could not load the quiz. Please try again.");
    }
  };

  /**
   * 🧭 Quiz selection handler
   */
  const handleQuizSelect = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setGameState("playing");
  };

  /**
   * 🏁 Game completed
   */
  const handleGameComplete = (results: GameResults) => {
    setGameResults(results);
    setGameState("results");
  };

  /**
   * 🔁 Play again handler
   */
  const handlePlayAgain = () => {
    setGameState("selection");
    setSelectedQuiz(null);
    setGameResults(null);
  };

  return (
    <WebSocketProvider roomId={id}>
      {/* 🎧 AudioProvider wraps the entire flow so background & SFX persist */}
      <AudioProvider>
        <div className="min-h-screen relative bg-gradient-to-b from-blue-600 to-indigo-900">
          {/* 🔇 Global Mute/Unmute control */}
          <MuteButton />

          {/* 🧑 Nickname Entry */}
          {gameState === "nickname" && (
            <NicknameEntry onNicknameSet={handleNicknameSet} />
          )}

          {/* 🧭 Quiz Selection */}
          {gameState === "selection" && (
            <QuizSelection onQuizSelect={handleQuizSelect} />
          )}

          {/* 🕹️ Game Engine */}
          {gameState === "playing" && selectedQuiz && (
            <GameEngine
              quiz={selectedQuiz}
              onGameComplete={handleGameComplete}
              playerNickname={playerNickname}
            />
          )}

          {/* 🏆 Results Screen */}
          {gameState === "results" && gameResults && selectedQuiz && (
            <ResultsSystem
              results={gameResults}
              quiz={selectedQuiz}
              onPlayAgain={handlePlayAgain}
              playerNickname={playerNickname}
            />
          )}
        </div>
      </AudioProvider>
    </WebSocketProvider>
  );
}
