"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, UserCheck, Zap } from "lucide-react";

export default function WhyChooseUs() {
  const benefits = [
    {
      title: "100% Verified Doctors",
      description: "Every clinician is credential-checked before joining our care network, so your treatment starts with confidence.",
      icon: <UserCheck size={28} className="text-[#FF85BB]" />,
      badge: "Trusted",
    },
    {
      title: "24/7 Instant Care",
      description: "Reach a qualified medical professional anytime, with immediate support when regular clinic access is limited.",
      icon: <Clock size={28} className="text-[#FF85BB]" />,
      badge: "Available",
    },
    {
      title: "Secure Health Records",
      description: "Prescription notes, reports, and reviews stay protected with encrypted storage and privacy-first workflows.",
      icon: <ShieldCheck size={28} className="text-[#FF85BB]" />,
      badge: "Encrypted",
    },
    {
      title: "Super-Fast Experience",
      description: "Book appointments, review plans, and track follow-ups in a streamlined digital care journey.",
      icon: <Zap size={28} className="text-[#FF85BB]" />,
      badge: "Digital",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
  };

  return (
    <section className="border-b border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-[#FFCEE3]/40 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#FF85BB]">
            Platform advantages
          </span>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[#021A54] sm:text-4xl md:text-5xl">
            Why Choose <span className="text-[#FF85BB]">MediCare Connect</span>?
          </h2>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            We combine patient-first care, advanced digital tools, and trusted specialists for a smoother healthcare experience.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(2, 26, 84, 0.08)" }}
              className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 p-7 transition-all duration-300"
            >
              <div className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                {benefit.badge}
              </div>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#021A54]/5 transition duration-300 group-hover:bg-[#021A54]">
                {benefit.icon}
              </div>

              <h3 className="mb-3 text-xl font-bold text-[#021A54] transition group-hover:text-[#FF85BB]">
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}