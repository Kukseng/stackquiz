"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import CardQuizComponent from "./CardQuizComponent";

const challenges = [
  {
    id: 1,
    title: "Math Fundamental",
    questions: 15,
    time: "30 min",
    difficulty: "Easy",
    color: "from-emerald-400 to-emerald-600",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    participants: 1250,
    rating: 4.8,
    image: "https://sohamtimes.org//wp-content/uploads/2018/07/Mathematics.png",
  },
  {
    id: 2,
    title: "Computer Programming",
    questions: 25,
    time: "1 hour",
    difficulty: "Hard",
    color: "from-red-400 to-red-600",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    participants: 890,
    rating: 4.9,
    image: "https://media.geeksforgeeks.org/wp-content/uploads/20241017105314407132/Basics-of-Computer-Programming-For-Beginners.webp",
  },
  {
    id: 3,
    title: "Science Essentials",
    questions: 20,
    time: "45 min",
    difficulty: "Medium",
    color: "from-amber-400 to-amber-600",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    participants: 2100,
    rating: 4.7,
    image: "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg",
  },
  {
    id: 4,
    title: "Chemistry Basics",
    questions: 15,
    time: "30 min",
    difficulty: "Easy",
    color: "from-emerald-400 to-emerald-600",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    participants: 1560,
    rating: 4.6,
    image: "https://i.ytimg.com/vi/5iTOphGnCtg/hq720.jpg",
  },
];

export default function ChallengeGrid() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const filteredChallenges =
    selectedDifficulty === "All"
      ? challenges
      : challenges.filter((c) => c.difficulty === selectedDifficulty);

  return (
    <section className="max-w-7xl mx-auto  mt-8">


      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredChallenges.map((challenge, i) => (
          <CardQuizComponent key={challenge.id} challenge={challenge} index={i} />
        ))}
      </div>
    </section>
  );
}
