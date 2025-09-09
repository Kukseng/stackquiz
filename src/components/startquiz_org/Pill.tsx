import React from "react";

type Props = {
  color?: string; // tailwind gradient colors e.g. 'from-.. to-..'
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
};

export default function Pill({
  color = "from-[#FFB84C] to-[#FF9F1C]",
  children,
  className = "",
  onClick,
  role,
}: Props) {
  return (
    <button
      onClick={onClick}
      role={role}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-b ${color} px-4 py-1.5 text-sm font-semibold text-[#2b2b2b] shadow-[inset_0_-2px_0_rgba(0,0,0,0.15),0_6px_14px_rgba(0,0,0,0.25)] ${className}`}
    >
      {children}
    </button>
  );
}
