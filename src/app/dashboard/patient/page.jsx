"use client";

import DoctorStats from '@/components/dashboard/DoctorStats';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import React from 'react';
import { ArrowRight, HeartPulse, Sparkles } from 'lucide-react';
import AppointmentPage from './appointmentTable/page';

const PatientPage = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div className="p-8 text-center text-slate-600">Loading...</div>;
  }

  const user = session?.user;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[30px] bg-[#021A54] shadow-[0_22px_50px_rgba(2,26,84,0.18)]">
        <div className="relative px-5 py-7 sm:px-8 lg:px-10">
          <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-[#FF85BB]/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#FFCEE3]/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFCEE3]">
                <Sparkles className="h-3.5 w-3.5" />
                Patient dashboard
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                Welcome back, <span className="text-[#FF85BB]">{user?.name || 'User'}</span> 👋
              </h1>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Great to see you again. Your care plan and upcoming appointments are ready to review.
              </p>
            </div>

            <Link
              href="/wellness"
              className="group inline-flex w-fit items-center gap-3 rounded-2xl bg-[#FF85BB] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#FF85BB]/30 transition hover:-translate-y-0.5 hover:bg-[#ff6aa6]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <HeartPulse className="h-5 w-5" />
              </span>
              Explore Wellness Hub
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      <DoctorStats />
      <AppointmentPage />
    </div>
  );
};

export default PatientPage;