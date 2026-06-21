"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Heart, LogOut, ChevronDown, Menu, X } from "lucide-react";

import { Avatar } from "@heroui/react"; 

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু স্টেট
  const [dropdownOpen, setDropdownOpen] = useState(false); // ডেক্সটপ ড্রপডাউন স্টেট
  const dropdownRef = useRef(null);

  // Better Auth লাইভ সেশন ডাটা
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // বেসিক ন্যাভলিংকস
  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "Find Doctors", href: "/doctors" },
    { name: "About Us", href: "/aboutus" },
    { name: "Contact Us", href: "/contactus" },
  ];

  // 🚀 লজিক: ইউজার লগইন থাকলে ডেক্সটপ ও মোবাইল উভয় ন্যাভলিংকস এর সাথেই "Dashboard" যুক্ত হবে
  const navLinks = user 
    ? [...baseNavLinks, { name: "Dashboard", href: "/dashboard/patient" }] 
    : baseNavLinks;

  // ড্রপডাউনের বাইরে ক্লিক করলে মেনু বন্ধ করার ইফেক্ট
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🚪 Better Auth লগআউট হ্যান্ডলার
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setIsOpen(false);
            setDropdownOpen(false);
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-[#021A54] text-white sticky top-0 z-50 shadow-xl border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* ১. Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Heart className="text-[#FF85BB] fill-[#FF85BB]/20 animate-pulse" size={28} />
              <span>MediCare<span className="text-[#FF85BB]">Connect</span></span>
            </Link>
          </div>

          {/* ২. Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 font-semibold">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="transition-colors duration-200 text-sm tracking-wide hover:text-[#FF85BB]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ৩. Auth / Profile Area (Desktop) */}
          <div className="hidden lg:flex items-center">
            {isPending ? (
              <div className="w-6 h-6 border-2 border-[#FF85BB] border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              /* কাস্টম ড্রপডাউন কন্টেইনার */
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 transition-all cursor-pointer outline-none"
                >
                  {/* 👤 প্রিমিয়াম Avatar ক্যাপসুল ডিজাইন */}
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors">
                    <Avatar className="w-7 h-7 border-2 border-[#48d07e]">
                      <Avatar.Image alt={user?.name} src={user?.image} />
                      <Avatar.Fallback>
                        {user?.name?.charAt(0)}
                      </Avatar.Fallback>
                    </Avatar>

                    <span className="text-sm font-medium text-white max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                
                {/* 💎 ক্লিন ড্রপডাউন মেনু (শুধু ইমেইল এবং লগআউট) */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-[#021A54] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-2xl p-2 z-50 backdrop-blur-xl">
                    <div className="px-4 py-2.5 border-b border-white/10 mb-1">
                      <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-[#FFCEE3] truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer mt-1"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signup" className="bg-[#FF85BB] hover:bg-[#FF85BB]/90 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-sm tracking-wide">
                Login / Register
              </Link>
            )}
          </div>

          {/* ৪. Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-[#FF85BB] p-2 transition-colors">
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* ৫. Mobile Responsive Menu Dropdown (sm and md screens) */}
      {isOpen && (
        <div className="lg:hidden bg-[#021A54] border-t border-white/10 px-4 pt-2 pb-6 space-y-2 font-semibold">
          {/* ড্যাশবোর্ডসহ সব লিঙ্ক এখন এখানে একসাথে white দেখাবে এবং hover করলে pink হবে */}
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)} 
              className="block py-3 px-3 rounded-xl hover:bg-white/5 hover:text-[#FF85BB] transition-all text-sm"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-white/10">
            {isPending ? (
              <div className="flex justify-center py-2">
                <div className="w-6 h-6 border-2 border-[#FF85BB] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              /* 📱 ছোট স্ক্রিনের ইউজার প্রোফাইল কার্ড এবং লগআউট */
              <div className="space-y-3 px-2">
                <div className="flex items-center gap-3 py-3">
                  <Avatar className="w-10 h-10 border-2 border-[#48d07e]">
                    <Avatar.Image alt={user?.name} src={user?.image} />
                    <Avatar.Fallback>
                      {user?.name?.charAt(0)}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="truncate">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                </div>
                
                <button onClick={handleLogout} className="w-full flex items-center gap-2 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition active:scale-95 justify-center text-sm shadow-md cursor-pointer">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="block text-center bg-[#FF85BB] hover:bg-[#FF85BB]/90 text-white font-bold py-3 rounded-xl shadow-md transition active:scale-95 text-sm tracking-wide">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );   
}