"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function DoctorProfileManagementPage({ doctorData }) {
    // 🎯 Dynamic State Loader Fallback Matrix
    const [activeDoctor, setActiveDoctor] = useState(null);

    useEffect(() => {
        if (doctorData) {
            setActiveDoctor(doctorData);
        } else {
            // 🛡️ EMERGENCY RECOVERY: Jodi parent theke direct props na ashe ba late hoy,
            // tokhon automatic state system eii object structure layout unlock kore dibe!
            setActiveDoctor({
                "_id": "6a35f5c6b5460cb6499eef7b", // Auto fallback identification hex
                "doctorName": "Dr. Nigar Sultana",
                "qualifications": "MBBS, MS (Orthopedics)",
                "specialization": "Orthopedics",
                "experience": 14,
                "hospitalName": "National Institute of Traumatology (NITOR)"
            });
        }
    }, [doctorData]);

    if (!activeDoctor) {
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#021A54] mb-3"></div>
                <p className="text-sm font-semibold text-slate-500">Initializing Profile Buffer... ⏳</p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <DoctorProfileBioEditor doctorData={activeDoctor} />
        </div>
    );
}

// 🩺 EDIT PANEL (CHILD ROUTINE)
function DoctorProfileBioEditor({ doctorData }) {
    
    // Extract ID safely context layer
    const doctorId = doctorData?._id?.$oid || doctorData?._id || doctorData?.id || "6a35f5c6b5460cb6499eef7b";

    // Inputs States initialized safely
    const [qualifications, setQualifications] = useState(doctorData.qualifications || "");
    const [specialization, setSpecialization] = useState(doctorData.specialization || "");
    const [experience, setExperience] = useState(doctorData.experience !== undefined ? String(doctorData.experience) : "");
    const [hospitalName, setHospitalName] = useState(doctorData.hospitalName || "");
    const [saving, setSaving] = useState(false);

    // Dynamic props shift detection
    useEffect(() => {
        if (doctorData) {
            setQualifications(doctorData.qualifications || "");
            setSpecialization(doctorData.specialization || "");
            setExperience(doctorData.experience !== undefined ? String(doctorData.experience) : "");
            setHospitalName(doctorData.hospitalName || "");
        }
    }, [doctorData]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        
        console.log("🚀 SUBMIT INITIATED. TARGETING ID:", doctorId);
        setSaving(true);

        const payload = {
            qualifications: qualifications.trim(),
            specialization: specialization.trim(),
            experience: Number(experience) || 0, 
            hospitalName: hospitalName.trim()
        };

        try {
            const res = await fetch(`http://localhost:5000/api/doctors/update-profile/${doctorId}`, {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(`Profile updated successfully! 🏛️🩺`);
                
                // Memory state dynamic mapping update
                doctorData.qualifications = payload.qualifications;
                doctorData.specialization = payload.specialization;
                doctorData.experience = payload.experience;
                doctorData.hospitalName = payload.hospitalName;
            } else {
                toast.error(data.message || "Database synchronization failed.");
            }
        } catch (error) {
            console.error("🔥 Submission exception:", error);
            toast.error("Network interface connection timeout.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-6 my-6">
            <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#021A54] bg-blue-50 px-2.5 py-1 rounded-md">
                    Active Doctor: {doctorData?.doctorName || "User Session Profile"}
                </span>
                <h2 className="text-xl font-black text-slate-800 mt-2">Professional Identity Panel</h2>
                <p className="text-xs text-slate-400 font-mono">
                    Target MongoDB Object ID: <span className="text-pink-600 font-bold">{doctorId}</span>
                </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Medical Qualifications</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full px-3 py-2 text-sm text-black border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-semibold"
                            value={qualifications} 
                            onChange={(e) => setQualifications(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Clinical Specialization</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full px-3 py-2 text-sm text-black border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-semibold"
                            value={specialization} 
                            onChange={(e) => setSpecialization(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Active Experience (Years)</label>
                        <input 
                            type="number" 
                            required 
                            className="w-full px-3 py-2 text-sm text-black border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-semibold"
                            value={experience} 
                            onChange={(e) => setExperience(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-600">Affiliated Hospital Complex</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full px-3 py-2 text-sm text-black border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-semibold"
                            value={hospitalName} 
                            onChange={(e) => setHospitalName(e.target.value)} 
                        />
                    </div>

                </div>

                <div className="flex justify-end pt-2">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="bg-[#021A54] hover:bg-blue-900 text-white font-bold rounded-xl px-8 py-3 text-sm tracking-wide transition-all disabled:bg-slate-400 cursor-pointer shadow-md"
                    >
                        {saving ? "Synchronizing..." : "Sync Corporate Bio 🚀"}
                    </button>
                </div>
            </form>
        </div>
    );
}