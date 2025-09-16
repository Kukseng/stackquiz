"use client";

import React from "react";
import QRCode from "react-qr-code";

interface QRCodeBoxProps {
  joinUrl: string;        // The URL participants use to join
  className?: string;
}

export default function QRCodeBox({ joinUrl, className = "" }: QRCodeBoxProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(joinUrl);
    alert("✅ Join link copied to clipboard!");
  };

  return (
    <div className={`rounded-xl bg-white p-3 flex flex-col items-center ${className}`}>
      {/* QR Code */}
      <QRCode value={joinUrl} size={160} />

      {/* Join URL + copy button */}
      <div className="mt-2 w-full flex flex-col items-center">
        <div className="text-sm text-black font-medium truncate max-w-full">{joinUrl}</div>
        <button
          onClick={handleCopy}
          className="mt-1 px-3 py-1 rounded-full bg-blue-500 text-white text-xs hover:bg-blue-600 transition"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
