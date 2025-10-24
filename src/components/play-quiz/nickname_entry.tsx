"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebSocket } from "@/context/websocket-context";
import { useParams } from "next/navigation";
import { Play } from "lucide-react";
import { useAudio } from "@/providers/AudioProvider";

interface NicknameEntryProps {
  onNicknameSet: (nickname: string) => void;
}

export function NicknameEntry({ onNicknameSet }: NicknameEntryProps) {
  const { id } = useParams() as { id: string };
  const [nickname, setNickname] = useState("");
  const { joinRoom } = useWebSocket();
  const { unlockAudio, playClick } = useAudio();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) return;
    unlockAudio();
    playClick();

    joinRoom(id);
    onNicknameSet(nickname.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-white/10 to-white/30 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 pointer-events-none" />

        <CardHeader className="text-center relative z-10 pb-4">
          <CardTitle className="text-3xl font-bold text-white drop-shadow-md">
            Join Quiz Play
          </CardTitle>
          <p className="text-white mt-2">Test your knowledge</p>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  />
                </svg>
                <label htmlFor="nickname" className="text-white font-medium">
                  Enter your nickname
                </label>
              </div>
              <Input
                id="nickname"
                type="text"
                placeholder="Your nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full py-6 font-bold border-1 rounded-2xl shadow-sm"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full btn-secondary text-primary font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg text-lg border-0"
              disabled={!nickname.trim()}
            >
              <Play className="w-5 h-5 mr-0" />
              Start Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
