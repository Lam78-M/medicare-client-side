"use client";

import { motion } from 'framer-motion';

export default function AboutUs() {
  // Stats Grid Data (Dynamic Design look as required)
  const stats = [
    { number: "15,000+", label: "Happy Patients", color: "#021A54" },
    { number: "250+", label: "Verified Doctors", color: "#FF85BB" },
    { number: "45,000+", label: "Appointments Booked", color: "#021A54" },
    { number: "4.9★", label: "Top Rated Reviews", color: "#FF85BB" }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-16 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Section 1: Hero Intro with Framer Motion Animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-sm font-bold text-[#FF85BB] uppercase tracking-widest bg-[#FFCEE3]/40 px-3 py-1 rounded-full">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#021A54] mt-4 mb-6">
            Revolutionizing Healthcare for a Connected World
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            MediCare Connect brings patients, top-certified doctors, and specialized medical networks 
            together under one seamless ecosystem. We replace endless waiting times with quick digital management.
          </p>
        </motion.div>

        {/* Section 2: Core Perks / "Why Choose Us" Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-[#021A54]">Our Core Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              Traditional healthcare systems often suffer from manual paperwork errors, fragmented histories, and extended phone queues. 
              Our centralized framework gives control back to patients and practitioner schedules directly.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="bg-[#FFCEE3] p-1.5 rounded-lg text-[#021A54] font-bold">✓</span>
                <p className="text-gray-700 font-medium">Fully Secure HIPAA-compliant medical health logs.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-[#FFCEE3] p-1.5 rounded-lg text-[#021A54] font-bold">✓</span>
                <p className="text-gray-700 font-medium">Stripe integrated zero-hassle consultation wireframes.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-[#FFCEE3] p-1.5 rounded-lg text-[#021A54] font-bold">✓</span>
                <p className="text-gray-700 font-medium">24/7 access to instant specialist scheduling matrices.</p>
              </div>
            </div>
          </motion.div>

          {/* Graphical Mock Side Content wrapper */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-tr from-[#021A54] to-[#FF85BB]/80 rounded-2xl p-8 text-white h-80 flex flex-col justify-between shadow-xl"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">Modern Technology. Warm Healthcare.</h3>
              <p className="text-white/80 text-sm">Empowering digital access paths across modern smart interfaces.</p>
            </div>
            <div className="border-t border-white/20 pt-4 flex justify-between items-center text-sm font-semibold text-[#FFCEE3]">
              <span>MediCare Connect Platform V2.0</span>
              <span>100% Certified Network</span>
            </div>
          </motion.div>
        </div>

        {/* Section 3: Platform Statistics (Required Dynamic Section style match) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
        >
          <h3 className="text-center text-xl font-bold text-[#021A54] mb-8 uppercase tracking-wide">
            MediCare Connect in Numbers
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((item, index) => (
              <div key={index} className="p-4 border-r last:border-0 border-gray-100">
                <h4 className="text-3xl md:text-4xl font-extrabold" style={{ color: item.color }}>
                  {item.number}
                </h4>
                <p className="text-gray-500 font-medium text-xs md:text-sm mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}