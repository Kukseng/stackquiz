"use client";
import React, { useState, useEffect } from "react";
import CardQuizComponent from "./CardQuizComponent";

interface Challenge {
  id: string;
  title: string;
  questions: number;
  time: string;
  difficulty: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  participants: number;
  rating: number;
  image: string;
  categories: { id: string; name: string }[]; // Added categories
}

interface QuizAPI {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: string;
  difficulty: string;
  participants?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  categories: { id: string; name: string }[]; // Added categories from API
  questions: {
    id: string;
    text: string;
    type: string;
    questionOrder: number;
    timeLimit: number;
    points: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    options: unknown[];
  }[];
}

interface ChallengeGridProps {
  limit?: number;
  selectedDifficulty?: string;
  searchTerm?: string;
  selectedCategory?: string;
}

const getDifficultyStyle = (difficulty: string) => {
  switch (difficulty.toUpperCase()) {
    case "EASY":
      return {
        color: "from-emerald-400 to-emerald-600",
        textColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
      };
    case "MEDIUM":
      return {
        color: "from-yellow-400 to-yellow-600",
        textColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    case "HARD":
      return {
        color: "from-red-400 to-red-600",
        textColor: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    default:
      return {
        color: "from-blue-400 to-blue-600",
        textColor: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
      };
  }
};

const getValidImageUrl = (thumbnailUrl: string | null | undefined): string => {
  if (!thumbnailUrl || thumbnailUrl.trim() === "") {
    return "https://via.placeholder.com/300x200?text=No+Image";
  }
  try {
    new URL(thumbnailUrl);
    return thumbnailUrl;
  } catch {
    return "https://via.placeholder.com/300x200?text=Invalid+Image";
  }
};

export default function ChallengeGrid({
  limit,
  selectedDifficulty = "All",
  searchTerm = "",
  selectedCategory = "All",
}: ChallengeGridProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes?active=true`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error(`Failed to fetch quizzes: ${res.status}`);

        const data: QuizAPI[] = await res.json();

        const mappedChallenges: Challenge[] = data.map((quiz) => {
          const difficultyStyle = getDifficultyStyle(quiz.difficulty);

          return {
            id: quiz.id,
            title: quiz.title || "Untitled Quiz",
            questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
            time: "N/A",
            difficulty: quiz.difficulty || "MEDIUM",
            ...difficultyStyle,
            participants: quiz.participants || 0,
            rating: quiz.rating || 0,
            image: getValidImageUrl(quiz.thumbnailUrl),
            categories: quiz.categories || [], // Keep categories from API
          };
        });

        setChallenges(mappedChallenges);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Apply all filters with proper category filtering
  const filteredChallenges = challenges
    .filter((c) =>
      selectedDifficulty === "All" ? true : c.difficulty === selectedDifficulty
    )
    .filter((c) =>
      searchTerm ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) : true
    )
    .filter((c) => {
      // Category filter - check if quiz has the selected category
      if (selectedCategory === "All") return true;
      
      // Check if any category in the quiz's categories array matches the selected category ID
      return c.categories?.some(cat => cat.id === selectedCategory) || false;
    });

  const displayedChallenges = limit ? filteredChallenges.slice(0, limit) : filteredChallenges;

  if (loading)
    return (
      <div className="text-center mt-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading quizzes...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );

  if (displayedChallenges.length === 0)
    return <p className="text-center mt-10 text-gray-500">No quizzes match your filters</p>;

  return (
    <section className="max-w-5xl mx-auto mt-8 px-4 md:px-1 lg:px-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14">
        {displayedChallenges.map((challenge, i) => (
          <CardQuizComponent key={challenge.id} challenge={challenge} index={i} />
        ))}
      </div>
    </section>
  );
}