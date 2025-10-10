"use client";
import React, { useState, useEffect } from "react";
import CardQuizComponent from "./CardQuizComponent";

// Local Challenge type for rendering
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
  categoryId?: string;
}

// API response type
interface QuizAPI {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  visibility: string;
  difficulty: string;
  categoryId?: string;
  category_id?: string;
  category?: string | { id: string; name: string };
  participants?: number;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  questions: Array<any>;
}

interface TemplateCardComponentProps {
  selectedDifficulty: string;
  searchTerm: string;
  selectedCategory: string;
}

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

const extractCategoryId = (quiz: QuizAPI): string | undefined => {
  if (quiz.categoryId && typeof quiz.categoryId === 'string') {
    return quiz.categoryId;
  }
  if (quiz.category_id && typeof quiz.category_id === 'string') {
    return quiz.category_id;
  }
  if (quiz.category && typeof quiz.category === 'object' && 'id' in quiz.category) {
    return quiz.category.id;
  }
  if (quiz.category && typeof quiz.category === 'string') {
    return quiz.category;
  }
  return undefined;
};

export default function TemplateCardComponent({
  selectedDifficulty,
  searchTerm,
  selectedCategory,
}: TemplateCardComponentProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noCategoryData, setNoCategoryData] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          "https://stackquiz-api.stackquiz.me/api/v1/quizzes?active=true",
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch quizzes: ${res.status} ${res.statusText}`);
        }

        const data: QuizAPI[] = await res.json();

        // Check if ANY quiz has category data
        const hasCategories = data.some(quiz => extractCategoryId(quiz) !== undefined);
        setNoCategoryData(!hasCategories);

        if (data.length > 0) {
          console.log("🔍 API Response Sample:", {
            firstQuiz: data[0],
            hasCategoryField: 'category' in data[0],
            hasCategoryIdField: 'categoryId' in data[0],
            hasCategory_idField: 'category_id' in data[0],
          });
        }

        if (!hasCategories) {
          console.warn("⚠️ WARNING: No quizzes have category information in the API response!");
          console.warn("The API needs to return categoryId, category_id, or category field for filtering to work.");
        }

        const mappedChallenges: Challenge[] = data.map((quiz) => {
          const difficultyStyle = getDifficultyStyle(quiz.difficulty || "MEDIUM");
          const categoryId = extractCategoryId(quiz);
          
          return {
            id: quiz.id,
            title: quiz.title || "Untitled Quiz",
            questions: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
            time: "N/A",
            difficulty: (quiz.difficulty || "MEDIUM").toUpperCase(),
            categoryId: categoryId,
            ...difficultyStyle,
            participants: quiz.participants || 0,
            rating: quiz.rating || 0,
            image: getValidImageUrl(quiz.thumbnailUrl),
          };
        });

        console.log("✅ Total Quizzes Loaded:", mappedChallenges.length);
        console.log("📊 Quizzes with Categories:", mappedChallenges.filter(c => c.categoryId).length);
        
        setChallenges(mappedChallenges);
      } catch (err: unknown) {
        console.error("❌ Error fetching quizzes:", err);
        if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesDifficulty =
      !selectedDifficulty ||
      selectedDifficulty === "All" ||
      (challenge.difficulty && selectedDifficulty && challenge.difficulty.toUpperCase() === selectedDifficulty.toUpperCase());

    const matchesSearch =
      !searchTerm ||
      searchTerm === "" ||
      (challenge.title && challenge.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // If no category data exists, ignore category filter
    const matchesCategory = 
      noCategoryData ||
      !selectedCategory ||
      selectedCategory === "All" || 
      (challenge.categoryId !== undefined && challenge.categoryId === selectedCategory);

    return matchesDifficulty && matchesSearch && matchesCategory;
  });

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

      {/* Active filter info */}
      {!noCategoryData && selectedCategory !== "All" && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Active Filter:</strong> Category ID = {selectedCategory}
            <br />
            <strong>Matching Quizzes:</strong> {filteredChallenges.length} of {challenges.length}
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-10">
        {filteredChallenges.map((challenge, i) => (
          <CardQuizComponent
            key={challenge.id}
            challenge={challenge}
            index={i}
          />
        ))}
      </div>

      {/* No results message */}
      {filteredChallenges.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-gray-500 text-lg">No quizzes found</p>
          <p className="text-gray-400 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </section>
  );
}