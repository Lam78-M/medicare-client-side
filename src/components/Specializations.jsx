"use client";
import { motion } from "framer-motion";
import { Heart, Brain, Activity, Baby, Sparkles } from "lucide-react";

export default function Specializations() {
  const specialties = [
    {
      name: "Cardiology",
      description: "Advanced heart screenings, blood pressure management, and preventive cardiac care.",
      icon: <Heart size={28} />,
    },
    {
      name: "Neurology",
      description: "Comprehensive brain and nervous system evaluations for long-term wellness.",
      icon: <Brain size={28} />,
    },
    {
      name: "Orthopedics",
      description: "Joint, fracture, and mobility care designed for faster recovery and comfort.",
      icon: <Activity size={28} />,
    },
    {
      name: "Pediatrics",
      description: "Compassionate child health support, vaccinations, and growth tracking.",
      icon: <Baby size={28} />,
    },
    {
      name: "Dermatology",
      description: "Skin, scalp, and beauty-focused care using modern treatment plans.",
      icon: <Sparkles size={28} />,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 85, damping: 14 },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f5f7ff_100%)] py-18 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-[#FF85BB]/30 bg-[#FFCEE3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#021A54]">
            Specialties
          </span>
          <h2 className="text-3xl font-black tracking-tight text-[#021A54] sm:text-4xl md:text-5xl">
            Top Medical <span className="text-[#FF85BB]">Specializations</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            Access expert-led care across key departments designed to keep your health journey simple, personal, and effective.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5"
        >
          {specialties.map((specialty, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -10,
                boxShadow: "0px 22px 40px rgba(255, 133, 187, 0.15)",
                borderColor: "#FF85BB",
              }}
              className="group flex min-h-[260px] flex-col items-center rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-[0_16px_28px_rgba(2,26,84,0.05)] transition-all duration-300"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#021A54] text-white shadow-lg shadow-[#021A54]/20 transition duration-300 group-hover:bg-[#FFCEE3] group-hover:text-[#021A54]">
                {specialty.icon}
              </div>

              <h3 className="mb-3 text-xl font-bold text-[#021A54]">{specialty.name}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{specialty.description}</p>

              <div className="mt-auto pt-5 text-xs font-bold text-[#FF85BB] opacity-0 transition duration-300 group-hover:opacity-100">
                Find Doctors →
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}