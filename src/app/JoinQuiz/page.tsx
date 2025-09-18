// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/app/quiz/[quizCode]/join/page.tsx or src/pages/join/[quizCode].tsx
// "use client";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";

// // WebSocket for participant role/session
// function useParticipantWebSocket(quizCode, nickname, onGameState, onQuestion) {
//   useEffect(() => {
//     if (!quizCode || !nickname) return;
//     const sock = new SockJS("http://localhost:9999/ws");
//     const stomp = new Client({ webSocketFactory: () => sock, reconnectDelay: 5000 });

//     stomp.onConnect = () => {
//       stomp.subscribe(`/topic/session/${quizCode}/game-state`, (msg) => {
//         onGameState(JSON.parse(msg.body));
//       });
//       stomp.subscribe(`/topic/session/${quizCode}/questions`, (msg) => {
//         onQuestion(JSON.parse(msg.body));
//       });
//     };

//     stomp.activate();
//     return () => { stomp.deactivate(); };
//   }, [quizCode, nickname, onGameState, onQuestion]);
// }

// export default function JoinQuiz() {
//   const [quizCode, setQuizCode] = useState("");
//   const [nickname, setNickname] = useState("");
//   const [avatarId, setAvatarId] = useState("");
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [joined, setJoined] = useState(false);

//   // Lobby and play state
//   const [gameState, setGameState] = useState<any>(null);
//   const [currentQuestion, setCurrentQuestion] = useState<any>(null);

//   // Join handler
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");
//     if (!quizCode.match(/^[0-9A-Z]{4,6}$/)) {
//       setError("Please enter a valid game PIN");
//       return;
//     }
//     if (!nickname.trim()) {
//       setError("Please enter your nickname");
//       return;
//     }
//     if (!avatarId.trim()) {
//       setError("Avatar ID is required");
//       return;
//     }
//     setIsSubmitting(true);
//     try {
//       await axios.post("http://localhost:9999/api/v1/participants/join", {
//         quizCode,
//         nickname,
//         avatarId,
//       });
//       setJoined(true);
//     } catch (err: any) {
//       setError(
//         err.response?.data?.message ||
//           "Failed to join. Please check inputs and try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   // Start WebSocket after join
//   useParticipantWebSocket(
//     joined ? quizCode : "",
//     joined ? nickname : "",
//     (msg) => setGameState(msg),
//     (qmsg) => setCurrentQuestion(qmsg?.question)
//   );

//   // When session starts, go to "play" mode
//   const [status, setStatus] = useState<"LOBBY"|"PLAY"|"END">("LOBBY");
//   useEffect(() => {
//     if (!gameState) return;
//     if (["SESSION_STARTED", "QUESTION_STARTED"].includes(gameState.action)) {
//       setStatus("PLAY");
//     } else if (gameState.action==="SESSION_ENDED") {
//       setStatus("END");
//     } else {
//       setStatus("LOBBY");
//     }
//   }, [gameState]);

//   // UI for participant lobby
//   function LobbyUI() {
//     return (
//       <div className="min-h-screen bg-gradient-to-tr from-purple-700 to-indigo-900 flex flex-col justify-center items-center p-6">
//         <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//           <h1 className="text-3xl font-bold text-center text-indigo-800 mb-2">
//             You re in! Waiting for host...
//           </h1>
//           <div className="py-4 flex flex-col items-center">
//             <span className="rounded-full bg-indigo-100 text-4xl px-8 py-5 mb-2">{avatarId || "😀"}</span>
//             <span className="bg-purple-100 text-purple-900 px-3 py-1 rounded font-bold">{nickname}</span>
//             <span className="text-xs text-gray-500 mt-2">Game PIN: <span className="font-mono">{quizCode}</span></span>
//           </div>
//           {gameState?.message && (
//             <div className="py-2 text-center text-indigo-700">
//               {gameState.message}
//             </div>
//           )}
//           <div className="mt-6 text-center text-gray-400">
//             Waiting for the host to start the quiz...
//             <div className="animate-pulse text-xl text-purple-200 mt-2">⏳</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // UI for playing/answering questions
//   function PlayUI() {
//     if (!currentQuestion) {
//       return (
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="text-5xl text-gray-400 animate-pulse">🕑 Waiting for Question...</div>
//         </div>
//       );
//     }
//     return (
//       <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-800 items-center pt-10">
//         <div className="max-w-lg w-full bg-white rounded-xl shadow-xl p-8">
//           <div className="mb-3 flex justify-between">
//             <span className="font-bold text-indigo-900">Q: {currentQuestion.text}</span>
//           </div>
//           <div className="grid grid-cols-2 gap-4 mt-6">
//             {currentQuestion.options?.map((option: any, idx: number) => {
//               const colors = ["bg-red-500", "bg-blue-500","bg-yellow-500", "bg-green-500"];
//               const shapes = ["▲", "●", "◆", "■"];
//               return (
//                 <button
//                   className={`${colors[idx % colors.length]} text-white text-xl py-6 rounded-lg font-bold shadow-md hover:scale-105 transform transition`}
//                   key={option.id || idx}
//                   // onClick={doAnswer(option.id)} // implement submission as needed
//                 >
//                   <div className="text-2xl mb-2">{shapes[idx % shapes.length]}</div>
//                   {option.optionText || option.text}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Session ended
//   function EndUI() {
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-700 to-indigo-900">
//         <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full text-center">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Ended</h1>
//           <div className="text-6xl mb-4">🏆</div>
//           <p className="text-lg text-gray-600">Thank you for playing!</p>
//         </div>
//       </div>
//     );
//   }

//   if (!joined) {
//     return (
//       <div className="min-h-screen bg-gradient-to-tr from-purple-700 to-indigo-900 flex flex-col justify-center items-center p-6">
//         <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//           <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">
//             Join a Kahoot
//           </h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="gamePin" className="block text-gray-700 font-semibold mb-1">Game PIN</label>
//               <input id="gamePin" type="text" maxLength={6} value={quizCode}
//                 onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md text-xl tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Enter your game PIN" required />
//             </div>
//             <div>
//               <label htmlFor="nickname" className="block text-gray-700 font-semibold mb-1">Nickname</label>
//               <input id="nickname" type="text" maxLength={30} value={nickname}
//                 onChange={(e) => setNickname(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Choose a fun nickname" required />
//             </div>
//             <div>
//               <label htmlFor="avatarId" className="block text-gray-700 font-semibold mb-1">Avatar ID</label>
//               <input id="avatarId" type="text" maxLength={3} value={avatarId}
//                 onChange={(e) => setAvatarId(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 placeholder="Select your avatar ID" required />
//             </div>
//             {error && (
//               <div
//                 className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//                 role="alert"
//               >
//                 {error}
//               </div>
//             )}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 rounded-md font-bold text-white shadow-md transition
//                   ${isSubmitting
//                   ? "bg-indigo-400 cursor-not-allowed"
//                   : "bg-indigo-600 hover:bg-indigo-700"
//                 }`}
//             >{isSubmitting ? "Joining..." : "Join Game"}</button>
//           </form>
//           <p className="mt-6 text-center text-indigo-100">
//             Enter the PIN you received and a nickname to start playing!
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Session flow: waiting lobby → play → end
//   if (status === "END") return <EndUI />;
//   if (status === "PLAY") return <PlayUI />;
//   return <LobbyUI />;
// }
import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page