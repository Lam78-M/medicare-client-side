"use client";

import React, { useState, useEffect } from "react";
// 🎯 React Toastify ইমপোর্ট করা হলো
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    // ডক্টর লিস্ট লোড করার ফাংশন
    const loadDoctors = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:5000/api/admin/pending-doctors");
            const data = await res.json();
            if (Array.isArray(data)) {
                setDoctors(data);
            }
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctors();
    }, []);

    // 🎯 কাস্টম কালার টোস্ট নোটিফিকেশন ফাংশন (তোমার কালার প্যালেট থিমে)
    const showToast = (message, type = "success") => {
        const config = {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
                backgroundColor: '#021A54', // নেভি ব্লু ব্যাকগ্রাউন্ড
                color: '#ffffff',
                borderRadius: '12px',
                fontWeight: '600'
            },
            progressStyle: {
                backgroundColor: type === "success" ? '#FF85BB' : '#f87171' // সাকসেস হলে রোজ পিঙ্ক বার
            }
        };

        if (type === "success") {
            toast.success(message, config);
        } else {
            toast.error(message, config);
        }
    };

    // 🟢 Approve হ্যান্ডলার
    const handleApprove = async (id) => {
        try {
            const res = await fetch("http://localhost:5000/api/admin/approve-doctor", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                showToast("Doctor Approved successfully! ✅", "success");
                setDoctors(prevDocs => 
                    prevDocs.map(doc => doc._id === id ? { ...doc, verificationStatus: 'Verified' } : doc)
                );
            }
        } catch (err) {
            showToast("Failed to approve!", "error");
        }
    };

    // 🟡 Cancel Verify হ্যান্ডলার
    const handleCancelVerify = async (id) => {
        try {
            const res = await fetch("http://localhost:5000/api/admin/cancel-verify", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                showToast("Verification cancelled successfully! ↩️", "success");
                setDoctors(prevDocs => 
                    prevDocs.map(doc => doc._id === id ? { ...doc, verificationStatus: 'Pending' } : doc)
                );
            }
        } catch (err) {
            setDoctors(prevDocs => prevDocs.map(doc => doc._id === id ? { ...doc, verificationStatus: 'Pending' } : doc));
            showToast("Verification reverted! (Frontend Update)", "success");
        }
    };

    // 🔴 Reject License হ্যান্ডলার
    const handleRejectLicense = async (id) => {
        if (!confirm("Are you sure you want to reject this doctor's license?")) return;

        try {
            const res = await fetch("http://localhost:5000/api/admin/reject-doctor", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });
            
            showToast("Doctor license rejected & removed! ❌", "error");
            setDoctors(prevDocs => prevDocs.filter(doc => doc._id !== id));
        } catch (err) {
            showToast("Failed to reject license!", "error");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold text-[#021A54]">Loading doctor profiles...</div>;

    return (
        <div className="min-h-screen py-10 px-4 md:px-8" style={{ backgroundColor: '#FFFFFF' }}>
            {/* টোস্ট কন্টেইনার */}
            <ToastContainer />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 border-b border-gray-200 pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#021A54]">Doctor Verifications</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage and verify medical registration licenses.</p>
                    </div>
                    <span className="text-white font-black text-sm px-4 py-1.5 rounded-full" style={{ backgroundColor: '#021A54' }}>
                        Total: {doctors.length}
                    </span>
                </div>

                {doctors.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <p className="text-gray-400 font-medium">🎉 No pending verification requests found.</p>
                    </div>
                ) : (
                    /* 🗂️ কাস্টম কার্ড গ্রিড লেআউট */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {doctors.map((doc) => {
                            const isApproved = doc.verificationStatus?.toLowerCase() === "verified";

                            return (
                                <div 
                                    key={doc._id} 
                                    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                                >
                                    {/* কার্ড বডি (ডিটেইলস) */}
                                    <div className="mb-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-extrabold text-lg text-[#021A54] group-hover:text-[#FF85BB] transition-colors duration-300">
                                                {doc.doctorName}
                                            </h3>
                                            <span 
                                                className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                                                style={{ 
                                                    backgroundColor: isApproved ? '#FFCEE3' : '#FEF3C7', 
                                                    color: isApproved ? '#021A54' : '#D97706' 
                                                }}
                                            >
                                                {isApproved ? "🟢 Verified" : "⏳ Pending"}
                                            </span>
                                        </div>
                                        
                                        {/* বিস্তারিত ইনফরমেশন */}
                                        <div className="space-y-1.5 text-xs font-semibold text-gray-500 border-t border-gray-50 pt-3">
                                            <p>🩺 <span className="text-gray-700">Specialization:</span> {doc.specialization}</p>
                                            <p>🏢 <span className="text-gray-700">Hospital:</span> {doc.hospitalName}</p>
                                            <p>💼 <span className="text-gray-700">Experience:</span> {doc.experience} Years</p>
                                            <p>💳 <span className="text-gray-700">Fees:</span> ৳ {doc.consultationFee}</p>
                                        </div>
                                    </div>

                                    {/* ⚙️ ডাইনামিক অ্যাকশন বাটন কন্ট্রোল (কাস্টম কালার প্যালেট সহ) */}
                                    <div className="grid grid-cols-2 gap-3 border-t border-gray-50 pt-4">
                                        {isApproved ? (
                                            /* ১. ভেরিফাইড হয়ে গেলে দেখাবে: Cancel Verify */
                                            <button 
                                                onClick={() => handleCancelVerify(doc._id)}
                                                className="text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center shadow-sm active:scale-95 duration-200"
                                                style={{ 
                                                    backgroundColor: '#FFCEE3', 
                                                    color: '#021A54',
                                                }}
                                                onMouseEnter={(e) => { e.target.style.backgroundColor = '#FF85BB'; e.target.style.color = '#ffffff'; }}
                                                onMouseLeave={(e) => { e.target.style.backgroundColor = '#FFCEE3'; e.target.style.color = '#021A54'; }}
                                            >
                                                Cancel Verify ↩️
                                            </button>
                                        ) : (
                                            /* ২. নরমাল অবস্থায় দেখাবে: Approve */
                                            <button 
                                                onClick={() => handleApprove(doc._id)}
                                                className="text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center shadow-sm active:scale-95 duration-200"
                                                style={{ backgroundColor: '#021A54' }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#FF85BB'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#021A54'}
                                            >
                                                Approve ✅
                                            </button>
                                        )}

                                        {/* ৩. সব অবস্থাতেই Reject License বাটনটি থাকবে */}
                                        <button 
                                            onClick={() => handleRejectLicense(doc._id)}
                                            className="border border-red-500 text-red-600 hover:bg-red-600 hover:text-black text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200 cursor-pointer text-center active:scale-95"
                                        >
                                            Reject License 🚫
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}