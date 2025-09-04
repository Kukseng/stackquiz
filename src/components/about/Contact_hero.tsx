"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
export function ContactSection() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15, duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 text-white overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-[url('/stars.png')] bg-cover bg-center opacity-80" />
      </motion.div>

      <div className="relative max-w-screen-2xl md:mx-30 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-30">
  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
    <span className="relative">
      Contact{" "}
      <span className="text-yellow">
        Us
      </span>
      <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-yellow-400"></span>
    </span>
  </h2>
</div>

        <motion.div
          className="flex flex-col md:flex-row gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white/2 backdrop-blur-3xl border-none rounded-3xl shadow-2xl p-4 sm:p-8 md:p-10 flex flex-col md:flex-row gap-6 text-white w-full">
            {/* Left Section */}
            <CardContent className="flex-[1] flex flex-col items-center md:mx-3 md:items-start text-center md:text-left gap-3 sm:gap-4">
              <motion.img
                src="about_svg/aboutus(contact).svg"
                alt="Support"
                className="w-28 h-28 sm:w-40 sm:h-40 md:w-72 md:h-72 lg:w-80 lg:h-80 max-w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />

              <motion.div
                className="flex items-center gap-2 flex-wrap justify-center md:justify-start"
                variants={itemVariants}
              >
                {/* Instagram Icon */}
                <div className="w-8 h-8 flex items-center justify-center  overflow-hidden">
                  <Image src="/map.png" alt="Map Icon" width={24} height={24} />
                </div>

                {/* Phone Number */}
                <p className="text-xs sm:text-sm md:text-base break-words">
                  Khan Toul Kork,Phnom Penh, Cambodia
                </p>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 flex-wrap justify-center sm:justify-start"
                variants={itemVariants}
              >
                {/* Phone Icon */}
                <div className="w-8 h-8 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src="/call.png"
                    alt="Call Icon"
                    width={24}
                    height={24}
                  />
                </div>

                {/* Phone Number */}
                <p className="text-xs sm:text-sm md:text-base break-words text-center sm:text-left">
                  +855 717563743 / 971777544
                </p>
              </motion.div>

              <motion.div
                className="flex items-center gap-2 flex-wrap justify-center sm:justify-start"
                variants={itemVariants}
              >
                {/* Email Icon */}
                <div className="w-8 h-8 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Image
                    src="/email.png"
                    alt="Email Icon"
                    width={24}
                    height={24}
                  />
                </div>

                {/* Email Address */}
                <p className="text-xs sm:text-sm md:text-base break-all text-center sm:text-left">
                  infostackquizz123@gmail.com
                </p>
              </motion.div>
            </CardContent>

            {/* Right Section - Form */}
            <CardContent className="flex-[2] md:mx-3 sm:mt-0 mt-4 w-full px-2 sm:px-0">
              <motion.form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <motion.div
                    className="relative w-full flex flex-col gap-1"
                    variants={itemVariants}
                  >
                    <label
                      htmlFor="firstName"
                      className="text-sm text-yellow-400 font-medium sm:mt-0 mt-2"
                    >
                      First Name
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 sm:w-6 h-5 sm:h-6 text-gray-400 transition-colors duration-300 peer-focus:text-yellow-400 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Roeurm"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="peer w-full bg-transparent border border-yellow-400 text-white placeholder:text-gray-400 focus:placeholder-transparent text-sm sm:text-base h-11 sm:h-12 pl-9 sm:pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                      />
                    </div>
                  </motion.div>

                  {/* Last Name */}
                  <motion.div
                    className="relative w-full flex flex-col gap-1"
                    variants={itemVariants}
                  >
                    <label
                      htmlFor="lastName"
                      className="text-sm text-yellow-400 font-medium"
                    >
                      Last Name
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 sm:w-6 h-5 sm:h-6 text-gray-400 transition-colors duration-300 peer-focus:text-yellow-400 pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Dara"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="peer w-full bg-transparent border border-yellow-400 text-white placeholder:text-gray-400 focus:placeholder-transparent text-sm sm:text-base h-11 sm:h-12 pl-9 sm:pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Email */}
                <motion.div
                  className="relative w-full flex flex-col gap-1"
                  variants={itemVariants}
                >
                  <label
                    htmlFor="email"
                    className="text-sm text-yellow-400 font-medium"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 sm:w-6 h-4 sm:h-6 text-gray-400 transition-colors duration-300 peer-focus:text-yellow-400 pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z" />
                      <path d="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z" />
                    </svg>

                    <input
                      type="email"
                      id="email"
                      placeholder="info123@gmail.com"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border border-yellow-400 text-white placeholder:text-gray-400 focus:placeholder-transparent text-sm sm:text-base h-11 sm:h-12 pl-9 sm:pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                    />
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  className="relative w-full flex flex-col gap-1"
                  variants={itemVariants}
                >
                  <label
                    htmlFor="message"
                    className="text-sm text-yellow-400 font-medium"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-4 sm:top-5 w-5 sm:w-6 h-5 sm:h-6 text-gray-400 transition-colors duration-300 peer-focus:text-yellow-400 pointer-events-none"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5.983C3 4.888 3.895 4 5 4h14c1.105 0 2 .888 2 1.983v8.923a1.992 1.992 0 0 1-2 1.983h-6.6l-2.867 2.7c-.955.899-2.533.228-2.533-1.08v-1.62H5c-1.105 0-2-.888-2-1.983V5.983Zm5.706 3.809a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Zm2.585.002a1 1 0 1 1 .003 1.414 1 1 0 0 1-.003-1.414Zm5.415-.002a1 1 0 1 0-1.412 1.417 1 1 0 1 0 1.412-1.417Z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <textarea
                      id="message"
                      placeholder="Write your message..."
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={6}
                      className="peer w-full bg-transparent border border-yellow-400 text-white placeholder:text-gray-400 focus:placeholder-transparent text-sm sm:text-base min-h-[12rem] sm:h-60 pl-9 sm:pl-10 pt-4 sm:pt-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all resize-none"
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="btn-secondary btn-text px-6 py-2 sm:py-3 md:py-4 box-radius font-semibold text-base sm:text-lg"
                  whileHover={{ scale: 0.98 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Send Message
                </motion.button>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
