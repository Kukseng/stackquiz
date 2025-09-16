"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    particlesJS?: (tagId: string, params: unknown) => void; 
    pJSDom?: Array<{
      pJS?: {
        fn?: {
          vendors?: {
            destroypJS?: () => void;
          };
        };
      };
    }>;
  }
}

type Props = {
  colors?: string[];
  size?: number;
  countDesktop?: number;
  countTablet?: number;
  countMobile?: number;
  zIndex?: number;
};

export default function ParticlesBackground({
  colors = ["#ffffff", "#f4b231", "#ff7300"],
  size = 4,
  countDesktop = 60,
  countTablet = 40,
  countMobile = 25,
  zIndex = -10,
}: Props) {
  useEffect(() => {
    const ensureScript = () =>
      new Promise<void>((resolve) => {
        if (window.particlesJS) return resolve();
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
        s.async = true;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    const destroyAll = () => {
      if (window.pJSDom && window.pJSDom.length) {
        window.pJSDom.forEach((p) => p.pJS?.fn?.vendors?.destroypJS?.());
        window.pJSDom = [];
      }
    };

    const pickCount = () => {
      const w = window.innerWidth;
      if (w > 1024) return countDesktop;
      if (w > 768) return countTablet;
      return countMobile;
    };

    let cancelled = false;

    const init = () => {
      destroyAll();
      if (window.particlesJS) {
        window.particlesJS("js-particles", {
          particles: {
            number: { value: pickCount() },
            color: { value: colors },
            shape: { type: "circle" },
            opacity: { value: 1, random: false },
            size: { value: size, random: true },
            line_linked: { enable: false },
            move: {
              enable: true,
              speed: 2,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: false },
              onclick: { enable: false },
              resize: true,
            },
          },
          retina_detect: true,
        });
      }
    };

    ensureScript().then(() => {
      if (!cancelled) init();
    });

    let lastBucket = window.innerWidth > 1024 ? "d" : window.innerWidth > 768 ? "t" : "m";
    const onResize = () => {
      const bucket = window.innerWidth > 1024 ? "d" : window.innerWidth > 768 ? "t" : "m";
      if (bucket !== lastBucket) {
        lastBucket = bucket;
        init();
      } else {
        window.dispatchEvent(new Event("resize"));
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      destroyAll();
    };
  }, [colors, size, countDesktop, countTablet, countMobile]);

  return (
    <div
      id="js-particles"
      className="fixed inset-0 pointer-events-none"
      style={{
        width: "100%",
        height: "100vh",
        zIndex,
      }}
    />
  );
}
