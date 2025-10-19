"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 w-96 text-center"
            >
              <div className="flex justify-center mb-4">
                <LogOut className="w-12 h-12 text-red-500" />
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Log Out?
              </h2>
              <p className="text-gray-500 mb-6">
                Are you sure you want to log out of your account?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
