"use client";

import React, { useState } from 'react';
import { Button, Input } from "@heroui/react";
import { toast } from 'react-toastify';

export default function DoctorProfileBioEditor({ doctorData, onUpdateSuccess }) {
    const doctorId = doctorData?._id?.$oid || doctorData?._id;

    // ImgBB API Key Variable Context
    // 💡 Replace this string with your real ImgBB client API key
    const IMGBB_API_KEY = "YOUR_IMGBB_API_KEY_HERE"; 

    // Dynamic standard reactive data fields tracking hooks
    const [qualifications, setQualifications] = useState(doctorData?.qualifications || "");
    const [specialization, setSpecialization] = useState(doctorData?.specialization || "");
    const [experience, setExperience] = useState(doctorData?.experience || "");
    const [hospitalName, setHospitalName] = useState(doctorData?.hospitalName || "");
    const [profileImageUrl, setProfileImageUrl] = useState(doctorData?.profileImage || "");
    
    const [imageUploading, setImageUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // ☁️ Handle ImgBB Cloud Binary Assets Processing Upload
    const handleImageUploadToImgBB = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                const liveUrl = data.data.display_url;
                setProfileImageUrl(liveUrl);
                toast.success("New Avatar hosted on ImgBB clusters! 📸☁️");
            } else {
                toast.error("ImgBB authentication validation failed.");
            }
        } catch (err) {
            console.error("ImgBB Upload Exception:", err);
            toast.error("Network gateway timeout on asset loading.");
        } finally {
            setImageUploading(false);
        }
    };

    // 🚀 Submit Whole Profiler Matrix Data
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!doctorId) return toast.error("Doctor ID mapping missing! ❌");
        
        setSaving(true);

        const payload = {
            qualifications,
            specialization,
            experience,
            hospitalName,
            profileImage: profileImageUrl
        };

        try {
            const res = await fetch(`http://localhost:5000/api/doctors/update-profile/${doctorId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Medical profile schema synchronized successfully! 🏛️🩺");
                if (onUpdateSuccess) onUpdateSuccess();
            } else {
                toast.error("Failed processing database synchronization sync layout.");
            }
        } catch (error) {
            toast.error("Network interface data exchange execution timeout.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-white to-slate-50/50 rounded-[32px] border border-slate-200/70 shadow-2xl shadow-slate-200/40 space-y-8 my-6">
            
            {/* Soft Modern Header Layout */}
            <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">Credentials Console</span>
                <h2 className="text-xl font-black text-slate-800 mt-2">Manage Professional Identity</h2>
                <p className="text-xs text-slate-400">Modify qualifications, hospital tags, and profile showcase elements</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
                
                {/* 📸 Row Section 1: Avatar Showcase & Upload Node */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center relative group">
                        {profileImageUrl ? (
                            <img src={profileImageUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl">🩺</span>
                        )}
                        {imageUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs text-white font-bold">...</div>
                        )}
                    </div>
                    <div className="flex-1 space-y-1 w-full">
                        <label className="text-xs font-black text-slate-700 block">Replace Practice Profile Photo</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleImageUploadToImgBB}
                            className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer w-full transition-colors"
                        />
                        <span className="text-[9px] text-slate-400 block">Assets directly piped and parsed through ImgBB live endpoint stream layers.</span>
                    </div>
                </div>

                {/* 📄 Row Section 2: Interactive Fields Structural Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Medical Qualifications</label>
                        <Input 
                            type="text" 
                            required
                            placeholder="e.g., MBBS, FCPS, MD"
                            value={qualifications}
                            onChange={(e) => setQualifications(e.target.value)}
                            className="font-semibold text-xs"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Clinical Specialization</label>
                        <Input 
                            type="text" 
                            required
                            placeholder="e.g., Pediatrics / Cardiology"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="font-semibold text-xs"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Years of Active Experience</label>
                        <Input 
                            type="number" 
                            required
                            placeholder="e.g., 10"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="font-semibold text-xs"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-extrabold text-slate-600 block mb-1">Affiliated Hospital Complex</label>
                        <Input 
                            type="text" 
                            required
                            placeholder="e.g., Bangladesh Child Hospital"
                            value={hospitalName}
                            onChange={(e) => setHospitalName(e.target.value)}
                            className="font-semibold text-xs"
                        />
                    </div>

                </div>

                {/* Action Interface Footer */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button 
                        type="submit" 
                        isLoading={saving}
                        disabled={imageUploading}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl px-10 py-5 text-xs tracking-wide shadow-md shadow-slate-900/10 transition-colors"
                    >
                        Sync Corporate Bio 🚀
                    </Button>
                </div>

            </form>
        </div>
    );
}