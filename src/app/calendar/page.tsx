"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  BellRing,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  exam: string;
  type: "exam_date" | "deadline" | "hall_ticket" | "result" | "key";
  certainty: "confirmed" | "tentative";
}

const EVENTS: CalendarEvent[] = [
  {
    id: "ev-1",
    date: "2026-04-18",
    title: "Exam Day: Scientist/Engineer 'SC' CBT",
    exam: "ISRO ICRB 2026",
    type: "exam_date",
    certainty: "confirmed",
  },
  {
    id: "ev-2",
    date: "2026-04-22",
    title: "Response Sheet & Provisional Answer Key",
    exam: "ISRO ICRB 2026",
    type: "key",
    certainty: "tentative",
  },
  {
    id: "ev-3",
    date: "2026-04-28",
    title: "Mains Result Announcement",
    exam: "State PSC Combined 2025",
    type: "result",
    certainty: "tentative",
  },
  {
    id: "ev-4",
    date: "2026-05-02",
    title: "City Intimation Slip Release",
    exam: "UPSC CSE Preliminary 2026",
    type: "hall_ticket",
    certainty: "tentative",
  },
  {
    id: "ev-5",
    date: "2026-05-10",
    title: "e-Admit Card / Hall Ticket Release",
    exam: "UPSC CSE Preliminary 2026",
    type: "hall_ticket",
    certainty: "tentative",
  },
  {
    id: "ev-6",
    date: "2026-05-24",
    title: "Preliminary Examination Day",
    exam: "UPSC CSE Preliminary 2026",
    type: "exam_date",
    certainty: "confirmed",
  },
  {
    id: "ev-7",
    date: "2026-07-10",
    title: "Application Registration Closes",
    exam: "SSC CGL 2026 Tier-I",
    type: "deadline",
    certainty: "confirmed",
  },
];

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"agenda" | "month" | "week">("agenda");

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              Examination Calendar
            </h1>
            <Badge variant="outline" className="text-indigo-300 border-indigo-500/30">
              Interactive Agenda
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-400">
            Keep track of application windows, admit card releases, test dates, and result declarations.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-[#121620] rounded-lg p-1 border border-[#1e2536] text-xs">
          <button
            onClick={() => setViewMode("agenda")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === "agenda"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Agenda View
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === "month"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Month View
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              viewMode === "week"
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Week View
          </button>
        </div>
      </div>

      {/* Reminder Presets Card */}
      <Card className="bg-[#121620] border-[#1e2536]">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <BellRing className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold">Automated Alerts:</span>
            <span className="text-slate-400">Scheduled for 30d, 15d, 7d, 3d, 1d and Day-of-Event</span>
          </div>
          <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
            Web Push Ready
          </Badge>
        </CardContent>
      </Card>

      {/* Agenda Events List */}
      <div className="space-y-3">
        {EVENTS.map((event) => {
          const isExam = event.type === "exam_date";
          const isDeadline = event.type === "deadline";

          return (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-xl bg-[#121620] border border-[#1e2536] hover:border-[#28344e] transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center min-w-[58px] ${
                    isExam
                      ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                      : isDeadline
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-300"
                      : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] font-bold uppercase">
                    {formatDate(event.date).split(" ")[1]}
                  </span>
                  <span className="text-sm font-extrabold leading-none">
                    {formatDate(event.date).split(" ")[0]}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">
                      {event.exam}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        event.certainty === "confirmed"
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-amber-400 bg-amber-500/10"
                      }`}
                    >
                      {event.certainty}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    {event.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Target Date: {formatDate(event.date)}
                  </p>
                </div>
              </div>

              <Button size="sm" variant="outline" className="text-xs h-8">
                Set Reminder
              </Button>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
