"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, Chip, Spinner } from "@heroui/react";
import { toast } from 'react-toastify'; 
// 🟢 তোমার Better Auth ক্লায়েন্ট হেল্পারটি এখানে ইম্পোর্ট করো
import { authClient } from "@/lib/auth-client"; 
import Link from 'next/link';

export default function DoctorAppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 🟢 Better Auth থেকে কারেন্ট লগইন থাকা ইউজারের সেশন ডাটা নেওয়া হচ্ছে
    const { data: session, isPending } = authClient.useSession();
    
    // সেশন থেকে ডাক্তারের ইমেইলটি বের করা হচ্ছে
    const doctorEmail = session?.user?.email;

    // 🔄 Fetch Doctor's Specific Appointments
    const fetchAppointments = () => {
        if (!doctorEmail) {
            console.log("❌ Better Auth থেকে এখনও কোনো ইমেইল পাওয়া যায়নি!");
            return;
        }
        
        setLoading(true);
        
        const cleanedEmail = doctorEmail.trim().toLowerCase();
        console.log("📡 এই ইমেইল দিয়ে ব্যাকএন্ডে রিকোয়েস্ট পাঠানো হচ্ছে:", cleanedEmail);

        fetch(`http://localhost:5000/api/appointments/doctor?email=${cleanedEmail}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                console.log("📥 ব্যাকএন্ড থেকে আসা ডেটা:", data); 
                setAppointments(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setLoading(false);
            });
    };

    // যখনই Better Auth সেশন থেকে ইমেইল পাবে, তখনই ডাটা ফেচ হবে
    useEffect(() => {
        if (doctorEmail) {
            fetchAppointments();
        }
    }, [doctorEmail]);

    // ✅ Approve Appointment Handler
    const handleApprove = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/appointments/approve/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Appointment Approved! 🎉");
                fetchAppointments(); // স্ট্যাটাস পরিবর্তন শেষে স্ক্রিনের ডাটা সাথে সাথে রিফ্রেশ করবে
            } else {
                toast.error(data.message || "Failed to approve appointment. ⚠️");
            }
        } catch (error) {
            console.error("Approval error:", error);
            toast.error("Error updating status 🌐");
        }
    };

    // Better Auth সেশন লোড হওয়া পর্যন্ত বা ডাটা ফেচ হওয়া পর্যন্ত স্পিনার দেখাবে
    if (isPending || (loading && doctorEmail)) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#021A54]"></span>
            </div>
        );
    }

    // যদি কেউ লগইন না করে এই পেজে আসে
    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <Card className="p-8 text-center font-bold text-red-500 rounded-3xl shadow-sm">
                    ⚠️ Please log in as a doctor first!
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-10 px-4 sm:px-6 lg:px-8 w-full relative">
            <div className="max-w-5xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-[#021A54] tracking-tight">
                        Doctor's Patient Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                      Welcome, {session.user.name}! Your bookings are listed below.
                    </p>
                </div>
                
                {/* Appointments List */}
                <div className="space-y-4">
                    {appointments.length === 0 ? (
                        <Card className="p-12 text-center text-gray-400 font-bold bg-white rounded-3xl shadow-sm border-none">
                            There are currently no registered appointments for you.
                        </Card>
                    ) : (
                        appointments.map((appointment, index) => {
                            if (!appointment) return null; 
                            
                            const appId = appointment?._id?.$oid || appointment?._id;
                            const uniqueKey = appId || `app-key-${index}`;
                            const isApproved = appointment.status === 'Approved';

                            return (
                                <Card key={uniqueKey} className="bg-white p-5 rounded-3xl shadow-sm border-none hover:shadow-md transition-all duration-300">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                        
                                        {/* Left Side: Patient Info */}
                                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 text-xl">
                                                👤
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-lg text-[#021A54]">
                                                    {appointment.userName || "Unknown Patient"}
                                                </h3>
                                                <p className="text-xs text-gray-400">
                                                    📧 {appointment.userEmail || "No Email Provided"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Center Panel: Date/Time */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 w-full lg:w-auto border-t border-b border-gray-50 py-3 lg:border-none lg:py-0">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Appointment Date</p>
                                                <p className="text-sm font-bold text-gray-800">🗓️ {appointment.appointmentDate}</p>
                                                <p className="text-[11px] font-medium text-gray-400">{appointment.appointmentDay}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Time Slot</p>
                                                <p className="text-sm font-black text-gray-700">🕒 {appointment.appointmentTime}</p>
                                            </div>
                                            <div className="col-span-2 md:col-span-1">
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Status</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Chip size="sm" variant="flat" className={`font-black text-[10px] ${
                                                        isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                        {appointment.status || 'Pending'}
                                                    </Chip>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 🎯 Right Side: Action Buttons (ডায়নামিক লজিক) */}
                                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end ml-auto lg:ml-0">
                                            {!isApproved ? (
                                                // ১. স্ট্যাটাস Approved না হলে শুধুমাত্র এই সবুজ বাটনটি দেখাবে
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleApprove(appId)}
                                                    className="bg-green-600 text-white font-bold text-xs rounded-xl px-4 py-4 shadow-sm hover:opacity-90"
                                                >
                                                    Approve ✅
                                                </Button>
                                            ) : (
                                                // ২. স্ট্যাটাস Approved হয়ে গেলে বাটন চেঞ্জ হয়ে এই নতুন লিংক বাটনটি দেখাবে
                                                <Link
                                                    href={`/dashboard/doctors/prescription?patientName=${encodeURIComponent(appointment.userName || "Unknown Patient")}`}
                                                    className="bg-[#021A54] text-white font-bold text-xs rounded-xl px-4 py-2.5 hover:opacity-90 flex items-center justify-center transition-all shadow-sm"
                                                >
                                                    Mark as Completed / Prescribe 📝
                                                </Link>
                                            )}
                                        </div>

                                    </div>

                                    {/* Patient Problem Note */}
                                    <div className="mt-3 bg-gray-50/50 rounded-2xl p-3 border border-gray-100">
                                        <span className="text-[10px] uppercase font-black text-gray-400 block mb-0.5">Patient's Problem / Symptoms:</span>
                                        <p className="text-xs font-medium text-gray-600 italic">
                                            {`"${appointment.patientProblem || 'No descriptions added.'}"`}
                                        </p>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    ); 
}