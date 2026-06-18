"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 🚀 রিডাইরেক্ট ফিক্স করার জন্য ইম্পোর্ট করা হলো
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail, Lock, Cast, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client"; // তোমার auth-client পাথ

export default function SignInPage() {
  const router = useRouter(); // 🚀 রাউটার ইনিশিয়েলাইজেশন
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // কাস্টম থিম টোস্ট
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      style: {
        background: "#021A54",
        color: "#ffffff",
        borderRadius: "16px",
        border: "1px solid rgba(255, 133, 187, 0.3)",
        fontWeight: "600",
      },
      progressStyle: {
        background: "linear-gradient(to right, #FF85BB, #FFCEE3)",
      },
    });
  };

  // 📧 Better Auth ইমেইল সাইন-ইন
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // formData থেকে ডাটা ডিস্ট্রাকচার করা হলো (যাতে reference error না আসে)
    const { email, password } = formData;

    if (!email || !password) {
      showToast("Please enter both email and password!", "error");
      setLoading(false);
      return;
    }

    try {
      // 🚀 Better Auth সাইন-ইন কল
      const { data, error: authError } = await authClient.signIn.email({
        email: email,
        password: password,
        callbackURL: "/", // সফল হলে হোম পেজে রিডাইরেক্ট করবে
      });

      if (authError) {
        showToast(authError.message || "Invalid email or password!", "error");
        return;
      }

      showToast("Welcome back! Redirecting... 🚀");
      
      // ⚡ ব্যাকআপ রিডাইরেক্ট (যদি callbackURL কোন কারণে ব্রাউজারে আটকে যায়)
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);

    } catch (err) {
      showToast(err.message || "Something went wrong. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Better Auth গুগল লগইন ও রিডাইরেক্ট
  const handleGoogleLogin = async () => {
    try {
      showToast("Connecting to Google...", "info");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", // 🚀 গুগলে লগইন শেষে সরাসরি হোম পেজে পাঠাবে
      });
    } catch (err) {
      showToast("Google sign in failed!", "error");
    }
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* ব্যাকগ্রাউন্ড গ্লসি আর্ট */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FFCEE3]/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF85BB]/15 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
        className="w-full max-w-lg bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(2,26,84,0.08)] relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-[#021A54] tracking-tight">
            Welcome <span className="text-[#FF85BB]">Back</span>
          </h2>
          <p className="text-slate-500 font-semibold text-sm">
            Sign in to access your secure medical portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ইমেইল */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#021A54]/80 px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
                className="w-full bg-white/80 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-[#021A54] outline-none focus:border-[#FF85BB] focus:ring-4 focus:ring-[#FFCEE3]/30 transition-all"
              />
            </div>
          </div>

          {/* পাসওয়ার্ড */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#021A54]/80">Password</label>
              <Link href="/auth/forgot-password" className="text-xs font-bold text-[#FF85BB] hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/80 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-[#021A54] outline-none focus:border-[#FF85BB] focus:ring-4 focus:ring-[#FFCEE3]/30 transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2, boxShadow: "0px 10px 25px rgba(2, 26, 84, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#021A54] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2 text-sm tracking-wide disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? "Signing In..." : "Sign In"}
            <ArrowRight size={16} />
          </motion.button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full absolute"></div>
          <span className="bg-white/90 backdrop-blur-sm px-3 text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">
            or connect with
          </span>
        </div>

        {/* 🌐 গুগল লগইন বাটন */}
        <motion.button
          whileHover={{ y: -2, borderColor: "#FF85BB", backgroundColor: "rgba(255,206,227,0.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 font-bold text-[#021A54] transition-all flex items-center justify-center gap-3 text-sm cursor-pointer"
        >
          <Cast size={18} className="text-[#FF85BB]" />
          Google Account
        </motion.button>

        <p className="text-center text-sm font-medium text-slate-500 mt-8">
          New to MediCare Connect?{" "}
          <Link href="/auth/signup" className="text-[#FF85BB] font-bold hover:underline transition-all">
            Create an account
          </Link>
        </p>
      </motion.div>

      <ToastContainer />
    </main>
  );
}