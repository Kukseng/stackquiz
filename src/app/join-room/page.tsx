import JoinRoomHero from "@/components/joinroom/JoinRoomHero";
import React from "react";

export const metadata = {
  title: "StackQuizz | Live",
  description: "Engage with organizer real-time StackQuizz. Compete in live quizzes!",
};
export default function JoinRoomPage() {
  return (
    <div>
      <JoinRoomHero />
    </div>
  );
}
