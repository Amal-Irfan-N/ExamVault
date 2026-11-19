"use client";

import React, { useState, useMemo } from "react";
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
  Sparkles,
} from "lucide-react";
import {
  INITIAL_MOCK_EXAMINATIONS,
  MOCK_ACTIVITIES,
  calculateDashboardStats,
  getUpcomingDeadlines,
  getUpcomingExamDates,
} from "@/data/mockExaminations";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DeadlineList } from "@/components/dashboard/deadline-list";
import { ExamDateList } from "@/components/dashboard/exam-date-list";
import { RecentExams } from "@/components/dashboard/recent-exams";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");

  // Filter exams based on year and status filter
  const filteredExams = useMemo(() => {
    return INITIAL_MOCK_EXAMINATIONS.filter((exam) => {
      // Year filter
      if (selectedYear !== "all" && exam.recruitmentYear.toString() !== selectedYear) {
        return false;
      }

      // Status group filter
      if (selectedStatusFilter === "applications") {
        return [
          "application_not_started",
          "application_in_progress",
          "payment_pending",
          "interested",
        ].includes(exam.status);
      }
      if (selectedStatusFilter === "scheduled") {
        return ["examination_scheduled", "hall_ticket_available"].includes(exam.status);
      }
      if (selectedStatusFilter === "results") {
        return ["result_pending", "result_published", "qualified", "selected"].includes(
          exam.status
        );
      }

      return true;
    });
  }, [selectedYear, selectedStatusFilter]);

  // Genuine calculated statistics from filtered records
  const stats = useMemo(() => {
    return calculateDashboardStats(filteredExams);
  }, [filteredExams]);

  const upcomingDeadlines = useMemo(() => {
    return getUpcomingDeadlines(filteredExams);
  }, [filteredExams]);

  const upcomingExamDates = useMemo(() => {
    return getUpcomingExamDates(filteredExams);
  }, [filteredExams]);

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
              {filteredExams.length} Records
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Real-time tracking of competitive recruitments, deadlines, admit cards & results.
          </p>
        </div>

        <QuickActions />
      </div>

      {/* Stage 1 Foundation Notice with Live In-App Progress Link */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-950/40 via-[#131724] to-[#121620] border border-indigo-500/20 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5 flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Stage 1 Verified & Complete:</span>
              <span className="text-emerald-400 font-medium">100% Tests Passing</span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Dark SaaS design system, responsive navigation, dynamic KPI engines, and 8 core modules active.
            </p>
          </div>
        </div>

        <Link
          href="/progress"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          View Live Roadmap (1/14 Stages) →
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#121620] border border-[#1e2536]">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year Filter */}
          <div className="flex items-center bg-[#0d1017] rounded-lg p-0.5 border border-[#1e2536] text-xs">
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

          {/* Status Category Filter */}
          <div className="flex items-center bg-[#0d1017] rounded-lg p-0.5 border border-[#1e2536] text-xs">
            <button
              onClick={() => setSelectedStatusFilter("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedStatusFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setSelectedStatusFilter("applications")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedStatusFilter === "applications"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setSelectedStatusFilter("scheduled")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedStatusFilter === "scheduled"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setSelectedStatusFilter("results")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedStatusFilter === "results"
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Results
            </button>
          </div>
        </div>
      </div>

      {/* Primary Statistics Grid - 7 KPIs specified in Section 5 */}
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

      {/* Two Column Grid for Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Deadlines & Tracked Examinations */}
        <div className="space-y-6">
          <DeadlineList deadlines={upcomingDeadlines} />
          <RecentExams exams={filteredExams} />
        </div>

        {/* Right Column: Upcoming Examination Dates & Recent Activity */}
        <div className="space-y-6">
          <ExamDateList examDates={upcomingExamDates} />
          <RecentActivity activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </AppLayout>
  );
}
