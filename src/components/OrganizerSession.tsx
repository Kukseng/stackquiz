
import React, { useEffect, useState } from "react";
import QRCodeBox from "../components/startquiz_org/QRCode";
import { createSession, connectWebSocket, Participant } from "@/services/QuizSessionService";

export default function OrganizerSession({ quizId, hostName }: { quizId: string; hostName: string }) {
  const [sessionCode, setSessionCode] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    async function init() {
      const session = await createSession(quizId, hostName);
      setSessionId(session.id);
      setSessionCode(session.sessionCode);

      connectWebSocket(session.id, (msg) => {
        if (msg.type === "PARTICIPANT_JOIN") {
          setParticipants((prev) => [...prev, { name: msg.data.name, emoji: "😄" }]);
        }
      });
    }
    init();
  }, [quizId, hostName]);

  const joinUrl = `${window.location.origin}/join?sessionId=${sessionId}`;
  return <QRCodeBox joinUrl={joinUrl} />;
}
