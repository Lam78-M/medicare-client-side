"use client";
import { motion } from "framer-motion";
import { Heart, Brain, Activity, Baby, Sparkles } from "lucide-react";

export default function Specializations() {
  const specialties = [
    {
      name: "Cardiology",
      description: "Heart care, blood pressure, and cardiovascular health management.",
      icon: <Heart size={28} />,
    },
    {
      name: "Neurology",
      description: "Brain, spine, nervous system, and advanced neurological care.",
      icon: <Brain size={28} />,
    },
    {
      name: "Orthopedics",
      description: "Bone health, joint pains, fractures, and sports injury solutions.",
      icon: <Activity size={28} />,
    },
    {
      name: "Pediatrics",
      description: "Specialized newborn care, child growth monitoring, and vaccinations.",
      icon: <Baby size={28} />,
    },
    {
      name: "Dermatology",
      description: "Skin, hair, nail treatments, and advanced clinical skincare.",
      icon: <Sparkles size={28} />,
    },
  ];

  // 🎭 কন্টেইনার অ্যানিমেশন ভ্যারিয়েন্টস
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.12, // প্রতিটি কার্ডের মাঝে সামান্য গ্যাপ
      },
    },
  };

  // 🎭 কার্ডের অ্যানিমেশন ভ্যারিয়েন্টস
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, // নিচ থেকে শুরু হবে
      scale: 0.95 
    },
    show: { 
      opacity: 1, 
      y: 0, // নিজের জায়গায় ফিরে আসবে
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 14 
      } 
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* সেকশন হেডার */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-[#021A54] tracking-tight mb-4">
          Top Medical <span className="text-[#FF85BB]">Specializations</span>
        </h2>
        <p className="text-slate-600 font-medium md:text-lg">
          Access specialized care from our world-class department experts right when you need it.
        </p>
      </div>

      {/* 🚀 মেইন ট্রিক: viewport={{ once: false }} করে দেওয়া হয়েছে */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show" 
        viewport={{ once: false, amount: 0.15 }} // ⚡ once: false দেওয়ার কারণে এই পেজে যতবারই আসবে বা স্ক্রল আপ-ডাউন করবে, ততবারই নতুন করে মোশন দেখাবে!
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {specialties.map((specialty, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              y: -8, // হোভার করলে ওপরে উঠবে
              boxShadow: "0px 20px 30px rgba(255, 133, 187, 0.15)",
              borderColor: "#FF85BB"
            }}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 transition-colors duration-300 flex flex-col items-center text-center group cursor-pointer"
          >
            {/* আইকন বক্স */}
            <div className="w-16 h-16 rounded-xl bg-[#021A54] text-white flex items-center justify-center mb-5 group-hover:bg-[#FFCEE3] group-hover:text-[#021A54] transition-colors duration-300 shadow-md">
              {specialty.icon}
            </div>

            {/* স্পেশালাইজেশনের নাম */}
            <h3 className="text-xl font-bold text-[#021A54] mb-2">
              {specialty.name}
            </h3>

            {/* বর্ণনা */}
            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              {specialty.description}
            </p>

            {/* বাটন ইন্ডিকেটর */}
            <div className="mt-auto pt-4 text-xs font-bold text-[#FF85BB] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Find Doctors &rarr;
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}