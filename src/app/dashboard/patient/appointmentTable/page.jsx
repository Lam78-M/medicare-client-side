"use client";

import React, { useEffect, useState } from 'react';

export default function AppointmentPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dynamic logged-in patient email
    const userEmail = "patient@example.com"; 

    useEffect(() => {
        // Fetching data from your Express backend
        fetch(`http://localhost:5000/api/appointments/patient?email=${userEmail}`)
            .then((res) => res.json())
            .then((data) => {
                setAppointments(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
                setLoading(false);
            });
    }, [userEmail]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <div className="text-xl font-bold text-[#021A54] animate-pulse">
                    Loading appointments...
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
                        View and track your scheduled medical consultations
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
                    No appointments found for this email.
                </td>
            </tr>
        ) : (
            appointments.map((appointment) => (
                <tr key={appointment._id?.$oid || appointment._id} className="hover:bg-[#F5F5F5] transition-colors">
                    
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
            ))
        )}
    </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}