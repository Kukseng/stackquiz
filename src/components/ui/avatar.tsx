
import React from "react"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  fallback?: string
  alt?: string
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, alt, className, ...props }) => {
  return (
    <div className={`relative rounded-full overflow-hidden ${className}`} {...props}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-white font-bold">
          {fallback || "?"}
        </div>
      )}
    </div>
  )
}

export const AvatarImage = Avatar 

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
  )
}
