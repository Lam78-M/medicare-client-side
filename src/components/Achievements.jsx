'use client';

import React, { useEffect, useState } from 'react';
import { Spinner } from "@heroui/react";

export default function HomeStatsOverview() {
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalDoctors = async () => {
      try {
        setLoading(true);
        
        // 🎯 এখানে /v1 ছাড়া তোমার সঠিক ব্যাকএন্ড রুট কল করা হয়েছে
        const response = await fetch(`http://localhost:5000/api/doctors`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // ব্যাকএন্ডের ডাটা স্ট্রাকচার চেক করে কাউন্ট সেট করা
        if (Array.isArray(data)) {
          setTotalDoctors(data.length);
        } else if (data.success && Array.isArray(data.doctors)) {
          setTotalDoctors(data.doctors.length);
        } else if (data.doctors && Array.isArray(data.doctors)) {
          setTotalDoctors(data.doctors.length);
        }
      } catch (err) {
        console.error("Home Doctor Card Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalDoctors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="md" style={{ color: '#FF85BB' }} label="Loading Stats..." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* 🎯 Total Registered Doctors Card */}
        <div className="bg-gradient-to-br from-[#021A54] to-[#0a2c7a] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group cursor-pointer">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#FF85BB]/20 rounded-full blur-xl group-hover:bg-[#FF85BB]/30 transition-all duration-500"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:border-[#FF85BB]/50 transition-colors duration-300">
              <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30 tracking-wider uppercase">
              Live
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-4xl font-black tracking-tight mb-1 text-white">
              {totalDoctors}
            </span>
            <span className="text-[#FFCEE3] text-xs font-bold tracking-wider uppercase">
              Total Doctors
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-gray-300 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Connected Medical Specialists
          </div>
        </div>

        {/* ➕ পরবর্তীতে নতুন কার্ড এখানে বসবে */}

      </div>
    </div>
  );
}