"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Award, HeartHandshake } from "lucide-react";

export default function PlatformStats() {
  const points = [
    { text: "Trusted by over 50,000+ active patients monthly", icon: <CheckCircle2 className="text-[#FF85BB]" size={20} /> },
    { text: "Direct access to 500+ premium certified board specialists", icon: <Award className="text-[#FF85BB]" size={20} /> },
    { text: "98.7% positive consulting satisfaction rating", icon: <HeartHandshake className="text-[#FF85BB]" size={20} /> },
  ];

  return (
    <section className="bg-[#021A54] py-20 text-white relative overflow-hidden mt-30 mb-30">
      {/* গ্লো ইফেক্ট */}
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#FF85BB]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* বাম কলাম: বড় টেক্সট এবং বুলেট লিস্ট */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-5xl font-black leading-tight">
              Our Commitment to <br />
              <span className="text-[#FF85BB]">Your Health Journey</span>
            </h2>
            <p className="text-slate-300 max-w-xl font-medium leading-relaxed">
              MediCare Connect is not just an app; it is a comprehensive smart medical network designed to keep professional medical help right in your pocket.
            </p>

            {/* পয়েন্ট লিস্ট */}
            <div className="space-y-4 pt-4">
              {points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 bg-white/10 p-1 rounded-full">{point.icon}</div>
                  <p className="text-slate-200 font-semibold text-sm md:text-base">{point.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ডান কলাম: বড় এবং বোল্ড স্ট্যাটিস্টিক্স গ্রিড */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-6 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm"
          >
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <h3 className="text-4xl md:text-5xl font-black text-[#FF85BB] mb-1">10 min</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg. Response Time</p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-1">99.9%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Uptime Reliability</p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <h3 className="text-4xl md:text-5xl font-black text-white mb-1">24/7</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Doctor Availability</p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
              <h3 className="text-4xl md:text-5xl font-black text-[#FF85BB] mb-1">Zero</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hidden Charges</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}