"use client";

import React from "react";
import Image from "next/image";
import Stage from "./Stage";
import Card from "./Card";
import { Button } from "@/components/ui/button";

import ChallengeGrid from "../GridCardComponent";


export default function StartPage() {
  return (
    <Stage>
      <div className="grid gap-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Card className="relative overflow-hidden rounded-xl group">
            <Image
              src="https://static.vecteezy.com/system/resources/previews/000/152/286/non_2x/linear-computer-technology-vector.jpg"
              alt="Computer Programming"
              width={600}
              height={400}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
            />
          </Card>

          <Card className="p-6 md:p-8 flex flex-col justify-center bg-[#5a6fb6]/40 rounded-xl">
            <h2 className="text-white font-extrabold text-2xl md:text-3xl">
              Computer Programming
            </h2>
            <p className="mt-2 text-white/80 text-sm leading-relaxed">
              Computer programming is writing code to make computers perform tasks or solve problems.
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                25 questions
              </span>
              <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                Hard
              </span>
            </div>

            <div className="mt-7">
              <div className="text-sm text-white/85 mb-2">Content</div>
              <div className="flex items-center gap-3">
                <div className="rounded-full border border-amber-300 bg-black/30 px-4 py-2 text-white/85">
                  Computer Science
                </div>
                <Button size="sm" className="h-10 rounded-full px-6 bg-white/10 text-white hover:bg-white/20">
                  Start
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Grid */}
        <ChallengeGrid/>
      </div>
    </Stage>
  );
}
