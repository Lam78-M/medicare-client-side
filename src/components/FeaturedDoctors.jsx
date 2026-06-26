'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// 🟢 সেশন চেক এবং টোস্টের জন্য ইম্পোর্ট করা হলো
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const FeaturedDoctors = () => {
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);  
    const [loading, setLoading] = useState(true);

    // 🟢 Better Auth লাইভ সেশন ডেটা আনা হলো
    const { data: session } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        const fetchFeaturedData = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/api/doctors?status=Approved`;
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
                console.error("Error fetching featured doctors:", error);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedData();
    }, []);

    // 🟢 বুকিং বাটন হ্যান্ডলার (Redirect Back লজিকসহ)
    const handleBookingClick = (e, doctorId) => {
        if (!user) {
            // যদি ইউজার লগইন না থাকে, লিংকের ডিফল্ট অ্যাকশন বন্ধ করো
            e.preventDefault(); 
            
            // টোস্ট মেসেজ দেখাও
            toast.warn("Please Login or Register to book an appointment! 🔐", {
                position: "top-center",
                autoClose: 3000
            });

            // 🎯 ডক্টরের নির্দিষ্ট বুকিং পেজের পাথটি তৈরি করলাম
            const targetUrl = `/doctors`;

            // 🚀 সাইনআপ পেজে পাঠানোর সময় callbackUrl হিসেবে টার্গেট পাথটি জুড়ে দিলাম
            router.push(`/auth/signup?callbackUrl=${encodeURIComponent(targetUrl)}`);
        }
    };

    return (
        <div className="py-16 px-4 md:px-10 bg-[#F5F5F5]">
            
            {/* Header Area */}
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-gray-200 pb-6 gap-4">
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#021A54' }}>
                        Meet Our Featured Specialists
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">Top-rated consultants available for instant booking</p>
                </div>
                <div>
                    <Link 
                        href="/doctors" 
                        className="inline-flex items-center gap-1.5 font-bold text-sm px-5 py-2.5 rounded-xl border transition-all duration-300 shadow-sm active:scale-95 text-[#021A54] border-[#021A54]/20 bg-white hover:bg-[#021A54] hover:text-black "
                    >
                        See All Doctors ➔
                    </Link>
                </div>
            </div>

            {/* Content Dynamic Grid Render */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#021A54', borderTopColor: 'transparent' }}></div>
                </div>
            ) : doctors.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg font-semibold text-gray-500">No featured doctors available right now.</p>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctors.slice(0, 4).map((doctor) => {
                        const doctorId = doctor._id?.$oid || doctor._id;
                        return (
                            <div 
                                key={doctorId} 
                                className="bg-white rounded-3xl border border-[#2652b8]/20 hover:border-[#FF85BB] shadow-[0_10px_25px_rgba(2,26,84,0.15)] hover:shadow-[0_20px_35px_rgba(38,82,184,0.3)] hover:-translate-y-2 transform transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                            >
                                <div className="p-5 flex flex-col items-center text-center">
                                    <div className="overflow-hidden rounded-2xl w-full h-44 relative mb-4 bg-gray-50 border border-gray-100">
                                        <Image 
                                            src={doctor.profileImage || "https://via.placeholder.com/150"} 
                                            alt={doctor.doctorName || "Doctor"} 
                                            fill 
                                            className="object-cover group-hover:scale-102 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, 250px"
                                        />
                                    </div>

                                    <div className="flex items-center gap-1.5 justify-center mb-1">
                                        <h3 className="font-extrabold text-base text-[#021A54] group-hover:text-[#FF85BB] transition-colors duration-300 line-clamp-1">
                                            {doctor.doctorName}
                                        </h3>
                                        {doctor.verificationStatus === "Verified" && (
                                            <span className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black text-white bg-green-500 shadow-sm flex-shrink-0" title="Verified">✓</span>
                                        )}
                                    </div>

                                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 bg-blue-50 text-[#021A54]">
                                        {doctor.specialization}
                                    </span>

                                    <div className="space-y-1 text-xs font-medium text-gray-400 w-full border-t border-gray-100 pt-3">
                                        <p className="truncate text-gray-500">🏢 {doctor.hospitalName}</p>
                                        <p>⏱️ {doctor.experience} Years Experience</p>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 group-hover:bg-pink-50/20 transition-colors duration-300">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Fee</p>
                                        <p className="text-lg font-black text-[#021A54]">৳ {doctor.consultationFee}</p>
                                    </div>
                                    
                                    {/* 🟢 Link ও onClick একসাথে হ্যান্ডেল করা হয়েছে */}
                                    <Link
                                        href={`/doctors/${doctorId}`} 
                                        onClick={(e) => handleBookingClick(e, doctorId)}
                                        className="text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-300 shadow-sm active:scale-95 bg-[#021A54] group-hover:bg-[#FF85BB] hover:opacity-90" 
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FeaturedDoctors;