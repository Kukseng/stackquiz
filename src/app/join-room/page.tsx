
import JoinRoomHero from "@/components/joinroom/JoinRoomHero";
import React from "react";

export const metadata = {
  title: "Join Live Quiz | StackQuiz - Real-Time Quiz Competition",
  description: "Join interactive real-time quizzes with unique codes. Compete with friends, test your knowledge, and get instant results on StackQuiz.",
  keywords: "join quiz, live quiz code, real-time quiz, quiz competition, interactive quiz, online trivia, quiz platform, StackQuiz, stack quiz app",
  openGraph: {
    title: "Join Live Quiz | StackQuiz - Real-Time Quiz Competition",
    description: "Join interactive real-time quizzes with unique codes. Compete with friends, test your knowledge, and get instant results on StackQuiz.",
    type: "website",
    url: "https://stackquiz-two.vercel.app/join-room",
    images: [
      {
        url: "https://stackquiz-two.vercel.app/bg-meta.png",
        width: 1200,
        height: 630,
        alt: "StackQuiz - Real-time Quiz Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Live Quiz | StackQuiz",
    description: "Join interactive real-time quizzes with unique codes on StackQuiz.",
    images: ["https://stackquiz-two.vercel.app/bg-meta.png"],
  },
};
export default function JoinRoomPage() {
  return (
    <main>
  
      <JoinRoomHero />
    </main>
  );
}