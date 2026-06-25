"use client";

import React, { useEffect, useState } from 'react';
// 🌟 STEP 1: Tomar project-er Better Auth client instance import koro
// Path-ta dhorlam "@/lib/auth-client" (Tomar prothone onno location hole thik kore nio)
import { authClient } from "@/lib/auth-client"; 

export default function AppointmentPage() {
    // 🌟 STEP 2: Better Auth hook theke session data nilam
    const { data: session, isPending } = authClient.useSession();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Better Auth jotokkhon loading line-e ache totokkhon logic break korbe na
        if (isPending) return;

        // User login thakle tar email diye fetch korbe
        if (session?.user?.email) {
            fetch(`http://localhost:5000/api/appointments/patient?email=${session.user.email}`)
                .then((res) => res.json())
                .then((data) => {
                    setAppointments(Array.isArray(data) ? data : []);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching data:", err);
                    setLoading(false);
                });
        } else {
            // User login na thakle loading false kore dibe layout blocker layer open thakar jonno
            setLoading(false);
        }
    }, [session, isPending]); // Session load ba change hole trigger hobe

    // Better Auth runtime pending checking or component fetch loader
    if (isPending || (loading && session)) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <div className="text-xl font-bold text-[#021A54] animate-pulse">
                    Synchronizing Better Auth session...
                </div>
            </div>
        );
    }

    // Access wall: Jodi kono user login na thake
    if (!session || !session.user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <div className="bg-white p-8 rounded-2xl shadow-md border border-red-200 text-center text-red-500 font-bold">
                    Access Denied. Please Sign In first! 🔒
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#021A54]">
                        My Appointments
                    </h1>
                    <p className="text-gray-500 mt-2 text-xs sm:text-sm md:text-base">
                        Patient Account: <span className="font-bold text-[#FF85BB]">{session.user.email}</span>
                    </p>
                </div>
                
                {/* Responsive Table Wrapper */}
                <div className="overflow-hidden shadow-xl rounded-2xl border border-[#FFCEE3] bg-white">
                    <div className="overflow-x-auto w-full scrollbar-thin">
                        <table className="min-w-full divide-y divide-[#FFCEE3] table-auto">
            
            {/* Table Header */}
            <thead className="bg-[#021A54] text-white">
                <tr>
                    <th className="py-4 px-4 sm:px-6 text-left font-semibold uppercase text-[10px] sm:text-xs tracking-wider">Doctor Name</th>
                    <th className="py-4 px-4 sm:px-6 text-left font-semibold uppercase text-[10px] sm:text-xs tracking-wider">Date & Day</th>
                    <th className="py-4 px-4 sm:px-6 text-left font-semibold uppercase text-[10px] sm:text-xs tracking-wider">Time</th>
                    <th className="py-4 px-4 sm:px-6 text-left font-semibold uppercase text-[10px] sm:text-xs tracking-wider">Fee</th>
                    <th className="py-4 px-4 sm:px-6 text-left font-semibold uppercase text-[10px] sm:text-xs tracking-wider">Status</th>
                </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-100 text-gray-700 text-xs sm:text-sm">
                {appointments.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="py-12 text-center text-gray-400 font-medium">
                            No appointments found for this account.
                        </td>
                    </tr>
                ) : (
                    appointments.map((appointment, index) => {
         if (!appointment) return null;
         const currentId = appointment._id?.$oid || appointment._id || `row-${index}`;
         
         return (
             <tr key={currentId} className="hover:bg-[#F5F5F5] transition-colors">
                 
                 {/* Doctor Name */}
                 <td className="py-4 px-4 sm:px-6 font-bold text-[#021A54] whitespace-nowrap">
                     {appointment.doctorName}
                 </td>
                 
                 {/* Date & Day */}
                 <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                     <span className="block font-medium text-gray-800">{appointment.appointmentDate}</span>
                     <span className="text-[10px] sm:text-xs text-gray-400">{appointment.appointmentDay}</span>
                 </td>
                 
                 {/* Time */}
                 <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-medium text-gray-600">
                     {appointment.appointmentTime}
                 </td>
                 
                 {/* Fee */}
                 <td className="py-4 px-4 sm:px-6 whitespace-nowrap font-bold text-[#021A54]">
                     ৳{appointment.consultationFee}
                 </td>
                 
                 {/* Status Badge */}
                 <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                     <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                         appointment.status === 'Approved' 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-[#FFCEE3] text-[#FF85BB]'
                     }`}>
                         <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                             appointment.status === 'Approved' ? 'bg-green-500' : 'bg-[#FF85BB]'
                         }`}></span>
                         {appointment.status || 'Pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}