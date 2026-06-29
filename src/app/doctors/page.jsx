'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);  
    const [loading, setLoading] = useState(true);
    const router = useRouter();


    const [viewMode, setViewMode] = useState('grid');

    // Search filters state
    const [search, setSearch] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [sortOrder, setSortOrder] = useState(''); 

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const specializations = [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Dermatology",
        "Ophthalmology"
    ];

    const handleReset = () => {
        setSearch('');
        setSelectedSpecialty('');
        setSortOrder('');
        setCurrentPage(1); 
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedSpecialty, sortOrder]);

 
    const handleBookingClick = (doctor, doctorId) => {
        const currentStatus = doctor?.verificationStatus?.toLowerCase();

        if (currentStatus === "pending") {
            toast.warn("This doctor is currently under verification. Booking is disabled until Admin approval!", {
                position: "bottom-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                style: {
                    backgroundColor: '#021A54',
                    color: '#ffffff',
                    borderRadius: '12px'
                },
                progressStyle: {
                    backgroundColor: '#FF85BB'
                }
            });
            return; 
        }

        router.push(`/doctors/${doctorId}`);  
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let url = `${process.env.NEXT_PUBLIC_BACK_URL}/api/doctors?`;
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

    //  Pagination Calculations
    const totalPages = Math.ceil(doctors.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   
    const currentDoctors = doctors.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="min-h-screen py-12 px-4 md:px-10" style={{ backgroundColor: '#F5F5F5' }}>
            
      
            <ToastContainer />

            {/* Header Section */}
            <div className="max-w-7xl mx-auto text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: '#021A54' }}>
                    Find Your Specialist
                </h1>
                <div className="w-24 h-1 mx-auto rounded-full mb-4" style={{ backgroundColor: '#021A54' }}></div>
            </div>

            {/* Filter Controls Box */}
            <div className="max-w-7xl mx-auto mb-6 bg-white p-5 rounded-3xl shadow-sm border border-blue-900/10 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="w-full">
                        <input 
                            type="text" 
                            placeholder="Search by Doctor Name..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#021A54] p-3 rounded-xl text-sm text-black"
                        />
                    </div>

                    <div className="w-full">
                        <select 
                            value={selectedSpecialty} 
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#021A54] p-3 rounded-xl text-sm text-gray-600"
                        >
                            <option value="">All Specializations</option>
                            {specializations.map((spec, index) => (
                                <option key={index} value={spec}>{spec}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full">
                        <select  
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#021A54] p-3 rounded-xl text-sm text-gray-600"
                        >
                            <option value="">Sort By Fees (Default)</option>
                            <option value="lowToHigh">Fee: Low to High</option>
                            <option value="highToLow">Fee: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Action Control Bar */}
                <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#021A54] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            📱 Card Grid
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${viewMode === 'table' ? 'bg-[#021A54] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            📊 Table List
                        </button>
                    </div>

                    <button
                        onClick={handleReset}
                        className="font-bold text-xs px-5 py-2 rounded-xl border border-gray-200 transition-all duration-300 shadow-sm active:scale-95 text-gray-500 bg-transparent hover:bg-gray-50"
                    >
                        🔄 Reset Filters
                    </button>
                </div>
            </div>

            {/* Main Content Render Layout */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#021A54', borderTopColor: 'transparent' }}></div>
                </div>
            ) : doctors.length === 0 ? (
                <div className="text-center py-12 bg-white max-w-7xl mx-auto rounded-3xl border border-none shadow-sm">
                    <p className="text-sm font-bold text-gray-400">No doctors found matching your criteria.</p>
                </div>
            ) : viewMode === 'grid' ? (
 
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentDoctors.map((doctor) => {
                        const doctorId = doctor._id?.$oid || doctor._id;
                        const isPending = doctor.verificationStatus?.toLowerCase() === "pending";

                        return (
                            <div 
                                key={doctorId} 
                                className={`bg-white rounded-3xl border border-[#2652b8]/30 hover:border-[#FF85BB] shadow-[0_10px_25px_rgba(2,26,84,0.15)] hover:shadow-[0_20px_35px_rgba(38,82,184,0.3)] hover:-translate-y-2 transform transition-all duration-300 overflow-hidden flex flex-col justify-between group ${isPending ? 'opacity-75' : ''}`}>
                                 <div className="p-6 flex flex-col items-center text-center">
                                    <div className="overflow-hidden rounded-2xl w-full h-44 relative mb-4 bg-gray-50 border border-gray-100">
                                        <Image 
                                            src={doctor.profileImage || "https://via.placeholder.com/150"} 
                                            alt={doctor.doctorName || "Doctor"} 
                                            fill 
                                            className="object-cover group-hover:scale-102 transition-transform duration-300"
                                            sizes="(max-w-768px) 100vw, 33vw"
                                        />
                                    </div>

                                    <div className="flex items-center gap-1.5 justify-center mb-1">
                                        <h3 className="font-extrabold text-lg text-[#021A54] group-hover:text-[#FF85BB] transition-colors duration-300">
                                            {doctor.doctorName}
                                        </h3>
                                        {doctor.verificationStatus === "Verified" && (
                                            <span className="flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black text-white bg-green-500 shadow-sm" title="Verified">✓</span>
                                        )}
                                        {isPending && (
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">Pending</span>
                                        )}
                                    </div>

                                    <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4 bg-blue-50 text-[#021A54]">
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
                                    
                                    <button
                                        onClick={() => handleBookingClick(doctor, doctorId)}
                                        className="text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm active:scale-95 bg-[#021A54] group-hover:bg-[#FF85BB] hover:opacity-90 cursor-pointer" 
                                    >
                                        Book Doctor
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* TABULAR VIEW MODE LAYOUT */
                <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-sm border border-[#021A54]/10 overflow-hidden">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider pl-6">Doctor</th>
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Specialization</th>
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Hospital</th>
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Experience</th>
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider">Consultation Fee</th>
                                    <th className="p-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
                                {currentDoctors.map((doctor) => {
                                    const doctorId = doctor._id?.$oid || doctor._id;
                                    const isPending = doctor.verificationStatus?.toLowerCase() === "pending";

                                    return (
                                        <tr key={doctorId} className={`hover:bg-pink-50/10 transition-colors group ${isPending ? 'opacity-70 bg-amber-50/10' : ''}`}>
                                            <td className="p-4 pl-6 flex items-center gap-3">
                                                <div className="w-10 h-10 relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                                                    <Image 
                                                        src={doctor.profileImage || "https://via.placeholder.com/150"}
                                                        alt={doctor.doctorName || "Doctor"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#021A54] group-hover:text-[#FF85BB] transition-colors duration-300 flex items-center gap-1.5">
                                                        {doctor.doctorName}
                                                        {doctor.verificationStatus === "Verified" && (
                                                            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[8px] font-black text-white bg-green-500" title="Verified">✓</span>
                                                        )}
                                                        {isPending && (
                                                            <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-amber-100 text-amber-700">Pending</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td className="p-4">
                                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#021A54] uppercase tracking-wider">
                                                    {doctor.specialization}
                                                </span>
                                            </td>

                                            <td className="p-4 text-gray-500 max-w-[200px] truncate">
                                                🏢 {doctor.hospitalName}
                                            </td>

                                            <td className="p-4 text-gray-400">
                                                {doctor.experience} Years
                                            </td>

                                            <td className="p-4 font-extrabold text-[#021A54]">
                                                ৳ {doctor.consultationFee}
                                            </td>

                                            <td className="p-4 text-right pr-6">
                                                <button
                                                    onClick={() => handleBookingClick(doctor, doctorId)}
                                                    className="inline-block text-white font-bold text-xs px-4 py-2 rounded-xl transition-all bg-[#021A54] group-hover:bg-[#FF85BB] active:scale-95 shadow-sm cursor-pointer"
                                                >
                                                    Book Slot 📅
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {!loading && totalPages > 1 && (
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200/60">
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl shadow-[0_8px_20px_rgba(2,26,84,0.05)] border border-gray-100">
                        {/* Previous Button */}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`h-11 px-5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                                currentPage === 1 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-transparent text-[#021A54] hover:bg-[#FFCEE3] hover:text-[#021A54]'
                            }`}
                        >
                            <span>◀</span> Prev
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1.5 border-l border-r border-gray-100 px-3">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                const isActive = currentPage === pageNumber;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`w-11 h-11 rounded-xl text-sm font-extrabold transition-all duration-300 transform active:scale-95 ${
                                            isActive
                                            ? 'text-white shadow-md scale-105 font-black'
                                            : 'text-[#021A54] hover:bg-gray-100'
                                        }`}
                                        style={{
                                            backgroundColor: isActive ? '#021A54' : 'transparent',
                                            boxShadow: isActive ? '0 4px 12px rgba(2, 26, 84, 0.25)' : 'none'
                                        }}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`h-11 px-5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                                currentPage === totalPages 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                : 'bg-transparent text-[#021A54] hover:bg-[#FFCEE3] hover:text-[#021A54]'
                            }`}
                        >
                            Next <span>▶</span>
                        </button>
                    </div>

                    {/* Page status text indicator */}
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100/70 px-4 py-2 rounded-full border border-gray-200/50">
                        Page <strong style={{ color: '#021A54' }}>{currentPage}</strong> of {totalPages}
                    </span>
                </div>
            )}
        </div>
    );
};

export default DoctorsPage;