// // src/pages/QuizDashboard.tsx
// 'use client'
// import React from "react";
// import { useGetAllQuizzesQuery } from "@/lib/api/quizApi";

// const QuizDashboard: React.FC = () => {
//   // Fetch all active public quizzes
//   const { data: quizzes, error, isLoading } = useGetAllQuizzesQuery({ active: true });

//   if (isLoading) return <div>Loading quizzes...</div>;
//   if (error) return <div>Error loading quizzes</div>;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
//       {quizzes?.map((quiz) => (
//         <div key={quiz.id} className="bg-white rounded-xl shadow px-4 py-6 hover:scale-105 transition">
//           <img src={quiz.thumbnailUrl || "/default-thumb.jpg"} alt="thumbnail"
//             className="w-full h-40 object-cover rounded" />
//           <h2 className="font-bold text-xl mt-3">{quiz.title}</h2>
//           <p className="text-gray-500">{quiz.description}</p>
//           <div className="flex justify-between text-sm mt-2">
//             <span>{quiz.difficulty}</span>
//             <span>{quiz.visibility}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default QuizDashboard;
import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page