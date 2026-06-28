"use client";

import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from "@heroui/react"; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { authClient } from "@/lib/auth-client"; 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Recharts3Page() {
    const { data: session, isPending } = authClient.useSession();
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isPending && session?.user?.email) {
            setLoading(true);
            fetch(`http://localhost:5000/api/appointments/patient?email=${session.user.email}`)
                .then((res) => res.json())
                .then((data) => {
                    // যদি ব্যাকএন্ডে ডেটা থাকে, তাহলে সেটা প্রসেস করবে
                    if (Array.isArray(data) && data.length > 0) {
                        const counts = {};
                        data.forEach((app) => {
                            const date = app.appointmentDate || app.date; // দুটাই চেক করলাম
                            if (date) {
                                counts[date] = (counts[date] || 0) + 1;
                            }
                        });

                        const formattedData = Object.keys(counts)
                            .map((date) => ({
                                date: date,
                                count: counts[date]
                            }))
                            .sort((a, b) => new Date(a.date) - new Date(b.date));

                        setChartData(formattedData);
                    } else {
                        // 🌟 যদি ব্যাকএন্ডে ডেটা না থাকে, তবে চার্ট দেখার জন্য এই ডামি ডেটা শো করবে
                        const dummyData = [
                            { date: '2026-06-20', count: 1 },
                            { date: '2026-06-22', count: 3 },
                            { date: '2026-06-23', count: 2 },
                            { date: '2026-06-25', count: 5 },
                            { date: '2026-06-26', count: 4 },
                            { date: '2026-06-27', count: 6 },
                        ];
                        setChartData(dummyData);
                    }
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching data for chart:", err);
                    // এরর খেলেও চার্ট যাতে ভেঙে না যায়, ডামি ডেটা সেট করে দিচ্ছি
                    const dummyData = [
                        { date: '2026-06-20', count: 2 },
                        { date: '2026-06-22', count: 4 },
                        { date: '2026-06-25', count: 1 },
                        { date: '2026-06-27', count: 5 },
                    ];
                    setChartData(dummyData);
                    setLoading(false);
                });
        } else if (!isPending && !session) {
            setLoading(false);
        }
    }, [session, isPending]);

    if (isPending || (loading && session)) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <Spinner size="lg" style={{ color: '#021A54' }} label="Loading chart analytics..." />
            </div>
        );
    }

    if (!session || !session.user) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5] p-4">
                <Alert 
                    variant="flat" 
                    color="danger" 
                    title="Access Denied" 
                    description="Please login with Better Auth to view your secure clinical dashboard." 
                    className="max-w-md rounded-2xl font-bold bg-white border-l-4 border-red-500 shadow-sm"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F5] py-10 px-4 sm:px-6 lg:px-8 w-full flex items-center justify-center">
            <ToastContainer />
            
            <Card className="bg-white p-6 sm:p-8 rounded-[32px] shadow-sm border border-gray-100 max-w-3xl w-full">
                <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-black text-[#021A54] tracking-tight">
                        Appointment Timeline
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                        Tracking scheduled sessions per date for <span className="text-[#FF85BB] font-bold">{session.user.email}</span>
                    </p>
                </div>

                <div className="w-full h-[320px] pr-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.01}/>
                                </linearGradient>
                            </defs>
                            
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                vertical={false} 
                                stroke="#E5E7EB" 
                            />
                            
                            <XAxis 
                                dataKey="date" 
                                axisLine={true}
                                tickLine={true}
                                tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 'bold' }}
                                dy={10}
                            />
                            
                            <YAxis 
                                axisLine={true}
                                tickLine={true}
                                tick={{ fill: '#9CA3AF', fontSize: 13, fontWeight: 'medium' }}
                                allowDecimals={false}
                                dx={-5}
                            />
                            
                            <Tooltip 
                                contentStyle={{ 
                                    borderRadius: '16px', 
                                    border: '1px solid #E5E7EB',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                                }}
                            />
                            
                            <Area 
                                type="monotone" 
                                dataKey="count" 
                                name="Appointments"
                                stroke="#10B981" 
                                strokeWidth={2.5}
                                fillOpacity={1} 
                                fill="url(#colorCount)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}