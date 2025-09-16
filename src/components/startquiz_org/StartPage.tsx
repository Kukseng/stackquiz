"use client";

import React from "react";
import Image from "next/image";
import Stage from "./Stage";
import Card from "./Card";
import { Button } from "@/components/ui/button";
import CardQuizComponent from "../CardQuizComponent";

type CardData = {
  id: number;
  title: string;
  questions: number;
  time: string;
  difficulty: string;
  color: string;
  image: string;
};

const quizCards: CardData[] = [
  {
    id: 1,
    title: "Math Fundamental",
    questions: 15,
    time: "30 min",
    difficulty: "Easy",
    color: "bg-green-500",
    image: "https://sohamtimes.org//wp-content/uploads/2018/07/Mathematics.png",
  },
  {
    id: 2,
    title: "Computer Programming",
    questions: 25,
    time: "1 hour",
    difficulty: "Hard",
    color: "bg-red-500",
    image:
      "https://media.geeksforgeeks.org/wp-content/uploads/20241017105314407132/Basics-of-Computer-Programming-For-Beginners.webp",
  },
  {
    id: 3,
    title: "Science Essentials",
    questions: 20,
    time: "45 min",
    difficulty: "Medium",
    color: "bg-yellow-500",
    image:
      "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg",
  },
  {
    id: 4,
    title: "Chemistry Basics",
    questions: 15,
    time: "30 min",
    difficulty: "Easy",
    color: "bg-green-500",
    image: "https://i.ytimg.com/vi/5iTOphGnCtg/hq720.jpg",
  },
];

export default function StartPage() {
  return (
    <Stage>
      <div className="grid gap-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Card className="relative overflow-hidden rounded-xl group">
            <Image
              src="https://static.vecteezy.com/system/resources/previews/000/152/286/non_2x/linear-computer-technology-vector.jpg"
              alt="Computer Programming"
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
          </Card>

          <Card className="p-6 md:p-8 flex flex-col justify-center bg-[#5a6fb6]/40 rounded-xl">
            <h2 className="text-white font-extrabold text-2xl md:text-3xl">
              Computer Programming
            </h2>
            <p className="mt-2 text-white/80 text-sm leading-relaxed">
              Computer programming is writing code to make computers perform tasks or solve problems.
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                25 questions
              </span>
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                Hard
              </span>
            </div>

            <div className="mt-7">
              <div className="text-sm text-white/85 mb-2">Content</div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-amber-300 bg-black/30 px-16 py-2 text-white/85">
                  Computer Science
                </div>
                <Button size="sm" className="h-10 font-bold rounded-full px-6 btn-text btn-secondary">
                  Start
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {quizCards.map((q, i) => (
            <CardQuizComponent
              key={q.id}
              id={q.id}
              index={i}
              title={q.title}
              questions={q.questions}
              time={q.time}
              difficulty={q.difficulty}
              color={q.color}
              image={q.image}
            />
          ))}
        </div>
      </div>
    </Stage>
  );
}
