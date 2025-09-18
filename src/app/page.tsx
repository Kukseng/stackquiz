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
        <FeedbackQuiz/>
        <TopPlayersSection />
        <QuizTypeComponent />
        {/* <CardSwipeDemo/> */}
        <CTASection />
      </main>
    </div>
  );
}

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Play, Users, Trophy, Zap, Brain, Target } from "lucide-react"

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
//       {/* Hero Section */}
//       <div className="container mx-auto px-4 py-16">
//         <div className="text-center mb-16">
//           <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
//             Stack<span className="text-blue-600">Quiz</span>
//           </h1>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
//             Create engaging real-time quizzes and compete with friends. Perfect for education, team building, and fun
//             competitions.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button asChild size="lg" className="text-lg px-8">
//               <Link href="/quiz/join">
//                 <Play className="mr-2 h-5 w-5" />
//                 Join Quiz
//               </Link>
//             </Button>
//             <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
//               <Link href="/dashboard">
//                 <Users className="mr-2 h-5 w-5" />
//                 Create Quiz
//               </Link>
//             </Button>
//             <Button asChild variant="secondary" size="lg" className="text-lg px-8">
//               <Link href="/demo">
//                 <Zap className="mr-2 h-5 w-5" />
//                 Try Demo
//               </Link>
//             </Button>
//           </div>
//         </div>

//         {/* Features Grid */}
//         <div className="grid md:grid-cols-3 gap-8 mb-16">
//           <Card className="text-center">
//             <CardHeader>
//               <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
//                 <Zap className="h-6 w-6 text-blue-600" />
//               </div>
//               <CardTitle>Real-time Competition</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Experience live quiz sessions with instant scoring and real-time leaderboards. See results as they
//                 happen!
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="text-center">
//             <CardHeader>
//               <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
//                 <Brain className="h-6 w-6 text-green-600" />
//               </div>
//               <CardTitle>Smart Question Types</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Support for multiple choice, true/false, and timed questions. Add images and customize difficulty
//                 levels.
//               </p>
//             </CardContent>
//           </Card>

//           <Card className="text-center">
//             <CardHeader>
//               <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
//                 <Target className="h-6 w-6 text-purple-600" />
//               </div>
//               <CardTitle>Easy to Join</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Participants can join instantly with session codes, QR codes, or direct links. No registration required!
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* How it Works */}
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">How It Works</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
//                 1
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Create Your Quiz</h3>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Design questions, set time limits, and customize your quiz experience.
//               </p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
//                 2
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Share Session Code</h3>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Generate a unique code, QR code, or link for participants to join.
//               </p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
//                 3
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Play & Compete</h3>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Start the quiz and watch real-time results with live leaderboards.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* CTA Section */}
//         <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-lg">
//           <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start?</h2>
//           <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
//             Join thousands of users creating engaging quiz experiences.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button asChild size="lg" className="text-lg px-8">
//               <Link href="/quiz/join">Join a Quiz Now</Link>
//             </Button>
//             <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
//               <Link href="/dashboard">Create Your First Quiz</Link>
//             </Button>
//             <Button asChild variant="secondary" size="lg" className="text-lg px-8">
//               <Link href="/demo">Try Interactive Demo</Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
