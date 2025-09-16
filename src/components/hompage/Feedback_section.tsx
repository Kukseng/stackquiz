"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { cn } from "@/components/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

  
const reviews = [
  { name: "Dana", username: "@dana", body: "StackQuizz made our class more interactive than ever!", img: "https://avatar.vercel.sh/jack" },
  { name: "Rita", username: "@rita", body: "I love competing with friends across different subjects. StackQuiz alway provide new plateform and new knowlage to learn it.", img: "https://avatar.vercel.sh/jill" },
  { name: "Bora", username: "@bora", body: "Easy to use and super fun for group activities.", img: "https://avatar.vercel.sh/john" },
  { name: "Janny", username: "@janny", body: "This is amazing. I love it.", img: "https://avatar.vercel.sh/jane" },
  { name: "Jira", username: "@jira", body: "Look so cool, need stackquiz to provide all skill.", img: "https://avatar.vercel.sh/jenny" },
  { name: "Neary", username: "@neary", body: "Wow stack stackquiz is very very cool I need to use when to teach my student!", img: "https://avatar.vercel.sh/james" },
  { name: "Bopha", username: "@bopha", body: "It greatful to play quiz find new experience and knowlage.", img: "https://avatar.vercel.sh/james" },
  { name: "kanha", username: "@kanha", body: "This platform gives me fun ways to study. Really helpful for students!", img: "https://avatar.vercel.sh/james" },
];

const ReviewCard = ({ img, name, username, body }: { img: string; name: string; username: string; body: string }) => (
  <figure
    className={cn(
      "flex flex-col justify-between w-full h-full min-h-[200px]",
      "cursor-pointer overflow-hidden rounded-xl border",
      "border-gray-700 bg-gray-900/40 p-6 shadow-md transition-all duration-500",
      "hover:shadow-lg hover:border-gray-600"
    )}
  >
    <div className="flex items-center gap-3 mb-4">
      <Image src={img} alt={`${name} profile`} width={48} height={48} className="rounded-full flex-shrink-0" />
      <div className="min-w-0">
        <figcaption className="text-base font-semibold text-white truncate">{name}</figcaption>
        <p className="text-sm text-gray-400 truncate">{username}</p>
      </div>
    </div>
    <blockquote className="text-gray-200 text-sm sm:text-[15px] leading-relaxed flex-1 flex items-center">
      <span>{body}</span>
    </blockquote>
  </figure>
);

export function FeedbackQuiz() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;
  const fontClass = language === "en" ? "en-font" : "kh-font";
  return (
    <div className={`relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 ${fontClass}`}>
      {/* Header */}
      <div className=" text-center mb-12">
              {/* Section Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                <span className="text-yellow text-underline">
                  {t.feedback.title}
                </span>
              </h2>
            </div>

      {/* Swiper */}
      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="pb-12"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={`${review.username}-${index}`} className="h-auto">
              <ReviewCard {...review} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation */}
        <div className="swiper-button-prev custom-nav"></div>
        <div className="swiper-button-next custom-nav"></div>

        {/* Pagination */}
        <div className="swiper-pagination !bottom-0 !relative !mt-8"></div>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .swiper {
          overflow: hidden;
        }

        .swiper-slide {
          height: auto;
          display: flex;
        }

        .swiper-pagination-bullet {
          background: #374151 !important;
          opacity: 0.7 !important;
          width: 10px !important;
          height: 10px !important;
        }

        .swiper-pagination-bullet-active {
          background: #fbbf24 !important;
          opacity: 1 !important;
        }

        .custom-nav {
          color: #fbbf24 !important;
          width: 32px; /* smaller */
          height: 32px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(31, 41, 55, 0.8);
          border-radius: 9999px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .custom-nav::after {
          font-size: 16px !important; /* smaller arrow symbol */
        }

        .swiper-button-prev {
          left: -8px;
        }
        .swiper-button-next {
          right: -8px;
        }

        /* Mobile adjustments */
        @media (max-width: 640px) {
          .custom-nav {
            width: 28px;
            height: 28px;
            top: 50%;
          }

          .custom-nav::after {
            font-size: 14px !important;
          }

          .swiper-button-prev {
            left: 4px; /* keep near left edge */
          }
          .swiper-button-next {
            right: 4px; /* keep near right edge */
          }
        }
      `}</style>
    </div>
  );
}
