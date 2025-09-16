
import { useEffect } from "react";
import { joinSession, connectWebSocket, sendAnswer } from "@/services/QuizSessionService";

export function useParticipantFlow(sessionId: string, participantName: string) {
  useEffect(() => {
    async function init() {
      await joinSession(sessionId, participantName);

      connectWebSocket(sessionId, (msg) => {
        if (msg.type === "QUESTION") sendAnswer(msg.data.id, "A");
        if (msg.type === "RESULT") console.log(msg.data);
      });
    }
    init();
  }, [sessionId, participantName]);
}
