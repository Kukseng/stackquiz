import CreateQuizSection from "@/components/hompage/Create_quiz_section";
import { CTASection } from "@/components/hompage/Cta_section";
import { FeedbackQuiz } from "@/components/hompage/Feedback_section";
import { HeroSection } from "@/components/hompage/Hero_section";
import { PlatformSection } from "@/components/hompage/Plateform_section";
import { StatsSection } from "@/components/hompage/State_section";
import { TopPlayersSection } from "@/components/hompage/Top_player";
import { QuizTypeComponent } from "@/components/hompage/Type_quiz";
import { WhyChooseSection } from "@/components/hompage/Why_chose_section";
// import CardSwipeDemo from "@/components/hompage/Type_quiz";

export const metadata = {
  title: "StackQuizz | Home",
  description: "Engage with organizers in real-time StackQuizz. Compete in live quizzes and test your knowledge!",
  keywords: "quiz, real-time, competition, knowledge, interactive, live quiz",
  openGraph: {
  title: "StackQuizz | Home",
  description: "Engage with organizers in real-time StackQuizz. Compete in live quizzes and test your knowledge!",
  type: "website",
  images: [
    {
      url: "https://app.stackquiz.me/bg-meta.png?v=2",
      width: 1200,
      height: 630,
      alt: "StackQuizz - Real-time Quiz Platform",
    },
  ],
},
twitter: {
  card: "summary_large_image",
  title: "StackQuizz | Home",
  description: "Engage with organizers in real-time StackQuizz. Compete in live quizzes and test your knowledge!",
  images: ["https://app.stackquiz.me/bg-meta.png?v=2"],
},

};

export default function HomePage() {
  return (
    <div>
      <main className="py-12">
        <HeroSection />
        <StatsSection />
        <CreateQuizSection />
        <WhyChooseSection />
        <PlatformSection />
        <FeedbackQuiz />
        <TopPlayersSection />
        <QuizTypeComponent />
        {/* <CardSwipeDemo/> */}
        <CTASection />
      </main>
    </div>
  );
}