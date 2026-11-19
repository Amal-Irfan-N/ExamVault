"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useExaminations } from "@/context/ExaminationContext";
import { MonthView } from "@/components/calendar/month-view";
import { WeekView } from "@/components/calendar/week-view";
import { AddReminderModal } from "@/components/calendar/add-reminder-modal";
import {
  CalendarEvent,
  EVENT_TYPE_CONFIG,
  generateICSContent,
} from "@/types/calendar";
import { CertaintyBadge } from "@/components/ui/status-badge";
import {
  Calendar as CalendarIcon,
  BellRing,
  Download,
  Plus,
  Clock,
  ExternalLink,
  LayoutGrid,
  Columns,
  ListOrdered,
  AlertTriangle,
} from "lucide-react";

export default function CalendarPage() {
  const { examinations } = useExaminations();

  const [viewMode, setViewMode] = useState<"month" | "week" | "agenda">("month");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<string>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  // Extract all calendar events dynamically from examinations
  const dynamicExamEvents = useMemo<CalendarEvent[]>(() => {
    const list: CalendarEvent[] = [];

    examinations.forEach((exam) => {
      // 1. Application closing deadline
      if (exam.applicationClosingDate?.date) {
        list.push({
          id: `ev-app-${exam.id}`,
          examId: exam.id,
          examName: exam.examName,
          title: "Application Registration Deadline",
          date: exam.applicationClosingDate.date,
          type: "app_deadline",
          certainty: exam.applicationClosingDate.certainty,
          notes: `Post: ${exam.postName}. Fee: ₹${exam.applicationFee ?? 0}`,
          actionUrl: exam.officialApplicationUrl,
        });
      }

      // 2. Fee payment deadline
      if (exam.feePaymentDeadline?.date) {
        list.push({
          id: `ev-fee-${exam.id}`,
          examId: exam.id,
          examName: exam.examName,
          title: "Application Fee Payment Cutoff",
          date: exam.feePaymentDeadline.date,
          type: "fee_deadline",
          certainty: exam.feePaymentDeadline.certainty,
          notes: `Status: ${exam.paymentStatus}. Fee: ₹${exam.applicationFee ?? 0}`,
        });
      }

      // 3. Examination day
      if (exam.examDate?.date) {
        list.push({
          id: `ev-exam-${exam.id}`,
          examId: exam.id,
          examName: exam.examName,
          title: `Examination Day: ${exam.examSession || "CBT / Written"}`,
          date: exam.examDate.date,
          type: "exam_date",
          certainty: exam.examDate.certainty,
          notes: `Venue: ${exam.examCentre || exam.examCity || "To be intimated"}`,
          actionUrl: exam.hallTicketDownloadUrl,
        });
      }

      // 4. Answer key release
      if (exam.answerKeyReleaseDate?.date) {
        list.push({
          id: `ev-key-${exam.id}`,
          examId: exam.id,
          examName: exam.examName,
          title: "Provisional Answer Key Publication",
          date: exam.answerKeyReleaseDate.date,
          type: "answer_key",
          certainty: exam.answerKeyReleaseDate.certainty,
          notes: "Check response sheet and prepare objections within cutoff window.",
        });
      }

      // 5. Result publication
      if (exam.resultPublicationDate?.date) {
        list.push({
          id: `ev-res-${exam.id}`,
          examId: exam.id,
          examName: exam.examName,
          title: "Result & Scorecard Publication",
          date: exam.resultPublicationDate.date,
          type: "result",
          certainty: exam.resultPublicationDate.certainty,
          notes: `Outcome status: ${exam.finalSelectionStatus || "Pending"}`,
        });
      }
    });

    return list;
  }, [examinations]);

  // Combined events: examination generated + user added
  const allEvents = useMemo(() => {
    return [...dynamicExamEvents, ...customEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [dynamicExamEvents, customEvents]);

  // Filtered by event type
  const filteredEvents = useMemo(() => {
    if (selectedEventType === "all") return allEvents;
    return allEvents.filter((e) => e.type === selectedEventType);
  }, [allEvents, selectedEventType]);

  // Download iCalendar file
  const handleExportICS = () => {
    const icsContent = generateICSContent(allEvents);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ExamVault_Schedule_2026.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Request browser notification permission
  const handleRequestNotification = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Browser Web Notifications are not supported in this browser.");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      new Notification("ExamVault Alerts Enabled", {
        body: "You will receive desktop and mobile countdown reminders for your upcoming exams!",
        icon: "/favicon.ico",
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                Examination Calendar & Reminders
              </h1>
              <Badge variant="outline" className="text-indigo-300 border-indigo-500/30">
                Interactive Schedule
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Track deadlines, hall ticket releases, test dates, and result declarations with automated alerts
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {notificationPermission !== "granted" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRequestNotification}
                className="text-xs h-9 px-3 gap-1.5 border-[#28324a] text-amber-300 hover:text-white cursor-pointer"
                title="Enable browser alerts for upcoming deadlines"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-400" />
                Enable Alerts
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handleExportICS}
              className="text-xs h-9 px-3 gap-1.5 border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
              title="Download iCal (.ics) for Google Calendar & Outlook"
            >
              <Download className="w-3.5 h-3.5" />
              Export .ICS
            </Button>

            <Button
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs h-9 px-4 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Event
            </Button>
          </div>
        </div>

        {/* View Mode & Filter Bar */}
        <div className="p-4 rounded-xl bg-[#121620] border border-[#1e2536] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* View Mode Switcher (Month / Week / Agenda) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0b0e14] border border-[#1e2536] self-start sm:self-auto">
              <button
                onClick={() => setViewMode("month")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "month"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Month Grid
              </button>

              <button
                onClick={() => setViewMode("week")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "week"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Week View
              </button>

              <button
                onClick={() => setViewMode("agenda")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "agenda"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                Agenda List
              </button>
            </div>

            {/* Total Milestones Counter */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                <strong className="text-white font-mono">{allEvents.length}</strong> active milestones tracked
              </span>
            </div>
          </div>

          {/* Event Type Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            <button
              onClick={() => setSelectedEventType("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedEventType === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-[#0b0e14] text-slate-400 hover:text-white border border-[#1e2536]"
              }`}
            >
              All Milestones ({allEvents.length})
            </button>

            {Object.entries(EVENT_TYPE_CONFIG).map(([typeKey, cfg]) => {
              const count = allEvents.filter((e) => e.type === typeKey).length;
              if (count === 0 && selectedEventType !== typeKey) return null;

              return (
                <button
                  key={typeKey}
                  onClick={() => setSelectedEventType(typeKey)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedEventType === typeKey
                      ? "bg-indigo-600 text-white"
                      : "bg-[#0b0e14] text-slate-400 hover:text-white border border-[#1e2536]"
                  }`}
                >
                  <span>{cfg.label}</span>
                  <span className="text-[10px] font-mono opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Display */}
        {viewMode === "month" ? (
          <MonthView
            events={filteredEvents}
            onAddEvent={() => setIsAddModalOpen(true)}
          />
        ) : viewMode === "week" ? (
          <WeekView events={filteredEvents} />
        ) : (
          /* Agenda View */
          <div className="space-y-3">
            {filteredEvents.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#121620] border border-[#1e2536]">
                <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">No scheduled events</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Add an examination or schedule a custom reminder for your study targets.
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Schedule First Event
                </Button>
              </div>
            ) : (
              filteredEvents.map((ev) => {
                const cfg = EVENT_TYPE_CONFIG[ev.type] || EVENT_TYPE_CONFIG.exam_date;
                const isDeadline =
                  ev.type === "app_deadline" || ev.type === "fee_deadline" || ev.type === "objection_deadline";

                return (
                  <Card
                    key={ev.id}
                    className="bg-[#121620] border-[#1e2536] hover:border-indigo-500/40 hover:bg-[#131825] transition-all"
                  >
                    <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Date & Type */}
                      <div className="flex items-start gap-4 min-w-0">
                        {/* Date badge */}
                        <div className="w-14 h-14 rounded-2xl bg-[#0b0e14] border border-[#1e2536] flex flex-col items-center justify-center flex-shrink-0 text-center">
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {new Date(ev.date).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          <span className="text-base font-bold text-white font-mono">
                            {new Date(ev.date).getDate()}
                          </span>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${cfg.bg} ${cfg.border} ${cfg.text}`}
                            >
                              {cfg.label}
                            </span>
                            <CertaintyBadge certainty={ev.certainty} />
                            {isDeadline && (
                              <Badge variant="destructive" className="text-[9px] gap-1">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                Deadline
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                            {ev.title}
                          </h3>

                          <p className="text-xs text-slate-400 font-medium truncate">
                            {ev.examName}
                          </p>

                          {ev.notes && (
                            <p className="text-[11px] text-slate-400 italic pt-0.5">
                              {ev.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                        {ev.examId && (
                          <Link href={`/examinations/${ev.examId}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 px-3 gap-1 border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
                            >
                              View Exam <ExternalLink className="w-3 h-3" />
                            </Button>
                          </Link>
                        )}

                        {ev.actionUrl && (
                          <a
                            href={ev.actionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold h-8 px-3"
                          >
                            Portal <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Add Reminder Modal */}
        <AddReminderModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddEvent={(newEvent) => {
            setCustomEvents((prev) => [newEvent, ...prev]);
          }}
        />
      </div>
    </AppLayout>
  );
}
