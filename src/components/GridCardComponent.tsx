"use client";
import React from "react";
import CardQuizComponent from "./CardQuizComponent"; 

const challenges = [
  {
    id: 1,
    title: "Math Fundamental",
    questions: 15,
    time: "30 min",
    difficulty: "Easy",
    color: "bg-green-500",
    image: "https://sohamtimes.org//wp-content/uploads/2018/07/Mathematics.png",
  },
 
];

export default function GridCardComponents() {
  return (
    <section className="px-4 md:px-10 lg:px-20 mt-8">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {challenges.map((c, i) => (
          <CardQuizComponent key={c.id} {...c} index={i} />
        ))}
      </div>
    </section>
  );
}
