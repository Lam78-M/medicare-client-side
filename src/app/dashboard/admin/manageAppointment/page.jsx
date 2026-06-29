"use client";

import React, { useEffect, useState } from 'react';
import { Spinner, Chip } from "@heroui/react"; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { authClient } from "@/lib/auth-client"; 

export default function AdminAppointmentDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAllAppointments = async () => {
        setLoading(true);
        try {
      
            const tokenData = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/appointments`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}` 
                }
            });
            const data = await res.json();
            
            setAppointments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching all appointments:", err);
            toast.error("Failed to fetch system records! ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAppointments();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner size="lg" style={{ color: '#FF85BB' }} label="Fetching all system bookings..." />
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 max-w-6xl mx-auto my-6">
            <ToastContainer />

       
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 mb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#021A54] tracking-tight">Admin Booking Directory</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Showing all real-time patient requests across the system</p>
                </div>
                <Chip size="md" className="bg-[#021A54] text-white font-bold px-3 py-1">
                    Total Bookings: {appointments.length}
                </Chip>
            </div>

            {/*  Responsive Container */}
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                <table className="w-full border-collapse text-left min-w-[800px]"> 
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="p-4 text-[#021A54] font-black text-xs uppercase tracking-wider rounded-l-2xl whitespace-nowrap">PATIENT NAME & EMAIL</th>
                            <th className="p-4 text-[#021A54] font-black text-xs uppercase tracking-wider whitespace-nowrap">DOCTOR NAME</th>
                            <th className="p-4 text-[#021A54] font-black text-xs uppercase tracking-wider whitespace-nowrap">SPECIALIZATION</th>
                            <th className="p-4 text-[#021A54] font-black text-xs uppercase tracking-wider whitespace-nowrap">DATE & DAY</th>
                            <th className="p-4 text-[#021A54] font-black text-xs uppercase tracking-wider whitespace-nowrap">TIME</th>
                            <th className="p-4 text-[#021A54] font-black text-xs uppercase tracking-wider whitespace-nowrap">FEE</th>
                            <th className="p-4 text-[#021A54] font-black text-xs uppercase tracking-wider text-center rounded-r-2xl whitespace-nowrap">STATUS</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-16 text-center text-gray-400 font-bold italic">
                                    No booking records available in the database currently.
                                </td>
                            </tr>
                        ) : (
                            appointments.map((appointment, index) => {
                                const currentId = appointment?._id?.$oid || appointment?._id || `row-${index}`;
                                
                                return (
                                    <tr key={currentId} className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors duration-200">
                                        
                                   
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="font-extrabold text-gray-800 text-sm">{appointment.userName || "Anonymous"}</div>
                                            <div className="text-[11px] text-gray-400 font-medium">{appointment.userEmail || "No Email"}</div>
                                        </td>

                         
                                        <td className="p-4 font-bold text-gray-700 text-sm whitespace-nowrap">
                                            {appointment.doctorName || "N/A"}
                                        </td>

                                 
                                        <td className="p-4 whitespace-nowrap">
                                            <Chip size="sm" className="font-bold text-[10px] bg-[#FFCEE3] text-[#021A54]">
                                                {appointment.specialization || "General"}
                                            </Chip>
                                        </td>
                                        
                                    
                                        <td className="p-4 text-sm font-bold text-gray-700 whitespace-nowrap">
                                            🗓️ {appointment.appointmentDate}
                                            <span className="block text-[10px] text-gray-400 uppercase font-medium mt-0.5">{appointment.appointmentDay}</span>
                                        </td>
                                        
                                   
                                        <td className="p-4 text-sm font-black text-gray-600 whitespace-nowrap">
                                            🕒 {appointment.appointmentTime}
                                        </td>
                                        
                     
                                        <td className="p-4 text-sm font-black text-[#FF85BB] whitespace-nowrap">
                                            ৳{appointment.consultationFee}
                                        </td>
                        
                                        <td className="p-4 text-center whitespace-nowrap">
                                            <Chip size="sm" variant="flat" className={`font-black text-[10px] shadow-sm mx-auto ${
                                                appointment.status === 'Approved' 
                                                    ? 'bg-green-50 text-green-700 border border-green-200' 
                                                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                                            }`}>
                                                {appointment.status || 'Pending'}
                                            </Chip>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    ); 
}