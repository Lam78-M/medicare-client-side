"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Front-end notification state placeholder
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-16 px-4 md:px-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Top Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#021A54] mb-3">Get In Touch</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Have queries regarding doctor verification, corporate accounts, or payment errors? Reach out to our 24/7 administrative helpdesk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1: Contact Direct Information Cards */}
          <div className="md:col-span-1 space-y-4">
            
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-[#FF85BB] uppercase">Emergency Line</span>
              <h4 className="text-lg font-bold text-[#021A54] mt-1">+880 1234-567890</h4>
              <p className="text-xs text-gray-400 mt-1">Available for trauma, critical advice channels.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-[#021A54] uppercase">Support Mail</span>
              <h4 className="text-base font-bold text-[#FF85BB] mt-1">support@medicareconnect.com</h4>
              <p className="text-xs text-gray-400 mt-1">Expected reply time context within 12 hours.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-[#021A54] uppercase">Corporate Office</span>
              <h4 className="text-sm font-semibold text-gray-700 mt-1">
                Level 4, Health Tower, Panthapath, Dhaka, Bangladesh
              </h4>
            </div>

          </div>

          {/* Column 2: Dynamic Animated Form (Framer Motion Integration) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-2 bg-white rounded-2xl p-6 md:p-8 border border-[#FFCEE3]/50 shadow-sm"
          >
            <h3 className="text-xl font-bold text-[#021A54] mb-4">Send Us a Direct Message</h3>
            
            {submitted && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 font-medium text-sm rounded-xl border border-green-200">
                🚀 Message logged successfully! Our admin dashboard will handle this shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#021A54] uppercase mb-1">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 bg-[#F5F5F5]/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF85BB] rounded-xl text-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#021A54] uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 bg-[#F5F5F5]/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF85BB] rounded-xl text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#021A54] uppercase mb-1">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-2 bg-[#F5F5F5]/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF85BB] rounded-xl text-sm"
                  placeholder="e.g. Appointment rescheduling error"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#021A54] uppercase mb-1">Message Description</label>
                <textarea 
                  rows="4" 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-2 bg-[#F5F5F5]/60 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF85BB] rounded-xl text-sm resize-none"
                  placeholder="Elaborate your issue in details here..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-[#021A54] hover:bg-[#021A54]/90 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-[#021A54]/10"
              >
                Send Message
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </div>
  );
}