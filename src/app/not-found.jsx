"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Stethoscope, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* 🔮 ব্যাকগ্রাউন্ডে থিম অনুযায়ী সুন্দর গ্লো ইফেক্ট */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF85BB]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#FFCEE3]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-xl mx-auto z-10 space-y-8">
        
        {/* 🏥 ১.  ৪৪৪ এবং আইকন সেকশন */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative inline-flex items-center justify-center mb-4"
        >
          <h1 className="text-[120px] md:text-[160px] font-black text-[#021A54] leading-none tracking-tighter flex items-center justify-center">
            4
            <motion.span
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
                y: [0, -5, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-[#FF85BB] mx-2 p-4 bg-[#FFCEE3]/30 rounded-full inline-flex items-center justify-center"
            >
              <Stethoscope size={64} className="stroke-[2.5]" />
            </motion.span>
            4
          </h1>
        </motion.div>

        {/* 📝 ২. টেক্সট মেসেজ সেকশন */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3"
        >
          <h2 className="text-2xl md:text-4xl font-black text-[#021A54]">
            Oops! This Page is <span className="text-[#FF85BB]">Off-Duty</span>
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed max-w-md mx-auto">
            The medical link you are looking for might have been moved, deleted, or never existed. Let&apos;s get you back to safety!
          </p>
        </motion.div>

        {/* 🎯 ৩. ব্যাক টু হোম বাটন */}
       <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pt-4"
        >
          {/* 🚀 এখানে <Link> সরাসরি নিজেই মোশন কম্পোনেন্ট হিসেবে কাজ করবে, কোনো <a> ট্যাগ লাগবে না */}
          <Link href="/">
            <motion.span
              whileHover={{ y: -4, boxShadow: "0px 15px 30px rgba(255, 133, 187, 0.25)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-[#021A54] hover:bg-[#021A54]/95 text-white font-bold px-8 py-4 rounded-2xl transition-all cursor-pointer text-sm tracking-wide group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Homepage
            </motion.span>
          </Link>
        </motion.div>

      </div>
    </main> // ⬅️ এবার পারফেক্টলি ক্লোজ করে দেওয়া হলো!
  );
}