'use client'
import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Spinner, Avatar } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';

const MyProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false); 

  const fetchUserProfile = async () => {
    try {
        const session = await authClient.getSession();
        
        if (session?.data?.user) {
            const userEmail = session.data.user.email;
            setEmail(userEmail);
            
            setName(session.data.user.name || '');
            if (session.data.user.phone) setPhone(session.data.user.phone);
            if (session.data.user.gender) setGender(session.data.user.gender);

            const tokenData = await authClient.token();
            const token = tokenData?.token;

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/user/${userEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${tokenData?.token}`
                }
            });

            if (res.ok) {
                const userData = await res.json();
                if (userData) {
                    if (userData.name) setName(userData.name);
                    if (userData.phone) setPhone(userData.phone);
                    if (userData.gender) setGender(userData.gender);
                }
            }
        }
    } catch (error) {
        console.error("Error loading profile data থেকে ঘুরে আসার সময়:", error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
             const tokenData = await authClient.token(); 
            const token = tokenData?.token; 
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/user/update-profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json',
                    authorization: `Bearer ${tokenData?.token}`
                 },
                body: JSON.stringify({ email, name, phone, gender })
            });

            if (response.ok) {
                toast.success("Profile saved successfully! 💾");
                setIsEditing(false); 
                
                await fetchUserProfile();
            } else {
                toast.error("Failed to update profile.");
            }
        } catch (error) {
            toast.error("Network connection failure!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Spinner label="Loading Your Profile..." style={{ color: '#FF85BB' }} size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 py-8">
            
            {/* 📋 ১. প্রোফাইল কার্ড ভিউ */}
            {!isEditing ? (
                <Card className="p-8 bg-white border border-gray-100 shadow-xl rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-[#021A54]"></div>
                    
                    <Avatar 
                        name={name}
                        className="w-28 h-28 text-xl font-bold border-4 border-white shadow-md z-10 mt-6 bg-[#FFCEE3] text-[#021A54]"
                    />

                    <h2 className="text-2xl font-black mt-4" style={{ color: '#021A54' }}>{name || "User Name"}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Patient Account</p>
                    
                    <div className="w-full my-6 border-b border-gray-100"></div>

                    <div className="w-full text-left space-y-4 px-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-xs font-bold text-gray-400 uppercase">📧 Email Address</span>
                            <span className="text-sm font-semibold text-black">{email}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-xs font-bold text-gray-400 uppercase">📱 Phone Number</span>
                            <span className="text-sm font-semibold text-black">
                                {phone || <span className="text-gray-300 italic text-xs">Not added yet</span>}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">⚧️ Gender</span>
                            <span className="text-sm font-semibold text-black">
                                {gender || <span className="text-gray-300 italic text-xs">Not added yet</span>}
                            </span>
                        </div>
                    </div>

                    <Button 
                        onClick={() => setIsEditing(true)}
                        className="w-full text-white font-extrabold py-6 mt-8 rounded-xl shadow-md text-sm transition-all"
                        style={{ backgroundColor: '#021A54' }}
                    >
                        Edit Profile Details ✏️
                    </Button>
                </Card>
            ) : (
                
                /* 📝 ২. প্রোফাইল ইনপুট ফর্ম */
                <Card className="p-6 bg-white border-none shadow-xl rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black" style={{ color: '#021A54' }}>
                            👤 Update Your Profile
                        </h2>
                        <Button 
                            size="sm" 
                            variant="light" 
                            onClick={() => setIsEditing(false)}
                            className="font-bold text-red-500"
                        >
                            Cancel
                        </Button>
                    </div>
                    
                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                            <Input 
                                type="text" 
                                variant="flat"
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="text-black font-medium"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                            <Input 
                                type="email" 
                                variant="flat"
                                value={email} 
                                disabled 
                                className="opacity-60 font-medium text-black cursor-not-allowed" 
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Contact Phone Number 📱</label>
                            <Input 
                                type="tel" 
                                variant="flat"
                                placeholder="e.g., +88017XXXXXXXX" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                                required 
                                className="text-black font-medium"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Select Gender ⚧️</label>
                            <select
                                required
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full h-[48px] px-3 text-sm font-medium border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF85BB] bg-gray-100 text-black transition-all"
                            >
                                <option value="">Choose Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <Button 
                            type="submit" 
                            isLoading={saving} 
                            className="w-full text-white font-extrabold py-6 mt-4 rounded-xl shadow-md text-sm" 
                            style={{ backgroundColor: '#FF85BB' }}
                        >
                            Save Details & View Card ✨
                        </Button>
                    </form>
                </Card>
            )}
        </div>
    );
};

export default MyProfilePage;