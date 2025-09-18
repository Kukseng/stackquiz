
import ExplorePage from "@/components/explore/ExplorePage";

export const metadata = {
  title: "StackQuiz | Explore",
  description: "Engage with organizers in real-time StackQuiz. Compete in live quizzes and test your knowledge!",
  keywords: "quiz, real-time, competition, knowledge, interactive, live quiz",
  openGraph: {
  title: "StackQuiz | Explore",
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
  title: "StackQuiz | Explore",
  description: "Engage with organizers in real-time StackQuiz. Compete in live quizzes and test your knowledge!",
  images: ["https://app.stackquiz.me/bg-meta.png?v=2"],
},

};
export default function Explore() {
  return (
    <div>
      <ExplorePage/>
    </div>
  );
}
