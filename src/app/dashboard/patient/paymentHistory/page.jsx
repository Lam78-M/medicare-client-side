'use client'
import React, { useEffect, useState } from 'react';
import { Avatar, Chip, Spinner, Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';
import Image from 'next/image';

const PaymentHistoryTable = () => {
    const { data: session, isPending: isSessionLoading } = authClient.useSession();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (!session?.user?.email) return;
            
            try {
                const tokenData = await authClient.token();
                const token = tokenData?.token;

                const res = await fetch(`http://localhost:5000/api/appointments?email=${session.user.email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                         authorization: `Bearer ${tokenData?.token}`
                    }
                });
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    setAppointments(data);
                } else {
                    setAppointments([]);
                }
            } catch (error) {
                console.error("Error fetching payment history:", error);
                toast.error("Failed to load payment history! ❌");
            } finally {
                setLoading(false);
            }
        };

        if (!isSessionLoading) {
            fetchPaymentHistory();
        }
    }, [session, isSessionLoading]);

    if (loading || isSessionLoading)
  
    {
        return (
            <div className="flex justify-center items-center py-20 min-h-[300px]">
                <Spinner size="lg" color="pink" label="Loading Payment History..." />
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <div className="mb-6 px-2">
                <h3 className="text-2xl font-bold text-[#021A54]">👑 Payment & Booking History</h3>
                <p className="text-xs text-gray-400 font-medium">List of doctors you booked and direct link options for rapid checkouts.</p>
            </div>

            <div className="overflow-x-auto w-full rounded-2xl border border-gray-100">
                <table className="w-full text-left border-collapse bg-white">
                    <thead>
                        <tr className="bg-gray-50/70 border-b border-gray-100 text-[#021A54] text-xs font-bold uppercase tracking-wider">
                            <th className="p-4">Doctor</th>
                            <th className="p-4">Specialization</th>
                            <th className="p-4">Appointment Date</th>
                            <th className="p-4">Consultation Fee</th>
                            <th className="p-4">Payment Status</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-black">
                        {appointments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-sm font-medium text-gray-400 italic">
                                    No payment history found.
                                </td>
                            </tr>
                        ) : (
                            appointments.map((appointment) => {
                                const currentId = appointment._id || appointment.id;
                                
                                return (
                                    <tr key={currentId} className="hover:bg-gray-50/40 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                              <div className="relative border border-pink-100 rounded-xl overflow-hidden w-10 h-10 min-w-[40px] bg-gray-50 flex items-center justify-center">
    <Image
        alt={appointment.doctorName || "Doctor Profile"}
        src={appointment.doctorImage || "https://via.placeholder.com/150"}
        fill
        sizes="40px"
        className="object-cover"
        priority={false}
    />
</div>
                                                <div className="flex flex-col text-left">
                                                    <p className="text-sm font-bold text-[#021A54] leading-tight">
                                                        {appointment.doctorName}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate max-w-[180px]">
                                                        🏢 {appointment.hospitalName || "Hospital Chamber"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                                                {appointment.specialization}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-gray-700">{appointment.appointmentDate}</p>
                                                <p className="text-[11px] text-gray-400 font-medium">{appointment.appointmentTime}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-black text-[#FF85BB]">
                                                ৳ {appointment.consultationFee}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            {/* 🎯 SHOB ROW-TE DIRECT "✅ PAID" CHIP */}
                                            <Chip
                                                className="capitalize font-extrabold text-xs px-2.5 py-1 rounded-xl"
                                                color="success"
                                                size="sm"
                                                variant="solid"
                                            >
                                                ✅ Paid
                                            </Chip>
                                        </td>
                                        <td className="p-4 text-center">
                                            {/* 🎯 CUSTOM BLUE COLOURED PALETTE - PAYMENT SUCCESS BUTTON */}
                                            <Button
                                                size="sm"
                                                disabled
                                                className="bg-[#021A54] text-white font-bold text-xs rounded-xl cursor-default opacity-100 shadow-sm border border-blue-900 px-4"
                                            >
                                                Payment Successful 🎉
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 flex justify-end px-4 text-base font-bold text-[#021A54] border-t border-gray-50 pt-4">
                Total Bookings: <span className="ml-1.5 font-black text-[#FF85BB]">{appointments.length}</span>
            </div>
        </div>
    );
};

export default PaymentHistoryTable;