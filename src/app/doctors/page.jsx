'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);  
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 🔍 সার্চ ও ফিল্টার স্টেট
    const [search, setSearch] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [sortOrder, setSortOrder] = useState(''); 

    const specializations = [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Dermatology",
        "Ophthalmology"
    ];

    // 🔄 রিসেট ফাংশন (এক ক্লিকে সব ফিল্টার ক্লিয়ার করার জন্য)
    const handleReset = () => {
        setSearch('');
        setSelectedSpecialty('');
        setSortOrder('');
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/api/doctors?`;
                const params = new URLSearchParams();
                
                if (search.trim() !== '') params.append('search', search);
                if (selectedSpecialty !== '') params.append('specialization', selectedSpecialty);
                if (sortOrder !== '') params.append('sort', sortOrder);

                const response = await fetch(url + params.toString());
                const data = await response.json();

                if (Array.isArray(data)) {
                    setDoctors(data);
                } else if (data && Array.isArray(data.result)) {
                    setDoctors(data.result);
                } else {
                    setDoctors([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [search, selectedSpecialty, sortOrder]);

    return (
        <div className="min-h-screen py-12 px-4 md:px-10" style={{ backgroundColor: '#F5F5F5' }}>
            
            {/* পেজ হেডার */}
            <div className="max-w-7xl mx-auto text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: '#021A54' }}>
                    Find Your Specialist
                </h1>
                <div className="w-24 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: '#FF85BB' }}></div>
            </div>

            {/* 🔍 ফিল্টার এবং রিসেট বার */}
            <div className="max-w-7xl mx-auto mb-10 bg-[white] p-5 rounded-2xl shadow-sm border border-[#fcc6de] flex flex-col gap-4">
                
                {/* ইনপুট গ্রিড (৩ টি ফিল্টার পাশাপাশি) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* ১. নাম দিয়ে সার্চ */}
                    <div className="w-full">
                        <input 
                            type="text" 
                            placeholder="Search by Doctor Name..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input input-bordered w-full bg-pink-50 border-gray-200 focus:outline-none focus:border-[#FF85BB] p-3 rounded-xl text-sm text-black"
                        />
                    </div>

                    {/* ২. স্পেশালাইজেশন ফিল্টার */}
                    <div className="w-full">
                        <select 
                            value={selectedSpecialty} 
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="select select-bordered w-full bg-pink-50 border-gray-800 focus:outline-none focus:border-[#FF85BB] p-3 rounded-xl text-sm text-gray-600"
                        >
                            <option value="">All Specializations</option>
                            {specializations.map((spec, index) => (
                                <option key={index} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>

                    {/* ৩. ফি সর্টিং */}
                    <div className="w-full">
                        <select  
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="select select-bordered w-full bg-pink-50 border-green-200 focus:outline-none focus:border-[#FF85BB] p-3 rounded-xl text-sm text-gray-600"
                        >
                            <option value="">Sort By Fees (Default)</option>
                            <option value="lowToHigh">Fee: Low to High</option>
                            <option value="highToLow">Fee: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* 🔄 রিসেট ফিল্টার বাটন (ইনপুটগুলোর ঠিক নিচে ডান পাশে থাকবে) */}
               <div className="flex justify-end">
    <button
        onClick={handleReset}
        className="font-bold text-xs px-6 py-2.5 rounded-xl border transition-all duration-300 shadow-sm active:scale-95 text-[#FF85BB] border-[#FF85BB] bg-transparent hover:opacity-80"
    >
        🔄 Reset Filters
    </button>
</div>
            </div>

            {/* 🗂️ কার্ড গ্রিড লেআউট */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#021A54', borderTopColor: 'transparent' }}></div>
                </div>
            ) : doctors.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg font-semibold text-gray-500">No doctors found matching your criteria.</p>
                </div>
            ) : (
                <div className="max-w-7xl  mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map((doctor) => {
                        const doctorId = doctor._id?.$oid || doctor._id;
                        return (
                            <div 
                                key={doctorId} 
                                className="bg-white rounded-2xl border border-[#fcc6de] shadow-sm hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                            >
                                <div className="p-6 flex flex-col items-center text-center">
                                    <div className="overflow-hidden rounded-2xl  w-64 h-40 border-2 shadow-sm relative mb-4" style={{ borderColor: '#FFCEE3' }}>
                                        <Image 
                                            src={doctor.profileImage || "https://via.placeholder.com/150"} 
                                            alt={doctor.doctorName || "Doctor"} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="112px"
                                        />
                                    </div>

                                    <div className="flex items-center gap-1.5 justify-center mb-1">
                                        <h3 className="font-bold text-lg" style={{ color: '#021A54' }}>
                                            {doctor.doctorName}
                                        </h3>
                                        {doctor.verificationStatus === "Verified" && (
                                            <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: '#FF85BB' }} title="Verified">✓</span>
                                        )}
                                    </div>

                                    <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4" style={{ backgroundColor: '#FFCEE3', color: '#021A54' }}>
                                        {doctor.specialization}
                                    </span>

                                    <div className="space-y-1 text-sm text-gray-500 w-full border-t border-gray-50 pt-3">
                                        <p className="truncate">🏢 {doctor.hospitalName}</p>
                                        <p>⏱️ {doctor.experience} Years Experience</p>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50 bg-opacity-60">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Fee</p>
                                        <p className="text-xl font-black" style={{ color: '#021A54' }}>৳ {doctor.consultationFee}</p>
                                    </div>
                                    
<Link
    href={`/doctors/${doctorId}`} // এখানে doctorsId এর বদলে doctorId হবে
    className="text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm active:scale-95" 
    style={{ backgroundColor: '#FF85BB' }}
>
    Book Doctor
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

export default DoctorsPage;