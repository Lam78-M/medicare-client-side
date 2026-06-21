"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MessageSquareCode, Send, Stethoscope } from "lucide-react";

export default function PatientFeedbackPage() {
  const [bookedDoctors, setBookedDoctors] = useState([]); 
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // 🎯 STEP 1: Fetching lists straight to drop down state array
  useEffect(() => {
    const fetchMyBookedDoctors = async () => {
      try {
        const session = await authClient.getSession();
        if (!session?.data?.user) {
          toast.error("Please log in first!");
          setPageLoading(false);
          return;
        }

        // 📧 Live Auth check: 'patient@example.com' catch
        const patientEmail = session.data.user.email; 

        // 📡 Backend route hitting
        const response = await fetch(`http://localhost:5000/api/appointments/patient?email=${patientEmail}`);
        const resData = await response.json();

        console.log("🔍 COMPACT TESTING DATA INSIDE FRONTEND:", resData);

        if (Array.isArray(resData)) {
          // 🚀 ZERO FILTERS WORK: Array pipeline load perfectly to component loop
          setBookedDoctors(resData);
        } else {
          toast.error("Failed to load appointment references.");
        }
      } catch (err) {
        console.error("UI Fetch Error:", err);
        toast.error("Cannot connect to server data matrix!");
      } finally {
        setPageLoading(false);
      }
    };

    fetchMyBookedDoctors();
  }, []);

  // 🎯 STEP 2: Main payload submission callback layout
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctorId) {
      toast.warning("Please select a doctor to review!");
      return;
    }

    setLoading(true);

    try {
      const session = await authClient.getSession();
      const patientId = session?.data?.user?.id || "mock_patient_id";
      const patientName = session?.data?.user?.name || "Anonymous Patient";

      const reviewPayload = {
        patientId,
        patientName,
        doctorId: selectedDoctorId,
        doctorName: selectedDoctorName, // 🚀 Real name update token column
        reviewText,
        rating: Number(rating),
        createdAt: new Date()
      };

      const response = await fetch("http://localhost:5000/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Review for ${selectedDoctorName} posted safely! 🎉`);
        setReviewText(""); 
        setSelectedDoctorId("");
        setSelectedDoctorName("");
      } else {
        toast.error(data.message || "Failed to submit!");
      }
    } catch (err) {
      toast.error("Network communication failed!");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-semibold text-[#021A54]">
        Synchronizing Booked Appointments... ⏳
      </div>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen flex justify-center items-center">
      <ToastContainer />
      
      <div className="bg-white p-8 rounded-2xl shadow-md border border-[#FFCEE3] w-full max-w-lg">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquareCode className="text-[#021A54] h-6 w-6" />
          <h2 className="text-2xl font-bold text-[#021A54]">Evaluation & Ratings</h2>
        </div>

        <form onSubmit={handleReviewSubmit} className="space-y-5">
          {/* 🩺 Dropdown Wrapper Selection element container */}
          <div>
            <label className="block text-sm font-bold text-[#021A54] mb-2 uppercase tracking-wide">Select Appointed Doctor</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-3.5 text-gray-400 h-4 w-4" />
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  const currentSelectedDocId = e.target.value;
                  setSelectedDoctorId(currentSelectedDocId);
                  
                  // 🎯 DYNAMIC OBJECT KEY MATCHING EXACTLY AS TOMAR RESPONSE DATA SCENARIO:
                  // Tumi metadata file scenario block format-e likhecho: doctorId & doctorName
                  const targetDocObject = bookedDoctors.find(d => String(d.doctorId) === String(currentSelectedDocId));
                  if (targetDocObject) {
                    setSelectedDoctorName(targetDocObject.doctorName);
                  }
                }}
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white text-sm font-semibold text-gray-700 outline-none"
              >
                <option value="">-- Choose From Your Doctors List --</option>
                {/* 🚀 HUB-A-HU DATABASE SCHEMA PROPERTY STRINGS LOOP */}
                {bookedDoctors && bookedDoctors.map((item, index) => {
                  return (
                    <option key={item._id || index} value={item.doctorId}>
                      {item.doctorName} — {item.specialization}
                    </option>
                  );
                })}
              </select>
            </div>
            {bookedDoctors.length === 0 && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">⚠️ No previous doctor appointments found to review!</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#021A54] mb-2 uppercase tracking-wide">Score Level</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white text-sm font-semibold text-gray-700 outline-none">
              <option value="5">⭐⭐⭐⭐⭐ (5 - Premium Care)</option>
              <option value="4">⭐⭐⭐⭐ (4 - Good Experience)</option>
              <option value="3">⭐⭐⭐ (3 - Average)</option>
              <option value="2">⭐⭐ (2 - Needs Improvement)</option>
              <option value="1">⭐ (1 - Unacceptable)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#021A54] mb-2 uppercase tracking-wide">Your Performance Summary</label>
            <textarea rows="4" placeholder="Write down your experience regarding the treatment process..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} required className="w-full p-4 border rounded-xl text-sm text-gray-700 outline-none" />
          </div>

          <button type="submit" disabled={loading || bookedDoctors.length === 0} className="w-full py-3 bg-[#021A54] text-white font-bold rounded-xl hover:opacity-95 transition flex justify-center items-center gap-2">
            {loading ? "Posting Evaluation..." : "Submit Ratings"} <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}