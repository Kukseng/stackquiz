import { motion } from "framer-motion"
import  Table  from "../table"
import { Button } from "@/components/ui/button"

export function Summary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen md:min-h-[800px] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden rounded-lg"
    >
      <div className="relative flex">
        <div className="flex-1 p-8">
          {/* Library Page Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-white">Session Summary</h1>
              <Button className="px-6 py-6 text-base font-semibold rounded-xl bg-black text-white hover:bg-white hover:text-black shadow-lg transition-all duration-300">
                View All Records
              </Button>
            </div>
            <p className="text-gray-300 text-lg">
              Review your performance and track your progress over time.
            </p>
          </div>

          {/* Table */}
          <Table/>
        </div>
      </div>
    </motion.div>
  )
}
