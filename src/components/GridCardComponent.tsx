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
}

// API response type - Updated to match your actual API structure
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

// Function to get difficulty-based styling
const getDifficultyStyle = (difficulty: string) => {
  switch (difficulty.toUpperCase()) {
    case 'EASY':
      return {
        color: "from-emerald-400 to-emerald-600",
        textColor: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
      };
    case 'MEDIUM':
      return {
        color: "from-yellow-400 to-yellow-600",
        textColor: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    case 'HARD':
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

// Function to validate and fix image URLs
const getValidImageUrl = (thumbnailUrl: string | null | undefined): string => {
  // If no thumbnail URL provided, return placeholder
  if (!thumbnailUrl || thumbnailUrl.trim() === "") {
    return "https://via.placeholder.com/300x200?text=No+Image";
  }
  
  // Check if URL is valid
  try {
    new URL(thumbnailUrl);
    return thumbnailUrl;
  } catch {
    // If invalid URL, return placeholder
    return "https://via.placeholder.com/300x200?text=Invalid+Image";
  }
};

export default function ChallengeGrid() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quizzes?active=true`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Add any required headers here
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch quizzes: ${res.status} ${res.statusText}`);
        }

        const data: QuizAPI[] = await res.json();

        // Debug: Log the API response to check data structure
        console.log("API Response:", data);

        // Map API data into our Challenge format
        const mappedChallenges: Challenge[] = data.map((quiz) => {
          const difficultyStyle = getDifficultyStyle(quiz.difficulty);
          
          return {
            id: quiz.id,
            title: quiz.title || "Untitled Quiz",
            questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
            time: "N/A", // Your API doesn't provide time
            difficulty: quiz.difficulty || "MEDIUM",
            ...difficultyStyle,
            participants: quiz.participants || 0,
            rating: quiz.rating || 0,
            image: getValidImageUrl(quiz.thumbnailUrl), // ✅ FIXED with validation
          };
        });

        console.log("Mapped Challenges:", mappedChallenges);
        setChallenges(mappedChallenges);
      } catch (err: unknown) {
        console.error("Error fetching quizzes:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const filteredChallenges =
    selectedDifficulty === "All"
      ? challenges
      : challenges.filter((c) => c.difficulty === selectedDifficulty);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4 md:px-10 lg:px-20">
        <div className="text-center mt-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4 md:px-10 lg:px-20">
        <div className="text-center mt-10">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (challenges.length === 0) {
    return (
      <div className="max-w-7xl mx-auto mt-8 px-4 md:px-10 lg:px-20">
        <p className="text-center mt-10 text-gray-500">No quizzes available</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto mt-8 px-4 md:px-1 lg:px-3">




      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
        {filteredChallenges.map((challenge, i) => (
          <CardQuizComponent
            key={challenge.id}
            challenge={challenge}
            index={i}
          />
        ))}
      </div>

      {filteredChallenges.length === 0 && selectedDifficulty !== "All" && (
        <p className="text-center mt-10 text-gray-500">
          No quizzes found for {selectedDifficulty} difficulty
        </p>
      )}
    </section>
  );
}