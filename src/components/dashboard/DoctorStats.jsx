'use client'; // ফিউচারে ক্লায়েন্ট-সাইড ফাংশনালিটি/স্টেট অ্যাড করার জন্য তৈরি রাখা হলো

import React from 'react';

export default function DoctorStats() {
  // স্ট্যাটিক ডেমো ডাটা (যা পরবর্তীতে তুমি API বা Props দিয়ে ডাইনামিক করতে পারবে)
  const stats = [
    {
      id: 1,
      title: "Upcoming Clinics",
      value: "12",
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
    {
      id: 2,
      title: "Pending Approval",
      value: "3",
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
    {
      id: 3,
      title: "Total Transactions",
      value: "$450", // তোমার ইমেজের মতো সেম ভ্যালু রাখলাম
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
    {
      id: 4,
      title: "Clinical Reviews",
      value: "2",
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
  ];

  return (
    <div className="max-w-7xl bg-[#021A54]  p-6 mt-4 rounded-2xl">
      {/* 4 Column Grid Layout - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
        {stats.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-[#0f0f15] hover:border-[#FF85BB]/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 shadow-lg group cursor-pointer"
          >
            {/* Left Box: Icon Wrapper */}
            <div className={`p-3.5 rounded-xl ${item.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
              {item.icon}
            </div>

            {/* Right Box: Info Text */}
            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-600 tracking-tight mb-0.5">
                {item.value}
              </span>
              <span className="text-gray-600 text-xs font-medium tracking-wide group-hover:text-gray-300 transition-colors">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}