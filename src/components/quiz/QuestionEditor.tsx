// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { useCreateQuestionMutation } from "@/store/services/questionApi";
// import OptionEditor from "./OptionEditor";

// interface Props {
//   quizId: string;
// }

// export default function QuestionEditor({ quizId }: Props) {
//   const [text, setText] = useState("");
//   const [type, setType] = useState<"MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER">("MULTIPLE_CHOICE");
//   const [points, setPoints] = useState(1);
//   const [options, setOptions] = useState<{ optionText: string; isCorrect: boolean }[]>([]);
//   const [correctAnswer, setCorrectAnswer] = useState("");

//   const [createQuestion, { isLoading }] = useCreateQuestionMutation();

//   const handleAddQuestion = async () => {
//     try {
//       await createQuestion({
//         quizId,
//         text,
//         type,
//         points,
//         options: type !== "SHORT_ANSWER" ? options.map((o, i) => ({ ...o, optionOrder: i })) : undefined,
//         correctAnswer: type === "SHORT_ANSWER" ? correctAnswer : undefined,
//         timeLimit: 30,
//       }).unwrap();

//       setText("");
//       setOptions([]);
//       setCorrectAnswer("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="space-y-4 border p-4 rounded">
//       <input
//         type="text"
//         placeholder="Question Text"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         className="border p-2 w-full rounded"
//       />
//       <select value={type} onChange={(e) => setType(e.target.value as any)} className="border p-2 rounded w-full">
//         <option value="MULTIPLE_CHOICE">Multiple Choice</option>
//         <option value="TRUE_FALSE">True / False</option>
//         <option value="SHORT_ANSWER">Short Answer</option>
//       </select>
//       <input
//         type="number"
//         placeholder="Points"
//         value={points}
//         onChange={(e) => setPoints(Number(e.target.value))}
//         className="border p-2 rounded w-full"
//       />

//       {type === "SHORT_ANSWER" && (
//         <input
//           type="text"
//           placeholder="Correct Answer"
//           value={correctAnswer}
//           onChange={(e) => setCorrectAnswer(e.target.value)}
//           className="border p-2 w-full rounded"
//         />
//       )}

//       {type !== "SHORT_ANSWER" && (
//         <OptionEditor options={options} setOptions={setOptions} type={type} />
//       )}

//       <button
//         onClick={handleAddQuestion}
//         disabled={isLoading}
//         className="bg-green-500 text-white px-4 py-2 rounded"
//       >
//         Add Question
//       </button>
//     </div>
//   );
// }
