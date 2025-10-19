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
  const fontClass = language === "en" ? "en-font" : "kh-font";

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Email sent successfully:", data);
        setSubmitStatus("success");
        
        // Clear form after successful submission
        setForm({ firstName: "", lastName: "", email: "", message: "" });

        // Hide success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error("Email send failed:", error);
      setSubmitStatus("error");

      // Hide error message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
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
    <section
      className={`relative max-w-7xl mx-auto py-12 sm:py-16 lg:py-20 text-white overflow-hidden px-4 sm:px-6 lg:px-8 mt-[-100px] mb-[-5px] ${fontClass}`}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-[url('/stars.png')] bg-cover bg-center opacity-80" />
      </motion.div>

      {/* Section Title */}
      <div className="relative text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          <span className="relative text-yellow text-underline">
            {t.contact.title}
          </span>
        </h2>
      </div>

      <motion.div
        className="flex flex-col md:flex-row gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 text-white w-full">
          {/* Left Section */}
          <CardContent className="flex-1 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
            <motion.img
              src="about_svg/aboutus(contact).svg"
              alt="Support"
              className="w-28 sm:w-40 md:w-56 lg:w-64 h-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />


            {/* Address */}
            <motion.div
              className="flex items-center gap-3 justify-center md:justify-start"
              variants={itemVariants}
            >
              <Image src="/map.png" alt="Map Icon" width={24} height={24} />
              <p className="text-sm sm:text-base break-words">{t.contact.address}</p>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="flex items-center gap-3 justify-center md:justify-start"
              variants={itemVariants}
            >
              <Image src="/call.png" alt="Call Icon" width={24} height={24} />
              <p className="text-sm sm:text-base break-words">{t.contact.phone}</p>
            </motion.div>

            {/* Email */}
            <motion.div
              className="flex items-center gap-3 justify-center md:justify-start"
              variants={itemVariants}
            >
              <Image src="/email.png" alt="Email Icon" width={24} height={24} />
              <p className="text-sm sm:text-base break-all">{t.contact.emailAddress}</p>
            </motion.div>
          </CardContent>

          {/* Right Section - Form */}
          <CardContent className="flex-[2] w-full">
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First Name */}
                <motion.div className="flex flex-col gap-2" variants={itemVariants}>
                  <label htmlFor="firstName" className="text-sm font-medium text-yellow-400">
                    {t.contact.firstName}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder={t.contact.placeholder.firstName}
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full  border border-yellow-400 text-white  text-sm sm:text-base h-12 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                  />
                </motion.div>

                {/* Last Name */}
                <motion.div className="flex flex-col gap-2" variants={itemVariants}>
                  <label htmlFor="lastName" className="text-sm font-medium text-yellow-400">
                    {t.contact.lastName}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder={t.contact.placeholder.lastName}
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full  border border-yellow-400 text-white  text-sm sm:text-base h-12 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                  />
                </motion.div>
              </div>


              {/* Email */}
              <motion.div className="flex flex-col gap-2" variants={itemVariants}>
                <label htmlFor="email" className="text-sm font-medium text-yellow-400">
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t.contact.placeholder.email}
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full  border border-yellow-400 text-white  text-sm sm:text-base h-12 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                />
              </motion.div>

              {/* Message */}
              <motion.div className="flex flex-col gap-2" variants={itemVariants}>
                <label htmlFor="message" className="text-sm font-medium text-yellow-400">
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder={t.contact.placeholder.message}
                  value={form.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full  border border-yellow-400 text-white  text-sm sm:text-base min-h-[10rem] p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none disabled:opacity-50"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-yellow-400 btn-text btn-secondary text-black font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-yellow-300 transition-all text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSubmitting ? { scale: 0.98 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              >
                {isSubmitting ? "Sending..." : t.contact.button}
              </motion.button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm"
                >
                  ✓ Message sent successfully! We all get back to you soon.
                </motion.div>
              )}
              
              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm"
                >
                  ✗ Failed to send message. Please try again or email us directly.
                </motion.div>
              )}
            </motion.form>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
