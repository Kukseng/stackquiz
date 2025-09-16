"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Stage from "./Stage";

export default function Countdown() {
  const [count, setCount] = useState(3);
  const router = useRouter();

  useEffect(() => {
    if (count > 1) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (count === 1) {
      // wait 1 second then navigate
      const timeout = setTimeout(() => {
        router.push("/startquiz_org/wait-start");
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [count, router]);

  return (
    <Stage> <div className="mx-auto max-w-7xl grid h-56 w-56 place-content-center rounded-full text-6xl font-extrabold cosmic-bg text-white shadow-2xl"> {count} </div> </Stage>
  );
}
