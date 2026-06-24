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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.12, 
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40, 
      scale: 0.95 
    },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 80, 
        damping: 14 
      } 
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-30">
     
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-black text-[#021A54] tracking-tight mb-4">
          Top Medical <span className="text-[#FF85BB]">Specializations</span>
        </h2>
        <p className="text-slate-600 font-medium md:text-lg">
          Access specialized care from our world-class department experts right when you need it.
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show" 
        viewport={{ once: false, amount: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {specialties.map((specialty, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ 
              y: -8, 
              boxShadow: "0px 20px 30px rgba(255, 133, 187, 0.15)",
              borderColor: "#FF85BB"
            }}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 transition-colors duration-300 flex flex-col items-center text-center group cursor-pointer"
          >        
            <div className="w-16 h-16 rounded-xl bg-[#021A54] text-white flex items-center justify-center mb-5 group-hover:bg-[#FFCEE3] group-hover:text-[#021A54] transition-colors duration-300 shadow-md">
              {specialty.icon}
            </div>

            <h3 className="text-xl font-bold text-[#021A54] mb-2">
              {specialty.name}
            </h3>

            <p className="text-slate-500 text-xs font-medium leading-relaxed">
              {specialty.description}
            </p>

            <div className="mt-auto pt-4 text-xs font-bold text-[#FF85BB] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Find Doctors &rarr;
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}