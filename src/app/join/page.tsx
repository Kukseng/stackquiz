
"use client";

import { useSearchParams } from "next/navigation";
import WaitParticipant from "@/components/startquiz_org/WaitParticipant";

export default function JoinPage() {
  const params = useSearchParams();
  const sessionId = params.get("sessionId") || "";
  const participantName = params.get("name") || "Guest";

  return <WaitParticipant sessionId={sessionId} participantName={participantName} />;
}
