// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";
// import { useCreateQuizMutation } from "@/lib/api/quizApi";

// interface Props {
//   onQuizCreated: (quizId: string) => void;
// }

// export default function CreateQuizForm({ onQuizCreated }: Props) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("EASY");
//   const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE" | "UNLISTED">("PUBLIC");

//   const [createQuiz, { isLoading, error }] = useCreateQuizMutation();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const quiz = await createQuiz({
//         title,
//         description,
//         thumbnailUrl: "",
//         visibility,
//       }).unwrap();

//       onQuizCreated(quiz.id);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <input
//         type="text"
//         placeholder="Quiz Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="border p-2 w-full rounded"
//         required
//       />
//       <textarea
//         placeholder="Description"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         className="border p-2 w-full rounded"
//       />

//       <select
//         value={difficulty}
//         onChange={(e) => setDifficulty(e.target.value as any)}
//         className="border p-2 w-full rounded"
//       >
//         <option value="EASY">Easy</option>
//         <option value="MEDIUM">Medium</option>
//         <option value="HARD">Hard</option>
//       </select>

//       <select
//         value={visibility}
//         onChange={(e) => setVisibility(e.target.value as any)}
//         className="border p-2 w-full rounded"
//       >
//         <option value="PUBLIC">Public</option>
//         <option value="PRIVATE">Private</option>
//         <option value="UNLISTED">Unlisted</option>
//       </select>

//       <button
//         type="submit"
//         disabled={isLoading}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         {isLoading ? "Creating..." : "Create Quiz"}
//       </button>

//       {error && <p className="text-red-600">Failed to create quiz</p>}
//     </form>
//   );
// }
