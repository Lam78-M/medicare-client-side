'use client'; 

import React, { useEffect, useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";

export default function DoctorStats() {
  // 🌟 Better Auth useSession ഹുക
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorStats = async () => {
      // 🚨 কনসোলে চেক করার জন্য: সেশন লোড হওয়ার পর ইমেইল কী আসছে তা দেখাবে
      if (!isSessionPending) {
        console.log("Better Auth Session User Email:", session?.user?.email);
      }

      if (isSessionPending || !session?.user?.email) return;

      try {
        setLoading(true);
        const doctorEmail = session.user.email;

        // 🎯 ব্যাকএন্ড এপিআই কল (যেহেতু ব্যাকএন্ডে শুধু email কুয়েরি খোঁজা হচ্ছে)
        const appointmentRes = await fetch(`http://localhost:5000/api/appointments/doctor?email=${doctorEmail}`);
        
        if (appointmentRes.ok) {
          const resData = await appointmentRes.json();
          console.log("Fetched Appointments Data:", resData); // 🚨 ডাটা আসলো কি না কনসোলে দেখবে

          // সেফটি লেয়ার
          const appointments = Array.isArray(resData) ? resData : [];
          
          // কেস-ইনসেন্সিটিভ ফিল্টারিং (ডাটাবেজে 'Pending' বা 'Approved' এর জন্য)
          const upcoming = appointments.filter(app => app?.status?.toLowerCase() === 'approved');
          const pending = appointments.filter(app => app?.status?.toLowerCase() === 'pending');

          setUpcomingCount(upcoming.length);
          setPendingCount(pending.length);

          // ডাইনামিক ট্রানজেকশন ফি যোগফল
          const totalEarnings = upcoming.reduce((sum, app) => {
            const fee = Number(app.consultationFee) || 0;
            return sum + fee;
          }, 0);
          
          setTotalTransactions(totalEarnings);
        }

        // ২. রিভিউ কাউন্ট ফেচ
        const reviewRes = await fetch(`http://localhost:5000/api/v1/reviews/doctor/${doctorEmail}`);
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          if (reviewData && Array.isArray(reviewData.reviews)) {
            setReviewCount(reviewData.reviews.length);
          }
        }
      } catch (error) {
        console.error("Error loading doctor stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorStats();
  }, [session, isSessionPending]);

  if (isSessionPending || loading) {
    return (
      <div className="bg-[#021A54] p-6 mt-4 rounded-2xl flex justify-center items-center min-h-[120px]">
        <Spinner color="danger" label="Syncing Stats..." />
      </div>
    );
  }

  const stats = [
    {
      id: 1,
      title: "Upcoming Clinics",
      value: upcomingCount.toString(),
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
      value: pendingCount.toString(),
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
    {
      id: 3,
      title: "Total Earnings",
      value: `৳${totalTransactions}`,
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
      value: reviewCount.toString(),
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
  ];

  return (
    <div className="bg-[#021A54] p-6 mt-4 rounded-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
        {stats.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-[#0f0f15] hover:border-[#FF85BB]/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 shadow-lg group cursor-pointer"
          >
            <div className={`p-3.5 rounded-xl ${item.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
              {item.icon}
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-800 tracking-tight mb-0.5">
                {item.value}
              </span>
              <span className="text-gray-500 text-xs font-bold tracking-wide group-hover:text-[#FF85BB] transition-colors">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}