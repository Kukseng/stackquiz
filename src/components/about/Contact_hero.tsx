"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {  Variants } from "framer-motion";
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Form submitted:", form);
    setIsSubmitting(false);
    
    // Reset form after successful submission
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    });
  };

  const contactInfo = [
    {
      icon: "/map.png",
      label: "Address",
      value: "Tuol Kouk, Phnom Penh, Cambodia",
      delay: 0
    },
    {
      icon: "/call.png",
      label: "Phone",
      value: "(+855) 96 458 789 / 97 458 789",
      delay: 0.1
    },
    {
      icon: "/email.png",
      label: "Email",
      value: "info.stackquiz@gmail.com",
      delay: 0.2
    }
  ];


  // 
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

// 

const SectionTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    className={`text-center mb-16 ${className}`}
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
  >
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
      <span className="relative">
        <span className="text-yellow-400 relative">
          {children}
          <motion.div
            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          />
        </span>
      </span>
    </h2>
  </motion.div>
);


  return (
    <section className="relative py-20 text-white overflow-hidden">
      <SectionTitle>{t.contact.title}</SectionTitle>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Section - Contact Info & Illustration */}
          <motion.div
            className="space-y-8"
            variants={fadeInLeft}
          >
            {/* Illustration */}
            <motion.div
              className="flex justify-center lg:justify-start mb-8"
              variants={scaleIn}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src="/about_svg/aboutus(contact).svg"
                  alt="Contact Us"
                  width={400}
                  height={400}
                  className="w-64 sm:w-80 lg:w-96 h-auto drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Contact Information Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: info.delay, duration: 0.6 }
                    }
                  }}
                  whileHover={{ scale: 1.02, x: 10 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors">
                    <Image 
                      src={info.icon} 
                      alt={info.label} 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-400 font-medium">{info.label}</p>
                    <p className="text-white font-medium">{info.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Section - Contact Form */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
            variants={fadeInRight}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  className="space-y-2"
                  variants={fadeInUp}
                >
                  <label htmlFor="firstName" className="text-sm font-medium text-yellow-400">
                    First Name
                  </label>
                  <motion.input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 hover:border-white/30"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  variants={fadeInUp}
                >
                  <label htmlFor="lastName" className="text-sm font-medium text-yellow-400">
                    Last Name
                  </label>
                  <motion.input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 hover:border-white/30"
                    whileFocus={{ scale: 1.02 }}
                  />
                </motion.div>
              </div>

              {/* Email Field */}
              <motion.div
                className="space-y-2"
                variants={fadeInUp}
              >
                <label htmlFor="email" className="text-sm font-medium text-yellow-400">
                  Email Address
                </label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 hover:border-white/30"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Message Field */}
              <motion.div
                className="space-y-2"
                variants={fadeInUp}
              >
                <label htmlFor="message" className="text-sm font-medium text-yellow-400">
                  Message
                </label>
                <motion.textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 hover:border-white/30 resize-none"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSubmitting ? 'animate-pulse' : 'hover:scale-105'
                }`}
                variants={fadeInUp}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Send Message"
                )}
              </motion.button>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
