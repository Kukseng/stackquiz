
"use client";
import { Clock, Search, Filter, Star, Users, BookOpen } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

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
  {
    id: 5,
    title: "Physics Advanced",
    questions: 15,
    time: "1 hour",
    difficulty: "Hard",
    color: "from-red-400 to-red-600",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    participants: 720,
    rating: 4.9,
    image: "https://schoolizer.com/img/articles_photos/17075942120.jpg",
  },
  {
    id: 6,
    title: "English Proficiency",
    questions: 20,
    time: "45 min",
    difficulty: "Medium",
    color: "from-amber-400 to-amber-600",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    participants: 1890,
    rating: 4.5,
    image: "https://kodakco.sgp1.digitaloceanspaces.com/blog/wp-content/uploads/2024/07/16125413/english-british-england-language.webp",
  },
  {
    id: 7,
    title: "History Overview",
    questions: 10,
    time: "30 min",
    difficulty: "Easy",
    color: "from-emerald-400 to-emerald-600",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    participants: 980,
    rating: 4.4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwHrywq-qhKrn_w3Q1u4aVmek2QVcP2VuN8g&s",
  },
  {
    id: 8,
    title: "Education for All",
    questions: 25,
    time: "1 hour",
    difficulty: "Hard",
    color: "from-red-400 to-red-600",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    participants: 1420,
    rating: 4.8,
    image: "https://cdn.businessday.ng/wp-content/uploads/2023/12/Education-1.png",
  },
];

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
      className="bg-white rounded-xl overflow-hidden shadow-md border cursor-pointer group"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
        <img
          src={challenge.image}
          alt={challenge.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star size={12} className="text-yellow-500 fill-current" />
          <span className="text-xs font-semibold text-gray-700">{challenge.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
            {challenge.title}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{challenge.questions} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{challenge.participants.toLocaleString()}</span>
          </div>
        </div>

        {/* Footer - Fixed alignment */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className={`bg-gradient-to-r ${challenge.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}>
            {challenge.difficulty}
          </span>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-600">
            <Clock size={16} className="text-gray-500" />
            <span>{challenge.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ChallengeGrid() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const filteredChallenges =
    selectedDifficulty === "All"
      ? challenges
      : challenges.filter((c) => c.difficulty === selectedDifficulty);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20 mt-8">
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-evenly mb-6 gap-4">
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

      {/* Difficulty Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {["All", "Easy", "Medium", "Hard"].map((level) => (
          <button
            key={level}
            onClick={() => setSelectedDifficulty(level)}
            className={`px-5 py-2 rounded-full font-semibold transition-colors ${
              selectedDifficulty === level
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 text-center">
        Start the Challenge
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredChallenges.map((challenge, i) => (
          <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
        ))}
      </div>
    </section>
  );
}