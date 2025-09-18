// // src/pages/QuizDashboard.tsx
// 'use client'
// // src/pages/QuizDetails.tsx
// import React from "react";
// import { useGetQuizByIdQuery } from "@/lib/api/quizApi";

// interface QuizDetailsProps {
//   quizId: string;
// }

// const QuizDetails: React.FC<QuizDetailsProps> = ({ quizId="cac92306-63cd-47a0-992d-16ccdb6f5503" }) => {
//   const { data: quiz, isLoading } = useGetQuizByIdQuery(quizId);

//   if (isLoading) return <div>Loading details...</div>;
//   if (!quiz) return <div>Quiz not found.</div>;

//   return (
//     <div className="p-6 mt-20">
//       <h2 className="text-2xl font-bold">{quiz.title}</h2>
//       <p>{quiz.description}</p>
//       <img src={quiz.thumbnailUrl} alt="" className="h-32 rounded" />
//       {quiz?.questions?.map(q => (
//         <div key={q.id} className="mt-6 border rounded p-4 bg-gray-50">
//           <div className="flex justify-between">
//             <span>Type: {q.type}</span>
//             <span>Points: {q.points}</span>
//             <span>Time: {q.timeLimit}s</span>
//           </div>
//           <div className="text-lg font-semibold mt-2">{q.text}</div>
//           {q.imageUrl && <img src={q.imageUrl} alt="" className="h-24" />}
//           <div className="grid grid-cols-2 gap-2 mt-4">
//             {q.options.map(opt => (
//               <button
//                 key={opt.id}
//                 className={`p-2 rounded border ${opt.isCorrected ? "border-green-500" : "border-gray-300"}`}
//               >
//                 {opt.optionText}
//               </button>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default QuizDetails;
import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page