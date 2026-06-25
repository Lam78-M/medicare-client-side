'use client'; 

import React, { useEffect, useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";

export default function DoctorStats() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [appointments, setAppointments] = useState([]);
  const [givenReviewCount, setGivenReviewCount] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorStats = async () => {
      if (isSessionPending || !session?.user) return;
      
      try {
        setLoading(true);
        const userEmail = session.user.email;
        const actualPatientId = session.user.id || session.user._id;

        // 1. Fetch Patient Appointments
        const res = await fetch(`http://localhost:5000/api/appointments/patient?email=${userEmail}`);
        if (res.ok) {
          const appointmentData = await res.json();
          setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
        }

        // 2. Fetch Given Reviews
        if (actualPatientId) {
          console.log("Frontend sending Patient ID:", actualPatientId);
          const reviewRes = await fetch(`http://localhost:5000/api/v1/reviews/patient/${actualPatientId}`);
          
          if (reviewRes.ok) {
            const reviewData = await reviewRes.json();
            if (reviewData && Array.isArray(reviewData.reviews)) {
              setGivenReviewCount(reviewData.reviews.length);
            }
          }
        } else {
          console.log("Session ID missing, checking from appointments...");
          const resCheck = await fetch(`http://localhost:5000/api/appointments/patient?email=${userEmail}`);
          if (resCheck.ok) {
            const data = await resCheck.json();
            const fallbackId = data.find(app => app?.patientId)?.patientId;
            
            if (fallbackId) {
              const reviewRes = await fetch(`http://localhost:5000/api/v1/reviews/patient/${fallbackId}`);
              const reviewData = await reviewRes.json();
              if (reviewData.success) setGivenReviewCount(reviewData.reviews.length);
            }
          }
        }

      } catch (error) {
        console.error("Error loading panel metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorStats();
  }, [session, isSessionPending]);

  if (isSessionPending || loading) {
    return (
      <div className="bg-[#021A54] p-6 mt-4 rounded-3xl flex justify-center items-center min-h-[140px]">
        <Spinner size="lg" style={{ color: '#FF85BB' }} label="Syncing Dashboard Stats..." />
      </div>
    );
  }

  // Filter Logics
  const approvedCount = appointments.filter(app => app.status === "Approved").length;
  const pendingCount = appointments.filter(app => app.status !== "Approved").length;

  // 🎯 Total Booking-er mot khorocher tk jog korar logic (Filter chada, shob appointment-er mot taka)
  const totalSpent = appointments.reduce((sum, app) => sum + (Number(app.consultationFee) || 0), 0);

  const stats = [
    {
      id: 1,
      title: "Histories & Checkups",
      value: approvedCount.toString(),
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
    {
      id: 2,
      title: "Upcoming Clinic",
      value: pendingCount.toString(),
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
    {
      id: 3,
      title: "Total Transactions",
      value: `৳ ${totalSpent}`, // 🎯 Ekhane tomar dynamically calculated total taka card-e bose gelo
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
      value: givenReviewCount.toString(), 
      icon: (
        <svg className="w-6 h-6 text-[#FF85BB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      iconBg: "bg-[#FF85BB]/10",
    },
  ];

  return (
    <div className="bg-[#021A54] p-6 mt-4 rounded-3xl shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
        {stats.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-gray-100 hover:border-[#FF85BB]/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 shadow-sm group cursor-pointer"
          >
            <div className={`p-3.5 rounded-xl ${item.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
              {item.icon}
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-black text-gray-800 tracking-tight mb-0.5">
                {item.value}
              </span>
              <span className="text-gray-400 text-xs font-bold tracking-wide group-hover:text-[#FF85BB] transition-colors">
                {item.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}