'use client'
import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; 
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const UpdateProfilePage = () => {
    const { data: session, isPending: isSessionLoading } = authClient.useSession();
    
    const [doctorEmail, setDoctorEmail] = useState("");
    const [doctorName, setDoctorName] = useState("");

    const [specialization, setSpecialization] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [hospitalName, setHospitalName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [experience, setExperience] = useState("");
    const [consultationFee, setConsultationFee] = useState("");
    
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setDoctorEmail(session.user.email || "");
            setDoctorName(session.user.name || "Doctor");
        }
    }, [session]);

 
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        
  
        toast.dismiss(); 

        if (!doctorEmail) {
            toast.error("Logged-in doctor's email not found! ❌");
            return;
        }

        if (!specialization && !qualifications && !hospitalName && !profileImage && !experience && !consultationFee) {
            toast.warning("Please fill in at least one field to update. ⚠️");
            return;
        }

        const toastId = toast.loading("Updating your profile info... ⏳");
        setUpdateLoading(true);

        try {
            const updatePayload = {
                email: doctorEmail,
                ...(specialization && { specialization }),
                ...(qualifications && { qualifications }),
                ...(hospitalName && { hospitalName }),
                ...(profileImage && { profileImage }),
                ...(experience && { experience: Number(experience) }),
                ...(consultationFee && { consultationFee: Number(consultationFee) }),
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/doctors/update-profile-by-email`, {
                method: 'PATCH', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            const result = await response.json();

            if (response.ok) {
          
                toast.update(toastId, {
                    render: "Your profile information has been updated successfully! 🎉🚀",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            } else {
                toast.update(toastId, {
                    render: result.message || "Profile update failed! ❌",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.update(toastId, {
                render: "Unable to connect to the server. 🖥️❌",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        } finally {
            setUpdateLoading(false);
        }
    };

    if (isSessionLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <Spinner size="lg" style={{ color: '#021A54' }} label="Verifying Session..." />
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <Card className="p-6 text-center max-w-sm bg-white border border-red-200 shadow-md">
                    <p className="text-red-500 font-bold mb-3">You are not logged in! ❌</p>
                    <p className="text-xs text-gray-500">Please log in to your doctor account to modify your profile.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 md:px-12 bg-[#F5F5F5] flex justify-center items-center">
            
      
            <ToastContainer position="top-right" autoClose={3000} />

            <Card className="max-w-2xl w-full bg-white p-8 rounded-3xl border border-[#2652b8]/20 shadow-xl space-y-6">
                
                <div className="text-center border-b border-gray-100 pb-4">
                    <h2 className="text-2xl font-extrabold text-[#021A54]">🩺 Update Profile Information</h2>
                    <p className="text-sm font-bold text-pink-500 mt-1">Welcome, {doctorName}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">Logged Email: {doctorEmail}</p>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                            label="Specialization" 
                            placeholder="e.g., Cardiology"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="font-semibold text-black"
                        />
                        <Input 
                            label="Qualifications" 
                            placeholder="e.g., MBBS, MD (Cardiology)"
                            value={qualifications}
                            onChange={(e) => setQualifications(e.target.value)}
                            className="font-semibold text-black"
                        />
                    </div>

                    <Input 
                        label="Hospital Name" 
                        placeholder="e.g., Dhaka Medical College Hospital"
                        value={hospitalName}
                        onChange={(e) => setHospitalName(e.target.value)}
                        className="font-semibold text-black"
                    />

                    <Input 
                        label="Profile Image URL" 
                        placeholder="https://example.com/your-photo.jpg"
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        className="font-semibold text-black"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input 
                            type="number"
                            label="Experience (Years)" 
                            placeholder="e.g., 12"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="font-semibold text-black"
                        />
                        <Input 
                            type="number"
                            label="Consultation Fee (BDT)" 
                            placeholder="e.g., 1000"
                            value={consultationFee}
                            onChange={(e) => setConsultationFee(e.target.value)}
                            className="font-semibold text-black"
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <Button 
                            type="submit"
                            isLoading={updateLoading}
                            className="bg-[#021A54] text-white font-black px-10 py-6 rounded-2xl shadow-lg text-sm hover:bg-[#021A54]/90"
                        >
                            Save & Update Profile 🚀
                        </Button>
                    </div>

                </form>
            </Card>
        </div>
    );
};

export default UpdateProfilePage;