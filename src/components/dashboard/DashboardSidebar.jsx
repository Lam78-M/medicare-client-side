"use client";

import { useEffect, useState } from "react";
import {
  LayoutSideContentLeft,
  Bell,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
  Paperclip
  
} from "@gravity-ui/icons";

import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; 

export function DashboardSidebar() {
  const [userRole, setUserRole] = useState("patient"); // Default patient role
  const [userName, setUserName] = useState("User");
  
  // 📌 মোবাইল মেনু ওপেন/ক্লোজ স্টেট কন্ট্রোল করার জন্য
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Better auths dynamic login
  useEffect(() => {
    const fetchSession = async () => {
      const savedRole = localStorage.getItem("user_role");
      if (savedRole) {
        setUserRole(savedRole); 
      } else {
        const session = await authClient.getSession();
        if (session?.data?.user?.role) {
          setUserRole(session.data.user.role);
        }
      }
      
      // ইউজারনেম ডাইনামিকালি সেট করার জন্য (ঐচ্ছিক, সেশন থেকে ডেটা আসলে)
      const session = await authClient.getSession();
      if (session?.data?.user?.name) {
        setUserName(session.data.user.name);
      }
    };
    
    fetchSession();
  }, []);

  const menuConfig = {
    // Patients Menu--------------- 
    patient: [
      { icon: House, label: "Overview", href: "/dashboard/patient" },
      { icon: Magnifier, label: "My Appointments", href: "/dashboard/patient/myAppointInfo" },
      { icon: Bell, label: "Payments History", href: "/dashboard/patient/paymentHistory" },
      { icon: Envelope, label: "FeedBack Reviews", href: "/dashboard/patient/reviews" },
      { icon: Person, label: "My Profile", href: "/dashboard/patient/myProfile" },
      { icon: Paperclip, label: "Patients Prescription", href: "/dashboard/patient/patientsPrescription" },
    ],
    // Doctors Menu----------------  
    doctors: [
      { icon: House, label: "Overview", href: "/dashboard/doctors" },
      { icon: LayoutSideContentLeft, label: "Manage Schedule & Days", href: "/dashboard/doctors/doctorTimeManage" },
      { icon: Magnifier, label: "Appointment Requests", href: "/dashboard/doctors/patientRequests" },
      { icon: Envelope, label: "Prescription Care", href: "/dashboard/doctors/patientsPrescription" },
      { icon: Person, label: "Profile Settings", href: "/dashboard/doctors/doctorProfile" },
    ],
    // Admin Menu----------------- 
    admin: [
      { icon: House, label: "Overview Admin", href: "/dashboard/admin" },
      { icon: Person, label: "Manage Users", href: "/dashboard/admin/userManage" },
      { icon: LayoutSideContentLeft, label: "Manage Doctors", href: "/dashboard/admin/manageDoctors" },
      { icon: Magnifier, label: "Manage Appointments", href: "/dashboard/admin/manageAppointment" },
      { icon: Bell, label: "Payment Management", href: "/dashboard/admin/stripeCashFlows" },
    ],
  };

  const navItems = menuConfig[userRole] || menuConfig.patient;

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF85BB] text-lg font-bold text-white shadow-sm">
          ❤️
        </div>

        <div>
          <h2 className="font-bold text-lg text-white">MediCare</h2>
          <p className="text-xs text-[#FFCEE3] font-semibold capitalize tracking-wide">
            {userRole === "doctors" ? "Doctor Workspace" : `${userRole} Console`}
          </p>
        </div>
      </div>

      {/* Navigation Matrix */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href || "#"}
            // 📌 লিংকে ক্লিক করলে মেনুবারটি অটো বন্ধ হয়ে যাবে
            onClick={() => setIsMobileMenuOpen(false)}
            className={`
              flex items-center gap-3
              rounded-xl px-4 py-3
              text-sm font-medium
              transition-all duration-200
              hover:bg-white/10
              hover:translate-x-1
              ${
                index === 0
                  ? "bg-[#FF85BB] text-[#021A54] font-bold"
                  : "text-gray-200 hover:text-white"
              }
            `}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Profile Details */}
      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFCEE3] text-[#021A54] font-bold text-sm">
             {userName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-sm text-white truncate max-w-[140px]">
              {userName}
            </h2>
            <p className="text-xs text-[#FFCEE3]/70 capitalize">
              Active Mode
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (lg Screen) */}
      <aside className="hidden lg:flex flex-col w-72 min-h-screen border-r rounded-2xl bg-[#021A54] text-white border-white/10 p-4">
        {navContent}
      </aside>

      {/* Mobile Drawer (Responsive Screen) */}
      <div className="lg:hidden p-3">
        {/* ওপেন ট্র্রিগার বাটন */}
        <Button 
          variant="flat" 
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-[#021A54] text-white font-semibold"
        >
          <LayoutSideContentLeft />
          Open Menu
        </Button>
        
        {/* 
          📌isOpen এবং onOpenChange দিয়ে ড্রয়ার কন্ট্রোল করছি। 
          size="xs" বা max-w-[288px] ব্যবহার করে ড্রয়ারের সাইজ ফিক্সড করা হয়েছে যাতে পুরো স্ক্রিন ব্লু না হয়ে যায়।
        */}
        <Drawer 
          isOpen={isMobileMenuOpen} 
          onOpenChange={setIsMobileMenuOpen}
          size="xs" 
        >
          {/* 📌 Backdrop-কে ব্লার বা হালকা ট্রান্সপারেন্ট রাখা হয়েছে যাতে পেজের বাকি অংশ দেখা যায় */}
          <Drawer.Backdrop className="bg-black/20 backdrop-blur-sm" />
          
          <Drawer.Content 
            placement="left" 
            className="bg-[#021A54] text-white p-0 max-w-[288px]"
          >
            <Drawer.Dialog className="bg-[#021A54] border-0 h-full m-0 rounded-r-2xl shadow-xl">
              <Drawer.CloseTrigger className="text-white top-4 right-4 absolute z-50" />

              <Drawer.Header className="border-b border-white/10 p-4">
                <Drawer.Heading className="text-white font-bold text-md">
                  MediCare Control Hub
                </Drawer.Heading>
              </Drawer.Header>
              
              <Drawer.Body className="p-4 bg-[#021A54] overflow-y-auto">
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer>
      </div>
    </>
  );
}