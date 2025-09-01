"use client";
import Image from "next/image";
import { Eye } from "lucide-react";

const templates = [
  {
    id: 1,
    title: "Computer Fundamental",
    desc: "Understanding computer fundamentals helps you unlock the core technology behind everyday devices.",
    date: "October 15, 2024",
    views: "1.5K",
    image: "https://media.geeksforgeeks.org/wp-content/uploads/20230628112440/Computer-Fundamentals-Tutorial.png", 
  },
  {
    id: 2,
    title: "Science Essentials",
    desc: "Science Essentials covers the core ideas of biology, and earth science to build a strong foundation.",
    date: "August 03, 2024",
    views: "12K",
    image: "https://schoolsweek.co.uk/wp-content/uploads/2020/04/Science-scientists-SM.jpg",
  },
  {
    id: 3,
    title: "Math Fundamental",
    desc: "Math Fundamental builds core skills in arithmetic, algebra, geometry, and problem-solving for a strong learning base.",
    date: "April 10, 2024",
    views: "5.3K",
    image: "https://freebootcamp.net/wp-content/uploads/2024/02/Computer-Fundamentals.png",
  },
  {
    id: 4,
    title: "Computer Fundamental",
    desc: "Understanding computer fundamentals helps you unlock the core technology behind everyday devices.",
    date: "October 15, 2024",
    views: "1.5K",
    image: "https://www.analyticssteps.com/backend/media/thumbnail/9987645/2803978_1620722464_computer%20scienceArtboard%201%20(1).jpg",
  },
];

export default function Templates() {
  return (
    <section className="px-4 md:px-10 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-400">
          Ready-to-Use Templates
        </h2>
        <a
          href="#"
          className="text-white hover:underline text-sm md:text-base"
        >
          View more templates
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((t) => (
          <div
            key={t.id}
            className="flex flex-col sm:flex-row bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-xl transition"
          >
            {/* Image */}
            <div className="relative w-full m-2 sm:w-40 h-40 sm:h-auto ">
              <Image
                src={t.image}
                alt={t.title}
                fill
                className="object-contian rounded-sm"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between p-4 flex-1">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{t.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{t.desc}</p>
              </div>
              <hr className="mt-2"/>

              <div className="mt-4 flex items-center justify-between text-gray-500 text-sm">
                <span>{t.date}</span>
            
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  {t.views}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
