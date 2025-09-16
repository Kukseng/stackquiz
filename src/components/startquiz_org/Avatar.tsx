import React from "react";

export default function Avatar({
  name,
  emoji = "😀",
  size = 44,
}: {
  name: string;
  emoji?: string;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        style={{ width: size, height: size }}
        className="grid place-content-center rounded-full bg-white shadow-md ring-1 ring-black/5 select-none"
      >
        <span className="text-[20px]">{emoji}</span>
      </div>
      <div className="text-white font-semibold">{name}</div>
    </div>
  );
}
