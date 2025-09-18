// "use client";
// import React from "react";
// import { useGetBySessionQuery } from "@/lib/api/leaderboardApi";

// export default function LeaderboardLivePage() {
 
//   const { data: leaderboard, isLoading, isSuccess } =
//     useGetBySessionQuery({ sessionCode: "2D27B6" });

//   if (isLoading) return <div>Loading leaderboard…</div>;
//   if (!leaderboard) return null;

//   return (
//     <div className="mt-20">
//       <h1>Live Leaderboard</h1>
//       {leaderboard.entries.map((entry) => (
//         <div key={entry.participantId}>
//           {entry.rank}. {entry.nickname} - {entry.totalScore} pts
//         </div>
//       ))}
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