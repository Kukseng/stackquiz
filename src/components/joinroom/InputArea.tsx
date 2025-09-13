"use client";

import * as React from "react";
import Image from "next/image";
// import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { useLanguage } from "@/context/LanguageContext";
import en from "@/locales/en.json";
import kh from "@/locales/km.json";

type InputAreaProps = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  buttonLabel?: string;
  buttonDisabled?: boolean;
  className?: string;
  isLoading?: boolean;
};

export default function InputArea({
  value,
  onChange,
  onSubmit,
  placeholder = "Enter Code...",
  iconSrc = "/gameButton.svg",
  iconAlt = "",
  buttonLabel = "Start",
  buttonDisabled,
  className,
  isLoading = false,
}: InputAreaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  const { language, toggleLanguage } = useLanguage();
  const t = language === "en" ? en.inputArea : kh.inputArea;
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buttonDisabled || isLoading) return;
    
    // Basic validation
    if (!value.trim()) {
      setHasError(true);
      setTimeout(() => setHasError(false), 3000);
      return;
    }
    
    onSubmit();
  };

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className={`
          relative grid grid-cols-[1fr_auto] items-center gap-4 p-4
          rounded-2xl border-2 backdrop-blur-xl shadow-2xl transition-all duration-300
          ${isFocused 
            ? 'border-yellow-400 bg-white/10 shadow-yellow-400/20' 
            : 'border-yellow-400/50 bg-white/5'
          }
          ${hasError 
            ? 'border-red-400 bg-red-500/10 animate-shake' 
            : ''
          }
          ${className || ''}
        `}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Input Container */}
        <div className="relative flex-1">
          {/* Icon */}
          {iconSrc && (
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7 z-10"
              animate={{ 
                scale: isFocused ? 1.1 : 1,
                rotate: isFocused ? 360 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={iconSrc}
                alt={iconAlt}
                width={28}
                height={28}
                className="object-contain opacity-80"
              />
            </motion.div>
          )}

          {/* Input Field */}
          <motion.input
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value.toUpperCase()); // Convert to uppercase for room codes
              setHasError(false);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            maxLength={10} // Reasonable limit for room codes
            className={`
              w-full h-16 px-4 text-lg font-medium text-white
              bg-transparent border-0 outline-none
              placeholder:text-white/50 transition-all duration-300
              ${iconSrc ? 'pl-14' : 'pl-4'}
              ${hasError ? 'placeholder:text-red-400/50' : ''}
            `}
            whileFocus={{ scale: 1.02 }}
          />

          {/* Floating Label Effect */}
          <AnimatePresence>
            {value && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-2 left-4 px-2 bg-gradient-to-r from-blue-900 to-purple-900 rounded text-xs font-medium text-yellow-400"
              >
                {t.labelname}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            disabled={buttonDisabled || isLoading}
            className={`
              h-14 px-8 font-bold text-lg rounded-xl
              bg-gradient-to-r from-yellow-400 to-orange-400
              text-black shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
              ${isLoading ? 'animate-pulse' : 'hover:scale-105'}
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Joining...
              </div>
            ) : (
              buttonLabel
            )}
          </Button>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute -bottom-8 left-0 text-red-400 text-sm font-medium"
            >
              Please enter a valid room code
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Subtle hint text */}
      <motion.p
        className="text-center text-white/60 text-sm mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {t.hint}
      </motion.p>
    </motion.div>
  );
}
