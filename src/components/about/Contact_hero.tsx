"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

import en from "@/locales/en.json";
import kh from "@/locales/km.json";

export function ContactSection() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, duration: 0.6 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 text-white overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-[url('/stars.png')] bg-cover bg-center opacity-80" />
      </motion.div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-30">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          <span className="relative">
            <span className="text-yellow text-underline">{t.contact.title}</span>
          </span>
        </h2>
      </div>

        <motion.div
          className="flex flex-col md:flex-row gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Contact Info Card */}
          <Card className="bg-white/5 backdrop-blur-3xl border-none rounded-3xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6 text-white w-full">
            {/* Left Section - Info */}
            <CardContent className="flex-[1] flex flex-col items-center md:items-start text-center md:text-left gap-4">
              <motion.div variants={itemVariants}>
                <Image
                  src="/about_svg/aboutus(contact).svg"
                  alt="Support"
                  width={300}
                  height={300}
                  className="w-40 sm:w-56 md:w-72 lg:w-80 h-auto"
                />
              </motion.div>

              {/* Address */}
              <motion.div
                className="flex items-center gap-2 flex-wrap justify-center md:justify-start"
                variants={itemVariants}
              >
                <Image src="/map.png" alt="Map Icon" width={24} height={24} />
                <p className="text-sm sm:text-base break-words">Tuol Kouk, Phnom Penh, Cambodia</p>
              </motion.div>

              {/* Phone */}
              <motion.div
                className="flex items-center gap-2 flex-wrap justify-center sm:justify-start"
                variants={itemVariants}
              >
                <Image src="/call.png" alt="Call Icon" width={24} height={24} />
                <p className="text-sm sm:text-base">(+855) 96 458 789 / 97 458 789
</p>
              </motion.div>

              {/* Email */}
              <motion.div
                className="flex items-center gap-2 flex-wrap justify-center sm:justify-start"
                variants={itemVariants}
              >
                <Image src="/email.png" alt="Email Icon" width={24} height={24} />
                <p className="text-sm sm:text-base break-all">info.stackquiz@gmail.com</p>
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
                  <motion.div className="flex flex-col gap-1" variants={itemVariants}>
                    <label htmlFor="firstName" className="text-sm text-yellow-400 font-medium">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Roeurm"
                      value={form.firstName}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border border-yellow-400 text-white placeholder-gray-400 focus:placeholder-transparent text-sm sm:text-base h-11 sm:h-12 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                    />
                  </motion.div>

                  {/* Last Name */}
                  <motion.div className="flex flex-col gap-1" variants={itemVariants}>
                    <label htmlFor="lastName" className="text-sm text-yellow-400 font-medium">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Dara"
                      value={form.lastName}
                      onChange={handleChange}
                      className="peer w-full bg-transparent border border-yellow-400 text-white placeholder-gray-400 focus:placeholder-transparent text-sm sm:text-base h-11 sm:h-12 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                    />
                  </motion.div>
                </div>

                {/* Email */}
                <motion.div className="flex flex-col gap-1" variants={itemVariants}>
                  <label htmlFor="email" className="text-sm text-yellow-400 font-medium">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="info123@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                    className="peer w-full bg-transparent border border-yellow-400 text-white placeholder-gray-400 focus:placeholder-transparent text-sm sm:text-base h-11 sm:h-12 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition-all"
                  />
                </motion.div>

                {/* Message */}
                <motion.div className="flex flex-col gap-1" variants={itemVariants}>
                  <label htmlFor="message" className="text-sm text-yellow font-medium">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Write your message..."
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="peer w-full bg-transparent border border-yellow-400 text-white placeholder-gray-400 focus:placeholder-transparent text-sm sm:text-base min-h-[12rem] sm:h-60 px-3 pt-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all resize-none"
                  />
                </motion.div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  className="box-radius  btn-text btn-secondary font-semibold rounded-lg px-6 py-3 sm:py-4 hover:scale-98 transition-transform"
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
