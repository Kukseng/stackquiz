"use client";

import React, { useEffect } from "react";
import Pill from "./Pill";
import Stage from "./Stage";
import { useRouter } from "next/navigation";

export default function QuestionList() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/startquiz_org/choice");
    }, 3000); // redirect after 3s

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Stage>
      <div className="mx-auto grid max-w-[820px] gap-4">
        <div className="ml-auto">
          <Pill>1 of 10</Pill>
        </div>
        <div className="mx-auto w-full rounded-2xl border border-[#f5c46b] bg-black/25 px-48 py-6 text-center text-2xl font-extrabold text-white">
          HTML Stands for
        </div>
      </div>
    </Stage>
  );
}
