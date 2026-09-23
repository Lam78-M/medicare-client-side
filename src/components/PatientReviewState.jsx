"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Star, MessageSquare, Loader2 } from "lucide-react";

export default function TopThreeReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/v1/reviews`);
        if (!res.ok) throw new Error("Failed to fetch reviews");

        const data = await res.json();

        if (data && data.success && Array.isArray(data.reviews)) {
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

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 bg-[#F5F7FF]">
        <Loader2 className="h-12 w-12 animate-spin text-[#FF85BB]" />
        <p className="font-medium text-[#021A54]">Loading Reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFF] px-4 py-16 sm:px-6 lg:px-8">
      <ToastContainer />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFCEE3] text-[#021A54]">
              <MessageSquare className="h-6 w-6" />
            </span>
            <h1 className="text-3xl font-black tracking-tight text-[#021A54] sm:text-4xl md:text-5xl">
              Patient Reviews
            </h1>
          </div>
          <div className="mx-auto mb-4 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#FF85BB] via-[#FFCEE3] to-[#021A54]" />
          <p className="mx-auto max-w-2xl text-base text-slate-600 md:text-lg">
            Patients trust our care experience and consistently highlight the professionalism, warmth, and convenience they receive.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reviews.length === 0 ? (
            <div className="col-span-full">
              <div className="rounded-[28px] border-2 border-dashed border-[#FFCEE3] bg-white p-12 text-center shadow-sm">
                <MessageSquare className="mx-auto mb-4 h-14 w-14 text-[#FF85BB]" />
                <h3 className="text-2xl font-bold text-[#021A54]">No Reviews Yet</h3>
                <p className="mt-2 text-[#021A54]/60">Patient reviews will appear here once submitted.</p>
              </div>
            </div>
          ) : (
            reviews.slice(0, 3).map((rev, index) => {
              const currentId = rev?._id?.$oid || rev?._id || `review-${index}`;
              const contentText = rev.reviewText ? rev.reviewText.trim() : "No review text provided.";

              return (
                <div
                  key={currentId}
                  className="flex h-full flex-col overflow-hidden rounded-[28px] border border-[#FFCEE3] bg-white shadow-[0_18px_35px_rgba(255,133,187,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(2,26,84,0.08)]"
                >
                  <div className="h-1 bg-gradient-to-r from-[#FF85BB] via-[#FFCEE3] to-[#021A54]" />

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-[#021A54]">{rev.patientName || "Anonymous Patient"}</h3>
                        <p className="mt-1 text-xs text-slate-500">Verified patient</p>
                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-[#FFCEE3] px-3 py-1.5">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-[#021A54]">{rev.rating || 0}</span>
                      </div>
                    </div>

                    <div className="flex-1 rounded-2xl border border-slate-100 bg-[#F9FAFF] p-5">
                      <p className="text-sm leading-relaxed text-slate-700">{contentText}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-500">Patient feedback</span>
                      <span className="text-xs font-bold text-[#FF85BB]">★ Trusted review</span>
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