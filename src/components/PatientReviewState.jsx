
"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authClient } from "@/lib/auth-client";
import { Star, MessageSquare, Loader2 } from "lucide-react";

export default function TopThreeReviewsPage() {
    const { data: session, isPending } = authClient.useSession();

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(
                    "http://localhost:5000/api/v1/reviews"
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch reviews");
                }

                const data = await res.json();

                if (
                    data &&
                    data.success &&
                    Array.isArray(data.reviews)
                ) {
                    setReviews(data.reviews);
                } else if (Array.isArray(data)) {
                    setReviews(data);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load reviews!");
            } finally {
                setLoading(false);
            }
        };

        if (!isPending && session?.user) {
            fetchReviews();
        } else if (!isPending && !session) {
            setLoading(false);
        }
    }, [session, isPending]);

    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-[#FF85BB] animate-spin" />
                <p className="font-medium text-[#021A54]">
                    Loading Reviews...
                </p>
            </div>
        );
    }

    if (!session || !session.user) {
        return (
            <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
                <div className="bg-white border border-red-100 rounded-3xl shadow-sm px-8 py-6 text-center max-w-md w-full">
                    <h2 className="text-xl font-bold text-red-500 mb-2">
                        Access Restricted
                    </h2>

                    <p className="text-gray-600">
                        Please sign in to view patient reviews.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] py-10 px-4 sm:px-6 lg:px-10">
            <ToastContainer />

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-3 mb-4">
                        <MessageSquare className="w-10 h-10 text-[#FF85BB]" />

                        <h1 className="text-4xl md:text-5xl font-bold text-[#021A54]">
                            Patient Reviews
                        </h1>
                    </div>

                    <div className="w-24 h-1 bg-[#FF85BB] rounded-full mx-auto"></div>

                    <p className="mt-4 text-[#021A54]/70 max-w-2xl mx-auto">
                        Read what our patients are saying about their
                        healthcare experience and service quality.
                    </p>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                    {reviews.length === 0 ? (
                        <div className="col-span-full">
                            <div className="bg-white rounded-3xl border-2 border-dashed border-[#FFCEE3] p-12 text-center">
                                <MessageSquare className="w-14 h-14 text-[#FF85BB] mx-auto mb-4" />

                                <h3 className="text-2xl font-bold text-[#021A54]">
                                    No Reviews Yet
                                </h3>

                                <p className="text-[#021A54]/60 mt-2">
                                    Patient reviews will appear here once
                                    submitted.
                                </p>
                            </div>
                        </div>
                    ) : (
                        reviews.slice(0, 3).map((rev) => {
                            const currentId =
                                rev?._id?.$oid ||
                                rev?._id ||
                                Math.random().toString();

                            const contentText = rev.reviewText
                                ? rev.reviewText.trim()
                                : "No review text provided.";

                            return (
                                <div
                                    key={currentId}
                                    className="
                                        bg-white
                                        rounded-3xl
                                        border
                                        border-[#FFCEE3]
                                        shadow-sm
                                        hover:shadow-xl
                                        hover:-translate-y-1
                                        transition-all
                                        duration-300
                                        overflow-hidden
                                        flex
                                        flex-col
                                        h-full
                                    "
                                >
                                    {/* Top Accent */}
                                    <div className="h-1 bg-gradient-to-r from-[#FF85BB] via-[#FFCEE3] to-[#021A54]" />

                                    <div className="p-6 flex flex-col flex-1">

                                        {/* User & Rating */}
                                        <div className="flex items-start justify-between mb-5">

                                            <div>
                                                <h3 className="text-xl font-bold text-[#021A54]">
                                                    {rev.patientName ||
                                                        "Anonymous Patient"}
                                                </h3>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    Verified Patient
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1 bg-[#FFCEE3] px-3 py-1 rounded-full">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

                                                <span className="font-bold text-[#021A54]">
                                                    {rev.rating || 0}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Review Box */}
                                        <div className="bg-[#F5F5F5] border border-gray-100 rounded-2xl p-5 flex-1">
                                            <p className="text-5xl text-[#FF85BB] leading-none mb-2">
                                        
                                            </p>

                                            <p className="text-sm text-[#021A54]/80 leading-relaxed">
                                                {contentText}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                Patient Feedback
                                            </span>

                                            <span className="text-xs font-semibold text-[#FF85BB]">
                                                ★ Trusted Review
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

