"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WaitParticipant from "@/components/startquiz_org/WaitParticipant";

function JoinContent() {
  const params = useSearchParams();
  const quizId = params.get("quizId") || params.get("sessionId") || "";
  const hostName = params.get("name") || "Guest";

  return <WaitParticipant quizId={quizId} hostName={hostName} />;
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="text-white text-xl font-semibold">Loading session...</div>
        </div>
      }
    >
      <JoinContent />
    </Suspense>
  );
}