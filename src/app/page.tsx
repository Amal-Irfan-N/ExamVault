"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  FileCheck2,
  Calendar,
  Clock,
  Award,
  AlertCircle,
  FileText,
  Filter,
  RotateCcw,
  LayoutGrid,
  List,
} from "lucide-react";
import { useExaminations } from "@/context/ExaminationContext";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DeadlineList } from "@/components/dashboard/deadline-list";
import { ExamDateList } from "@/components/dashboard/exam-date-list";
import { RecentExams } from "@/components/dashboard/recent-exams";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const {
    filteredExaminations,
    stats,
    upcomingDeadlines,
    upcomingExamDates,
    activities,
    selectedYear,
    setSelectedYear,
    selectedStatus,
    setSelectedStatus,
    selectedCategory,
    setSelectedCategory,
  } = useExaminations();

  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");

  const categories = ["all", "UPSC", "SSC", "ISRO", "DRDO", "GATE", "RRB", "State PSC", "Banking"];

  const hasActiveFilters =
    selectedYear !== "all" || selectedStatus !== "all" || selectedCategory !== "all";

  const clearFilters = () => {
    setSelectedYear("all");
    setSelectedStatus("all");
    setSelectedCategory("all");
  };

  return (
    <AppLayout>
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Examination Dashboard
            </h1>
            <Badge variant="outline" className="text-slate-400 border-[#232a3e] text-[11px]">
              {filteredExaminations.length} Active Records
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time tracking of competitive recruitments, deadlines, admit cards & results.
          </p>
        </div>

        <QuickActions />
      </div>

      {/* Welcome & Search Shortcut Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 via-[#131724] to-[#121620] border border-indigo-500/20 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5 flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Competitive Recruitment Lifecycle Hub</span>
              <Badge variant="outline" className="text-[10px] py-0 border-indigo-500/30 text-indigo-300">
                Offline First & Zero-Knowledge
              </Badge>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Press <kbd className="font-mono text-slate-300 bg-[#161c28] px-1 py-0.5 rounded border border-[#232c40]">⌘K</kbd> anywhere to search examinations, registration IDs, or open quick actions.
            </p>
          </div>
        </div>

        <Link
          href="/examinations"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors self-start sm:self-auto whitespace-nowrap shadow-sm"
        >
          View All Examinations →
        </Link>
      </div>

      {/* Primary Statistics Grid - 7 KPIs dynamically calculated */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard
          title="Total Exams"
          value={stats.totalExaminations}
          subtitle="Tracked recruitments"
          icon={GraduationCap}
          accentColor="indigo"
        />
        <StatCard
          title="Active Apps"
          value={stats.activeApplications}
          subtitle="In-progress or drafts"
          icon={FileCheck2}
          accentColor="amber"
        />
        <StatCard
          title="Scheduled"
          value={stats.upcomingExaminations}
          subtitle="Target exam dates"
          icon={Calendar}
          accentColor="blue"
        />
        <StatCard
          title="Pending Results"
          value={stats.pendingResults}
          subtitle="Awaiting declaration"
          icon={Clock}
          accentColor="purple"
        />
        <StatCard
          title="Pending Keys"
          value={stats.pendingAnswerKeys}
          subtitle="Provisional keys"
          icon={FileText}
          accentColor="rose"
        />
        <StatCard
          title="Hall Tickets"
          value={stats.availableHallTickets}
          subtitle="Ready to download"
          icon={Award}
          accentColor="emerald"
        />
        <StatCard
          title="App Deadlines"
          value={stats.upcomingApplicationDeadlines}
          subtitle="Urgent action required"
          icon={AlertCircle}
          accentColor="cyan"
        />
      </div>

      {/* Advanced Multi-Dimensional Filter Toolbar */}
      <div className="p-3.5 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Group Filters */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              Filter by:
            </span>

            <div className="flex items-center bg-[#0d1017] rounded-lg p-0.5 border border-[#1e2536]">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedStatus === "all"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Statuses
              </button>
              <button
                onClick={() => setSelectedStatus("applications")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedStatus === "applications"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Applications
              </button>
              <button
                onClick={() => setSelectedStatus("scheduled")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedStatus === "scheduled"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setSelectedStatus("results")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedStatus === "results"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Results
              </button>
            </div>

            {/* Year Filters */}
            <div className="flex items-center bg-[#0d1017] rounded-lg p-0.5 border border-[#1e2536]">
              <button
                onClick={() => setSelectedYear("all")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedYear === "all"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Years
              </button>
              <button
                onClick={() => setSelectedYear("2026")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedYear === "2026"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2026
              </button>
              <button
                onClick={() => setSelectedYear("2025")}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedYear === "2025"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2025
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-400 hover:text-amber-300 bg-[#161c29] border border-[#222c42] text-[11px] font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 self-end lg:self-auto">
            <span className="text-[11px] text-slate-500 mr-1">Display:</span>
            <div className="flex items-center bg-[#0d1017] rounded-lg p-0.5 border border-[#1e2536]">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "cards" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("compact")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "compact" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="Compact List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sector / Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1 border-t border-[#182030]">
          <span className="text-[11px] text-slate-500 whitespace-nowrap mr-1">Sector:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-[#0d1017] text-slate-400 hover:text-white border border-[#1e2536]"
              }`}
            >
              {cat === "all" ? "All Sectors" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Grid for Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Deadlines & Tracked Examinations */}
        <div className="space-y-6">
          <DeadlineList deadlines={upcomingDeadlines} />
          <RecentExams exams={filteredExaminations} />
        </div>

        {/* Right Column: Upcoming Examination Dates & Recent Activity */}
        <div className="space-y-6">
          <ExamDateList examDates={upcomingExamDates} />
          <RecentActivity activities={activities} />
        </div>
      </div>
    </AppLayout>
  );
}
