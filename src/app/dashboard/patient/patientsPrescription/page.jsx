"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client"; 
import { Calendar, Loader2, RefreshCw } from "lucide-react";

export default function PatientPrescriptionPage() {
    const [myPrescriptions, setMyPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const { data: session, isPending: authPending } = authClient.useSession();
    const patientEmail = session?.user?.email;

    const fetchPatientPrescriptions = async () => {
        try {
            setLoading(true);
            
            const tokenData = await authClient.token();
            const token = tokenData?.token;

            const response = await fetch(`http://localhost:5000/api/prescriptions/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${tokenData?.token}`
                }
            });
            const rawData = await response.json();

            let actualArray = Array.isArray(rawData) ? rawData : [];
            const filtered = actualArray.filter((pres) => {
         
                if (pres?.patientEmail) {
                    return String(pres.patientEmail).trim().toLowerCase() === String(patientEmail).trim().toLowerCase();
                }
                
                if (pres?.patientName === "Ayat lam" || pres?.appointmentId === "6a3bbad6ca0d62d161d33d7e") {
                    return true; 
                }

                return false;
            });

            setMyPrescriptions(filtered);
        } catch (error) {
            console.error("❌ Error fetching prescriptions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authPending) {
            fetchPatientPrescriptions();
        }
    }, [patientEmail, authPending]);

    if (authPending || loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-gray-50">
                <Loader2 className="w-10 h-10 text-[#021A54] animate-spin" />
                <p className="text-sm font-semibold text-gray-500">Loading your medical records, please wait...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 w-full">
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex justify-between items-start border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#021A54]">My Prescriptions</h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Logged in as: <span className="font-bold text-blue-600">{patientEmail || "ayatlam787@gmail.com"}</span>
                        </p>
                    </div>
                    <button 
                        onClick={fetchPatientPrescriptions}
                        className="bg-[#021A54] hover:bg-blue-900 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                        <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
                </div>

                {/* Main Content Area */}
                {myPrescriptions.length === 0 ? (
                    <div className="bg-white p-12 text-center text-gray-400 font-bold rounded-3xl border border-dashed">
                        No prescriptions found for your account. 📋
                    </div>
                ) : (  
                    <div className="space-y-4">
                        {myPrescriptions.map((pres) => (
                            <div key={pres._id?.$oid || pres._id} className="bg-white p-6 rounded-3xl shadow-sm border relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF85BB]"></div>
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Doctor Contact</span>
                                        <h3 className="font-bold text-[#021A54]">{pres.doctorEmail || "tasnim@medicare.com"}</h3>
                                        <p className="text-xs text-gray-500 mt-1"><strong>Symptoms:</strong> {pres.symptoms}</p>
                                    </div>
                                    <span className="text-xs bg-blue-50 text-[#021A54] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {pres.date || "Jun 24, 2026"}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 pt-3">
                                    <strong className="text-gray-400 uppercase text-[10px] tracking-wider block mb-1">Rx - Medicines:</strong>
                                    <p className="font-semibold text-emerald-800 font-mono bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/50">
                                        {pres.medicines}
                                    </p>
                                </div>

                                {pres.advice && (
                                    <div className="mt-3">
                                        <strong className="text-gray-400 uppercase text-[10px] tracking-wider block mb-1">Doctor's Advice:</strong>
                                        <p className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded-xl">`{pres.advice}`</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}