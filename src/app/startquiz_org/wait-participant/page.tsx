"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import WaitParticipant from "@/components/startquiz_org/WaitParticipant";

function WaitParticipantContent() {
  const searchParams = useSearchParams();
  
  // Get params from URL or use defaults
  const quizId = searchParams.get("quizId") || "12345";
  const hostName = searchParams.get("hostName") || searchParams.get("name") || "Rotha";

  return <WaitParticipant quizId={quizId} hostName={hostName} />;
}

export default function ParentComponent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div className="text-white text-xl font-semibold">Preparing session...</div>
        </div>
      }
    >
      <WaitParticipantContent />
    </Suspense>
  );
}