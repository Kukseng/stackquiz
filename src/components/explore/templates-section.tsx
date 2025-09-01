"use client";
import Image from "next/image";
import { Clock } from "lucide-react";

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
    image: "https://media.geeksforgeeks.org/wp-content/uploads/20241017105314407132/Basics-of-Computer-Programming-For-Beginners.webp",
  },
  {
    id: 3,
    title: "Science Essentials",
    questions: 20,
    time: "45 min",
    difficulty: "Medium",
    color: "bg-yellow-500",
    image: "https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg",
  },
    {
    id: 4,
    title: "Chemistry Basics",
    questions: 15,
    time: "30 min",
    difficulty: "Easy",
    color: "bg-green-500",
    image: "https://i.ytimg.com/vi/5iTOphGnCtg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD3b70iq8hohw605nEB622Q_mzzfg", 
  },
  {
    id: 5,
    title: "Physics Advanced",
    questions: 15,
    time: "1 hour",
    difficulty: "Hard",
    color: "bg-red-500",
    image: "https://ramjas.du.ac.in/college/web/dept/physics.jpg",
  },
  {
    id: 6,
    title: "English Proficiency",
    questions: 20,
    time: "45 min",
    difficulty: "Medium",
    color: "bg-yellow-500",
    image: "https://kodakco.sgp1.digitaloceanspaces.com/blog/wp-content/uploads/2024/07/16125413/english-british-england-language.webp",
  },
    {
    id: 7,
    title: "History Overview",
    questions: 10,
    time: "30 min",
    difficulty: "Easy",
    color: "bg-green-500",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwHrywq-qhKrn_w3Q1u4aVmek2QVcP2VuN8g&s", 
  },
  {
    id: 8,
    title: "Education for All",
    questions: 25,
    time: "1 hour",
    difficulty: "Hard",
    color: "bg-red-500",
    image:"https://cdn.businessday.ng/wp-content/uploads/2023/12/Education-1.png"
  },
  
];

export default function ChallengeGrid() {
  return (
    <section className="px-4 md:px-10 py-10">
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-evenly  mb-8">
        <input
          type="text"
          placeholder="Search quizzes..."
          className="w-full md:w-1/2 px-4 py-2 text-white rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select className="w-full md:w-auto px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500">
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

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6">
        Start the Challenge
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md-grid-cols-3 lg:grid-cols-4 gap-6">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl overflow-hidden shadow-md border hover:shadow-xl transition"
          >
            {/* Image */}
            <div className="relative w-full h-40 md:h-48">
              <Image
                src={c.image}
                alt={c.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{c.title}</h3>
              <p className="text-gray-600 text-sm">
                {c.questions} questions
              </p>

              <div className="mt-3 flex items-center justify-between">
                {/* Difficulty */}
                <span
                  className={`${c.color} text-white text-xs px-3 py-1 rounded-full`}
                >
                  {c.difficulty}
                </span>

                {/* Time */}
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock size={16} />
                  {c.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
