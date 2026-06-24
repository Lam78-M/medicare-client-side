"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify"; 
// 🟢 Better Auth ক্লায়েন্ট হেল্পার
import { authClient } from "@/lib/auth-client"; 

function PrescriptionContent() {
    const searchParams = useSearchParams();
    
    const urlAppId = searchParams.get("appId") || "";
    const nameFromUrl = searchParams.get("patientName") || "Unknown Patient";

    const [symptoms, setSymptoms] = useState("");
    const [medicines, setMedicines] = useState("");
    const [advice, setAdvice] = useState("");
    
    const [selectedPatientName, setSelectedPatientName] = useState("");
    const [activeAppointmentId, setActiveAppointmentId] = useState("");
    const [prescriptionsList, setPrescriptionsList] = useState([]);

    // 🟢 Better Auth থেকে কারেন্ট ডক্টর সেশন রিড করা
    const { data: session } = authClient.useSession();
    const doctorEmail = session?.user?.email;

    useEffect(() => {
        if (urlAppId) {
            setActiveAppointmentId(urlAppId);
        }
        if (nameFromUrl) {
            setSelectedPatientName(nameFromUrl);
        }
    }, [urlAppId, nameFromUrl]);

    const fetchPrescriptions = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/prescriptions/all");
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setPrescriptionsList(data);

                if (urlAppId) {
                    const existing = data.find((p) => p.appointmentId === urlAppId);
                    if (existing) {
                        setSymptoms(existing.symptoms || "");
                        setMedicines(existing.medicines || "");
                        setAdvice(existing.advice || "");
                        setSelectedPatientName(existing.patientName || nameFromUrl);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error fetching from MongoDB:", error);
            toast.error("Failed to fetch prescriptions! 📋"); 
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, [urlAppId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // যদি ইউজার হিস্ট্রি কার্ডে ক্লিক করে তবে activeAppointmentId চেঞ্জ হবে, অন্যথায় URL-এর আইডি থাকবে
        const finalAppointmentId = activeAppointmentId || urlAppId || `AUTO-${Date.now()}`;

        const prescriptionData = {
            appointmentId: finalAppointmentId,
            patientName: selectedPatientName, 
            doctorEmail: doctorEmail?.trim().toLowerCase() || "", 
            symptoms: symptoms,
            medicines: medicines,
            advice: advice,
        };

        console.log("🚀 Syncing with Backend (Upsert Mode):", prescriptionData);

        try {
            // 🎯 তোমার ব্যাকএন্ডের সিঙ্গেল রুট যা একইসাথে সেভ এবং এডিট হ্যান্ডেল করতে পারে!
            const response = await fetch("http://localhost:5000/api/prescriptions/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(prescriptionData),
            });

            const result = await response.json();
            console.log("📥 Server Response:", result);

            if (result.success || response.ok) {
                toast.success("📋 Prescription Synchronized successfully! 🎉");
                
                // ফর্ম রিসেট করে আবার ডিফল্ট URL মুডে নিয়ে যাওয়া
                setSymptoms("");
                setMedicines("");
                setAdvice("");
                setActiveAppointmentId(urlAppId); 
                setSelectedPatientName(nameFromUrl);
                
                // লাইভ হিস্ট্রি ডাটা রিফ্রেশ করা
                fetchPrescriptions();
            } else {
                toast.error(`⚠️ Error: ${result.message || "Failed to sync"}`);
            }
        } catch (error) {
            console.error("❌ Request Error:", error);
            toast.error("Backend server connection failed! 🌐");
        }
    };

    // 🛑 STRICTOR FILTERING MATRIX
    const currentDoctorEmail = doctorEmail?.trim().toLowerCase();
    
    const myFilteredPrescriptions = prescriptionsList.filter((pres) => {
        if (!pres) return false;
        const presDoctorEmail = pres.doctorEmail || pres.doctor_email;
        if (presDoctorEmail && currentDoctorEmail) {
            return presDoctorEmail.trim().toLowerCase() === currentDoctorEmail;
        }
        return pres.patientName === nameFromUrl;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left side: Form */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
                <h2 className="text-xl font-bold text-[#021A54] mb-2">Prescription Form (MongoDB Client)</h2>
                <div className="mb-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${activeAppointmentId === urlAppId ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                        {activeAppointmentId === urlAppId ? "🆕 New / URL Mode" : "✏️ Editing Mode Active"}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1.5">Target ID: {activeAppointmentId || "Auto-Generate"}</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase block mb-1">Patient Name</label>
                        <input type="text" value={selectedPatientName} disabled className="w-full bg-gray-100 text-gray-600 font-extrabold p-3 rounded-xl border border-gray-200 text-sm cursor-not-allowed"/>
                    </div>

                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase block mb-1">Symptoms / Disease</label>
                        <input type="text" required value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="e.g., Fever, Cough" className="w-full bg-gray-50 text-gray-800 p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all" />
                    </div>

                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase block mb-1">Medicines & Dosage</label>
                        <textarea required rows="3" value={medicines} onChange={(e) => setMedicines(e.target.value)} placeholder="e.g., Napa (1+0+1)" className="w-full bg-gray-50 text-gray-800 p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all resize-none" />
                    </div>

                    <div>
                        <label className="text-xs font-black text-gray-400 uppercase block mb-1">Advice / Instructions</label>
                        <input type="text" value={advice} onChange={(e) => setAdvice(e.target.value)} placeholder="e.g., Rest well" className="w-full bg-gray-50 text-gray-800 p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400 transition-all" />
                    </div>

                    <button type="submit" className={`w-full text-white font-bold p-3.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer ${activeAppointmentId === urlAppId ? 'bg-[#021A54] hover:bg-blue-900' : 'bg-amber-600 hover:bg-amber-700'}`}>
                        {activeAppointmentId === urlAppId ? "Submit & Save to MongoDB ✅" : "Update Existing Prescription 🔄"}
                    </button>
                    
                    {activeAppointmentId !== urlAppId && (
                        <button type="button" onClick={() => { setSymptoms(""); setMedicines(""); setAdvice(""); setActiveAppointmentId(urlAppId); setSelectedPatientName(nameFromUrl); }} className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold p-2 rounded-xl text-xs transition-all">
                            Cancel Edit ❌
                        </button>
                    )}
                </form>
            </div>

            {/* Right side: Data history */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#021A54] mb-2">Prescription History ({myFilteredPrescriptions.length})</h2>
                
                {myFilteredPrescriptions.length === 0 ? (
                    <div className="bg-white p-12 text-center text-gray-400 font-bold rounded-3xl border border-dashed border-gray-200">
                        No prescriptions saved for this doctor yet.
                    </div>
                ) : (
                    myFilteredPrescriptions.map((pres) => (
                        <div 
                            key={pres._id} 
                            onClick={() => {
                                setSymptoms(pres.symptoms || "");
                                setMedicines(pres.medicines || "");
                                setAdvice(pres.advice || "");
                                setActiveAppointmentId(pres.appointmentId);
                                setSelectedPatientName(pres.patientName || "Unknown Patient");
                                console.log("✏️ Loaded for edit. Appointment ID:", pres.appointmentId);
                            }}
                            className={`bg-white p-5 rounded-3xl shadow-sm border transition-all duration-300 relative overflow-hidden cursor-pointer group ${activeAppointmentId === pres.appointmentId ? 'border-amber-400 ring-2 ring-amber-100' : 'border-gray-100 hover:border-blue-300 hover:shadow-md'}`}
                        >
                            <div className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${activeAppointmentId === pres.appointmentId ? 'bg-amber-500' : 'bg-pink-500 group-hover:bg-[#021A54]'}`}></div>
                            
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-black text-lg text-[#021A54] group-hover:text-blue-800 transition-colors">{pres.patientName}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">ID: {pres.appointmentId}</p>
                                </div>
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full transition-all ${activeAppointmentId === pres.appointmentId ? 'bg-amber-100 text-amber-800' : 'bg-green-50 text-green-700'}`}>
                                    {activeAppointmentId === pres.appointmentId ? "Editing... ✏️" : "Click to Edit ✏️"}
                                </span>
                            </div>

                            <div className="space-y-2 text-xs border-t border-gray-50 pt-3">
                                <p className="text-gray-600"><strong className="text-gray-400 uppercase text-[9px] block">Symptoms:</strong> <span className="font-semibold text-gray-800">{pres.symptoms}</span></p>
                                <p className="text-gray-600"><strong className="text-gray-400 uppercase text-[9px] block">Medicines:</strong> <span className="font-semibold text-green-700 block whitespace-pre-line">{pres.medicines}</span></p>
                                {pres.advice && <p className="text-gray-600"><strong className="text-gray-400 uppercase text-[9px] block">Advice:</strong> <span className="font-medium text-gray-500 italic">{`"${pres.advice}"`}</span></p>}
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}

export default function PrescriptionPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F5] py-10 px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl mx-auto">
                <Suspense fallback={<div className="flex justify-center items-center py-20"><span className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#021A54]"></span></div>}>
                    <PrescriptionContent />
                </Suspense>
            </div>
        </div>
    );
}