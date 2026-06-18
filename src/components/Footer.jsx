"use client";
import Link from "next/link";

import { Heart,  Envelope, LocationArrow } from "@gravity-ui/icons";

import { PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#021A54] text-slate-300 border-t border-white/5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 py-16 ">
        
        {/* Col 1: Logo & Statement */}
        <div className="space-y-4">
          <div className="text-white text-2xl font-bold flex items-center gap-2">
            <Heart className="text-[#FF85BB]" style={{ width: '28px', height: '28px' }} />
            <span>MediCare<span className="text-[#FF85BB]">Connect</span></span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            A modern, centralized online healthcare platform bridging the gap between exceptional doctors and patients.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h3 className="text-white font-bold mb-5 text-lg border-b border-[#FF85BB]/20 pb-2">Quick Links</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link href="/" className="hover:text-[#FF85BB] transition">Home</Link></li>
            <li><Link href="/doctors" className="hover:text-[#FF85BB] transition">Find Doctors</Link></li>
            <li><Link href="/about" className="hover:text-[#FF85BB] transition">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#FF85BB] transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* Col 3: Contact & Emergency */}
        <div>
          <h3 className="text-white font-bold mb-5 text-lg border-b border-[#FF85BB]/20 pb-2">Contact Info</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <LocationArrow className="text-[#FF85BB]" style={{ width: '18px', height: '18px' }} /> 
              Dhaka, Bangladesh
            </li>
            <li className="flex items-center gap-2">
              <Envelope className="text-[#FF85BB]" style={{ width: '18px', height: '18px' }} /> 
              support@medicare.com
            </li>
          </ul>
          <div className="mt-5 bg-[#FFCEE3] text-[#021A54] p-3.5 rounded-xl border border-[#FF85BB]/50 text-center shadow-md">
            <span className="text-xs uppercase font-extrabold tracking-widest block text-[#021A54]/70 mb-0.5">Emergency Hotline</span>
            <span className="text-2xl font-black flex items-center justify-center gap-2">
              <PhoneCall size={22} className="text-[#FF85BB] animate-bounce" /> 10666
            </span>
          </div>
        </div>

        {/* Col 4: Social Links (এখানে পিওর এবং রেসপন্সিভ SVG দেওয়া হয়েছে) */}
        <div>
          <h3 className="text-white font-bold mb-5 text-lg border-b border-[#FF85BB]/20 pb-2">Follow Us</h3>
          <p className="text-sm text-slate-400 mb-4">Stay updated with our medical articles and news updates.</p>
          <div className="flex gap-4">
            
            {/* Facebook SVG */}
            <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#FF85BB] hover:text-white transition-all text-white" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            
            {/* Twitter / X SVG */}
            <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#FF85BB] hover:text-white transition-all text-white" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            
            {/* Instagram SVG */}
            <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-[#FF85BB] hover:text-white transition-all text-white" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>

          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6 text-center text-xs text-slate-500 font-medium bg-black/10">
        &copy; {new Date().getFullYear()} MediCare Connect. All rights reserved. Built with Unique UX.
      </div>
    </footer>
  );
}