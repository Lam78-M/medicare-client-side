"use client";

import React, { useState, useEffect } from "react";
// 🎯 Framer Motion ইমপোর্ট করা হলো এনিমেশনের জন্য
import { motion } from "framer-motion";
// 🎯 Lucide React থেকে আইকনগুলো নেওয়া হলো
import { Users, UserCheck, Activity, ShieldAlert, RefreshCw } from "lucide-react";
import DoctorRecharts from "./doctorsRecharts.jsx/page";

export default function DashboardOverview() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // সব ইউজার লোড করার ফাংশน
    const loadUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/admin/all-users");
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (err) {
            console.error("Error fetching users for dashboard", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-[#021A54]">Loading Dashboard Metrics...</div>;

    // 📊 ডাটাবেজের ইউজার ফিল্টার করে মেটট্রিক্স হিসাব করা
    const totalUsers = users.length;
    const totalPatients = users.filter(user => (user.role || "patient").toLowerCase() === "patient").length;
    const totalDoctors = users.filter(user => user.role?.toLowerCase() === "doctor").length;
    const totalAdmins = users.filter(user => user.role?.toLowerCase() === "admin").length;
    
    const activeUsers = users.filter(user => (user.status || "active") === "active").length;
    const suspendedUsers = users.filter(user => user.status === "suspended").length;

    // 🎨 কার্ডের জন্য ডাটা অ্যারে তৈরি (লুসিড আইকন সহ)
    const cardsData = [
        {
            title: "Total Patients",
            count: totalPatients,
            icon: <Users size={22} />,
            bgColor: "#FFCEE3", // লাইট পিঙ্ক
            textColor: "#021A54",
            description: "Registered medical service receivers"
        },
        {
            title: "Verified Doctors",
            count: totalDoctors,
            icon: <UserCheck size={22} />,
            bgColor: "#021A54", // নেভি ব্লু
            textColor: "#ffffff",
            description: "Active clinical ecosystem experts"
        },
        {
            title: "Active Users",
            count: activeUsers,
            icon: <Activity size={22} />,
            bgColor: "#ffffff", // হোয়াইট
            textColor: "#021A54",
            description: "Currently active accounts on hub",
            border: "1px solid #e5e7eb"
        },
        {
            title: "Suspended Accounts",
            count: suspendedUsers,
            icon: <ShieldAlert size={22} />,
            bgColor: "#fee2e2", // হালকা লাল
            textColor: "#ef4444",
            description: "Temporarily restricted system profiles"
        }
    ];

    // Framer Motion কন্টেইনার এনিমেশন কনফিগ
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
            {/* 🛠️ এখানে py-10 থেকে কমিয়ে py-6 করা হয়েছে যেন অতিরিক্ত স্পেস না নেয় */}
            <div className="py-6 px-4 md:px-8" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    {/* 🛠️ mb-8 থেকে কমিয়ে mb-6 করা হয়েছে */}
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
                    {/* 🛠️ mb-10 থেকে কমিয়ে mb-6 করা হয়েছে */}
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
                                {/* ব্যাকগ্রাউন্ড সার্কেল ইফেক্ট */}
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
                                    <h2 className="text-3xl md:text-4xl font-black mb-1">
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
                            onClick={() => loadUsers()}
                            className="text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm active:scale-95 cursor-pointer flex items-center gap-2"
                            style={{ backgroundColor: '#021A54' }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#FF85BB'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#021A54'}
                        >
                            <RefreshCw size={14} className="animate-spin-slow" />
                            Refresh Live Metrics
                        </motion.button>
                    </div>

                </div>
            </div>
            {/* 🛠️ চাইল্ড কম্পোনেন্টের নিজের যদি কোনো অভ্যন্তরীণ টপ মার্জিন থাকে, তবে তা এই ডিভের নিচে সুন্দরভাবে প্লেস হবে */}
            <div className="px-4 md:px-8 pb-10">
                <div className="max-w-6xl mx-auto">
                    <DoctorRecharts />
                </div>
            </div>
     </div>
    );
}