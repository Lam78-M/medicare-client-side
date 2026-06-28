"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// 🎯 Framer Motion ইমপোর্ট করা হলো চমৎকার অ্যানিমেশনের জন্য
import { motion, AnimatePresence } from "framer-motion";
import { GiToken } from "react-icons/gi";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // সব ইউজার লোড করার ফাংশন
    const loadUsers = async () => {
        try {
            setLoading(true);
            const tokenData = await authClient.token();
        const token = tokenData?.token;

      const res = await fetch(`http://localhost:5000/api/admin/all-user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                 authorization: `Bearer ${tokenData?.token}`
            }
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        
        const data = await res.json();
        if (Array.isArray(data)) setUsers(data);
        
    } catch (err) {
        console.error("Error fetching users:", err);
        showToast("Failed to load users from server!", "error");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        loadUsers();
    }, []);

    // 🎯 কাস্টম থিম টোস্ট ফাংশন (নেভি ব্লু ও রোজ পিঙ্ক কম্বিনেশন)
    const showToast = (message, type = "success") => {
        const config = {
            position: "top-right",
            autoClose: 3000,
            style: {
                backgroundColor: '#021A54',
                color: '#ffffff',
                borderRadius: '12px',
                fontWeight: '600'
            },
            progressStyle: {
                backgroundColor: type === "success" ? '#FF85BB' : '#f87171'
            }
        };
        if (type === "success") toast.success(message, config);
        else toast.error(message, config);
    };

    // 🔄 Active / Suspend হ্যান্ডলার
    const toggleStatus = async (id, currentStatus) => {
        const nextStatus = currentStatus === "active" ? "suspended" : "active";
             const tokenData = await authClient.token();
        const token = tokenData?.token;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/update-user-status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json",
                    authorization: `Bearer ${tokenData?.token}`
                 },
                body: JSON.stringify({ id, status: nextStatus })
            });
            const data = await res.json();
            if (data.success) {
                showToast(`User account ${nextStatus === 'active' ? 'Activated' : 'Suspended'}! 🔄`, "success");
                setUsers(prevUsers =>
                    prevUsers.map(user => user._id === id ? { ...user, status: nextStatus } : user)
                );
            }
        } catch (err) {
            showToast("Failed to update status!", "error");
        }
    };

    // 🔴 Delete হ্যান্ডলার
    const handleDeleteUser = async (id) => {

             const tokenData = await authClient.token();
        const token = tokenData?.token;

        if (!confirm("Are you sure you want to permanently delete this user?")) return;
        try {
            const res = await fetch("http://localhost:5000/api/admin/delete-user", {
                method: "DELETE",
                headers: { "Content-Type": "application/json",
                    authorization: `Bearer ${tokenData?.token}`
                 },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                showToast("User deleted permanently! ❌", "error");
                setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
            }
        } catch (err) {
            showToast("Failed to delete user!", "error");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-[#021A54]">Loading User Profiles...</div>;

    return (
        <div className="min-h-screen py-10 px-4 md:px-8" style={{ backgroundColor: '#F5F5F5' }}>
            <ToastContainer />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#021A54]">User Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Monitor, suspend, or delete platform users (Admins, Doctors, Patients).</p>
                    </div>
                    <span className="text-white font-black text-sm px-4 py-1.5 rounded-full shadow-sm" style={{ backgroundColor: '#021A54' }}>
                        Total Users: {users.length}
                    </span>
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
                        <p className="text-gray-400 font-medium">No users found in the system.</p>
                    </div>
                ) : (
                    /* 📊 রেসপন্সিভ প্রিমিয়াম টেবিল লেআউট */
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr style={{ backgroundColor: '#021A54' }} className="text-white text-xs uppercase tracking-wider font-bold">
                                        <th className="py-4 px-6">User Details</th>
                                        <th className="py-4 px-6">Role</th>
                                        <th className="py-4 px-6">Contact Info</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium text-gray-700">
                                    <AnimatePresence>
                                        {users.map((user) => {
                                            const isSuspended = user.status === "suspended";

                                            return (
                                                <motion.tr 
                                                    key={user._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: isSuspended ? 0.65 : 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -50 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
                                                >
                                                    {/* ইউজার ইমেজ ও নাম-ইমেইল */}
                                                    <td className="py-4 px-6 flex items-center gap-4">
                                                        <div className="w-11 h-11 relative rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                                                            <Image 
                                                                src={user.image || "https://via.placeholder.com/150"}
                                                                alt={user.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <div className="truncate max-w-[180px]">
                                                            <p className="font-extrabold text-gray-900 truncate">{user.name}</p>
                                                            <p className="text-xs text-gray-400 font-normal truncate">{user.email}</p>
                                                        </div>
                                                    </td>

                                                    {/* রোল কলাম */}
                                                    <td className="py-4 px-6">
                                                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-[#021A54]">
                                                            👤 {user.role}
                                                        </span>
                                                    </td>

                                                    {/* কন্টাক্ট ইনফো */}
                                                    <td className="py-4 px-6 text-xs text-gray-500 font-semibold">
                                                        <p>📞 {user.phone || "N/A"}</p>
                                                        <p className="font-normal text-gray-400">⚥ {user.gender || "N/A"}</p>
                                                    </td>

                                                    {/* স্ট্যাটাস ব্যাজ */}
                                                    <td className="py-4 px-6">
                                                        <span 
                                                            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block transition-colors duration-300"
                                                            style={{ 
                                                                backgroundColor: isSuspended ? '#fee2e2' : '#FFCEE3', 
                                                                color: isSuspended ? '#ef4444' : '#021A54' 
                                                            }}
                                                        >
                                                            {isSuspended ? "🚫 Suspended" : "🟢 Active"}
                                                        </span>
                                                    </td>

                                                    {/* ⚙️ অ্যাকশন বাটন কন্ট্রোল (Framer Motion ইন্টারেকশন সহ) */}
                                                    <td className="py-4 px-6 text-center">
                                                        <div className="flex items-center justify-center gap-3">
                                                            
                                                            {/* Active / Suspend বাটন */}
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => toggleStatus(user._id, user.status)}
                                                                className="text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer shadow-sm min-w-[100px]"
                                                                style={{
                                                                    backgroundColor: isSuspended ? '#021A54' : '#FFCEE3',
                                                                    color: isSuspended ? '#ffffff' : '#021A54'
                                                                }}
                                                                onMouseEnter={(e) => {
                                                                    if(!isSuspended) { 
                                                                        e.target.style.backgroundColor = '#FF85BB'; 
                                                                        e.target.style.color = '#ffffff'; 
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    if(!isSuspended) { 
                                                                        e.target.style.backgroundColor = '#FFCEE3'; 
                                                                        e.target.style.color = '#021A54'; 
                                                                    }
                                                                }}
                                                            >
                                                                {isSuspended ? "Activate" : "Suspend"}
                                                            </motion.button>

                                                            {/* Delete বাটন */}
                                                            <motion.button
                                                                whileHover={{ scale: 1.05, backgroundColor: "#dc2626", color: "#ffffff" }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="border border-red-500 text-red-600 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer"
                                                            >
                                                                Delete
                                                            </motion.button>

                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}