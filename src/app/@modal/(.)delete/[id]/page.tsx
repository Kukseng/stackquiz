"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DeleteModal({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleDelete = () => {
    // Handle delete logic here
    console.log("Deleting question:", params.id)
    router.back()
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Delete this question now</h2>
          <p className="text-gray-600">Are you sure you want to delete this question? This action can't be undone.</p>
          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

