"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Plus,
  Menu,
  X,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveProgressModal } from "@/components/progress/live-progress-modal";
import { useExaminations } from "@/context/ExaminationContext";

interface TopbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export function Topbar({ onToggleMobileMenu, isMobileMenuOpen }: TopbarProps) {
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const { setIsCommandPaletteOpen, setIsQuickAddOpen } = useExaminations();

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-[#0b0e14]/90 backdrop-blur-md border-b border-[#1e2536]">
        {/* Left side: Mobile Toggle + Brand on Mobile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161c28] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-indigo-400" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              EV
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              Exam<span className="text-indigo-400">Vault</span>
            </span>
          </div>

          {/* Global Search Bar (Triggers Command Palette ⌘K) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden md:flex items-center justify-between w-72 lg:w-96 px-3 py-1.5 h-9 bg-[#121620] hover:bg-[#161b29] border border-[#222a3d] hover:border-[#2f3a52] rounded-lg text-xs text-slate-400 transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Search className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              <span className="truncate">Search exams, registration IDs, orgs...</span>
            </div>
            <kbd className="hidden lg:inline-flex text-[10px] font-mono text-slate-400 bg-[#1a2133] px-1.5 py-0.5 rounded border border-[#26314a]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side: Actions, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Trigger Icon */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161c28] transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Live Progress Tracker Button */}
          <button
            onClick={() => setIsProgressOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs text-indigo-300 transition-all cursor-pointer group"
            title="Click to view full Live Progress Tracker"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white group-hover:text-indigo-200 hidden sm:inline">Live Progress</span>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/20 px-1.5 py-0.2 rounded font-mono">
              Stage 2
            </span>
          </button>

          {/* Notifications Icon with Badge */}
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161c28] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0b0e14]" />
          </Link>

          {/* Calendar Quick Link */}
          <Link
            href="/calendar"
            className="hidden sm:flex p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#161c28] transition-colors"
            title="Calendar"
          >
            <Calendar className="w-4 h-4" />
          </Link>

          {/* Add Exam Quick Button */}
          <Button
            size="sm"
            onClick={() => setIsQuickAddOpen(true)}
            className="gap-1.5 text-xs font-semibold h-8 px-3 cursor-pointer bg-indigo-600 hover:bg-indigo-500 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Examination</span>
            <span className="sm:hidden">Add</span>
          </Button>

          {/* User Avatar */}
          <Link
            href="/settings"
            className="flex items-center gap-2 pl-1 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow ring-1 ring-white/10 group-hover:ring-indigo-400 transition-all">
              AV
            </div>
          </Link>
        </div>
      </header>

      {/* Live In-App Progress Modal */}
      <LiveProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
      />
    </>
  );
}
