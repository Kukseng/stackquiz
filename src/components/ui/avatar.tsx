"use client";

import React from "react";
import Image from "next/image";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  alt?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  fallback,
  alt = "avatar",
  className,
  ...props
}) => {
  return (
    <div className={`relative rounded-full overflow-hidden ${className}`} {...props}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100px, 150px"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-bold">
          {fallback || "?"}
        </div>
      )}
    </div>
  );
};

export const AvatarImage = Avatar;

export const AvatarFallback: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gray-300 text-white font-bold ${className}`}
    >
      {children}
    </div>
  );
};
