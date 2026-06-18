"use client";
import { ArrowUpRight, ShieldCheck, Person } from "@gravity-ui/icons";
import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 ">
    
      <div className="bg-[#021A54] rounded-3xl overflow-hidden relative shadow-2xl border border-white/5">
        
   
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF85BB]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFCEE3]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-8 py-12 md:p-16 lg:p-20">
          
          {/* বাম কলাম: টেক্সট এবং কল-টু-অ্যাকশন বাটন */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            {/* ছোট একটি ব্যাজ */}
            <div className="inline-flex items-center gap-2 bg-[#FFCEE3]/10 border border-[#FF85BB]/30 text-[#FF85BB] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
              <ShieldCheck style={{ width: '14px', height: '14px' }} /> 100% Verified Medical Network
            </div>

            {/* মেইন h1 ট্যাগ */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15]">
              Skip the Waiting Room. <br />
              Meet Your <span className="text-[#FF85BB]">Doctor</span> Online.
            </h1>

            {/* সাব-টেক্সট */}
            <p className="text-slate-300 text-base md:text-lg font-medium max-w-xl leading-relaxed">
              Connect with top-rated, certified healthcare professionals instantly. 
              Book appointments, securely manage health records, and access quality care from home.
            </p>

            {/* 🎯 কল-টু-অ্যাকশন (CTA) বাটন সেকশন */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button className="bg-[#FF85BB] hover:bg-[#FF85BB]/90 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center gap-2 group text-sm tracking-wide border-none">
                Book An Appointment
                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" style={{ width: '16px', height: '16px' }} />
              </button>
              
              <button className="btn btn-outline border-slate-400 hover:bg-white/5 text-white font-semibold px-6 py-4 h-auto min-h-0 rounded-xl text-sm normal-case">
                See How It Works
              </button>
            </div>

            {/* স্ট্যাটিক ট্রাস্ট ইন্ডিকেটর ইনফো */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 gap-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-[#FF85BB]">
                  <Person style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">15,000+</h4>
                  <p className="text-xs text-slate-400 font-medium">Happy Patients</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-[#FF85BB]">
                  <ShieldCheck style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">4.9 / 5</h4>
                  <p className="text-xs text-slate-400 font-medium">Top Rated Doctors</p>
                </div>
              </div>
            </div>

          </div>

          {/* ডান কলাম: ডাক্তারের ছবি */}
          <div className="lg:col-span-5 flex justify-center z-10">
            <div className="relative w-full max-w-[380px] aspect-square lg:max-w-none lg:h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FF85BB]/20 to-[#FFCEE3]/20 rounded-full scale-95 animate-pulse"></div>
              
              {/* 🔒 এরর এড়াতে স্ট্যান্ডার্ড img ট্যাগ ব্যবহার করা হলো */}
         <Image
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600" 
                alt="Doctor Healthcare" 
                width={380}
                height={450}
                className="w-full h-full object-cover rounded-3xl border-4 border-white/10 shadow-2xl mix-blend-normal"
                priority // এটি দিলে ইমেজ লোড ফাস্ট হবে
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}