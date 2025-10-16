
"use client";
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setNotifications([]); 
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl">

        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center bg-white p-10 rounded-2xl shadow-sm border border-gray-200"
          >
            <Bell className="w-12 h-12 text-gray-400 mb-3" />
            <h2 className="text-lg font-medium text-gray-600">
              No notifications yet
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              You see updates and alerts here once they arrive.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <p className="text-gray-700">{n.message}</p>
                <span className="text-xs text-gray-400">
                  {n.date || "Just now"}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
