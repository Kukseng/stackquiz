import { pageMetadata } from "@/config/metadata";
import JoinRoomHero from "@/components/joinroom/JoinRoomHero";
import React from "react";

/**
 * Home page - Join room hero page
 * Uses centralized metadata from config/metadata.ts
 */
export const metadata = pageMetadata.joinLive;
export default function JoinRoomPage() {
  return (
    <div>
      <JoinRoomHero />
    </div>
  );
}
