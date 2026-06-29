'use client';

import React, { useEffect, useState } from 'react';
import DashboardPrescrip from './dashboardPrescrip/page';
import { authClient } from "@/lib/auth-client"; 

const DoctorsPage = () => { 
   
    const [allReviews, setAllReviews] = useState([]); 
    const [appointments, setAppointments] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [error, setError] = useState(null);

    const { data: session } = authClient.useSession();
    const doctorEmail = session?.user?.email;
    const currentDoctorName = session?.user?.name; 

useEffect(() => {
    const fetchAllReviews = async () => {
        try {
               const tokenData = await authClient.token();
            const token = tokenData?.token;
            setLoadingReviews(true);
            const response = await fetch(`http://localhost:5000/api/v1/reviews`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${tokenData?.token}`
                }
            });

            if (!response.ok) throw new Error('Server returned an error');
            const data = await response.json();
            
            if (data.success) {
                setAllReviews(data.reviews || []); 
            }
        } catch (err) {
            console.error("Reviews error:", err.message);
            setError(err.message);
        } finally {
            setLoadingReviews(false);
        }
    };
    fetchAllReviews();
}, []);

 useEffect(() => {
    if (!doctorEmail) return;
    
    setLoadingAppointments(true);
    const cleanedEmail = doctorEmail.trim().toLowerCase();

    const fetchDoctorData = async () => {
        try {
            const tokenData = await authClient.token();
            const token = tokenData?.token;

            fetch(`http://localhost:5000/api/appointments/doctor?email=${cleanedEmail}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${tokenData?.token}`
                }
            })
            .then((res) => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                setAppointments(Array.isArray(data) ? data : []);
                setLoadingAppointments(false);
            })
            .catch((err) => {
                console.error("Appointments error:", err);
                setLoadingAppointments(false);
            });
            
        } catch (tokenErr) {
            console.error("Token error:", tokenErr);
            setLoadingAppointments(false);
        }
    };

    fetchDoctorData();
}, [doctorEmail]);

    const filteredReviews = allReviews.filter(review => {
        if (!currentDoctorName || !review.doctorName) return false;
        return review.doctorName.trim().toLowerCase() === currentDoctorName.trim().toLowerCase();
    });

    const totalReviews = filteredReviews.length;
    const averageRating = totalReviews > 0 
        ? (filteredReviews.reduce((sum, rev) => sum + (rev.rating || 0), 0) / totalReviews).toFixed(1) 
        : 0;
    
    const pendingCount = appointments.filter(app => app && app.status !== "Approved").length;
    const approvedCount = appointments.filter(app => app && app.status === "Approved").length;

    const globalLoading = loadingReviews || (loadingAppointments && doctorEmail);
    if (globalLoading) {
        return (
            <div style={{ backgroundColor: '#021A54', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif' }}>
                <div style={{ color: '#FFCEE3', fontWeight: 'bold', fontSize: '18px' }}>Loading Dashboard Metrics... ⏳</div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '24px', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
    
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', width: '100%' }}>
                    
                    {/* WIDGET 1: Doctor Rating Details Card */}
                    <div style={{ backgroundColor: '#021A54', color: '#FFFFFF', padding: '16px', borderRadius: '24px', flex: '1 1 ' , minWidth: '220px', maxWidth: '280px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)', textAlign: 'center' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', display: 'block', color: '#FFCEE3', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Reviews</span>
                            <span style={{ fontSize: '32px', fontWeight: '900', color: '#FFFFFF', lineHeight: '1' }}>{totalReviews}</span>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '10px', borderRadius: '14px', border: '1px solid rgba(255, 133, 187, 0.3)' }}>
                            <span style={{ fontSize: '11px', display: 'block', color: '#FFCEE3', marginBottom: '2px', fontWeight: 'bold' }}>Average Rating</span>
                            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFFFFF' }}>⭐ {averageRating} / 5</span>
                        </div>
                    </div>

                    {/* WIDGET 2: Live Pending Patients Counter Card */}
                    <div style={{ backgroundColor: '#021A54', color: '#FFFFFF', padding: '16px', borderRadius: '24px', flex: '1 1 ', minWidth: '220px', maxWidth: '280px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)', textAlign: 'center' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', display: 'block', color: '#FFCEE3', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Waiting Queue</span>
                            <span style={{ fontSize: '32px', fontWeight: '900', color: '#FF85BB', lineHeight: '1' }}>{pendingCount}</span>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '10px', borderRadius: '14px', border: '1px solid rgba(255, 133, 187, 0.3)' }}>
                            <span style={{ fontSize: '11px', display: 'block', color: '#FFCEE3', marginBottom: '2px', fontWeight: 'bold' }}>Pending Action</span>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>⏳ {pendingCount} Waiting</span>
                        </div>
                    </div>

                    {/* WIDGET 3: Checked Patients Counter Card */}
                    <div style={{ backgroundColor: '#021A54', color: '#FFFFFF', padding: '16px', borderRadius: '24px', flex: '1 1 ', minWidth: '220px', maxWidth: '280px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)', textAlign: 'center' }}>
                        <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', display: 'block', color: '#FFCEE3', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Checked Patients</span>
                            <span style={{ fontSize: '32px', fontWeight: '900', color: '#FFFFFF', lineHeight: '1' }}>{approvedCount}</span>
                        </div>
                        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '10px', borderRadius: '14px', border: '1px solid rgba(255, 133, 187, 0.3)' }}>
                            <span style={{ fontSize: '11px', display: 'block', color: '#FFCEE3', marginBottom: '2px', fontWeight: 'bold' }}>Status Counter</span>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>✅ Approved</span>
                        </div>
                    </div>

                </div>

                {/* 📋 Lower Main Component Content */}
                <div style={{ width: '100%' }}>
                    <DashboardPrescrip />
                </div>

            </div>
        </div>
    );
};

export default DoctorsPage;