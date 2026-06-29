"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; 

export default function DashboardPrescrip() {
    const [prescriptionsList, setPrescriptionsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data: session, isPending: authPending } = authClient.useSession();
    const doctorEmail = session?.user?.email;

 const fetchPrescriptions = async () => {
    try {
        setLoading(true);
        const tokenData = await authClient.token();
        const token = tokenData?.token;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/prescriptions/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
            }
        });
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
useEffect(() => {  
    if (session?.user) {
        fetchPrescriptions();
    }
}, [session]);

    const currentDoctorEmail = doctorEmail?.trim().toLowerCase();
    
    const myFilteredPrescriptions = prescriptionsList.filter((pres) => {
        if (!pres) return false;
        const presDoctorEmail = pres.doctorEmail || pres.doctor_email;
        
        if (presDoctorEmail && currentDoctorEmail) {
            return presDoctorEmail.trim().toLowerCase() === currentDoctorEmail;
        }
        return false; 
    });

    if (authPending || (loading && doctorEmail)) {
        return (
            <div className="flex justify-center items-center py-20 w-full">
                <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#021A54]"></span>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="p-6 text-center font-bold text-red-500 bg-red-50 rounded-3xl border border-red-100 text-sm">
                ⚠️ Please log in as a doctor to view your prescriptions.
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 w-full font-sans">
            <div className="max-w-2xl space-y-6 ">

                {myFilteredPrescriptions.length === 0 ? (
                    <div className="bg-[#021A54]/5 text-center text-[#021A54] font-medium p-16 rounded-3xl border border-dashed border-[#021A54]/20 shadow-sm">
                        No prescriptions saved under your account yet. 📋
                    </div>
                ) : (  
       
                    <div className="space-y-4">
                        {myFilteredPrescriptions.map((pres) => (
                            <div 
                                key={pres._id} 
                                className="bg-[#FFFFFF] p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden border border-white/10"
                            >
                             
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#021A54]"></div>
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-black text-xl text-[#021A54]">{pres.patientName}</h3>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase mt-0.5">
                                            ID: {pres.appointmentId} | Issued: {pres.date || "Recent"}
                                        </p>
                                    </div>
                                    <Link 
                                        href={'/dashboard/doctors/prescription'} 
                                        className="bg-[#FFCEE3] text-[#021A54] text-[10px] font-black px-3 py-1 rounded-full border border-[#FF85BB]/40 transition-colors hover:bg-[#FF85BB]"
                                    >
                                        Atlas Live
                                    </Link>
                                </div>

                                <div className="space-y-3 text-sm border-t border-gray-100 pt-4">
                                    <p className="text-gray-600">
                                        <strong className="text-[#021A54]/60 uppercase text-[10px] tracking-wider block mb-0.5">Symptoms / Disease:</strong> 
                                        <span className="font-semibold text-[#021A54]">{pres.symptoms}</span>
                                    </p>
                                    
                                    <p className="text-gray-600">
                                        <strong className="text-[#021A54]/60 uppercase text-[10px] tracking-wider block mb-0.5">Medicines & Dosage:</strong> 
                                        {/* Container block matched using subtle #FFCEE3 scheme fallback */}
                                        <span className="font-semibold text-[#021A54] block whitespace-pre-line bg-[#FFCEE3]/20 p-3 rounded-xl border border-[#FFCEE3]/40">
                                            {pres.medicines}
                                        </span>
                                    </p>
                                    
                                    {pres.advice && (
                                        <p className="text-gray-600">
                                            <strong className="text-[#021A54]/60 uppercase text-[10px] tracking-wider block mb-0.5">Advice:</strong> 
                                            <span className="font-medium text-[#021A54]/80 italic bg-[#021A54]/5 p-2.5 block rounded-xl border border-gray-100">
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