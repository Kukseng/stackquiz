"use client";

import React, { useRef,  useState } from "react";
import { cn } from "../lib/utils";
import { Pause, Play } from "lucide-react";

export interface SlidingLogoMarqueeItem {
  id: string;
  content: React.ReactNode;
  href?: string;
}

export interface SlidingLogoMarqueeProps {
  items: SlidingLogoMarqueeItem[];
  speed?: number;
  pauseOnHover?: boolean;
  enableBlur?: boolean;
  blurIntensity?: number;
  height?: string;
  width?: string;
  gap?: string;
  scale?: number;
  direction?: "horizontal" | "vertical";
  autoPlay?: boolean;
  backgroundColor?: string;
  showGridBackground?: boolean;
  className?: string;
  onItemClick?: (item: SlidingLogoMarqueeItem) => void;
  enableSpillEffect?: boolean;
  animationSteps?: number;
  showControls?: boolean;
}


export function SlidingLogoMarquee({
  items,
  pauseOnHover = true,
  enableBlur = true,
  width = "100%",
  direction = "horizontal",
  autoPlay = true,
  backgroundColor,
  showGridBackground = false,
  className,
  onItemClick,
  enableSpillEffect = false,
  animationSteps = 8,
  showControls = true,
}: SlidingLogoMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const handleItemClick = (item: SlidingLogoMarqueeItem) => {
    if (item.href) window.open(item.href, "_blank", "noopener,noreferrer");
    onItemClick?.(item);
  };

  const togglePlayState = () => setIsPlaying(!isPlaying);

  const blurDivs = Array.from({ length: animationSteps }, (_, index) => (
    <div key={index} style={{ "--index": index } as React.CSSProperties} />
  ));

  return (
    <div
      ref={containerRef}
      className={cn("sliding-marquee-container relative", className)}
      style={{ width, background: backgroundColor }}
      onMouseEnter={() => pauseOnHover && setIsPlaying(false)}
      onMouseLeave={() => pauseOnHover && setIsPlaying(true)}
    >
      {showGridBackground && <div className="" />}

      <div
        className="sliding-marquee-resizable"
        data-translate="items"
        data-direction={direction}
        data-blurring={enableBlur}
        data-play-state={isPlaying ? "running" : "paused"}
        data-spill={enableSpillEffect}
      >
        <div className="sliding-marquee-inner">
          {enableBlur && (
            <div className="sliding-marquee-blur sliding-marquee-blur--left">
              {blurDivs}
            </div>
          )}

          <ul className="sliding-marquee-list text-foreground">
            {items.map((item, index) => (
              <li
                key={item.id}
                className="sliding-marquee-item text-foreground"
                style={{ "--index": index } as React.CSSProperties}
                onClick={() => handleItemClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleItemClick(item);
                }}
              >
                {item.content}
              </li>
            ))}
          </ul>

          {enableBlur && (
            <div className="sliding-marquee-blur sliding-marquee-blur--right">
              {blurDivs}
            </div>
          )}
        </div>
      </div>

      {showControls && (
        <button
          onClick={togglePlayState}
          className="absolute top-0 right-0 z-10 px-2 py-1 text-xs bg-white/10 text-foreground
            rounded hover:bg-background/20 transition-colors"
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>
      )}
    </div>
  );
}

export default SlidingLogoMarquee;
