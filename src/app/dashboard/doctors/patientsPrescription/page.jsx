"use client";

import React, { useState, useEffect } from "react";
// 🟢 Better Auth ক্লায়েন্ট হেল্পার ইমপোর্ট করলাম
import { authClient } from "@/lib/auth-client"; 

export default function PrescriptionHistoryPage() {
    // MongoDB থেকে আসা ডাটার স্টেট
    const [prescriptionsList, setPrescriptionsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🟢 Better Auth থেকে কারেন্ট ডক্টর সেশন রিড করা
    const { data: session, isPending: authPending } = authClient.useSession();
    const doctorEmail = session?.user?.email;

    // 🔄 MongoDB Atlas থেকে সব ডাটা লোড করার ফাংশন
    const fetchPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/api/prescriptions/all");
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setPrescriptionsList(data);
            }
        } catch (error) {
            console.error("❌ Error fetching from MongoDB:", error);
        } finally {
            setLoading(false);
        }
    };

    // পেজ লোড হওয়ার সাথে সাথে ডাটা নিয়ে আসবে
    useEffect(() => {
        fetchPrescriptions();
    }, []);

    // 🛑 STRICT DOCTOR FILTER MATRIX: লগইন করা ডক্টরের ডাটা আলাদা করা
    const currentDoctorEmail = doctorEmail?.trim().toLowerCase();
    
    const myFilteredPrescriptions = prescriptionsList.filter((pres) => {
        if (!pres) return false;
        
        // ব্যাকএন্ডে আমরা যে 'doctorEmail' ফিল্ডটি সেভ করেছি, সেটি চেক করা হচ্ছে
        const presDoctorEmail = pres.doctorEmail || pres.doctor_email;
        
        if (presDoctorEmail && currentDoctorEmail) {
            return presDoctorEmail.trim().toLowerCase() === currentDoctorEmail;
        }
        
        return false; // ইমেইল না মিললে বা ডাটা ওল্ড হলে সিকিউরিটির জন্য হিস্ট্রিতে দেখাবে না
    });

    // সেশন লোড হওয়া পর্যন্ত ওয়েট করা
    if (authPending) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#021A54]"></span>
            </div>
        );
    }

    // যদি কোনো ডক্টর লগইন ছাড়া এই পেজে আসে
    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white px-4">
                <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-center max-w-sm">
                    <p className="text-red-600 font-bold">⚠️ Access Denied!</p>
                    <p className="text-xs text-gray-500 mt-1">Please log in with your doctor account to view your prescription history.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* হেডার সেকশন এবং রিফ্রেশ বাটন */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#021A54]">Prescription History</h1>
                        {/* 🎯 এখানে এখন ফিল্টার করা টোটাল কাউন্ট দেখাবে */}
                        <p className="text-xs text-gray-500 mt-1">Your Total Prescriptions: {myFilteredPrescriptions.length}</p>
                    </div>
                    <button 
                        onClick={fetchPrescriptions}
                        className="bg-[#021A54] hover:bg-blue-900 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        Refresh List 🔄
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#021A54]"></span>
                    </div>
                ) : myFilteredPrescriptions.length === 0 ? (
                    /* ডাটা না থাকলে বা কারেন্ট ডক্টরের কোনো ডাটা ম্যাচ না করলে এই ভিউ দেখাবে */
                    <div className="bg-white p-16 text-center text-gray-400 font-bold rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        No prescriptions issued by you found in MongoDB. 📋
                    </div>
                ) : (  
                    /* 🗂️ ডক্টরের নিজস্ব প্রেসক্রিপশন কার্ড লিস্ট */
                    <div className="space-y-4">
                        {myFilteredPrescriptions.map((pres) => (
                            <div 
                                key={pres._id} 
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden"
                            >
                                {/* বর্ডার টপ ডেকোরেশন লাইন */}
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#ca3a9f]"></div>
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black text-xl text-[#021A54]">{pres.patientName}</h3>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">
                                            ID: {pres.appointmentId} | Issued: {pres.date}
                                        </p>
                                    </div>
                                    <span className="bg-green-50 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-full border border-green-100">
                                        Atlas Live
                                    </span>
                                </div>

                                <div className="space-y-3 text-sm border-t border-gray-50 pt-4">
                                    <p className="text-gray-600">
                                        <strong className="text-gray-400 uppercase text-[10px] tracking-wider block mb-0.5">Symptoms / Disease:</strong> 
                                        <span className="font-semibold text-gray-800">{pres.symptoms}</span>
                                    </p>
                                    
                                    <p className="text-gray-600">
                                        <strong className="text-gray-400 uppercase text-[10px] tracking-wider block mb-0.5">Medicines & Dosage:</strong> 
                                        <span className="font-semibold text-green-700 block whitespace-pre-line bg-green-50/40 p-2.5 rounded-xl border border-green-50">
                                            {pres.medicines}
                                        </span>
                                    </p>
                                    
                                    {pres.advice && (
                                        <p className="text-gray-600">
                                            <strong className="text-gray-400 uppercase text-[10px] tracking-wider block mb-0.5">Advice:</strong> 
                                            <span className="font-medium text-gray-500 italic bg-gray-50 p-2 block rounded-xl">
                                                {`"${pres.advice}"`}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}