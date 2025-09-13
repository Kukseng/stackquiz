// 'use client'
// import React from "react";
// import { useGetAllQuizzesQuery } from "@/lib/api/quizApi";

// export default function QuizList() {
//   const { data: quizzes, error, isLoading } = useGetAllQuizzesQuery({});

//   if (isLoading) return <p>Loading quizzes...</p>;
//   if (error) return <p>Failed to load quizzes</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {quizzes?.map((quiz) => (
//           <div
//             key={quiz.id}
//             className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
//           >
//             <img
//               src={
//                 quiz.thumbnailUrl ||
//                 `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
//                   quiz.title
//                 )}`
//               }
//               alt={quiz.title}
//               className="w-full h-40 object-cover rounded-md"
//             />
//             <h3 className="text-lg font-semibold mt-3">{quiz.title}</h3>
//             <p className="text-gray-600 text-sm">{quiz.description}</p>
//             <div className="flex justify-between items-center mt-2 text-sm">
//               <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
//                 {quiz.difficulty}
//               </span>
//               <span className="text-gray-500">
//                 {new Date(quiz.createdAt).toLocaleDateString()}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page