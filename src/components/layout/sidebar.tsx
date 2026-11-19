"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Compass,
  Calendar,
  FolderLock,
  KeyRound,
  Bell,
  Settings,
  ShieldCheck,
  Sparkles,
  Layers,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useOffline } from "@/context/OfflineContext";

export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "My Examinations",
    href: "/examinations",
    icon: GraduationCap,
    badge: "7",
  },
  {
    name: "Exam Discovery",
    href: "/discovery",
    icon: Compass,
    badge: "New",
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    badge: null,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FolderLock,
    badge: null,
  },
  {
    name: "Password Vault",
    href: "/vault",
    icon: KeyRound,
    badge: "AES",
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    badge: "4",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    badge: null,
  },
  {
    name: "Live Dev Progress",
    href: "/progress",
    icon: Layers,
    badge: "Stage 11",
  },
];

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { profile, isConfigured, setIsAuthModalOpen } = useAuth();
  const { effectiveOnline, pendingCount, setIsStorageModalOpen } = useOffline();

  const userInitials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "EV";

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#0d1017] border-r border-[#1e2536] text-slate-300 w-64 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-[#1e2536]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-bold">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-white">
              Exam<span className="text-indigo-400">Vault</span>
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-indigo-500/30 text-indigo-300">
              PRO
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400">Exam Lifecycle Hub</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Main Navigation
        </div>
        {NAVIGATION_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#151a26]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-indigo-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-semibold",
                    item.badge === "New"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : item.badge === "Stage 3"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : item.badge === "AES"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-[#1f2638] text-slate-300"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Live Progress Widget */}
        <div className="pt-4 mt-3 border-t border-[#1a2133] space-y-2">
          {/* Offline & Sync Status Trigger */}
          <button
            type="button"
            onClick={() => setIsStorageModalOpen(true)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-[#121622] hover:bg-[#161c2b] border border-[#1e2536] text-xs transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <div>
                <span className="font-semibold text-slate-200 block text-[11px]">
                  IndexedDB Storage
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  {effectiveOnline ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Online • Synced
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-ping" />
                      Offline Mode
                    </>
                  )}
                </span>
              </div>
            </div>
            {pendingCount > 0 ? (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px]">
                {pendingCount}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 font-mono">Dexie v4</span>
            )}
          </button>

          <Link
            href="/progress"
            onClick={onNavigate}
            className="block p-2.5 rounded-lg bg-[#121622] border border-[#1e2536] hover:border-indigo-500/40 text-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5 group-hover:text-indigo-300 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Live Roadmap
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed mb-1">
              Stage 11 IndexedDB & Offline Sync Active.
            </p>
            <div className="flex items-center text-[10px] text-indigo-400 font-semibold group-hover:underline">
              View In-App Progress →
            </div>
          </Link>
        </div>
      </div>

      {/* User / Sync Status Footer */}
      <div className="p-3 border-t border-[#1e2536] bg-[#0b0e14]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#121620] border border-[#1d2335]">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 group-hover:ring-1 group-hover:ring-indigo-400 transition-all">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                {profile?.fullName ?? "Candidate Sign In"}
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {isConfigured ? "Supabase Connected" : "Local Demo Mode"}
              </span>
            </div>
          </button>
          <Link
            href="/settings"
            className="text-slate-400 hover:text-slate-200 p-1 flex-shrink-0"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
