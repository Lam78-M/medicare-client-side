'use client'
import React, { useEffect, useState } from 'react';
import { Card, Button, Input, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';

const MyProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const session = await authClient.getSession();
                if (session?.data?.user) {
                    const userEmail = session.data.user.email;
                    setEmail(userEmail);
                    setName(session.data.user.name || '');

                    // Fetch extra info (Phone & Gender) from your custom backend database endpoints layer
                    const res = await fetch(`http://localhost:5000/api/users/${userEmail}`);
                    if (res.ok) {
                        const dbData = await res.json();
                        if (dbData) {
                            setPhone(dbData.phone || '');
                            setGender(dbData.gender || '');
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading profile data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await fetch('http://localhost:5000/api/user/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name, phone, gender })
            });

            if (response.ok) {
                toast.success("Profile saved successfully! 💾");
            } else {
                toast.error("Failed to save data context endpoints.");
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
                <Spinner label="Loading Profile Data Container..." color="danger" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 py-8">
            <Card className="p-6 bg-white border-none shadow-xl rounded-3xl">
                <h2 className="text-2xl font-black mb-6" style={{ color: '#021A54' }}>👤 Personal Account Management</h2>
                
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                        <Input type="email" value={email} disabled className="opacity-70" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Contact Phone Number 📱</label>
                        <Input type="tel" placeholder="e.g., +88017XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Select Gender ⚧️</label>
                        <select
                            required
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full h-[40px] px-3 text-sm font-medium border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF85BB] bg-gray-50/50 text-black"
                        >
                            <option value="">Choose Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <Button type="submit" isLoading={saving} className="w-full text-white font-extrabold py-4 mt-4 rounded-xl shadow-md" style={{ backgroundColor: '#FF85BB' }}>
                        Save Database Record Changes ✨
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default MyProfilePage;