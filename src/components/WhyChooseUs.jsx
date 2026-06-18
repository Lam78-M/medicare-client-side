"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, UserCheck, Zap } from "lucide-react";

export default function WhyChooseUs() {
  const benefits = [
    {
      title: "100% Verified Doctors",
      description: "Every doctor on our platform goes through a strict medical license verification process before consulting.",
      icon: <UserCheck size={28} className="text-[#FF85BB]" />,
      badge: "Trusted"
    },
    {
      title: "24/7 Instant Care",
      description: "Get connected with top-rated emergency certified physicians within minutes, anytime, day or night.",
      icon: <Clock size={28} className="text-[#FF85BB]" />,
      badge: "Available"
    },
    {
      title: "Secure Health Records",
      description: "Your prescriptions, reports, and consultation history are protected with industry-standard end-to-end encryption.",
      icon: <ShieldCheck size={28} className="text-[#FF85BB]" />,
      badge: "Encrypted"
    },
    {
      title: "Super-Fast Experience",
      description: "Skip long hospital queues. Book, pay, and join video consultations smoothly with our optimized system.",
      icon: <Zap size={28} className="text-[#FF85BB]" />,
      badge: "Digital"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <section className="bg-white py-20 border-b border-slate-100 pb-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* সেকশন হেডার */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#FF85BB] font-extrabold tracking-widest text-xs uppercase bg-[#FFCEE3]/30 px-4 py-1.5 rounded-full">
            Platform Advantages
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#021A54] tracking-tight mt-4 mb-4">
            Why Choose <span className="text-[#FF85BB]">MediCare Connect</span>?
          </h2>
          <p className="text-slate-600 font-medium">
            We bridge the gap between patients and quality healthcare with cutting-edge technology and care.
          </p>
        </div>

        {/* বেনিফিট কার্ড গ্রিড */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0px 20px 40px rgba(2, 26, 84, 0.06)" }}
              className="bg-slate-50 border border-slate-200/60 p-8 rounded-3xl relative overflow-hidden transition-all duration-300 group"
            >
              <div className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 bg-white border px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {benefit.badge}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#021A54]/5 flex items-center justify-center mb-6 group-hover:bg-[#021A54] group-hover:text-white transition-colors duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-[#021A54] mb-3 group-hover:text-[#FF85BB] transition-colors">
                {benefit.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}