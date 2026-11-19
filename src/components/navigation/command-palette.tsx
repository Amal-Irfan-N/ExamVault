"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useExaminations } from "@/context/ExaminationContext";
import {
  Search,
  X,
  GraduationCap,
  Calendar,
  FolderLock,
  KeyRound,
  Bell,
  Settings,
  Plus,
  Sparkles,
  ArrowRight,
  Hash,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";

const QUICK_NAV = [
  { label: "Dashboard", href: "/", icon: GraduationCap },
  { label: "My Examinations", href: "/examinations", icon: GraduationCap },
  { label: "Exam Discovery", href: "/discovery", icon: Sparkles },
  { label: "Calendar Agenda", href: "/calendar", icon: Calendar },
  { label: "Document Vault", href: "/documents", icon: FolderLock },
  { label: "Password Vault", href: "/vault", icon: KeyRound },
  { label: "Notifications & Alerts", href: "/notifications", icon: Bell },
  { label: "Application Settings", href: "/settings", icon: Settings },
  { label: "Live Progress Roadmap", href: "/progress", icon: Sparkles },
];

export function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    examinations,
    setIsQuickAddOpen,
  } = useExaminations();

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isCommandPaletteOpen]);

  const handleClose = () => {
    setQuery("");
    setIsCommandPaletteOpen(false);
  };

  // Search filtered examinations
  const matchingExams = useMemo(() => {
    if (!query.trim()) return examinations.slice(0, 4);
    const q = query.toLowerCase();
    return examinations.filter(
      (e) =>
        e.examName.toLowerCase().includes(q) ||
        e.recruitingOrg.toLowerCase().includes(q) ||
        e.postName.toLowerCase().includes(q) ||
        (e.registrationNumber && e.registrationNumber.toLowerCase().includes(q))
    );
  }, [examinations, query]);

  const matchingNav = useMemo(() => {
    if (!query.trim()) return QUICK_NAV.slice(0, 5);
    const q = query.toLowerCase();
    return QUICK_NAV.filter((n) => n.label.toLowerCase().includes(q));
  }, [query]);

  const handleSelectRoute = (href: string) => {
    handleClose();
    router.push(href);
  };

  const handleSelectExam = (examId: string) => {
    handleClose();
    router.push(`/examinations?id=${examId}`);
  };

  const handleQuickAdd = () => {
    handleClose();
    setIsQuickAddOpen(true);
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-2xl bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto max-h-[80vh] animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1e2536] bg-[#121622]">
          <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search examinations, registration IDs, or quick-jump to modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono text-slate-400 bg-[#1a2133] px-2 py-0.5 rounded border border-[#26314a]">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-3 space-y-4">
          {/* Quick Action: Add Examination */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Quick Actions
            </div>
            <button
              onClick={handleQuickAdd}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#151b29] text-left transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 text-indigo-400">
                <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30">
                  <Plus className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-sm font-semibold text-white group-hover:text-indigo-300">
                  Add New Examination
                </span>
              </div>
              <span className="text-xs text-slate-500 flex items-center gap-1 group-hover:text-indigo-400">
                Open Form <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>

          {/* Examinations Matches */}
          {matchingExams.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Examinations ({matchingExams.length})
              </div>
              <div className="space-y-1">
                {matchingExams.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => handleSelectExam(exam.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#151b29] text-left transition-colors group cursor-pointer border border-transparent hover:border-[#222c3f]"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="text-xs font-bold text-white bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 rounded flex-shrink-0">
                        {exam.recruitingOrg}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-200 group-hover:text-indigo-300 truncate">
                          {exam.examName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{exam.postName}</span>
                          {exam.registrationNumber && (
                            <span className="flex items-center gap-0.5 font-mono text-slate-400">
                              <Hash className="w-3 h-3 text-slate-600" />
                              {exam.registrationNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={exam.status} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Module Matches */}
          {matchingNav.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Quick Jump to Module
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {matchingNav.map((nav) => {
                  const Icon = nav.icon;
                  return (
                    <button
                      key={nav.href}
                      onClick={() => handleSelectRoute(nav.href)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#151b29] text-left text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-[#1e2536]"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span>{nav.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#1e2536] bg-[#0f131f] flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Navigation: Click to jump</span>
            <span>•</span>
            <span>Press <kbd className="font-mono text-slate-400">ESC</kbd> to exit</span>
          </div>
          <Badge variant="outline" className="text-[10px] text-indigo-400 border-indigo-500/30">
            Stage 2 Command Engine
          </Badge>
        </div>
      </div>
    </div>
  );
}
