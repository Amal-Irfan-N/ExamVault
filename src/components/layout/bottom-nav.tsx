"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Compass,
  Calendar,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Exams",
    href: "/examinations",
    icon: GraduationCap,
  },
  {
    name: "Discovery",
    href: "/discovery",
    icon: Compass,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    name: "Vault",
    href: "/vault",
    icon: KeyRound,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1017]/95 backdrop-blur-lg border-t border-[#1e2536] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-lg text-[10px] font-medium transition-colors select-none",
                isActive
                  ? "text-indigo-400"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <div
                className={cn(
                  "p-1 rounded-md transition-all",
                  isActive && "bg-indigo-500/15"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="mt-0.5">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
