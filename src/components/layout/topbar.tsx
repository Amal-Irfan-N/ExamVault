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
import { Input } from "@/components/ui/input";
import { LiveProgressModal } from "@/components/progress/live-progress-modal";

interface TopbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export function Topbar({ onToggleMobileMenu, isMobileMenuOpen }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProgressOpen, setIsProgressOpen] = useState(false);

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

          {/* Global Search bar on Desktop */}
          <div className="hidden md:flex items-center relative w-72 lg:w-96">
            <Search className="w-4 h-4 absolute left-3 text-slate-500 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search examinations, reg. numbers, orgs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 h-9 bg-[#121620] border-[#222a3d] text-xs text-slate-200 placeholder:text-slate-500 rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
            <kbd className="hidden lg:inline-flex absolute right-2.5 top-2 text-[10px] font-mono text-slate-500 bg-[#1a2133] px-1.5 py-0.5 rounded border border-[#26314a]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right side: Actions, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Live Progress Tracker Button */}
          <button
            onClick={() => setIsProgressOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs text-indigo-300 transition-all cursor-pointer group"
            title="Click to view full Live Progress Tracker"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white group-hover:text-indigo-200">Live Progress</span>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/20 px-1.5 py-0.2 rounded font-mono">
              Stage 1
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
          <Link href="/examinations?action=new">
            <Button size="sm" className="gap-1.5 text-xs font-semibold h-8 px-3">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Examination</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </Link>

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
