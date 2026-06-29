"use client";

import React, { useEffect, useState } from 'react';
import { Button, Card, Chip } from "@heroui/react";
import { toast } from 'react-toastify'; 

import { authClient } from "@/lib/auth-client"; 
import Link from 'next/link';

export default function DoctorAppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    
  
    const { data: session, isPending } = authClient.useSession();
    const doctorEmail = session?.user?.email;

const fetchAppointments = async () => {
    if (!doctorEmail) {
        console.log("❌ Better Auth থেকে এখনও কোনো ইমেইল পাওয়া যায়নি!");
        return;
    }
    
    setLoading(true);
    const cleanedEmail = doctorEmail.trim().toLowerCase();

    try {
        const tokenData = await authClient.token();
        const token = tokenData?.token;

        fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/appointments/doctor?email=${cleanedEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then((data) => {
            setAppointments(Array.isArray(data) ? data : []);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching data:", err);
            setLoading(false);
        });

    } catch (tokenErr) {
        console.error("Error fetching token:", tokenErr);
        setLoading(false);
    }
};

useEffect(() => {
    if (doctorEmail) {
        fetchAppointments();
    }
}, [doctorEmail]);

   
    const handleApprove = async (id) => {
        try {
            const tokenData = await authClient.token();
        const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/appointments/approve/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json',
                     authorization: `Bearer ${token}`
                 }
            });
            
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success("Appointment Approved! 🎉");
                fetchAppointments(); 
            } else {
                toast.error(data.message || "Failed to approve appointment. ⚠️");
            }
        } catch (error) {
            console.error("Approval error:", error);
            toast.error("Error updating status 🌐");
        }
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Are you sure you want to cancel/delete this appointment? ⚠️")) {
            return;
        }

        try {
            const tokenData = await authClient.token();
        const token = tokenData?.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/appointments/delete/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json',
                     authorization: `Bearer ${token}`
                 }
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.error("Appointment Cancelled & Deleted! 🗑️");
                fetchAppointments(); 
            } else {
                toast.error(data.message || "Failed to delete appointment.");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Network connection error! 🌐");
        }
    };

    const currentDoctorEmail = doctorEmail?.trim().toLowerCase();
    
    const myFilteredAppointments = appointments.filter(app => {
        if (!app) return false;
        
        const appDoctorEmail = app.doctorEmail || app.doctor_email || app.email;
        
        if (appDoctorEmail && currentDoctorEmail) {
            return appDoctorEmail.trim().toLowerCase() === currentDoctorEmail;
        }
        return false; 
    });

    const pendingCount = myFilteredAppointments.filter(app => app.status !== "Approved").length;

    if (isPending || (loading && doctorEmail)) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#021A54]"></span>
            </div>
        );
    }

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
            <div className="max-w-5xl mx-auto space-y-6">
                

                <div className="text-center mb-4">
                    <h1 className="text-3xl font-black text-[#021A54] tracking-tight">
                        Doctor's Patient Dashboard
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm font-medium">
                      Welcome, <span className="text-[#021A54] font-bold">{session.user.name}</span>! Your bookings are listed below.
                    </p>
                </div>

                {/* Counter cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white p-5 rounded-3xl border-none shadow-sm flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center font-black text-xl">
                            ⏳
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending Requests</p>
                            <h2 className="text-2xl font-black text-orange-600">
                                {pendingCount} {pendingCount === 1 ? 'Patient Waiting' : 'Patients Waiting'}
                            </h2>
                        </div>
                    </Card>

                    <Card className="bg-white p-5 rounded-3xl border-none shadow-sm flex flex-row items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 border border-green-100 flex items-center justify-center font-black text-xl">
                            ✅
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Handled Bookings</p>
                            <h2 className="text-2xl font-black text-green-700">
                                {myFilteredAppointments.length} Registered
                            </h2>
                        </div>
                    </Card>
                </div>
                
                {/* Appointments List */}
                <div className="space-y-4">
                    {myFilteredAppointments.length === 0 ? (
                        <Card className="p-12 text-center text-gray-400 font-bold bg-white rounded-3xl shadow-sm border-none">
                            There are currently no registered appointments for you.
                        </Card>
                    ) : (
                        myFilteredAppointments.map((appointment, index) => {
                            const appId = appointment?._id?.$oid || appointment?._id;
                            const uniqueKey = appId || `app-key-${index}`;
                            const isApproved = appointment.status === 'Approved';

                            return (
                                <Card key={uniqueKey} className="bg-white p-5 rounded-3xl shadow-sm border-none hover:shadow-md transition-all duration-300">
                                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                        
                                        {/* Patient Info */}
                                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 text-xl">
                                                👤
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-lg text-[#021A54]">
                                                    {appointment.patientName || appointment.userName || "Unknown Patient"}
                                                </h3>
                                                <p className="text-xs text-gray-400">
                                                    📧 {appointment.patientEmail || appointment.userEmail || "No Email Provided"}
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

                   
                                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end ml-auto lg:ml-0">
                                            
                                  
                                            <Button 
                                                size="sm"
                                                variant="light"
                                                onClick={() => handleDelete(appId)}
                                                className="text-red-500 hover:bg-red-50 font-bold text-xs rounded-xl px-3 py-4 transition-all"
                                            >
                                                Cancel ❌
                                            </Button>

                                            {!isApproved ? (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleApprove(appId)}
                                                    className="bg-green-600 text-white font-bold text-xs rounded-xl px-4 py-4 shadow-sm hover:opacity-90"
                                                >
                                                    Approve ✅
                                                </Button>
                                            ) : (
                                                <Link
                                                    href={`/dashboard/doctors/prescription?appId=${encodeURIComponent(appId)}&patientName=${encodeURIComponent(appointment.patientName || appointment.userName || "Unknown Patient")}`}
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