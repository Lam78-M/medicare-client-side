"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@heroui/react";
import { toast } from 'react-toastify';

export default function DoctorScheduleTagsEditor({ doctorData, onUpdateSuccess }) {
    // 🎯 মঙ্গোডিবির $oid ফরম্যাট থেকে আইডি নিখুঁতভাবে এক্সট্র্যাক্ট করা
  // 🎯 সরাসরি স্ট্রিং আইডি এবং মঙ্গোডিবি অবজেক্ট আইডি — দুটিই হ্যান্ডেল করার পারফেক্ট লাইন:
const doctorId = typeof doctorData?._id === 'object' ? doctorData?._id?.$oid : doctorData?._id;

    const weekDaysOptions = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const timeSlotsOptions = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
        "02:00 PM", "02:30 PM", "03:30 PM", "04:00 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"
    ];

    // স্টেট ইনিশিয়ালাইজেশন
    const [availableDays, setAvailableDays] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [tempDay, setTempDay] = useState("");
    const [tempTime, setTempTime] = useState("");
    const [updating, setUpdating] = useState(false);

    // 🌟 ম্যাজিক পার্ট: ডক্টরের ডাটা লোড হওয়ার সাথে সাথে স্টেটগুলোকে ডাইনামিকালি সিঙ্ক করা
    useEffect(() => {
        if (doctorData) {
            if (doctorData.availableDays) {
                setAvailableDays(doctorData.availableDays);
            }
            if (doctorData.availableSlots) {
                // অবজেক্ট অ্যারে থেকে শুধু টাইমের স্ট্রিংগুলো বের করে স্টেটে রাখা
                setAvailableSlots(doctorData.availableSlots.map(s => s.time || s));
            }
        }
    }, [doctorData]);

    const addDayChip = () => {
        if (!tempDay) return;
        if (availableDays.includes(tempDay)) {
            toast.warn("Day already listed! 📅");
            return;
        }
        setAvailableDays([...availableDays, tempDay]);
        setTempDay("");
    };

    const removeDayChip = (dayToRemove) => {
        setAvailableDays(availableDays.filter(day => day !== dayToRemove));
    };

    const addTimeChip = () => {
        if (!tempTime) return;
        if (availableSlots.includes(tempTime)) {
            toast.warn("Slot already listed! 🕒");
            return;
        }
        setAvailableSlots([...availableSlots, tempTime]);
        setTempTime("");
    };

    const removeTimeChip = (timeToRemove) => {
        setAvailableSlots(availableSlots.filter(time => time !== timeToRemove));
    };

    const handleSyncDatabase = async () => {
        if (!doctorId) return toast.error("Doctor profile identifier mapping missing! ❌");
        setUpdating(true);

        // ডাটাবেজের রিকোয়ার্ড স্ট্রাকচার অনুযায়ী পেলোড তৈরি
        const payload = {
            availableDays,
            availableSlots: availableSlots.map(t => ({ time: t, isBooked: false }))
        };

        try {
            const tokenData = await authClient.token();
          const token = tokenData?.token;
          
            const res = await fetch(`http://localhost:5000/api/doctors/update-slots/${doctorId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json',
                    authorization: `Bearer ${tokenData?.token}`
                 },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Database architecture synchronized! 🚀");
                if (onUpdateSuccess) onUpdateSuccess();
            } else {
                toast.error("Cloud synchronization mismatch error.");
            }
        } catch (error) {
            toast.error("Network gateway connection timeout.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gradient-to-tr from-slate-50 to-blue-50/30 rounded-[32px] border border-slate-200/60 shadow-xl shadow-slate-100/50 space-y-8">
            
            {/* Header Content Section */}
            <div className="border-b border-slate-200/80 pb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">Live Control Panel</span>
                <h2 className="text-2xl font-black text-slate-800 mt-2">Custom Roster Configuration</h2>
                <p className="text-xs text-slate-400">Dr. {doctorData?.doctorName || "Profile Specialist"} &bull; Practice Timings Matrix</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 🗓️ Block A: Working Weekdays */}
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-pink-200 shadow-sm flex flex-col justify-between min-h-[220px]">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 font-bold text-sm">🗓️</div>
                            <h4 className="font-extrabold text-slate-700 text-sm tracking-tight">Active Duty Weekdays</h4>
                        </div>
                        
                        <div className="flex gap-2">
                            <select 
                                value={tempDay}
                                onChange={(e) => setTempDay(e.target.value)}
                                className="w-full h-10 border border-pink-200 rounded-xl px-3 bg-slate-50/50 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                            >
                                <option value="">Choose Day</option>
                                {weekDaysOptions.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <button 
                                type="button"
                                onClick={addDayChip} 
                                className="bg-[#021A54] hover:bg-blue-900 active:scale-95 text-white font-bold text-xs rounded-xl px-4 h-10 transition-all flex items-center shadow-sm shadow-emerald-600/10"
                            >
                                Insert
                            </button>
                        </div>
                    </div>

                    {/* Styled Chips Render Matrix */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-dashed border-slate-100 mt-4">
                        {availableDays.length === 0 ? (
                            <span className="text-[11px] italic text-slate-400">No active days set yet</span>
                        ) : (
                            availableDays.map(day => (
                                <div key={day} className="group flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200/60 transition-colors">
                                    <span>{day}</span>
                                    <span 
                                        onClick={() => removeDayChip(day)} 
                                        className="text-slate-400 hover:text-rose-500 cursor-pointer font-black text-[10px] transition-colors"
                                    >
                                        ✕
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 🕒 Block B: Configured Appointment Hours */}
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-pink-200 shadow-sm flex flex-col justify-between min-h-[220px]">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 font-bold text-sm">🕒</div>
                            <h4 className="font-extrabold text-slate-700 text-sm tracking-tight">Consultation Session Slots</h4>
                        </div>
                        
                        <div className="flex gap-2">
                            <select 
                                value={tempTime}
                                onChange={(e) => setTempTime(e.target.value)}
                                className="w-full h-10 border border-pink-200 rounded-xl px-3 bg-slate-50/50 text-xs font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all"
                            >
                                <option value="">Choose Timing</option>
                                {timeSlotsOptions.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <button 
                                type="button"
                                onClick={addTimeChip} 
                                className="bg-[#021A54] hover:bg-blue-900 active:scale-95 text-white font-bold text-xs rounded-xl px-4 h-10 transition-all flex items-center shadow-sm shadow-blue-600/10"
                            >
                                Insert
                            </button>
                        </div>
                    </div>

                    {/* Cyan styled soft pill indicators */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-dashed border-slate-100 mt-4">
                        {availableSlots.length === 0 ? (
                            <span className="text-[11px] italic text-slate-400">No timings registered</span>
                        ) : (
                            availableSlots.map(time => (
                                <div key={time} className="group flex items-center gap-2 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-900 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-100/70 transition-colors">
                                    <span>{time}</span>
                                    <span 
                                        onClick={() => removeTimeChip(time)} 
                                        className="text-indigo-300 hover:text-rose-500 cursor-pointer font-black text-[10px] transition-colors"
                                    >
                                        ✕
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Bottom Save Section */}
            <div className="flex justify-end pt-4 border-t border-slate-200/80">
                <Button 
                    isLoading={updating} 
                    onClick={handleSyncDatabase} 
                    className="bg-[#021A54] hover:bg-blue-900 active:scale-98 text-white font-black rounded-xl px-12 py-5 text-xs shadow-lg shadow-indigo-600/20 transition-all"
                >
                    Apply Schedule System 🚀
                </Button>
            </div>

        </div>
    );
}