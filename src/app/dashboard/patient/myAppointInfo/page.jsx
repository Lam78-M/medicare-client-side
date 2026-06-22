"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, Chip, Input, Spinner } from "@heroui/react";
import { toast } from 'react-toastify'; 

export default function AppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Reschedule management states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeAppointment, setActiveAppointment] = useState(null); 
    const [newDate, setNewDate] = useState('');
    const [newSlot, setNewSlot] = useState('');

    const userEmail = "patient@example.com"; 

    // Fetch user appointments
    const fetchAppointments = () => {
        setLoading(true);
        fetch(`http://localhost:5000/api/appointments/patient?email=${userEmail}`)
            .then((res) => res.json())
            .then((data) => {
                setAppointments(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                toast.error("Failed to load appointments! ❌"); 
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAppointments();
    }, [userEmail]);

    // ❌ Cancel Appointment Handler
    const handleCancel = async (id) => {
        if (!id) return;
        if (!confirm("আপনি কি নিশ্চিত যে অ্যাপয়েন্টমেন্টটি বাতিল করতে চান?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success("Appointment successfully canceled! 🛑"); 
                setAppointments(appointments.filter(app => {
                    const appId = app?._id?.$oid || app?._id;
                    return appId !== id;
                }));
            } else {
                toast.error("Failed to cancel appointment. ⚠️"); 
            }
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error("Network error while canceling! 🌐");
        }
    };

    // 🗓️ Open Reschedule Panel
    const openRescheduleModal = (appointment) => {
        if (!appointment) return;
        setActiveAppointment(appointment);
        setNewDate(appointment.appointmentDate || '');
        setNewSlot(appointment.appointmentTime || '');
        setIsModalOpen(true);
    };

    // 🚀 Submit Rescheduled Data
    const handleRescheduleSubmit = async (e) => {
        e.preventDefault();
        
        if (!activeAppointment) return;
        const id = activeAppointment?._id?.$oid || activeAppointment?._id;
        if (!id) return;

        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayName = daysOfWeek[new Date(newDate).getDay()];

        const updatedPayload = {
            appointmentDate: newDate,
            appointmentDay: dayName,
            appointmentTime: newSlot
        };

        try {
            const res = await fetch(`http://localhost:5000/api/appointments/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPayload)
            });

            if (res.ok) {
                toast.success("Rescheduled Successfully! 🗓️✨"); 
                setIsModalOpen(false);
                setActiveAppointment(null); 
                fetchAppointments(); 
            } else {
                toast.error("Something went wrong while rescheduling. ⚠️"); 
            }
        } catch (error) {
            console.error("Reschedule network issue:", error);
            toast.error("Network error while updating schedule! 🌐");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <Spinner size="lg" style={{ color: '#FF85BB' }} label="Loading Your Schedules..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-10 px-4 sm:px-6 lg:px-8 w-full relative">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-[#021A54] tracking-tight">
                        My Appointments Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Manage, Reschedule, or Cancel your ongoing consulting schedules
                    </p>
                </div>
                
                {/* Horizontal Rows Content Container */}
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <Card className="p-12 text-center text-gray-400 font-bold bg-white rounded-3xl shadow-sm border border-none">
                            No appointments registered yet.
                        </Card>
                    ) : (
                        appointments.map((appointment, index) => {
                            if (!appointment) return null; 
                            const appId = appointment?._id?.$oid || appointment?._id;
                            const uniqueKey = appId || `app-key-${index}`;

                            return (
                                <Card key={uniqueKey} className="bg-white p-5 rounded-3xl shadow-sm border-none hover:shadow-md transition-all duration-300">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                        
                                        {/* Left Side: Doctor Info */}
                                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center border border-[#FFCEE3] text-xl">
                                                👨‍⚕️
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-lg text-[#021A54]">{appointment.doctorName}</h3>
                                                <div className="flex flex-wrap gap-2 items-center mt-1">
                                                    <Chip size="sm" className="font-bold text-[10px] bg-[#FFCEE3] text-[#021A54]">
                                                        {appointment.specialization}
                                                    </Chip>
                                                    <span className="text-xs text-gray-400 truncate max-w-[200px] sm:max-w-none">
                                                        🏢 {appointment.hospitalName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Center Panel: Date/Time */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 w-full lg:w-auto border-t border-b border-gray-50 py-3 lg:border-none lg:py-0">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Schedule Date</p>
                                                <p className="text-sm font-bold text-gray-800">🗓️ {appointment.appointmentDate}</p>
                                                <p className="text-[11px] font-medium text-gray-400">{appointment.appointmentDay}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Consultation Time</p>
                                                <p className="text-sm font-black text-gray-700">🕒 {appointment.appointmentTime}</p>
                                            </div>
                                            <div className="col-span-2 md:col-span-1">
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Payment & Status</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-sm font-extrabold text-[#FF85BB]">৳{appointment.consultationFee}</span>
                                                    <Chip size="sm" variant="flat" className={`font-black text-[10px] ${
                                                        appointment.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {appointment.status || 'Pending'}
                                                    </Chip>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Action Buttons */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end ml-auto lg:ml-0">
                                            <Button 
                                                size="sm" 
                                                onClick={() => openRescheduleModal(appointment)}
                                                className="bg-[#021A54] text-white font-bold text-xs rounded-xl px-4 py-4 shadow-sm hover:opacity-90"
                                            >
                                                Reschedule 🗓️
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleCancel(appId)}
                                                className="bg-transparent border border-red-200 text-red-500 font-bold text-xs rounded-xl px-4 py-4 hover:bg-red-50"
                                            >
                                                Cancel ❌
                                            </Button>
                                        </div>

                                    </div>

                                    {/* Patient Problem Note */}
                                    <div className="mt-3 bg-gray-50/50 rounded-2xl p-3 border border-gray-100">
                                        <span className="text-[10px] uppercase font-black text-gray-400 block mb-0.5">Reported Symptoms / Problem:</span>
                                        <p className="text-xs font-medium text-gray-600 italic">
                                            {`"${appointment.patientProblem || 'No descriptions added.'}"`}
                                        </p>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* ================= RESCHEDULE MODAL ================= */}
                {isModalOpen && activeAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <Card className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full space-y-4 border border-[#FFCEE3]">
                            <div>
                                <h3 className="text-lg font-black text-[#021A54]">Reschedule Appointment</h3>
                                <p className="text-xs text-gray-400 mt-1">Modifying session with {activeAppointment?.doctorName}</p>
                            </div>

                            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Pick New Date</label>
                                    <Input 
                                        type="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]} 
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="font-bold"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">Select Time Slot</label>
                                    <Input 
                                        type="text"
                                        required
                                        placeholder="Enter time e.g., 04:30 PM"
                                        value={newSlot}
                                        onChange={(e) => setNewSlot(e.target.value)}
                                        className="font-bold text-black"
                                    />
                                </div>

                                <div className="pt-2 flex justify-end gap-2">
                                    <Button 
                                        type="button" 
                                        size="sm"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setActiveAppointment(null);
                                        }} 
                                        className="bg-gray-100 text-gray-500 font-bold rounded-xl"
                                    >
                                        Close
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        size="sm"
                                        className="bg-[#FF85BB] text-white font-black rounded-xl px-5 shadow-md"
                                    >
                                        Update Schedule 🚀
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                )}

            </div>
        </div>
    ); 
}