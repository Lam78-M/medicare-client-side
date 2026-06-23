'use client';

import React, { useEffect, useState } from 'react'; // 'use' ফেলে দেওয়া হয়েছে

const DoctorsPage = () => { // paramsPromise ফেলে দেওয়া হয়েছে
    
    // সরাসরি তোমার সেই নির্দিষ্ট ডক্টর আইডি এখানে বসিয়ে দাও
    const doctorId = "6a35f5c6b5460cb6499eef86"; 

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // বাকি নিচের সব useEffect এবং return কোড একদম হুবহু আগের মতোই থাকবে...
    useEffect(() => {
        const fetchReviews = async () => {
            if (!doctorId) return;
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`http://localhost:5000/api/v1/reviews/doctor/${doctorId}`);
                if (!response.ok) throw new Error('Server returned an error');

                const data = await response.json();
                if (data.success) {
                    setReviews(data.reviews || []); 
                } else {
                    setError("Backend failed");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [doctorId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F5F5F5', fontFamily: 'sans-serif' }}>
                <h2 style={{ color: '#021A54' }}>Loading Data...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#F5F5F5', fontFamily: 'sans-serif' }}>
                <h2 style={{ color: '#FF85BB' }}>Error: {error}</h2>
            </div>
        );
    }

    const hasReviews = reviews.length > 0;
    const singleRating = hasReviews ? reviews[0].rating : 0;
    const doctorName = hasReviews && reviews[0].doctorName ? reviews[0].doctorName : "Dr. Anika Chowdhury";

    return (
        <div style={{ backgroundColor: '#F5F5F5', padding: '40px 20px', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#021A54', color: '#FFFFFF', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                <h2 style={{ color: '#FFCEE3', marginBottom: '5px', fontSize: '24px' }}>{doctorName}</h2>
                <p style={{ color: '#F5F5F5', fontSize: '14px', opacity: 0.8 }}>ID: {doctorId}</p>
                <hr style={{ borderColor: '#FF85BB', margin: '20px 0' }} />
                <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '15px', display: 'block', color: '#FFCEE3', marginBottom: '5px' }}>Total Reviews</span>
                    <span style={{ fontSize: '42px', fontWeight: 'bold', color: '#FF85BB' }}>{reviews.length}</span>
                </div>
                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255, 133, 187, 0.3)' }}>
                    <span style={{ fontSize: '15px', display: 'block', color: '#FFCEE3', marginBottom: '5px' }}>Rating</span>
                    <span style={{ fontSize: '28px', fontWeight: 'bold' }}>⭐ {singleRating} / 5</span>
                </div>
            </div>
        </div>
    );
};

export default DoctorsPage;