// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/components/HostDashboard.tsx
// "use client";
// import React, { useCallback, useState, useEffect } from "react";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import { useGetBySessionQuery } from "@/lib/api/leaderboardApi";

// // WebSocket hook, integrated and self-contained
// function useQuizHostWebSocket(sessionCode: string, onMessage: (topic: string, msg: any) => void) {
//   const stompRef = React.useRef<Client | null>(null);

//   React.useEffect(() => {
//     if (!sessionCode) return;
    
//     const sock = new SockJS("http://localhost:9999/ws");
//     const stomp = new Client({ 
//       webSocketFactory: () => sock, 
//       reconnectDelay: 5000,
//       debug: (str) => console.log('[STOMP]', str) // Enable debug for troubleshooting
//     });

//     stomp.onConnect = () => {
//       console.log('WebSocket connected for session:', sessionCode);
//       stomp.subscribe(`/topic/session/${sessionCode}/game-state`, (msg) => {
//         onMessage("game-state", JSON.parse(msg.body));
//       });
//       stomp.subscribe(`/topic/session/${sessionCode}/questions`, (msg) => {
//         onMessage("questions", JSON.parse(msg.body));
//       });
//       stomp.subscribe(`/topic/session/${sessionCode}/leaderboard`, (msg) => {
//         onMessage("leaderboard", JSON.parse(msg.body));
//       });
//       stomp.subscribe(`/topic/session/${sessionCode}/participants`, (msg) => {
//         onMessage("participants", JSON.parse(msg.body));
//       });
//     };

//     stomp.onDisconnect = () => {
//       console.log('WebSocket disconnected for session:', sessionCode);
//     };

//     stomp.onStompError = (frame) => {
//       console.error('STOMP error:', frame);
//     };

//     stomp.activate();
//     stompRef.current = stomp;
    
//     return () => { 
//       if (stompRef.current) {
//         stompRef.current.deactivate();
//       }
//     };
//   }, [sessionCode, onMessage]);

//   function send(destination: string, body: any) {
//     if (stompRef.current?.connected) {
//       stompRef.current.publish({ destination, body: JSON.stringify(body) });
//       console.log('Sent message:', destination, body);
//     } else {
//       console.warn('WebSocket not connected, cannot send message');
//     }
//   }
//   return send;
// }

// const hostNickname = "mingming";
// const sessionCode = "2D27B6";

// export default function HostDashboard() {
//   const [gameState, setGameState] = useState<any>(null);
//   const [currentQuestion, setCurrentQuestion] = useState<any>(null);
//   const [participants, setParticipants] = useState<any[]>([]);
//   const [liveLeaderboard, setLiveLeaderboard] = useState<any[] | null>(null);
//   const [questionTimer, setQuestionTimer] = useState<number | null>(null);

//   const { data: leaderboard, isLoading } = useGetBySessionQuery({ sessionCode });

//   const onMessage = useCallback((topic: string, msg: any) => {
//     console.log('Received message:', topic, msg);
    
//     if (topic === "game-state") {
//       setGameState(msg);
//       // Reset question timer on game state changes
//       if (msg.action === "QUESTION_STARTED" && msg.timeLeft) {
//         setQuestionTimer(msg.timeLeft);
//       }
//     }
//     if (topic === "questions") {
//       setCurrentQuestion(msg.question);
//       // Start question timer
//       if (msg.timeLimit) {
//         setQuestionTimer(msg.timeLimit);
//       }
//     }
//     if (topic === "participants") {
//       setParticipants(msg.participants || []);
//     }
//     if (topic === "leaderboard") {
//       setLiveLeaderboard(msg.leaderboard?.entries || []);
//     }
//   }, []);

//   const sendMessage = useQuizHostWebSocket(sessionCode, onMessage);

//   // Question timer countdown effect
//   useEffect(() => {
//     if (questionTimer && questionTimer > 0) {
//       const interval = setInterval(() => {
//         setQuestionTimer(prev => {
//           if (prev && prev > 0) {
//             return prev - 1;
//           }
//           return null;
//         });
//       }, 1000);
      
//       return () => clearInterval(interval);
//     }
//   }, [questionTimer]);

//   function startSession() {
//     sendMessage(`/app/session/${sessionCode}/host-command`, {
//       command: "START_SESSION",
//       hostNickname,
//       sessionId: sessionCode,
//     });
//   }

//   function nextQuestion() {
//     sendMessage(`/app/session/${sessionCode}/host-command`, {
//       command: "NEXT_QUESTION",
//       hostNickname,
//       sessionId: sessionCode,
//     });
//   }

//   function pauseSession() {
//     sendMessage(`/app/session/${sessionCode}/host-command`, {
//       command: "PAUSE_SESSION",
//       hostNickname,
//       sessionId: sessionCode,
//     });
//   }

//   function endSession() {
//     sendMessage(`/app/session/${sessionCode}/host-command`, {
//       command: "END_SESSION",
//       hostNickname,
//       sessionId: sessionCode,
//     });
//   }

//   // Status color UX
//   const getStatusColor = () => {
//     if (!gameState) return "#6c757d";
//     switch (gameState.action) {
//       case "SESSION_LOBBY": return "#ffc107";
//       case "SESSION_STARTED":
//       case "QUESTION_STARTED": return "#28a745";
//       case "SESSION_PAUSED": return "#fd7e14";
//       case "SESSION_ENDED": return "#dc3545";
//       case "COUNTDOWN": return "#17a2b8";
//       default: return "#6c757d";
//     }
//   };

//   // Check if session is active and can proceed to next question
//   const canGoToNextQuestion = () => {
//     return gameState && 
//            (gameState.status === "IN_PROGRESS" || 
//             ["SESSION_STARTED", "QUESTION_STARTED"].includes(gameState.action));
//   };

//   const allEntries = liveLeaderboard ?? leaderboard?.entries?? [];

//   if (isLoading) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-xl">Loading dashboard...</div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen mt-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
//       {/* Header */}
//       <div className="bg-white shadow-lg">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">
//                 Stackquiz! Host
//               </h1>
//               <p className="text-gray-600">Quiz Control Center</p>
//             </div>
//             <div className="text-right">
//               <div className="bg-purple-100 px-4 py-2 rounded-lg">
//                 <p className="text-sm text-gray-600">Session Code</p>
//                 <p className="text-2xl font-bold text-purple-700">
//                   {sessionCode}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Control Panel - Left Column */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Host Controls */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 Host Controls
//               </h2>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <button
//                   onClick={startSession}
//                   disabled={gameState?.action === "SESSION_STARTED" || gameState?.status === "IN_PROGRESS"}
//                   className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
//                 >
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">▶️</div>
//                     <div className="text-sm">Start</div>
//                   </div>
//                 </button>
//                 <button
//                   onClick={nextQuestion}
//                   disabled={!canGoToNextQuestion()}
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
//                 >
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">⏭️</div>
//                     <div className="text-sm">Next</div>
//                   </div>
//                 </button>
//                 <button
//                   onClick={pauseSession}
//                   disabled={!canGoToNextQuestion()}
//                   className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
//                 >
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">⏸️</div>
//                     <div className="text-sm">Pause</div>
//                   </div>
//                 </button>
//                 <button
//                   onClick={endSession}
//                   className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
//                 >
//                   <div className="text-center">
//                     <div className="text-2xl mb-1">⏹️</div>
//                     <div className="text-sm">End</div>
//                   </div>
//                 </button>
//               </div>
//             </div>

//             {/* Game Status */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 Game Status
//               </h2>
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-4">
//                   <div
//                     className="w-4 h-4 rounded-full animate-pulse"
//                     style={{ backgroundColor: getStatusColor() }}
//                   ></div>
//                   <span className="text-lg font-semibold text-gray-700">
//                     {gameState?.action?.replace(/_/g, " ") || "Waiting"}
//                   </span>
//                 </div>
//                 {questionTimer && (
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-red-600">
//                       {questionTimer}s
//                     </div>
//                     <div className="text-sm text-gray-500">Time left</div>
//                   </div>
//                 )}
//               </div>
//               {gameState?.message && (
//                 <p className="text-gray-600 mt-2">{gameState.message}</p>
//               )}
//             </div>

//             {/* Current Question */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">
//                 Current Question
//               </h2>
//               {currentQuestion ? (
//                 <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                     {currentQuestion.text}
//                   </h3>
//                   {currentQuestion.options?.length > 0 ? (
//                     <div className="grid grid-cols-2 gap-4">
//                       {currentQuestion.options.map(
//                         (option: any, index: number) => {
//                           const colors = [
//                             "bg-red-500",
//                             "bg-blue-500",
//                             "bg-yellow-500",
//                             "bg-green-500",
//                           ];
//                           const shapes = ["🔴", "🔷", "🔶", "🟢"];
//                           return (
//                             <div
//                               key={option.id || index}
//                               className={`${
//                                 colors[index % 4]
//                               } text-white p-4 rounded-xl font-semibold text-center shadow-lg transition-all hover:scale-110`}
//                             >
//                               <div className="text-2xl mb-2">
//                                 {shapes[index % 4]}
//                               </div>
//                               <div>{option.optionText || option.text}</div>
//                             </div>
//                           );
//                         }
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-gray-400 text-center">
//                       No options for this question.
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <div className="text-6xl mb-4">❓</div>
//                   <p>No question loaded yet</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Sidebar */}
//           <div className="space-y-6">
//             {/* Participants */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-gray-800">Players</h2>
//                 <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">
//                   {participants.length}
//                 </span>
//               </div>
//               {participants.length > 0 ? (
//                 <div className="max-h-64 overflow-y-auto space-y-2">
//                   {participants.map((participant, index) => (
//                     <div
//                       key={participant.id || index}
//                       className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                         {participant.nickname?.charAt(0)?.toUpperCase() || "?"}
//                       </div>
//                       <span className="font-medium text-gray-700">
//                         {participant.nickname}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <div className="text-4xl mb-2">👥</div>
//                   <p>Waiting for players...</p>
//                   <p className="text-sm mt-2">
//                     Share code:{" "}
//                     <span className="font-bold text-purple-600">
//                       {sessionCode}
//                     </span>
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Leaderboard */}
//             <div className="bg-white rounded-2xl shadow-xl p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
//                 <span className="text-2xl">🏆</span>
//               </div>
//               {allEntries.length > 0 ? (
//                 <>
//                   {/* Top 5 Podium */}
//                   <div className="space-y-3 mb-6">
//                     {allEntries.slice(0, 5).map((entry, index) => {
//                       const podiumColors = [
//                         "bg-yellow-400",
//                         "bg-gray-400",
//                         "bg-amber-600",
//                       ];
//                       const medals = ["🥇", "🥈", "🥉"];
//                       return (
//                         <div
//                           key={entry.participantId || index}
//                           className={`flex items-center justify-between p-3 rounded-lg ${
//                             index < 3
//                               ? podiumColors[index] + " text-white"
//                               : "bg-gray-100"
//                           }`}
//                         >
//                           <div className="flex items-center space-x-3">
//                             <span className="text-lg">
//                               {index < 3 ? medals[index] : `${index + 1}.`}
//                             </span>
//                             <span className="font-semibold">
//                               {entry.nickname}
//                             </span>
//                           </div>
//                           <span className="font-bold">
//                             {entry.totalScore || entry.score || 0} pts
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   {/* Full Live Leaderboard */}
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-700 mb-2">
//                       All Players
//                     </h3>
//                     <div className="bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
//                       {allEntries.map((entry, idx) => (
//                         <div
//                           key={entry.participantId || idx}
//                           className="flex justify-between px-3 py-2 border-b border-gray-200 last:border-b-0"
//                         >
//                           <span className="font-mono">{idx + 1}.</span>
//                           <span className="flex-1 ml-3">{entry.nickname}</span>
//                           <span className="font-bold">
//                             {entry.totalScore || entry.score || 0} pts
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <div className="text-4xl mb-2">📊</div>
//                   <p>No scores yet</p>
//                   <p className="text-sm">Start the quiz to see rankings!</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
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