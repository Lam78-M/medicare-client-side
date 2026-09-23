'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { toast } from 'react-toastify';

const FeaturedDoctors = () => {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchFeaturedData = async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_BACK_URL}/api/doctors?status=Approved`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (data && Array.isArray(data.result)) {
          setDoctors(data.result);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error fetching featured doctors:', error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedData();
  }, []);

  const handleBookingClick = (e, doctorId) => {
    if (!user) {
      e.preventDefault();
      toast.warn('Please Login or Register to book an appointment! 🔐', {
        position: 'top-center',
        autoClose: 3000,
      });

      const targetUrl = '/doctors';
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(targetUrl)}`);
    }
  };

  return (
    <section className="bg-[#f6f8ff] py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex rounded-full border border-[#FF85BB]/30 bg-[#FFCEE3] px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#021A54]">
              Featured specialists
            </span>
            <h2 className="text-3xl font-black tracking-tight text-[#021A54] sm:text-4xl">
              Meet our top-rated<span className="block text-[#FF85BB]">medical experts</span>
            </h2>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center justify-center rounded-2xl border border-[#021A54]/15 bg-white px-5 py-3 text-sm font-bold text-[#021A54] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#021A54] hover:text-white"
          >
            See all doctors <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#021A54]/20 border-t-[#FF85BB]" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white py-12 text-center">
            <p className="text-lg font-semibold text-slate-500">No featured doctors available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {doctors.slice(0, 4).map((doctor) => {
              const doctorId = doctor._id?.$oid || doctor._id;

              return (
                <div
                  key={doctorId}
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(2,26,84,0.08)] transition duration-300 hover:-translate-y-2 hover:border-[#FF85BB] hover:shadow-[0_24px_50px_rgba(255,133,187,0.18)]"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <Image
                      src={doctor.profileImage || 'https://via.placeholder.com/600x600'}
                      alt={doctor.doctorName || 'Doctor'}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-center gap-2">
                      <h3 className="text-lg font-black text-[#021A54] transition group-hover:text-[#FF85BB]">
                        {doctor.doctorName}
                      </h3>
                      {doctor.verificationStatus === 'Verified' && (
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] font-black text-white shadow-sm">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="mb-4 flex justify-center">
                      <span className="rounded-full bg-[#EAF1FF] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#021A54]">
                        {doctor.specialization}
                      </span>
                    </div>

                    <div className="mt-auto space-y-2 border-t border-slate-100 pt-4 text-center text-sm text-slate-500">
                      <p className="font-medium">🏥 {doctor.hospitalName || 'Leading care center'}</p>
                      <p className="font-medium">⏱️ {doctor.experience || 5} years experience</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#F7F9FF] p-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Consultation</p>
                        <p className="text-lg font-black text-[#021A54]">৳ {doctor.consultationFee || 1200}</p>
                      </div>

                      <Link
                        href={`/doctors/${doctorId}`}
                        onClick={(e) => handleBookingClick(e, doctorId)}
                        className="rounded-xl bg-[#021A54] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#FF85BB]"
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDoctors;