import React from "react";

/**
 * Lightweight placeholder QR (no dep). Replace with real QR if you prefer.
 */
export default function QRCodeBox({
  text = "stackquiz.com",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-white p-3 text-[10px] text-black ${className}`}
    >
      <div className="aspect-square w-full rounded-md bg-[radial-gradient(circle,black_20%,white_21%),radial-gradient(circle,black_20%,white_21%)] [background-size:8px_8px,8px_8px] [background-position:0_0,4px_4px]"></div>
      <div className="pt-2 text-center font-medium">{text}</div>
    </div>
  );
}
