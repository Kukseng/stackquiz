"use client";
import Image from "next/image";
import { Clock, Search } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import React, { useEffect, useRef } from "react";

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
  {
    id: 5,
    title: "Physics Advanced",
    questions: 15,
    time: "1 hour",
    difficulty: "Hard",
    color: "bg-red-500",
    image: "https://schoolizer.com/img/articles_photos/17075942120.jpg",
  },
  {
    id: 6,
    title: "English Proficiency",
    questions: 20,
    time: "45 min",
    difficulty: "Medium",
    color: "bg-yellow-500",
    image:
      "https://kodakco.sgp1.digitaloceanspaces.com/blog/wp-content/uploads/2024/07/16125413/english-british-england-language.webp",
  },
  {
    id: 7,
    title: "History Overview",
    questions: 10,
    time: "30 min",
    difficulty: "Easy",
    color: "bg-green-500",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwHrywq-qhKrn_w3Q1u4aVmek2QVcP2VuN8g&s",
  },
  {
    id: 8,
    title: "Education for All",
    questions: 25,
    time: "1 hour",
    difficulty: "Hard",
    color: "bg-red-500",
    image: "https://cdn.businessday.ng/wp-content/uploads/2023/12/Education-1.png",
  },
];

// Extract each card into its own component
const ChallengeCard: React.FC<{ challenge: typeof challenges[0]; index: number }> = ({ challenge, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: false, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 80, damping: 20, delay: index * 0.15 },
      });
    } else {
      controls.start({ opacity: 0, y: 60 });
    }
  }, [inView, controls, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white rounded-xl overflow-hidden shadow-md border cursor-pointer"
    >
      <div className="relative w-full h-58">
        <Image src={challenge.image} alt={challenge.title} fill className="object-cover" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{challenge.title}</h3>
        <p className="text-gray-600 text-sm">{challenge.questions} questions</p>

        <div className="mt-12 flex items-center justify-between">
          <span className={`${challenge.color} text-white text-xs px-3 py-1 rounded-full`}>
            {challenge.difficulty}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock size={16} />
            {challenge.time}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ChallengeGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 mt-8">
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-evenly mb-8 gap-4">
        <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={16} className="text-white opacity-70" />
          </span>
          <input
            type="text"
            placeholder="Search quizzes..."
            className="w-full pl-10 pr-4 py-2 text-white rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select className="w-full md:w-auto text-white px-4 py-2 mt-4 md:mt-0 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Select category</option>
          <option>Math</option>
          <option>Physical</option>
          <option>History</option>
          <option>English</option>
          <option>Chemistry</option>
          <option>Computer</option>
          <option>Science</option>
          <option>Education</option>
          <option>IT</option>
          <option>Other</option>
        </select>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6">Start the Challenge</h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {challenges.map((challenge, i) => (
          <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
        ))}
      </div>
    </section>
  );
}
