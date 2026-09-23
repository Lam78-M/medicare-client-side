"use client";

import { useEffect, useState } from "react";
import {
  LayoutSideContentLeft,
  Bell,
  Envelope,
  House,
  Magnifier,
  Person,
  Paperclip,
  Xmark,
} from "@gravity-ui/icons";

import { Button } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function DashboardSidebar() {
  const [userRole, setUserRole] = useState("patient");
  const [userName, setUserName] = useState("User");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

      const session = await authClient.getSession();
      if (session?.data?.user?.name) {
        setUserName(session.data.user.name);
      }
    };

    fetchSession();
  }, []);

  const menuConfig = {
    patient: [
      { icon: House, label: "Overview", href: "/dashboard/patient" },
      { icon: House, label: "Medi-Ai", href: "/dashboard/patient/aichatbot" },
      { icon: Magnifier, label: "My Appointments", href: "/dashboard/patient/myAppointInfo" },
      { icon: Bell, label: "Payments History", href: "/dashboard/patient/paymentHistory" },
      { icon: Envelope, label: "FeedBack Reviews", href: "/dashboard/patient/reviews" },
      { icon: Person, label: "Wellness Hub", href: "/wellness" },
      { icon: Person, label: "My Profile", href: "/dashboard/patient/myProfile" },
      { icon: Paperclip, label: "Patients Prescription", href: "/dashboard/patient/patientsPrescription" },
    ],
    doctors: [
      { icon: House, label: "Overview", href: "/dashboard/doctors" },
      { icon: LayoutSideContentLeft, label: "Manage Schedule & Days", href: "/dashboard/doctors/doctorTimeManage" },
      { icon: Magnifier, label: "Appointment Requests", href: "/dashboard/doctors/patientRequests" },
      { icon: Envelope, label: "Prescription Care", href: "/dashboard/doctors/patientsPrescription" },
      { icon: Person, label: "Wellness Hub", href: "/wellness" },
      { icon: Person, label: "Profile Settings", href: "/dashboard/doctors/doctorProfile" },
    ],
    admin: [
      { icon: House, label: "Overview Admin", href: "/dashboard/admin" },
      { icon: Person, label: "Manage Users", href: "/dashboard/admin/userManage" },
      { icon: LayoutSideContentLeft, label: "Manage Doctors", href: "/dashboard/admin/manageDoctors" },
      { icon: Magnifier, label: "Manage Appointments", href: "/dashboard/admin/manageAppointment" },
      { icon: Bell, label: "Payment Management", href: "/dashboard/admin/stripeCashFlows" },
      { icon: Person, label: "Wellness Hub", href: "/wellness" },
    ],
  };

  const navItems = menuConfig[userRole] || menuConfig.patient;
  const initials = userName?.substring(0, 2)?.toUpperCase() || "U";

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF85BB] text-lg font-bold text-white shadow-sm">
            ❤️
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">MediCare</h2>
            <p className="text-xs font-semibold capitalize tracking-wide text-[#FFCEE3]">
              {userRole === "doctors" ? "Doctor Workspace" : `${userRole} Console`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="rounded-lg border border-white/10 p-1 text-white hover:text-gray-300 lg:hidden"
        >
          <Xmark className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href || "#"}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-1 hover:bg-white/10 ${
              index === 0 ? "bg-[#FF85BB] font-bold text-[#021A54]" : "text-gray-200 hover:text-white"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white/5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFCEE3] text-sm font-bold text-[#021A54]">
            {initials}
          </div>
          <div>
            <h2 className="max-w-[140px] truncate text-sm font-bold text-white">{userName}</h2>
            <p className="text-xs capitalize text-[#FFCEE3]/70">Active Mode</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden min-h-screen w-full max-w-[280px] flex-col rounded-[28px] border border-white/10 bg-[#021A54] p-4 text-white shadow-[0_20px_40px_rgba(2,26,84,0.18)] lg:flex">
        {navContent}
      </aside>

      <div className="lg:hidden">
        <Button
          variant="flat"
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-[#021A54] font-semibold text-white"
        >
          <LayoutSideContentLeft />
          Open Menu
        </Button>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative flex h-full w-full max-w-[290px] flex-1 flex-col rounded-r-[28px] border-r border-white/10 bg-[#021A54] p-4 text-white shadow-xl">
              {navContent}
            </div>
          </div>
        )}
      </div>
    </>
  );
}