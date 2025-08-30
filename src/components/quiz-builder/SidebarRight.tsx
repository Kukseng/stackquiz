

"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock } from "lucide-react"
import { Question } from "./QuizBuilder"

export default function SidebarRight({
  questions,
  currentQuestion,
  setCurrentQuestion,
}: {
  questions: Question[]
  currentQuestion: Partial<Question>
  setCurrentQuestion: (q: Partial<Question>) => void
}) {
  return (
    <div className="w-[300px] bg-white/10 backdrop-blur-sm border-l border-white/20 p-6">
      <div className="space-y-6">
        <div>
          <Label className="text-white flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4" />
            Time limit
          </Label>
          <Select
            value={currentQuestion.timeLimit?.toString() || "5"}
            onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, timeLimit: Number.parseInt(value) })}
          >
            <SelectTrigger className="bg-white/20 border-white/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 seconds</SelectItem>
              <SelectItem value="10">10 seconds</SelectItem>
              <SelectItem value="20">20 seconds</SelectItem>
              <SelectItem value="30">30 seconds</SelectItem>
              <SelectItem value="60">1 minute</SelectItem>
              <SelectItem value="90">90 seconds</SelectItem>
              <SelectItem value="120">2 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/20">
          <Button variant="destructive" className="w-full bg-red-500 hover:bg-red-600" disabled={questions.length === 0}>
            Delete
          </Button>
          <Button className="w-full bg-orange-500 hover:bg-orange-600" disabled={questions.length === 0}>
            Duplicate
          </Button>
        </div>
      </div>
    </div>
  )
}
