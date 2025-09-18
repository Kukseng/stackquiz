import { AboutHero } from "@/components/about/About_hero";
import { ContactSection } from "@/components/about/Contact_hero";
import { EstablishmentSection } from "@/components/about/EstablishmentSection";
import { MentorsSection } from "@/components/about/Mentors";
import { MissionSection } from "@/components/about/Mission";
import { TeamsSection } from "@/components/about/Team";
import { TechnologySection } from "@/components/about/Technology";
import { ValuesSection } from "@/components/about/Value";
import { VisionSection } from "@/components/about/Vision";

export const metadata = {
  title: "StackQuiz | About",
  description: "Engage with organizers in real-time StackQuiz. Compete in live quizzes and test your knowledge!",
  keywords: "quiz, real-time, competition, knowledge, interactive, live quiz",
  openGraph: {
  title: "StackQuiz | About",
  description: "Engage with organizers in real-time StackQuiz. Compete in live quizzes and test your knowledge!",
  type: "website",
  images: [
    {
      url: "https://app.stackquiz.me/bg-meta.png?v=2",
      width: 1200,
      height: 630,
      alt: "StackQuiz - Real-time Quiz Platform",
    },
  ],
},
twitter: {
  card: "summary_large_image",
  title: "StackQuiz | About",
  description: "Engage with organizers in real-time StackQuiz. Compete in live quizzes and test your knowledge!",
  images: ["https://app.stackquiz.me/bg-meta.png?v=2"],
},

};
export default function AboutPage() {
  return (
    <div>
      <main className="relative z-10">
        <AboutHero/>
        <TechnologySection/>
        <EstablishmentSection/>
        <MissionSection/>
        <VisionSection/>
        <ValuesSection/>
        <MentorsSection/>
        <TeamsSection/>
        <ContactSection/>
      </main>
    </div>
  )
}
