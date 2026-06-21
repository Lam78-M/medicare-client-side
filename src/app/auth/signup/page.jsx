"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 🚀 রাউটার ইম্পোর্ট করা হলো
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Mail, Lock, Image as ImageIcon, Cast, ArrowRight } from "lucide-react";
import {Description, Label, Radio, RadioGroup} from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";

export default function SignUpPage() {
  const router = useRouter(); // 🚀 রাউটার ইনিশিয়েলাইজেশন
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  // 🔥 ডাটাবেজের সাথে বানান ঠিক রাখতে ডিফল্ট ভ্যালু 'patient' রাখলাম, আর ডক্টর সিলেক্ট করলে 'doctors' যাবে
  const [role, setRole] = useState('patient'); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // কাস্টম টোস্ট স্টাইল
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 4000,
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

  // 📧 Better Auth ইমেইল রেজিস্ট্রেশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password, photoUrl } = formData;

    if (!name || !email || !password) {
      showToast("Please fill in all required fields!", "error");
      setLoading(false);
      return;
    }

    try {
      // 🔥 লক্ষ করো বন্ধু: callbackURL কেটে দিয়েছি যাতে Better Auth জোর করে হোমে না পাঠায়।
      // আমরা নিজেরা নিচে রোল চেক করে সঠিক ড্যাশবোর্ডে পাঠাবো।
      const { data, error: authError } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        image: photoUrl || undefined,
        role: role, // 'patient', 'doctors' অথবা 'admin' পাস হবে
      });

      if (authError) {
        showToast(authError.message || "Sign up failed!", "error");
        return;
      }

      showToast("Account created successfully! Redirecting to dashboard... ✨");
      
      // ⚡ ওস্তাদ ট্রিক: সাইন-আপ ডেটা থেকে রোল চেক করে সঠিক ড্যাশবোর্ডে পাঠানো
      // যদি data.user.role না পাও, তবে সরাসরি আমাদের লোকাল 'role' স্টেট ব্যবহার করলেই কাজ হয়ে যাবে!
      const userRole = data?.user?.role || role;
       localStorage.setItem("user_role", role)
      setTimeout(() => {
        if (userRole === "admin") {
          router.push("/dashboard/admin");
        } else if (userRole === "doctors") {
          router.push("/dashboard/doctors"); // ফোল্ডার স্ট্রাকচার /dashboard/doctor হলে
        } else {
          router.push("/dashboard/patient");
        }
        router.refresh();
      }, 1500);
      
    } catch (err) {
      showToast(err.message || "Something went wrong. Try again!", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🌐 Better Auth গুগল সোশ্যাল লগইন

  const handleGoogleSignIn = async () =>{
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/"
    })
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* গ্লসি ব্যাকগ্রাউন্ড আর্ট */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FFCEE3]/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF85BB]/15 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
        className="w-full max-w-lg bg-white/60 backdrop-blur-xl border border-white/80 rounded-[32px] p-8 md:p-10 shadow-[0_25px_50px_-12px_rgba(2,26,84,0.08)] relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-[#021A54] tracking-tight">
            Create <span className="text-[#FF85BB]">Account</span>
          </h2>
          <p className="text-slate-500 font-semibold text-sm">
            Join MediCare Connect today for premium healthcare access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* নাম */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#021A54]/80 px-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-white/80 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-[#021A54] outline-none focus:border-[#FF85BB] focus:ring-4 focus:ring-[#FFCEE3]/30 transition-all"
              />
            </div>
          </div>

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

          {/* ফটো ইউআরএল */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#021A54]/80 px-1">Photo URL (Optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="url"
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full bg-white/80 border border-slate-200/80 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold text-[#021A54] outline-none focus:border-[#FF85BB] focus:ring-4 focus:ring-[#FFCEE3]/30 transition-all"
              />
            </div>
          </div>

          {/* পাসওয়ার্ড */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#021A54]/80 px-1">Password</label>
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

          {/* role based name */}
          {/* role based name */}
<div className="flex flex-col gap-2">
  <Label className="text-xs font-bold uppercase tracking-wider text-[#021A54]/80 px-1 pb-2">
    Subscription Plan
  </Label>
  <RadioGroup onChange={value => setRole(value)} defaultValue="patient" name="role" orientation="horizontal" className="flex gap-4">
    
    {/* Starter */}
    <Radio value="patient">
      <Radio.Content>
        <Radio.Control>
          <Radio.Indicator  />
        </Radio.Control>
        <span className="text-sm font-bold text-[#021A54]">Patient</span>
      </Radio.Content>
    
    </Radio>

    {/* Pro */}
    <Radio value="doctors">
      <Radio.Content>
        <Radio.Control>
          <Radio.Indicator  />
        </Radio.Control>
        <span className="text-sm font-bold text-[#021A54]">Doctors</span>
      </Radio.Content>
    </Radio>

    {/* Teams */}
    <Radio value="admin">
      <Radio.Content>
        <Radio.Control>
          <Radio.Indicator />
        </Radio.Control>
        <span className="text-sm font-bold text-[#021A54]">Admin</span>
      </Radio.Content>
    </Radio>

  </RadioGroup>
</div>

          <motion.button
            whileHover={{ y: -2, boxShadow: "0px 10px 25px rgba(2, 26, 84, 0.15)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-[#021A54] text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2 text-sm tracking-wide disabled:opacity-50 cursor-pointer shadow-md"
          >
            {loading ? "Registering..." : "Create Account"}
            <ArrowRight size={16} />
          </motion.button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full absolute"></div>
          <span className="bg-white/90 backdrop-blur-sm px-3 text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">
            or continue with
          </span>
        </div>

        {/* 🌐 গুগল সাইন ইন বাটন */}
        <motion.button onClick={handleGoogleSignIn}
          whileHover={{ y: -2, borderColor: "#FF85BB", backgroundColor: "rgba(255,206,227,0.1)" }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 font-bold text-[#021A54] transition-all flex items-center justify-center gap-3 text-sm cursor-pointer"
        >
          <FaGoogle size={18} className="text-[#FF85BB]" />
          Google Account
        </motion.button>

        <p className="text-center text-sm font-medium text-slate-500 mt-8">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-[#FF85BB] font-bold hover:underline transition-all">
            Sign In here
          </Link>
        </p>
      </motion.div>

      <ToastContainer />
    </main>
  );
}