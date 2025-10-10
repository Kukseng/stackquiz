"use client";
import { useState } from "react";
import CardQuizComponent from "../CardQuizComponent";
import Searchbar from "../leaderboard/Searchbar";
import TemplatesCardComponent from "../TemplateCardComponent";
import { Quiz } from "@/lib/api/quizApi";

interface LibraryProps {
  myQuizzes?: Quiz[];
}

export function Library({ myQuizzes }: LibraryProps) {
  // State for filters
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  return (
    <div className="min-h-[800px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden rounded-lg">
      <Searchbar 
        onSearch={setSearchTerm}
        onDifficultyChange={setSelectedDifficulty}
        onCategoryChange={setSelectedCategory}
      />

      <div className="relative flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Library Page Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Quiz Library</h1>
            </div>
            <p className="text-gray-300 text-lg">
              Discover quizzes to test knowledge across subjects and skill levels.
            </p>
          </div>

          {/* My Quizzes Section */}
          {myQuizzes && myQuizzes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">My Quizzes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myQuizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white rounded-lg p-4 shadow-lg">
                    <h3 className="font-bold text-gray-800">{quiz.title}</h3>
                    <p className="text-gray-600 text-sm">{quiz.description}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      Difficulty: {quiz.difficulty} | Visibility: {quiz.visibility}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Classic Mode Section */}
          <div className="mb-4">
            <div className="flex items-start gap-8"></div>
          </div>

          {/* Quiz Cards Grid */}
          <TemplatesCardComponent
            selectedDifficulty={selectedDifficulty}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}