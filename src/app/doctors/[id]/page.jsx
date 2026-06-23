'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Button, Chip, Spinner, Avatar, Input } from "@heroui/react";
import { authClient } from "@/lib/auth-client"; 
import { toast } from 'react-toastify'; // 🌟 Added react-toastify import
import Link from 'next/link';

const DoctorDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); 
    const [patientProblem, setPatientProblem] = useState(''); 
    const [bookingLoading, setBookingLoading] = useState(false);

    const formatTime12Hour = (time24) => {
        if (!time24) return '';
        const [hours, minutes] = time24.split(':');
        let hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12; 
        return `${hour}:${minutes} ${ampm}`;
    };

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/doctors/${id}`);
                const data = await res.json();
                setDoctor(data);
            } catch (error) {
                console.error("Error fetching doctor details:", error);
                toast.error("Failed to fetch doctor details! ❌");
            } finally {
                loading && setLoading(false);
            }
        };
        if (id) fetchDoctorDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
                <Spinner size="lg" style={{ color: '#FF85BB' }} label="Loading Doctor Profile..." />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="text-center py-20 bg-[#F5F5F5] min-h-screen flex flex-col justify-center items-center gap-4">
                <p className="text-xl font-bold text-[#021A54]">Doctor profile not found!</p>
                <Button onClick={() => router.push('/doctors')} className="bg-[#FF85BB] text-white font-bold">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-10 px-4 md:px-12 bg-[#F5F5F5]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* ================= LEFT COLUMN ================= */}
                <div className="lg:sticky lg:top-6">
                    <Card className="border border-none bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 opacity-20" style={{ backgroundColor: '#FFCEE3' }}></div>
                        
                        <Avatar 
                            src={doctor.profileImage || "https://via.placeholder.com/150"} 
                            className="w-36 h-36 text-large border-4 shadow-md mb-4"
                            style={{ borderColor: '#FFCEE3' }}
                        />

                        <div className="flex items-center gap-1.5 justify-center mb-1">
                            <h2 className="font-extrabold text-2xl" style={{ color: '#021A54' }}>{doctor.doctorName}</h2>
                            {doctor.verificationStatus === "Verified" && (
                                <span className="flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold text-white shadow-sm" style={{ backgroundColor: '#FF85BB' }}>✓</span>
                            )}
                        </div>

                        <Chip className="font-bold text-xs uppercase tracking-wider px-3 mb-4" style={{ backgroundColor: '#FFCEE3', color: '#021A54' }}>
                            {doctor.specialization}
                        </Chip>

                        <p className="text-sm font-medium text-gray-500 mb-6 px-4">
                            {doctor.qualifications}
                        </p>

                        <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4 mb-6">
                            <div className="text-center border-r border-gray-100">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Experience</p>
                                <p className="text-lg font-extrabold" style={{ color: '#021A54' }}>{doctor.experience} Years</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Consultation Fee</p>
                                <p className="text-lg font-black" style={{ color: '#FF85BB' }}>৳ {doctor.consultationFee}</p>
                            </div>
                        </div>

                        <div className="w-full text-left space-y-3 bg-gray-50 p-4 rounded-2xl">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Primary Hospital</p>
                                <p className="text-sm font-bold truncate" style={{ color: '#021A54' }}>🏢 {doctor.hospitalName}</p>
                            </div>
                            {(doctor.doctorEmail || doctor.email) && (
                                <div className="border-t border-gray-200/60 pt-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Doctor Email</p>
                                    <p className="text-sm font-semibold truncate text-gray-600">✉️ {doctor.doctorEmail || doctor.email}</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* ================= RIGHT COLUMN ================= */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Symptoms Presentation */}
                    {doctor.symptomsPresentation && (
                        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-3xl">
                            <div className="h-2 w-full" style={{ backgroundColor: '#FF85BB' }}></div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold mb-2" style={{ color: '#021A54' }}>
                                    💡 {doctor.symptomsPresentation.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {doctor.symptomsPresentation.description}
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Expertise & Symptoms Treated */}
                    <Card className="border-none shadow-sm bg-white p-6 rounded-3xl">
                        <h3 className="text-md font-bold uppercase tracking-wider mb-4" style={{ color: '#021A54' }}>
                            🩺 Expertise & Symptoms Treated
                        </h3>
                        <div className="flex flex-wrap gap-2.5">
                            {doctor.treatedSymptoms?.map((symptom, index) => (
                                <Chip 
                                    key={index} 
                                    variant="flat" 
                                    className="px-3 py-3 font-semibold text-xs transition-transform hover:scale-105"
                                    style={{ backgroundColor: '#F5F5F5', color: '#021A54', border: '1px solid #FFCEE3' }}
                                >
                                    • {symptom}
                                </Chip>
                            ))}
                        </div>
                    </Card>

                    {/* Booking Form Card */}
                    <Card className="border-none shadow-sm bg-white p-6 rounded-3xl space-y-6">
                        
                        {/* 📅 1. Select Appointment Date */}
                        <div>
                            <h3 className="text-md font-bold uppercase tracking-wider mb-1" style={{ color: '#021A54' }}>
                                📅 1. Select Appointment Date
                            </h3>
                            
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 font-medium mb-1.5">Doctors Chamber Days:</p>
                                <div className="flex flex-wrap gap-2">
                                    {doctor.availableDays?.map((day, i) => (
                                        <span 
                                            key={i} 
                                            className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                                                selectedDay === day 
                                                    ? 'bg-[#021A54] text-white border-[#021A54]' 
                                                    : 'bg-pink-50/50 text-[#021A54] border-[#FFCEE3]'
                                            }`}
                                        >
                                            🗓️ {day}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <Input 
                                type="date"
                                min={new Date().toISOString().split('T')[0]} 
                                value={selectedDate}
                                onChange={(e) => {
                                    const dateStr = e.target.value;
                                    if (!dateStr) return;

                                    const chosenDate = new Date(dateStr);
                                    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                    const dayName = daysOfWeek[chosenDate.getDay()];

                                    if (doctor.availableDays && !doctor.availableDays.includes(dayName)) {
                                        // 🌟 Replaced alert with toast
                                        toast.warning(`Sorry, Dr. ${doctor.doctorName} is not available on this day. Please select a date from the chamber days (${doctor.availableDays.join(', ')}).`);
                                        setSelectedDate('');
                                        setSelectedDay('');
                                    } else {
                                        setSelectedDate(dateStr);
                                        setSelectedDay(dayName);
                                        setSelectedSlot(''); 
                                    }
                                }}
                                className="max-w-xs font-semibold text-black"
                            />
                            {selectedDay && (
                                <p className="text-xs text-green-600 font-bold mt-2">✓ Selected Day: {selectedDay}</p>
                            )}
                        </div>

                        {/* ⏰ 2. Time Slot Selection */}
                        <div>
                            <h3 className="text-md font-bold uppercase tracking-wider mb-3" style={{ color: '#021A54' }}>
                                ⏰ 2. Available Slots {selectedDay && `for ${selectedDay}`}
                            </h3>
                            {!selectedDate ? (
                                // 🌟 Converted from Bengali to English
                                <p className="text-xs text-gray-400 italic">Please select a calendar date first according to the doctors chamber availability.</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {doctor.availableSlots?.map((slot, index) => {
                                        const isSelected = selectedSlot === slot.time;
                                        
                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                disabled={slot.isBooked}
                                                onClick={() => setSelectedSlot(slot.time)}
                                                className={`p-3 text-xs font-extrabold rounded-xl border transition-all duration-300 text-center
                                                    ${slot.isBooked ? 'bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed' : ''}
                                                    ${!slot.isBooked && !isSelected ? 'bg-pink-50 text-[#FF8BB] border-[#FFCEE3] hover:bg-[#FF85BB] hover:text-white' : ''}
                                                    ${isSelected ? 'text-white border-[#FF85BB] shadow-md' : ''}
                                                `}
                                                style={isSelected ? { backgroundColor: '#FF85BB' } : {}}
                                            >
                                                {formatTime12Hour(slot.time)}
                                                {slot.isBooked && (
                                                    <span className="block text-[9px] font-medium text-gray-400 no-underline">Booked</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ================= FORM INSIDE ================= */}
                        <form 
                            onSubmit={async (e) => {
                                e.preventDefault(); 

                                const session = await authClient.getSession();
                                
                                if (!session?.data?.user) {
                                    // 🌟 Replaced alert with toast
                                    toast.error("Please login first to book an appointment! 🔒");
                                    return;
                                }

                                if (!selectedDate || !selectedSlot) {
                                    // 🌟 Replaced alert with toast
                                    toast.warning("Please select an appointment date and time slot.");
                                    return;
                                }

                                const currentUserEmail = session.data.user.email;
                                const currentUserName = session.data.user.name || "Anonymous Patient";
                                
                                const bookingData = {
                                    doctorId: doctor._id,
                                    doctorName: doctor.doctorName,
                                    doctorEmail: doctor.doctorEmail || doctor.email, 
                                    specialization: doctor.specialization,
                                    hospitalName: doctor.hospitalName,
                                    consultationFee: doctor.consultationFee,
                                    appointmentDate: selectedDate, 
                                    appointmentDay: selectedDay,   
                                    appointmentTime: formatTime12Hour(selectedSlot), 
                                    patientProblem: patientProblem, 
                                    
                                    userEmail: currentUserEmail,   
                                    userName: currentUserName,  
                                    patientEmail: currentUserEmail,  
                                    patientName: currentUserName,     
                                    status: "Pending",             
                                    createdAt: new Date()
                                };

                                setBookingLoading(true);
                                try {
                                    const response = await fetch('http://localhost:5000/api/appointments', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(bookingData)
                                    });

                                    if (response.ok) {
                                        // 🌟 Replaced alert with toast
                                        toast.success("Appointment successfully booked! 🎉");
                                        router.push('/dashboard/patient'); 
                                    } else {
                                        const errData = await response.json();
                                        console.error("Booking failed on server:", errData.error);
                                        // 🌟 Replaced alert with toast
                                        toast.error("Booking failed. Please try again.");
                                    }
                                } catch (error) {
                                    console.error("Network Error:", error);
                                    // 🌟 Replaced alert with toast
                                    toast.error("Server connection error! Please verify your backend API.");
                                } finally {
                                    setBookingLoading(false);
                                }
                            }}
                            className="space-y-6"
                        >
                            {/* 📝 3. Describe Your Problem / Symptoms */}
                            <div>
                                <h3 className="text-md font-bold uppercase tracking-wider mb-3" style={{ color: '#021A54' }}>
                                    📝 3. Describe Your Problem / Symptoms
                                </h3>
                                <textarea
                                    rows="4"
                                    required
                                    // 🌟 Converted placeholder from Bengali to English
                                    placeholder="Briefly describe your symptoms or medical concerns here (e.g., fever for 2 days, dry cough...)"
                                    value={patientProblem} 
                                    onChange={(e) => setPatientProblem(e.target.value)}
                                    className="w-full p-4 text-sm font-medium border border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF85BB] bg-gray-50/50 text-black placeholder-gray-400"
                                />
                            </div>

                            {/* 🚀 4. Schedule Review & Submit Button */}
                            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-xs text-gray-400 font-semibold">Your Selected Schedule:</p>
                                    <p className="text-sm font-bold" style={{ color: '#021A54' }}>
                                        {selectedDate && selectedSlot ? `🗓️ ${selectedDate} (${selectedDay}) at 🕒 ${formatTime12Hour(selectedSlot)}` : '❌ No schedule selected'}
                                    </p>
                                </div>
                                
                                <Button 
                                    type="submit"
                                    isLoading={bookingLoading} 
                                    className="font-black px-10 py-6 rounded-2xl shadow-lg text-white text-sm transition-all duration-300 active:scale-95 hover:opacity-90"
                                    style={{ backgroundColor: '#FF85BB' }}
                                >
                                    Confirm Appointment 🚀
                                </Button>
                            </div>
                        </form>

                    </Card>
                </div>

            </div>
        </div>
    );
};

export default DoctorDetailPage;