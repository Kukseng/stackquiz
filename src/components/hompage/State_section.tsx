"use client";
import Image from "next/image";

export function StatsSection() {
  const stats = [
    { number: "10K+", label: "Questions", icon: "/icon_hero/quiz_create.svg" },
    { number: "4K+", label: "Active Players", icon: "/icon_hero/active_play.svg" },
    { number: "20+", label: "Countries", icon: "/icon_hero/contry.svg" },
  ];

  return (
    <section className="relative w-full py-12 bg-footer glow-pink glowAnim">
      <div className="relative max-w-7xl mx-auto glow-pink z-10 flex items-center justify-center px-4">
        <div className="w-full grid md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 transition-transform duration-500 ease-in-out hover:scale-110"
            >
              <div className="relative w-12 h-12 mb-4">
                <Image
                  src={stat.icon}
                  alt={stat.label}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-yellow-400 text-2xl font-bold">{stat.number}</h2>
              <p className="mt-1 text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
