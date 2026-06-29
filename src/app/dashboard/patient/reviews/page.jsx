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

 useEffect(() => {
    const fetchMyBookedDoctors = async () => {
      try {
        const session = await authClient.getSession();
        if (!session?.data?.user) {
          toast.error("Please log in first!");
          setPageLoading(false);
          return;
        }

        const patientEmail = session.data.user.email; 

        const tokenData = await authClient.token();
        const token = tokenData?.token;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/v1/patient-appointments/${patientEmail}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer${tokenData?.token}`
            }
        });
        const resData = await response.json();
        
        console.log("🔍 UNIQUE DOCTORS IN FRONTEND:", resData);

        if (resData.success && Array.isArray(resData.doctors)) {
          console.log("✅ সফল! ১ নম্বর (Main) রুট থেকে ডাটা পাওয়া গেছে।");
          setBookedDoctors(resData.doctors);
        } else {
    
          console.log("⚠️ ১ নম্বর রুট কাজ করেনি। এবার ২ নম্বর (Backup) রুটে ট্রাই করছি...");
           const tokenData = await authClient.token();
        const token = tokenData?.token;
          const backupRes = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/appointments/patient?email=${patientEmail}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                   authorization: `Bearer${tokenData?.token}`
              }
          });
          const backupData = await backupRes.json();
          
          if (Array.isArray(backupData)) {
            console.log("✅ সফল! ২ নম্বর (Backup) রুট থেকে ডাটা পাওয়া গেছে।");
         
            const formattedDocs = backupData.map(item => ({
              doctorId: item.doctorId || item._id || item.id,
              doctorName: item.doctorName || item.name,
              specialization: item.specialization || ""
            })).filter((value, index, self) => 
              self.findIndex(v => v.doctorId === value.doctorId) === index
            );
            setBookedDoctors(formattedDocs);
          } else {
            toast.error("Failed to load appointment references.");
          }
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

  //  STEP 2: Main payload submission callback layout
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
        doctorName: selectedDoctorName, 
        reviewText,
        rating: Number(rating),
        createdAt: new Date()
      };

   const tokenData = await authClient.token();
        const token = tokenData?.token;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/api/v1/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
          authorization: `Bearer${tokenData?.token}`
          
         },
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
      loading && setLoading(false);
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
          {/* 🩺 Dropdown Selection container */}
          <div>
            <label className="block text-sm font-bold text-[#021A54] mb-2 uppercase tracking-wide">Select Appointed Doctor</label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-3.5 text-gray-400 h-4 w-4" />
              <select
                value={selectedDoctorId}
                onChange={(e) => {
                  const currentSelectedDocId = e.target.value;
                  setSelectedDoctorId(currentSelectedDocId);
                  
                  const targetDocObject = bookedDoctors.find(d => 
                    String(d.doctorId || d.id || d._id) === String(currentSelectedDocId)
                  );
                  if (targetDocObject) {
                    setSelectedDoctorName(targetDocObject.doctorName || targetDocObject.name);
                  }
                }}
                required
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white text-sm font-semibold text-gray-700 outline-none"
              >
                <option value="">-- Choose From Your Doctors List --</option>
                {bookedDoctors && bookedDoctors.map((item, index) => {
               
                  const currentId = item.doctorId || item.id || item._id || index;
                  const currentName = item.doctorName || item.name || "Unknown Doctor";
                  
                  return (
                    <option key={currentId} value={currentId}>
                      {currentName} {item.specialization ? `— ${item.specialization}` : ""}
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