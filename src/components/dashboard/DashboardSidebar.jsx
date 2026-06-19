"use client";

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

export function DashboardSidebar() {
  const navItems = [
    { icon: House, label: "Home" },
    { icon: Magnifier, label: "Search" },
    { icon: Bell, label: "Notifications" },
    { icon: Envelope, label: "Messages" },
    { icon: Person, label: "Profile" },
    { icon: Gear, label: "Settings" },
  ];

  const navContent = (
    <div className="flex h-full flex-col ">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
          ❤️
        </div>

        <div>
          <h2 className="font-bold text-lg">MediCare</h2>
          <p className="text-xs text-default-500">
            Dashboard
          </p>
          
        </div>

      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            className={`
              flex items-center gap-3
              rounded-xl px-4 py-3
              text-sm font-medium
              transition-all duration-200
              hover:bg-default-100
              hover:translate-x-1
              ${
                index === 0
                  ? "bg-primary/10 text-primary"
                  : "text-default-700"
              }
            `}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Profile */}
      <div className="mt-auto border-t border-default-200 pt-4">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-default-100 transition">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white font-semibold">
             ❤️
          </div>
    <div>
      <h2 className="font-bold text-lg">
        MediCare
      </h2>

      <p className="text-xs text-slate-400">
        Dashboard
      </p>
    </div>

        
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className=" hidden lg:flex flex-col w-72 min-h-screen border-r bg-[#021A54] rounded-2xl  text-white border-default-200 bg-content1 p-4">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <div className="lg:hidden p-3">
        <Drawer>
          <Button variant="flat" className="bg-[#021A54] text-white">
            <LayoutSideContentLeft />
            Menu
          </Button>

          <Drawer.Backdrop>
            <Drawer.Content placement="left">
              <Drawer.Dialog>
                <Drawer.CloseTrigger />

                <Drawer.Header>
                  <Drawer.Heading>
                    Navigation
                  </Drawer.Heading>
                </Drawer.Header>

                <Drawer.Body>
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