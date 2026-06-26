'use client';

import React, { useEffect, useState } from 'react';
import { Spinner, Chip, Button } from "@heroui/react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const AdminPaymentHistoryTable = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllPaymentHistory = async () => {
            try {
                // 🎯 গ্লোবাল API হিট করা হচ্ছে যাতে সব পেশেন্টের পেমেন্ট ডাটা অ্যাডমিন দেখতে পায়
                const res = await fetch(`http://localhost:5000/api/appointments`);
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    setAppointments(data);
                } else {
                    setAppointments([]);
                }
            } catch (error) {
                console.error("Error fetching global payment history:", error);
                toast.error("Failed to load payment tracking directory! ❌");
            } finally {
                setLoading(false);
            }
        };

        fetchAllPaymentHistory();
    }, []);

    // মোট কত টাকা বিনিময় হলো তা হিসাব করার মেকানিজম
    const totalRevenue = appointments.reduce((sum, app) => sum + (Number(app.consultationFee) || 0), 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                <Spinner size="lg" style={{ color: '#FF85BB' }} label="Loading Global Payment Records..." />
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <ToastContainer />
            
            {/* অ্যাডমিন পেমেন্ট ট্র্যাকিং হেডার */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-2">
                <div>
                    <h3 className="text-2xl font-black text-[#021A54]">📊 Global Payment Tracker</h3>
                    <p className="text-xs text-gray-400 font-medium">Monitoring the financial exchange and consultation fees between patients and doctors.</p>
                </div>
                
                {/* সর্বমোট ফি বিনিময়ের কাউন্টার চিপ */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex gap-4">
                    <div className="text-left">
                        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Total Volume</span>
                        <span className="text-sm font-black text-[#FF85BB]">৳ {totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="border-l border-gray-200 pl-4 text-left">
                        <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Tx Count</span>
                        <span className="text-sm font-black text-[#021A54]">{appointments.length} Paid</span>
                    </div>
                </div>
            </div>

            {/* 🔄 📱 রেস্পনসিভ স্ক্রোল কন্টেইনার (মোবাইলে স্লাইড করার জন্য) */}
            <div className="overflow-x-auto w-full rounded-2xl border border-gray-100 scrollbar-thin scrollbar-thumb-gray-200">
                <table className="w-full text-left border-collapse bg-white min-w-[900px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-[#021A54] text-xs font-black uppercase tracking-wider">
                            <th className="p-4 whitespace-nowrap">Patient Details</th>
                            <th className="p-4 whitespace-nowrap">Doctor & Chamber</th>
                            <th className="p-4 whitespace-nowrap">Specialization</th>
                            <th className="p-4 whitespace-nowrap">Schedule Date</th>
                            <th className="p-4 whitespace-nowrap">Consultation Fee</th>
                            <th className="p-4 whitespace-nowrap">Status</th>
                            <th className="p-4 text-center whitespace-nowrap">System Log</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-black">
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-16 text-center text-sm font-bold text-gray-400 italic">
                                    No transaction records found in the database.
                                </td>
                            </tr>
                        ) : (
                            appointments.map((appointment, index) => {
                                const currentId = appointment._id?.$oid || appointment._id || appointment.id || `pay-${index}`;
                                
                                return (
                                    <tr key={currentId} className="hover:bg-gray-50/50 transition-colors duration-150">
                                        
                                        {/* ১. পেশেন্টের ডিটেইলস */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="font-extrabold text-gray-800 text-sm">
                                                👤 {appointment.userName || "Anonymous Patient"}
                                            </div>
                                            <div className="text-[11px] text-gray-400 font-medium pl-5">
                                                {appointment.userEmail || "No Email Linked"}
                                            </div>
                                        </td>

                                        {/* ২. ডক্টরের ছবি ও নাম */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="relative border border-pink-100 rounded-xl overflow-hidden w-9 h-9 min-w-[36px] bg-gray-50 flex items-center justify-center">
                                                    <Image
                                                        alt={appointment.doctorName || "Doctor Profile"}
                                                        src={appointment.doctorImage || "https://via.placeholder.com/150"}
                                                        fill
                                                        sizes="36px"
                                                        className="object-cover"
                                                        priority={false}
                                                    />
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <p className="text-sm font-bold text-[#021A54] leading-tight">
                                                        {appointment.doctorName || "Dr. Unassigned"}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 max-w-[180px] truncate">
                                                        🏢 {appointment.hospitalName || "Hospital Chamber"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ৩. স্পেশালাইজেশন চিপ */}
                                        <td className="p-4 whitespace-nowrap">
                                            <span className="text-[10px] font-black text-[#021A54] bg-[#FFCEE3] px-2.5 py-1 rounded-full uppercase tracking-wide">
                                                {appointment.specialization || "General"}
                                            </span>
                                        </td>

                                        {/* ৪. অ্যাপয়েন্টমেন্ট তারিখ ও সময় */}
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-gray-700">🗓️ {appointment.appointmentDate}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-tight">{appointment.appointmentTime} ({appointment.appointmentDay})</p>
                                            </div>
                                        </td>

                                        {/* ৫. কনসালটেশন ফি */}
                                        <td className="p-4 whitespace-nowrap">
                                            <p className="text-sm font-black text-[#FF85BB]">
                                                ৳ {appointment.consultationFee || 0}
                                            </p>
                                        </td>

                                        {/* ৬. গেটওয়ে পেমেন্ট স্ট্যাটাস */}
                                        <td className="p-4 whitespace-nowrap">
                                            <Chip
                                                className="capitalize font-black text-[10px] px-2 py-0.5 rounded-xl border border-green-200"
                                                color="success"
                                                size="sm"
                                                variant="flat"
                                            >
                                                ✅ Paid
                                            </Chip>
                                        </td>

                                        {/* ৭. সিস্টেম অ্যাকশন বাটন */}
                                        <td className="p-4 text-center whitespace-nowrap">
                                            <Button
                                                size="sm"
                                                disabled
                                                className="bg-[#021A54] text-white font-black text-[10px] rounded-xl cursor-default opacity-100 shadow-sm border border-blue-900 px-3 py-1 uppercase tracking-wider"
                                            >
                                                Success 🎉
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* বটম ট্র্যাকিং সামারি */}
            <div className="mt-6 flex justify-end px-4 text-sm font-bold text-[#021A54] border-t border-gray-50 pt-4 gap-2">
                Total System Booking Volume: 
                <span className="font-black text-[#FF85BB]">৳ {totalRevenue.toLocaleString()}</span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-400 font-medium self-center">({appointments.length} total entries checked out)</span>
            </div>
        </div>
    );
};

export default AdminPaymentHistoryTable;