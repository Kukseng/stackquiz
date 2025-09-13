"use client";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function StatsSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en.stats : kh.stats;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const stats = [
    { number: "10K+", label: t.questions, icon: "/icon_hero/quiz_create.svg" },
    { number: "4K+", label: t.activePlayers, icon: "/icon_hero/active_play.svg" },
    { number: "20+", label: t.countries, icon: "/icon_hero/contry.svg" },
  ];

  return (
    <section className={`relative w-full py-12 bg-footer ${fontClass}`}>
      <div className="relative max-w-7xl mx-auto z-10 flex items-center justify-center px-4">
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
