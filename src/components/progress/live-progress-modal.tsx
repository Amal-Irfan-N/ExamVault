"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Layers,
  Code2,
  Database,
  Shield,
  Calendar,
  Smartphone,
  Lock,
  Compass,
  RefreshCw,
  FolderLock,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface StageProgress {
  id: number;
  name: string;
  category: string;
  status: "completed" | "in_progress" | "ready" | "pending";
  description: string;
  completedTasks: string[];
  pendingTasks: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export const STAGES_DATA: StageProgress[] = [
  {
    id: 1,
    name: "Stage 1: Project Initialization & Design System",
    category: "Foundation",
    status: "completed",
    description: "Next.js App Router, TypeScript, Tailwind CSS dark SaaS theme, responsive navigation, and initial dashboard.",
    completedTasks: [
      "Next.js App Router & React 19 initialization",
      "Tailwind CSS dark charcoal design system (#0b0d13, #121620)",
      "Indigo (#6366f1) & Blue (#3b82f6) accent styling",
      "Desktop sticky sidebar with PRO branding & module badges",
      "Mobile 5-tab bottom navigation with Android viewport optimization",
      "Global search topbar with keyboard shortcut (⌘K)",
      "Dynamic dashboard stats calculated from actual examination records",
      "Upcoming deadlines engine with day countdown and urgency badges",
      "Upcoming test dates engine with admit card status",
      "All 8 core module routes created without 404s",
      "ESLint code quality passing with 0 errors & 0 warnings",
      "Production build passing cleanly in Turbopack",
    ],
    pendingTasks: [],
    icon: Layers,
  },
  {
    id: 2,
    name: "Stage 2: Responsive Dashboard & Deep Navigation",
    category: "Dashboard",
    status: "completed",
    description: "Multi-dimensional filter controls, quick-add drawer, command palette search modal, and responsive mobile enhancements.",
    completedTasks: [
      "Primary statistics grid (7 core KPI metrics) dynamically computed",
      "Global Command Palette (⌘K / Ctrl+K) with keyboard shortcuts & quick jump",
      "Interactive Quick-Add Examination modal supporting all 4 sub-sections",
      "Reactive ExaminationContext with client localStorage persistence",
      "Multi-dimensional filter toolbar (Recruitment Year, Status Group, Sector)",
      "View mode switcher (Cards Grid vs Compact List)",
      "Instant state updates across Dashboard, KPIs, Deadlines & Tracked Exams",
      "Mobile bottom navigation and touch drawer optimization",
    ],
    pendingTasks: [],
    icon: Code2,
  },
  {
    id: 3,
    name: "Stage 3: Database Architecture & Authentication",
    category: "Backend",
    status: "completed",
    description: "Supabase PostgreSQL normalized schema, Row Level Security (RLS) policies, and Supabase Authentication.",
    completedTasks: [
      "12 normalized PostgreSQL tables designed with UUID primary keys",
      "Strict Row Level Security (RLS) policies guaranteeing user isolation",
      "Supabase Client & SSR SDK (@supabase/supabase-js, @supabase/ssr) integrated",
      "Full TypeScript database models (src/types/database.ts) for query safety",
      "AuthProvider & AuthModal supporting Sign In, Sign Up & local demo fallback",
      "Automated updated_at triggers and handle_new_user auth hook",
      "Performance indexes on user_id, exam_id, dates & status columns",
      "Database migration script: supabase/migrations/20261119000000_init_examvault_schema.sql",
    ],
    pendingTasks: [],
    icon: Database,
  },
  {
    id: 4,
    name: "Stage 4: Examination Management",
    category: "Core Features",
    status: "ready",
    description: "Comprehensive CRUD operations for examinations across UPSC, SSC, ISRO, DRDO, GATE, State PSC, Banking, and PSU.",
    completedTasks: [
      "Examinations list view with category filters",
      "Full examination data structure with 4 sub-sections",
      "Interactive Quick-Add modal and client persistence",
    ],
    pendingTasks: [
      "Interactive Edit Examination modal & form validation",
      "Archive and unarchive completed examinations",
      "Delete with confirmation safeguard",
      "Advanced search and multi-tag filtering",
    ],
    icon: GraduationCap,
  },
  {
    id: 5,
    name: "Stage 5: Examination Details & Lifecycle Timeline",
    category: "Core Features",
    status: "pending",
    description: "Visual examination lifecycle progress tracking across all 18 examination states with certainty indicators.",
    completedTasks: [
      "18 status badges with semantic colors and icons",
      "Date certainty badges (confirmed, tentative, unannounced)",
    ],
    pendingTasks: [
      "Visual timeline graph from Notification -> Exam -> Key -> Result",
      "Milestone completion checkboxes",
      "One-click status transition stepper",
    ],
    icon: Clock,
  },
  {
    id: 6,
    name: "Stage 6: Examination Document Vault",
    category: "Storage",
    status: "pending",
    description: "Dedicated private storage for official notifications, application forms, payment receipts, hall tickets, and scorecards.",
    completedTasks: [
      "14 document categories defined",
      "Document metadata cards and upload UI scaffolded",
    ],
    pendingTasks: [
      "Supabase Storage private bucket integration",
      "Direct PDF and Image viewer modal",
      "Camera scanning via browser MediaDevices API",
      "File size validation & mime-type restrictions",
    ],
    icon: FolderLock,
  },
  {
    id: 7,
    name: "Stage 7: Secure Credential & Password Vault",
    category: "Security",
    status: "pending",
    description: "Client-side zero-knowledge encrypted vault using AES-GCM and PBKDF2 for recruitment portal logins.",
    completedTasks: [
      "Credential cards with copy-to-clipboard functionality",
      "Zero-knowledge architecture design",
    ],
    pendingTasks: [
      "Web Crypto API AES-GCM 256-bit client-side encryption",
      "PBKDF2 key derivation from Master Password",
      "Automatic vault locking on 15-minute inactivity",
      "Encrypted sync to Supabase (ciphertext only)",
    ],
    icon: Lock,
  },
  {
    id: 8,
    name: "Stage 8: Calendar & Reminder System",
    category: "Planning",
    status: "pending",
    description: "Interactive calendar with Month, Week, and Agenda views; automated milestone notifications (30d, 15d, 7d, 3d, 1d, Day-of-Event).",
    completedTasks: [
      "Agenda view displaying upcoming exam dates and deadlines",
      "Reminder interval presets configured",
    ],
    pendingTasks: [
      "Full interactive monthly grid view",
      "Custom reminder date scheduling",
      "Browser Web Notification API integration",
    ],
    icon: Calendar,
  },
  {
    id: 9,
    name: "Stage 9: Automatic Recruitment Website Monitoring",
    category: "Automation",
    status: "pending",
    description: "Modular background worker monitoring official government portals for notifications, admit cards, and result announcements.",
    completedTasks: [
      "Monitoring alert notification cards & activity logs",
    ],
    pendingTasks: [
      "Scheduled backend worker / cron task",
      "Official website diff detection engine",
      "User confirmation flow before updating critical dates",
    ],
    icon: RefreshCw,
  },
  {
    id: 10,
    name: "Stage 10: Exam Discovery Hub",
    category: "Discovery",
    status: "pending",
    description: "Directory of verified competitive exams with qualification filters, deadlines, and one-click tracking.",
    completedTasks: [
      "Discovery catalog with qualification and sector filtering",
      "Interactive 'Track Exam' button",
    ],
    pendingTasks: [
      "Verified recruitment feed API",
      "Dynamic vacancy and deadline ingestion",
    ],
    icon: Compass,
  },
  {
    id: 11,
    name: "Stage 11: Local Storage & Offline Functionality",
    category: "Offline",
    status: "pending",
    description: "IndexedDB local database (Dexie.js) allowing full offline browsing, cached documents, and offline changes.",
    completedTasks: [
      "Client-side state architecture established",
    ],
    pendingTasks: [
      "Dexie.js / IndexedDB schema setup",
      "Offline cache for examination records & metadata",
      "Pending action queue for offline mutations",
    ],
    icon: Database,
  },
  {
    id: 12,
    name: "Stage 12: Cloud Synchronization",
    category: "Sync",
    status: "pending",
    description: "Bi-directional synchronization between IndexedDB and Supabase PostgreSQL with conflict resolution.",
    completedTasks: [
      "Sync status indicators built into UI sidebar",
    ],
    pendingTasks: [
      "Conflict resolution engine (Last-Write-Wins / Prompt)",
      "Sync queue replay on network reconnection",
      "Cross-device real-time sync via Supabase Realtime",
    ],
    icon: RefreshCw,
  },
  {
    id: 13,
    name: "Stage 13: PWA Installation & Web Push",
    category: "Mobile",
    status: "pending",
    description: "Progressive Web App installable on Samsung Android smartphones with offline service worker and Web Push.",
    completedTasks: [
      "Viewport-fit=cover & mobile touch-target styling",
      "Web app metadata in root layout",
    ],
    pendingTasks: [
      "manifest.webmanifest configuration",
      "Service worker registration with asset caching",
      "Web Push notification subscription flow",
    ],
    icon: Smartphone,
  },
  {
    id: 14,
    name: "Stage 14: Testing, Security Review & Deployment",
    category: "Production",
    status: "pending",
    description: "End-to-end security audit, automated tests, zero-plaintext credential verification, and Vercel production deployment.",
    completedTasks: [
      "ESLint code quality passing with 0 warnings",
      "Turbopack production build verified",
    ],
    pendingTasks: [
      "End-to-end user flow testing",
      "Security audit for credential encryption & RLS",
      "Production deployment on Vercel with environment variables",
    ],
    icon: Shield,
  },
];

interface LiveProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveProgressModal({ isOpen, onClose }: LiveProgressModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  if (!isOpen) return null;

  const totalStages = STAGES_DATA.length;
  const completedStages = STAGES_DATA.filter((s) => s.status === "completed").length;
  const readyStages = STAGES_DATA.filter((s) => s.status === "ready").length;
  const progressPercent = Math.round((completedStages / totalStages) * 100);

  const filteredStages = STAGES_DATA.filter((stage) => {
    if (selectedFilter === "completed") return stage.status === "completed";
    if (selectedFilter === "in_progress") return stage.status === "ready" || stage.status === "in_progress";
    if (selectedFilter === "pending") return stage.status === "pending";
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  ExamVault Live Development Progress
                </h2>
                <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live In-App Tracker
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Real-time milestone tracker across all 14 architectural implementation stages.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Progress Meter */}
        <div className="p-5 border-b border-[#1e2536] bg-[#0f131e]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-300">
                Implementation Velocity:
              </span>
              <span className="text-xs text-slate-400 ml-2">
                <strong className="text-emerald-400">{completedStages}</strong> of {totalStages} Stages Completed (
                <strong className="text-indigo-400">{readyStages}</strong> Next Stage Ready)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{progressPercent}%</span>
              <span className="text-xs text-slate-500">Overall Progress</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[#1b2233] rounded-full overflow-hidden p-0.5 border border-[#242e44]">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(progressPercent, 8)}%` }}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#182030] text-xs">
            <span className="text-slate-500 mr-1">Filter by status:</span>
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-[#141a27] text-slate-400 hover:text-white border border-[#20293d]"
              }`}
            >
              All Stages ({totalStages})
            </button>
            <button
              onClick={() => setSelectedFilter("completed")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilter === "completed"
                  ? "bg-emerald-600 text-white"
                  : "bg-[#141a27] text-emerald-400 hover:text-white border border-[#20293d]"
              }`}
            >
              Completed ({completedStages})
            </button>
            <button
              onClick={() => setSelectedFilter("in_progress")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilter === "in_progress"
                  ? "bg-amber-600 text-white"
                  : "bg-[#141a27] text-amber-400 hover:text-white border border-[#20293d]"
              }`}
            >
              Ready / Up Next ({readyStages})
            </button>
            <button
              onClick={() => setSelectedFilter("pending")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedFilter === "pending"
                  ? "bg-slate-700 text-white"
                  : "bg-[#141a27] text-slate-400 hover:text-white border border-[#20293d]"
              }`}
            >
              Pending ({totalStages - completedStages - readyStages})
            </button>
          </div>
        </div>

        {/* Scrollable Stage Cards */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filteredStages.map((stage) => {
            const Icon = stage.icon;
            const isCompleted = stage.status === "completed";
            const isReady = stage.status === "ready";

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? "bg-[#111724] border-emerald-500/30"
                    : isReady
                    ? "bg-[#141a28] border-indigo-500/40"
                    : "bg-[#0e121a] border-[#1b2233]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg border ${
                        isCompleted
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : isReady
                          ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400"
                          : "bg-[#141a26] border-[#222b3e] text-slate-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">
                          {stage.name}
                        </h3>
                        <Badge variant="outline" className="text-[10px] py-0 text-slate-400 border-[#242f47]">
                          {stage.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isCompleted && (
                      <Badge variant="success" className="text-xs font-semibold gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed & Verified
                      </Badge>
                    )}
                    {isReady && (
                      <Badge variant="default" className="text-xs font-semibold gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Ready to Execute
                      </Badge>
                    )}
                    {stage.status === "pending" && (
                      <Badge variant="secondary" className="text-xs font-medium">
                        Upcoming Phase
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Completed Tasks Checklist */}
                {stage.completedTasks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#1a2133]">
                    <div className="text-[11px] font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed & Verified Deliverables ({stage.completedTasks.length}):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {stage.completedTasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-300 bg-[#0a0d14]/60 p-1.5 rounded border border-[#161d2b]"
                        >
                          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Tasks */}
                {stage.pendingTasks.length > 0 && (
                  <div className="mt-3 pt-2">
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      Target Deliverables for this Stage ({stage.pendingTasks.length}):
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {stage.pendingTasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-400 bg-[#0a0d14]/30 p-1.5 rounded border border-[#161d2b]"
                        >
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e2536] bg-[#101420] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Source document: <span className="font-mono text-slate-300">DEVELOPMENT_PROGRESS.md</span>
          </div>
          <Button size="sm" onClick={onClose} className="h-8 text-xs font-semibold px-4">
            Close Progress View
          </Button>
        </div>
      </div>
    </div>
  );
}
