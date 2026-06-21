'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FeaturedDoctors = () => {
    const [doctors, setDoctors] = useState([]);  
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedData = async () => {
            setLoading(true);
            try {
                // 📡 Direct API hit to get all doctors
                let url = `http://localhost:5000/api/doctors`;
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

    return (
        <div className="py-16 px-4 md:px-10 bg-white">
            
            {/* 🏷️ পেজ হেডার এবং ডান পাশে "Show All" লিঙ্ক */}
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-12 border-b border-gray-200 pb-6 gap-4">
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2" style={{ color: '#021A54' }}>
                        Meet Our Featured Specialists
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">Top-rated consultants available for instant booking</p>
                </div>
                
                {/* 🔗 ডানে চমৎকার "Show All Data" লিঙ্ক বাটন */}
                <div>
                    <Link 
                        href="/doctors" 
                        className="inline-flex items-center gap-1.5 font-bold text-sm px-5 py-2.5 rounded-xl border transition-all duration-300 shadow-sm active:scale-95 text-[#FF85BB] border-[#FF85BB] bg-white hover:bg-[#FF85BB] hover:text-white"
                    >
                        See All Doctors ➔
                    </Link>
                </div>
            </div>

            {/* 🗂️ কার্ড গ্রিড লেআউট */}
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
                    {/* 🎯 .slice(0, 4) দিয়ে জাস্ট ৪ টি কার্ড রেন্ডার করা হচ্ছে */}
                    {doctors.slice(0, 4).map((doctor) => {
                        const doctorId = doctor._id?.$oid || doctor._id;
                        return (
                            <div 
                                key={doctorId} 
                                className="bg-white rounded-2xl border border-[#fcc6de] shadow-sm hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                            >
                                <div className="p-5 flex flex-col items-center text-center">
                                    <div className="overflow-hidden rounded-2xl w-full h-44 border shadow-sm relative mb-4" style={{ borderColor: '#FFCEE3' }}>
                                        <Image 
                                            src={doctor.profileImage || "https://via.placeholder.com/150"} 
                                            alt={doctor.doctorName || "Doctor"} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 768px) 100vw, 250px"
                                        />
                                    </div>

                                    <div className="flex items-center gap-1.5 justify-center mb-1">
                                        <h3 className="font-bold text-base line-clamp-1" style={{ color: '#021A54' }}>
                                            {doctor.doctorName}
                                        </h3>
                                        {doctor.verificationStatus === "Verified" && (
                                            <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-white shadow-sm flex-shrink-0" style={{ backgroundColor: '#FF85BB' }} title="Verified">✓</span>
                                        )}
                                    </div>

                                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3 inline-block" style={{ backgroundColor: '#FFCEE3', color: '#021A54' }}>
                                        {doctor.specialization}
                                    </span>

                                    <div className="space-y-1 text-xs text-gray-500 w-full border-t border-gray-50 pt-3">
                                        <p className="truncate">🏢 {doctor.hospitalName}</p>
                                        <p>⏱️ {doctor.experience} Years Experience</p>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50 bg-opacity-60">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Fee</p>
                                        <p className="text-lg font-black" style={{ color: '#021A54' }}>৳ {doctor.consultationFee}</p>
                                    </div>
                                    
                                    <Link
                                        href={`/doctors/${doctorId}`} 
                                        className="text-white font-bold text-[11px] px-4 py-2 rounded-xl transition-all duration-300 shadow-sm active:scale-95 static" 
                                        style={{ backgroundColor: '#FF85BB' }}
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