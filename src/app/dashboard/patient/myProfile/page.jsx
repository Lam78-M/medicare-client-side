"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; // Better Auth import
import { User, Mail, ShieldAlert, HeartPulse, CalendarDays, Award } from "lucide-react";

export default function MyProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setProfileData(session.data.user);
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-[#021A54]">
        Loading Profile Data... ⏳
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg font-semibold text-red-500">
        Please login to see your profile! ⚠️
      </div>
    );
  }

  // ⚡ ওস্তাদ লজিক: রোল লোকাল ভ্যারিয়েবলে স্টোর করা (patient / doctors / admin)
  const role = profileData.role || "patient";

  return (
    <div className="p-6 bg-[#F5F5F5] min-h-screen flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md border border-[#FFCEE3] overflow-hidden">
        
        {/* Banner Card top cover */}
        <div className="bg-[#021A54] p-6 text-white flex items-center gap-4">
          <div className="h-20 w-20 bg-[#FFCEE3] text-[#021A54] rounded-full flex items-center justify-center font-bold text-2xl uppercase shadow-inner">
            {profileData.name ? profileData.name.substring(0, 2) : "ME"}
          </div>
          <div>
            <h2 className="text-2xl font-bold capitalize">{profileData.name || "User Name"}</h2>
            <span className="inline-block mt-1 px-3 py-1 bg-[#FF85BB] text-[#021A54] font-bold text-xs rounded-full uppercase tracking-wider">
              {role === "doctors" ? "🩺 Verified Doctor" : `🛡️ ${role}`}
            </span>
          </div>
        </div>

        {/* Details Grid Form */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-bold text-[#021A54] border-b pb-2">Account Credentials</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name display input */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border">
              <User className="text-[#021A54] h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Full Name</p>
                <p className="text-sm font-bold text-gray-700">{profileData.name}</p>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border">
              <Mail className="text-[#021A54] h-5 w-5 shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase">Email Address</p>
                <p className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{profileData.email}</p>
              </div>
            </div>
          </div>

          {/* 🚀 DYNAMIC CORNER BASED ON USER ROLE */}
          <h3 className="text-lg font-bold text-[#021A54] border-b pb-2 pt-2">Medical & Professional Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role === "patient" && (
              <>
                <div className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                  <HeartPulse className="text-red-500 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Blood Group</p>
                    <p className="text-sm font-bold text-gray-700">O+ (Positive)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                  <CalendarDays className="text-blue-500 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Age Criteria</p>
                    <p className="text-sm font-bold text-gray-700">26 Years</p>
                  </div>
                </div>
              </>
            )}

            {role === "doctors" && (
              <>
                <div className="flex items-center gap-3 p-3 bg-green-50/50 rounded-xl border border-green-100">
                  <Award className="text-green-500 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Specialization</p>
                    <p className="text-sm font-bold text-gray-700">Cardiologist (Heart Specialist)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <CalendarDays className="text-amber-500 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Experience</p>
                    <p className="text-sm font-bold text-gray-700">8+ Years Active Practice</p>
                  </div>
                </div>
              </>
            )}

            {role === "admin" && (
              <>
                <div className="flex items-center gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                  <ShieldAlert className="text-purple-500 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Access Level</p>
                    <p className="text-sm font-bold text-gray-700">Root Super Admin / Owner</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <User className="text-indigo-500 h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Security Token</p>
                    <p className="text-sm font-bold text-gray-700">Active Node Secured</p>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}