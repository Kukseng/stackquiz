"use client";

import React, { useEffect, useState } from "react";
import Stage from "./Stage";
import QRCode from "react-qr-code";
import { Users } from "lucide-react";
import { createSession, connectWebSocket } from "@/services/QuizSessionService";

type Participant = { name: string; emoji: string };

interface OrganizerSessionProps {
  quizId: string;
  hostName: string;
}

export default function OrganizerSession({ quizId, hostName }: OrganizerSessionProps) {
  const [sessionCode, setSessionCode] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || ""; // if required

    async function init() {
      try {
        // 1️⃣ Create session
        const session = await createSession(quizId, hostName, token);
        console.log("✅ Session created:", session);

        setSessionId(session.id);
        setSessionCode(session.sessionCode);

        // 2️⃣ Connect WebSocket to listen participants
        connectWebSocket(session.id, (msg) => {
          if (msg.type === "PARTICIPANT_JOIN") {
            setParticipants((prev) => [
              ...prev,
              { name: msg.data.name, emoji: "😄" },
            ]);
          } else if (msg.type === "PARTICIPANT_LEAVE") {
            setParticipants((prev) =>
              prev.filter((p) => p.name !== msg.data.name)
            );
          } else {
            console.log("📩 WS message:", msg);
          }
        });

        setLoading(false);
      } catch (err) {
        console.error("❌ Session creation error:", err);
        setLoading(false);
      }
    }

    init();
  }, [quizId, hostName]);

  const joinUrl = `${window.location.origin}/join?sessionId=${sessionId}`;

  return (
    <Stage>
      <div className="mx-auto max-w-[780px]">
        {/* QR + Join Info */}
        <div className="relative flex items-stretch gap-6 rounded-[16px] bg-[#5b6fb6]/35 p-6 ring-1 ring-white/10">
          {/* Left: join info */}
          <div className="flex-[3] rounded-[16px] bg-[#0f0f0f] px-6 py-6 shadow flex flex-col justify-center">
            <div className="text-white text-lg mb-3">
              Session Code: <b>{sessionCode || "Generating..."}</b>
            </div>
            <div className="text-white/80 mb-2">Participants:</div>
            {participants.length > 0 ? (
              participants.map((p, i) => (
                <div key={i} className="text-white flex items-center gap-2">
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                </div>
              ))
            ) : (
              <div className="text-white/60">No participants yet</div>
            )}
          </div>

          {/* Right: QR code */}
          <div className="flex-[1.2] flex flex-col items-center justify-center">
            <div className="rounded-2xl bg-white p-3">
              {sessionCode && <QRCode value={joinUrl} size={160} />}
            </div>
            <div className="mt-3 text-sm text-white/90">Scan to join</div>
          </div>
        </div>

        {/* Footer: participant count */}
        <div className="mt-6 flex items-center">
          <div className="ml-auto inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 text-white/90 text-sm">
            <Users size={16} />
            <span>{participants.length}</span>
          </div>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xl font-bold rounded-xl">
            Creating Session...
          </div>
        )}
      </div>
    </Stage>
  );
}
