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
    <section className="relative mx-auto mt-24 mb-24 w-full max-w-7xl overflow-hidden rounded-[32px] bg-[#021A54] px-4 py-16 text-white shadow-[0_30px_80px_rgba(2,26,84,0.25)] sm:px-6 lg:px-8">
      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#FF85BB]/10 blur-3xl" />
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[#FFCEE3]/10 blur-3xl" />

      <div className="relative grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-flex rounded-full border border-[#FF85BB]/40 bg-[#FFCEE3]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#FFCEE3]">
            Better care outcomes
          </span>

          <h2 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
            Our commitment to <span className="text-[#FF85BB]">your health journey</span>
          </h2>

          <p className="max-w-xl text-base leading-relaxed text-slate-300 md:text-lg">
            MediCare Connect brings together digital convenience and clinical excellence so patients get the right support, faster.
          </p>

          <div className="space-y-4 pt-3">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <div className="mt-0.5 rounded-full bg-white/10 p-1.5">{point.icon}</div>
                <p className="text-sm font-semibold text-slate-200 sm:text-base">{point.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-5 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6"
        >
          {[
            { value: '10 min', label: 'Avg. response time', accent: 'text-[#FF85BB]' },
            { value: '99.9%', label: 'Uptime reliability', accent: 'text-white' },
            { value: '24/7', label: 'Doctor availability', accent: 'text-white' },
            { value: 'Zero', label: 'Hidden charges', accent: 'text-[#FF85BB]' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center shadow-inner shadow-white/5">
              <h3 className={`text-3xl font-black sm:text-4xl ${item.accent}`}>{item.value}</h3>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}