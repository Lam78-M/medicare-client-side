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
} from "@gravity-ui/icons";

import { Button, Drawer } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client"; // 🚀 Better Auth import

export function DashboardSidebar() {
  const [userRole, setUserRole] = useState("patient"); // Default 'patient' role
  const [userName, setUserName] = useState("User");

  // 📡 Better Auth theke dynamic logged-in user er information ber kora
useEffect(() => {
  const fetchSession = async () => {
    // Prothome local storage check korbo, na paile better auth session nibe
    const savedRole = localStorage.getItem("user_role");
    
    if (savedRole) {
      setUserRole(savedRole); // Dynamic direct setup
    } else {
      const session = await authClient.getSession();
      if (session?.data?.user?.role) {
        setUserRole(session.data.user.role);
      }
    }
  };
  
  fetchSession();
}, []);

  // 🛠️ ROLE ONUSHARE ALADA ALADA DASHBOARD LINKS (Assignment Criteria Complete)
  const menuConfig = {
    // 🧑‍ Patients Menu 
    patient: [
      { icon: House, label: "Overview", href: "/dashboard/patient" },
      { icon: Magnifier, label: "My Appointments", href: "/dashboard/patient/myAppointInfo" },
      { icon: Bell, label: "Payments History", href: "/dashboard/patient/payments" },
      { icon: Envelope, label: "FeedBack Reviews", href: "/dashboard/patient/reviews" },
      { icon: Person, label: "My Profile", href: "/dashboard/patient/myProfile" },
    ],
    // 🩺 Doctors Menu (Database standard capitalization)
    doctors: [
      { icon: House, label: "Overview", href: "/dashboard/doctors" },
      { icon: LayoutSideContentLeft, label: "Manage Schedule & Days", href: "/dashboard/doctors/doctorTimeManage" },
      { icon: Magnifier, label: "Appointment Requests", href: "/dashboard/doctors/patientRequests" },
      { icon: Envelope, label: "Prescription Care", href: "/dashboard/doctors/prescriptions" },
      { icon: Person, label: "Profile Settings", href: "/dashboard/doctors/doctorProfile" },
    ],
    // 👑 Admin Menu
    admin: [
      { icon: House, label: "Overview Admin", href: "/dashboard/admin" },
      { icon: Person, label: "Manage Users", href: "/dashboard/admin/users" },
      { icon: LayoutSideContentLeft, label: "Manage Doctors", href: "/dashboard/admin/doctors" },
      { icon: Magnifier, label: "Manage Appointments", href: "/dashboard/admin/appointments" },
      { icon: Bell, label: "Payment Management", href: "/dashboard/admin/payments" },
    ],
  };

  // Roll meshano dynamic filter array mapping target pointer
  const navItems = menuConfig[userRole] || menuConfig.patient;

  const navContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
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
          // 🚀 Button element swap kore standard Next link banano holo design drop chara
          <Link
            key={item.label}
            href={item.href || "#"}
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
      {/* Desktop Sidebar (Tomar original grid layer wrapper strictly optimized) */}
      <aside className="hidden lg:flex flex-col w-72 min-h-screen border-r rounded-2xl bg-[#021A54] text-white border-white/10 p-4">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <div className="lg:hidden p-3">
        <Drawer>
          <Button variant="flat" className="bg-[#021A54] text-white font-semibold">
            <LayoutSideContentLeft />
            Open Menu
          </Button>

          <Drawer.Backdrop>
            <Drawer.Content placement="left" className="bg-[#021A54] text-white p-0">
              <Drawer.Dialog className="bg-[#021A54] border-0 h-full">
                <Drawer.CloseTrigger className="text-white" />

                <Drawer.Header className="border-b border-white/10">
                  <Drawer.Heading className="text-white font-bold">
                    MediCare Control Hub
                  </Drawer.Heading>
                </Drawer.Header>

                <Drawer.Body className="p-4 bg-[#021A54]">
                  {navContent}
                </Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}