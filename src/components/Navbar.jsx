"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

import { Heart, LayoutCells, SignOut } from "@gravity-ui/icons";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // পরে Better Auth সেটআপ করলে এখানে ইউজার স্টেট কানেক্ট করবে (আপাতত null)
  const user = null; 

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Doctors", href: "/doctors" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="bg-[#021A54] text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Heart className="text-[#FF85BB] animate-pulse" style={{ width: '28px', height: '28px' }} />
              <span>MediCare<span className="text-[#FF85BB]">Connect</span></span>
            </Link>
          </div>

          {/* 2. Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 font-semibold">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-[#FF85BB] transition-colors duration-200">
                {link.name}
              </Link>
            ))}
          </div>

          {/* 3. Auth / Profile Area (Desktop) */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border-2 border-[#FF85BB]">
                  <div className="w-10 rounded-full">
                    <Image alt="Profile" src={user?.photoURL || "https://placehold.co/100"} />
                  </div>
                </div>
                {/* User Profile Dropdown */}
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl rounded-xl w-56 bg-[#FFCEE3] text-[#021A54] font-bold border border-[#FF85BB]">
                  <li className="px-3 py-2 text-sm text-[#021A54]/70 border-b border-[#FF85BB]/30 mb-1">
                    Hello, {user?.displayName || "User"}
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:bg-[#FF85BB] hover:text-white flex items-center gap-2 py-2.5 rounded-lg transition">
                      <LayoutCells style={{ width: '16px', height: '16px' }} /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <button className="text-red-600 hover:bg-red-100 flex items-center gap-2 py-2.5 rounded-lg transition mt-1">
                      <SignOut style={{ width: '16px', height: '16px' }} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link href="/login" className="bg-[#FF85BB] hover:bg-[#FF85BB]/90 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-sm tracking-wide">
                Login / Register
              </Link>
            )}
          </div>

          {/* 4. Mobile Menu Button (Hamburger) */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-[#FF85BB] p-2" aria-label="Toggle Menu">
              {isOpen ? (
                // Close (X) SVG
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              ) : (
                // Menu (Hamburger) SVG
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Mobile Responsive Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden bg-[#021A54] border-t border-white/10 px-4 pt-2 pb-6 space-y-2 font-semibold">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="block py-3 px-3 rounded-lg hover:bg-white/5 hover:text-[#FF85BB] transition">
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10">
            {user ? (
              <div className="space-y-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-3 px-3 rounded-xl bg-[#FFCEE3] text-[#021A54] font-bold">
                  <LayoutCells style={{ width: '18px', height: '18px' }} /> Dashboard
                </Link>
                <button className="w-full flex items-center gap-2 py-3 px-3 rounded-xl bg-red-600 text-white font-bold transition active:scale-95">
                  <SignOut style={{ width: '18px', height: '18px' }} /> Logout
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center bg-[#FF85BB] hover:bg-[#FF85BB]/90 text-white font-bold py-3 rounded-xl shadow-md transition active:scale-95 text-sm tracking-wide">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}