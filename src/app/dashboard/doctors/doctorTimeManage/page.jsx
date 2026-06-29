'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; 

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateSchedulePage = () => {
    const router = useRouter();

    const { data: session, isPending: isSessionLoading } = authClient.useSession();
    
    const [doctorEmail, setDoctorEmail] = useState("");
    const [doctorName, setDoctorName] = useState("");

    const [updateLoading, setUpdateLoading] = useState(false);
    const [availableDays, setAvailableDays] = useState([]); 
    const [slots, setSlots] = useState([]); 
    const [newSlotTime, setNewSlotTime] = useState(""); 

    const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    useEffect(() => {
        if (session?.user) {
            setDoctorEmail(session.user.email || "");
            setDoctorName(session.user.name || "Doctor");
        }
    }, [session]);

    const handleDayChange = (day) => {
        if (availableDays.includes(day)) {
            setAvailableDays(availableDays.filter(d => d !== day));
        } else {
            setAvailableDays([...availableDays, day]);
        }
    };

    const handleAddSlot = () => {
        if (!newSlotTime) {
            toast.warning("Please select a time first.");
            return;
        }

        let formattedTime = newSlotTime;
        if (newSlotTime.includes(":")) {
            const [hours, minutes] = newSlotTime.split(':');
            let hour = parseInt(hours, 10);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12;
            hour = hour ? hour : 12;
            const displayHour = hour < 10 ? `0${hour}` : hour;
            formattedTime = `${displayHour}:${minutes} ${ampm}`;
        }

        if (slots.some(s => s.time === formattedTime)) {
            toast.error("This time slot is already added!");
            return;
        }

        setSlots([...slots, { time: formattedTime, isBooked: false }]);
        setNewSlotTime(""); 
        toast.success("New slot added to the list! 🕒");
    };

    const handleRemoveSlot = (indexToRemove) => {
        setSlots(slots.filter((_, index) => index !== indexToRemove));
    };


    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        
        if (!doctorEmail) {
            toast.error("Logged-in doctor's email not found! ❌");
            return;
        }
        if (availableDays.length === 0) {
            toast.warning("Please select at least one available day.");
            return;
        }
        if (slots.length === 0) {
            toast.warning("Please add at least one time slot.");
            return;
        }

        setUpdateLoading(true);
        try {
            const updatePayload = {
                email: doctorEmail,
                availableDays: availableDays,
                availableSlots: slots
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/doctors/update-schedule-by-email`, {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Your chamber schedule has been successfully updated! 🎉🚀");
            } else {
                toast.error(result.message || "Schedule update failed! ❌");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Unable to connect to the server.");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (isSessionLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <Spinner size="lg" style={{ color: '#FF85BB' }} label="Verifying Session..." />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <Card className="p-6 text-center max-w-sm bg-white border border-red-200 shadow-md">
                    <p className="text-red-500 font-bold mb-3">You are not logged in! ❌</p>
                    <p className="text-xs text-gray-500">Please log in to your doctor account to modify your schedule.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 md:px-12 bg-[#F5F5F5] flex justify-center items-center">
            <Card className="max-w-2xl w-full bg-white p-8 rounded-3xl border border-[#2652b8]/20 shadow-xl space-y-6">
                
                <div className="text-center border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-extrabold text-[#021A54]">📅 Update Your Schedule</h2>
                    <p className="text-sm font-bold text-pink-500 mt-1">Welcome, {doctorName}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">Logged Email: {doctorEmail}</p>
                </div>

                <form onSubmit={handleUpdateSubmit} className="space-y-6">
                    
                    {/* 1. Day Selection Grid */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#021A54] mb-3">
                            🏥 1. Select Your Available Chamber Days:
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {allDays.map((day) => {
                                const isSelected = availableDays.includes(day);
                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDayChange(day)}
                                        className={`px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-200 text-center ${
                                            isSelected 
                                            ? 'bg-[#021A54] text-white border-[#021A54] shadow-md scale-95' 
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        {day} {isSelected && "✅"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* 2. Time Slot Input */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#021A54] mb-3">
                            ⏰ 2. Add Available Time Slots:
                        </h3>
                        
                        <div className="flex gap-2 items-center mb-4 max-w-md">
                            <Input 
                                type="time" 
                                value={newSlotTime}
                                onChange={(e) => setNewSlotTime(e.target.value)}
                                className="font-semibold text-black"
                            />
                            <Button 
                                type="button" 
                                onClick={handleAddSlot}
                                className="bg-[#021A54] text-white font-bold px-6 rounded-xl"
                            >
                                Add Slot
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {slots.length === 0 ? (
                                <p className="text-xs text-red-400 italic">No time slots have been added yet.</p>
                            ) : (
                                slots.map((slot, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-pink-50 text-[#FF85BB] border-[#FFCEE3] font-extrabold text-xs"
                                    >
                                        <span>🕒 {slot.time}</span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveSlot(index)}
                                            className="text-red-500 hover:text-red-700 font-black ml-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <Button 
                            type="submit"
                            isLoading={updateLoading}
                            className="bg-[#FF85BB] text-white font-black px-10 py-6 rounded-2xl shadow-lg text-sm"
                        >
                            Save & Update Schedule 🚀
                        </Button>
                    </div>

                </form>
            </Card>


            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default UpdateSchedulePage;