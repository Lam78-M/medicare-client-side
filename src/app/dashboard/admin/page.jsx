"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Activity, DollarSign, RefreshCw } from "lucide-react"; // 💵 Suspended আইকনের বদলে DollarSign নেওয়া হলো
import DoctorRecharts from "./doctorsRecharts.jsx/page";
import { authClient } from "@/lib/auth-client";

export default function DashboardOverview() {
    const [users, setUsers] = useState([]);
    const [verifiedDoctorsCount, setVerifiedDoctorsCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0); // 💰 টোটাল ভলিউমের স্টেট
    const [txCount, setTxCount] = useState(0); // 📊 মোট পেইড ট্রানজেকশনের স্টেট
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            const tokenData = await authClient.token();
            const token = tokenData?.token;

            // 🔄 ৩টি API একসাথে প্যারালালি কল করা হচ্ছে (সুপার ফাস্ট পারফরম্যান্স)
            const [usersRes, doctorsRes, appointmentsRes] = await Promise.all([
                fetch(`http://localhost:5000/api/admin/all-user`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }
                }),
                fetch(`http://localhost:5000/api/admin/pending-doctors`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` }
                }),
                fetch(`http://localhost:5000/api/appointments`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                })
            ]);

            const usersData = await usersRes.json();
            const doctorsData = await doctorsRes.json();
            const appointmentsData = await appointmentsRes.json();

            // ১. ইউজার স্টেট সেট
            if (Array.isArray(usersData)) {
                setUsers(usersData);
            }

            // ২. ভেরিফাইড ডক্টর কাউন্ট সেট
            if (Array.isArray(doctorsData)) {
                const verifiedCount = doctorsData.filter(
                    (doc) => doc.verificationStatus?.toLowerCase() === "verified"
                ).length;
                setVerifiedDoctorsCount(verifiedCount);
            }

            // ৩. পেমেন্ট ডাটা প্রসেস ও স্টেট সেট
            if (Array.isArray(appointmentsData)) {
                const revenue = appointmentsData.reduce((sum, app) => sum + (Number(app.consultationFee) || 0), 0);
                setTotalRevenue(revenue);
                setTxCount(appointmentsData.length);
            }

        } catch (err) {
            console.error("Error fetching dashboard analytics data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-[#021A54]">Loading Dashboard Metrics...</div>;

    const totalUsers = users.length;
    const totalPatients = users.filter(user => (user.role || "patient").toLowerCase() === "patient").length;
    const totalAdmins = users.filter(user => user.role?.toLowerCase() === "admin").length;
    const activeUsers = users.filter(user => (user.status || "active") === "active").length;

    // 🗂️ কার্ড ডেটা লিস্ট
    const cardsData = [
        {
            title: "Total Patients",
            count: totalPatients,
            icon: <Users size={22} />,
            bgColor: "#FFCEE3", 
            textColor: "#021A54",
            description: "Registered medical service receivers"
        },
        {
            title: "Verified Doctors",
            count: verifiedDoctorsCount,
            icon: <UserCheck size={22} />,
            bgColor: "#021A54", 
            textColor: "#ffffff",
            description: "Active clinical ecosystem experts"
        },
        {
            title: "Active Users",
            count: activeUsers,
            icon: <Activity size={22} />,
            bgColor: "#ffffff", 
            textColor: "#021A54",
            description: "Currently active accounts on hub",
            border: "1px solid #e5e7eb"
        },
        // 🎯 এখানে Suspended Accounts সরিয়ে পেমেন্ট ভলিউম কার্ড দেওয়া হলো
        {
            title: "Total Volume",
            count: `৳ ${totalRevenue.toLocaleString()}`, // 👈 সুন্দর করে ফরম্যাট করা অ্যামাউন্ট
            icon: <DollarSign size={22} />,
            bgColor: "#fee2e2", // হালকা লালচে/গোলাপী ব্যাকগ্রাউন্ড ব্যাকআপ রাখা হলো
            textColor: "#ef4444",
            description: `${txCount} Total entries successfully checked out` // 👈 মোট ট্রানজেকশন কাউন্ট ডেসক্রিপশনে দিয়ে দেওয়া হলো
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
     <div>
            <div className="py-6 px-4 md:px-8" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 border-b border-gray-200 pb-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-[#021A54]">Ecosystem Analytics</h1>
                            <p className="text-sm text-gray-500 mt-1">Real-time overview of users, clinical roles, and account statuses.</p>
                        </div>
                        <span className="text-white font-black text-sm px-4 py-1.5 rounded-full shadow-sm" style={{ backgroundColor: '#021A54' }}>
                            Total Database Rows: {totalUsers}
                        </span>
                    </div>

                    {/* 🗂️ গ্রিড লেআউটে ওভারভিউ কার্ডস */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
                    >
                        {cardsData.map((card, index) => (
                            <motion.div
                                key={index}
                                variants={cardVariants}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="p-6 rounded-3xl shadow-sm flex flex-col justify-between transition-all relative overflow-hidden group cursor-pointer border border-gray-100"
                                style={{ 
                                    backgroundColor: card.bgColor, 
                                    color: card.textColor,
                                    border: card.border 
                                }}
                            >
                                <div 
                                    className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500"
                                    style={{ backgroundColor: '#FF85BB' }}
                                />

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-xs uppercase tracking-wider font-black opacity-80">{card.title}</p>
                                        <div className="p-2.5 rounded-xl bg-black/5 group-hover:bg-[#FF85BB] group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                                            {card.icon}
                                        </div>
                                    </div>
                                    {/* 💡 এখানে টেক্সটের সাইজ একটু ব্যালেন্স করা হয়েছে যাতে বড় টাকার ফিগার সুন্দরভাবে ধরে যায় */}
                                    <h2 className="text-2xl md:text-3xl font-black mb-1 tracking-tight">
                                        {card.count}
                                    </h2>
                                </div>
                                
                                <p className="text-[11px] font-medium opacity-60 mt-4 leading-relaxed">
                                    {card.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* 📊 কুইক স্ট্যাটাস সেকশন */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h3 className="font-extrabold text-base text-[#021A54]">System Management Notice</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Currently there are <span className="font-bold text-[#021A54]">{totalAdmins} Admins</span> managing the Clinical Hub.</p>
                        </div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => loadDashboardData()}
                            className="text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm active:scale-95 cursor-pointer flex items-center gap-2 bg-[#021A54] hover:bg-[#FF85BB]"
                        >
                            <RefreshCw size={14} className="animate-spin-slow" />
                            Refresh Live Metrics
                        </motion.button>
                    </div>

                </div>
            </div>

            {/* 📊 চার্ট কম্পোনেন্ট */}
            <div className="px-4 md:px-8 pb-10">
                <div className="max-w-6xl mx-auto">
                    <DoctorRecharts />
                </div>
            </div>
     </div>
    );
}