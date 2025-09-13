// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState } from "react";

// interface Props {
//   options: { optionText: string; isCorrect: boolean }[];
//   setOptions: React.Dispatch<React.SetStateAction<{ optionText: string; isCorrect: boolean }[]>>;
//   type: "MULTIPLE_CHOICE" | "TRUE_FALSE";
// }

// export default function OptionEditor({ options, setOptions, type }: Props) {
//   const handleAddOption = () => {
//     setOptions([...options, { optionText: "", isCorrect: false }]);
//   };

//   const handleChange = (index: number, key: "optionText" | "isCorrect", value: any) => {
//     const newOptions = [...options];
//     newOptions[index][key] = value;
//     if (type === "TRUE_FALSE" && key === "isCorrect" && value) {
//       // Only one correct answer for TRUE_FALSE
//       newOptions.forEach((o, i) => {
//         if (i !== index) o.isCorrect = false;
//       });
//     }
//     setOptions(newOptions);
//   };

//   const handleDelete = (index: number) => {
//     setOptions(options.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-2">
//       {options.map((opt, index) => (
//         <div key={index} className="flex items-center gap-2">
//           <input
//             type="text"
//             placeholder={`Option ${index + 1}`}
//             value={opt.optionText}
//             onChange={(e) => handleChange(index, "optionText", e.target.value)}
//             className="border p-2 rounded flex-1"
//           />
//           <label className="flex items-center gap-1">
//             <input
//               type="checkbox"
//               checked={opt.isCorrect}
//               onChange={(e) => handleChange(index, "isCorrect", e.target.checked)}
//             />
//             Correct
//           </label>
//           <button onClick={() => handleDelete(index)} className="text-red-500">
//             Delete
//           </button>
//         </div>
//       ))}
//       {type === "MULTIPLE_CHOICE" && (
//         <button onClick={handleAddOption} className="bg-gray-200 px-2 py-1 rounded">
//           Add Option
//         </button>
//       )}
//       {type === "TRUE_FALSE" && options.length === 0 && setOptions([
//         { optionText: "True", isCorrect: false },
//         { optionText: "False", isCorrect: false },
//       ])}
//     </div>
//   );
// }
