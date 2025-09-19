"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Stage from "./Stage";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import ChallengeGrid from "../GridCardComponent";

// Types
interface QuizData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  questions: string[];
  category?: string;
}

// Fetch quiz by ID from API
const fetchQuizById = async (id: string): Promise<QuizData | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/quizzes?active=true`,
      { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const quizzes: QuizData[] = await res.json();
    return quizzes.find((quiz) => quiz.id === id) || null;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};

export default function StartPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params?.id as string;
  
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuizData = async () => {
      if (!quizId) {
        setError("No quiz ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await fetchQuizById(quizId);
        
        if (!data) {
          setError("Quiz not found");
        } else {
          setQuizData(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load quiz");
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [quizId]);

  const handleStartQuiz = () => {
    // Add your quiz start logic here
    console.log("Starting quiz:", quizId);
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Stage>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading quiz...</p>
          </div>
        </div>
      </Stage>
    );
  }

  if (error || !quizData) {
    return (
      <Stage>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {error || "Quiz Not Found"}
            </h1>
            <p className="text-slate-600 mb-4">
              The quiz you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
            </p>
            <Button 
              onClick={handleGoBack}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go Back
            </Button>
          </div>
        </div>
      </Stage>
    );
  }

  // Determine difficulty based on number of questions (you can customize this logic)
  const getDifficulty = (questionCount: number) => {
    if (questionCount <= 10) return { label: "Easy", color: "bg-green-500" };
    if (questionCount <= 20) return { label: "Medium", color: "bg-yellow-500" };
    return { label: "Hard", color: "bg-red-500" };
  };

  const difficulty = getDifficulty(quizData.questions?.length || 0);

  return (
    <Stage>
      <div className="grid gap-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Card className="relative overflow-hidden rounded-xl group">
            {/* Dynamic thumbnail from API */}
            {quizData.thumbnailUrl ? (
              <Image
                src={quizData.thumbnailUrl}
                alt={quizData.title}
                width={600}
                height={400}
                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-xl transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                <div className="text-white text-6xl font-bold opacity-20">
                  {quizData.title?.charAt(0) || 'Q'}
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 md:p-8 flex flex-col justify-center bg-[#5a6fb6]/40 rounded-xl">
            <h2 className="text-white font-extrabold text-2xl md:text-3xl">
              {quizData.title}
            </h2>
            <p className="mt-2 text-white/80 text-sm leading-relaxed">
              {quizData.description}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                {quizData.questions?.length || 0} questions
              </span>
              <span className={`${difficulty.color} text-white text-xs px-3 py-1 rounded-full`}>
                {difficulty.label}
              </span>
            </div>

            <div className="mt-7">
              <div className="text-sm text-white/85 mb-2">Content</div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-amber-300 bg-black/30 px-7 py-2 text-white/85">
                  {quizData.title || "General"}
                </div>
                <Button 
                  size="sm" 
                  className="h-10 rounded-full px-6 bg-white/10 text-white hover:bg-white/20"
                  onClick={handleStartQuiz}
                >
                  Start
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Grid */}
        <ChallengeGrid/>
      </div>
    </Stage>
  );
}