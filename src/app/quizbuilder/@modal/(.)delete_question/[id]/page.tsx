
"use client"

import  DeleteQuestionModal  from "@/components/quizBuilder/modal/deleteqquestion"

interface Props {
  params: { id: string }
}

export default function DeleteQuestionModalPage({ params }: Props) {
  return <DeleteQuestionModal questionId={Number.parseInt(params.id)} />
}
