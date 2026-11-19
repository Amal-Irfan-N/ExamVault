"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent, EVENT_TYPE_CONFIG } from "@/types/calendar";
import { CertaintyBadge } from "@/components/ui/status-badge";
import Link from "next/link";

interface WeekViewProps {
  events: CalendarEvent[];
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function WeekView({ events }: WeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day; // start on Sunday
    return new Date(now.setDate(diff));
  });

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleThisWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    setCurrentWeekStart(new Date(now.setDate(diff)));
  };

  // Build the 7 days of this week
  const weekDays = React.useMemo(() => {
    const days: { date: Date; dateStr: string; dayName: string; isToday: boolean }[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const dayNum = String(d.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${dayNum}`;

      const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

      days.push({
        date: d,
        dateStr,
        dayName: DAYS_OF_WEEK[i],
        isToday,
      });
    }
    return days;
  }, [currentWeekStart]);

  const eventsByDate = React.useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      if (!ev.date) return;
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  const startDateFormatted = weekDays[0]?.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endDateFormatted = weekDays[6]?.date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>
              Week of {startDateFormatted} – {endDateFormatted}
            </span>
          </h2>

          <Button
            size="sm"
            variant="outline"
            onClick={handleThisWeek}
            className="text-xs h-7 px-2.5 border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
          >
            This Week
          </Button>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrevWeek}
            className="p-1.5 h-8 w-8 rounded-lg border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNextWeek}
            className="p-1.5 h-8 w-8 rounded-lg border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 7-Day Columns Layout */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayEvents = eventsByDate[day.dateStr] || [];

          return (
            <div
              key={day.dateStr}
              className={`rounded-2xl border flex flex-col p-3 space-y-3 min-h-[220px] transition-all ${
                day.isToday
                  ? "bg-[#141a29] border-indigo-500/50 ring-1 ring-indigo-500/30"
                  : "bg-[#121620] border-[#1e2536]"
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#1a2133]">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {day.dayName.substring(0, 3)}
                  </span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      day.isToday ? "text-indigo-400" : "text-white"
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                </div>

                {day.isToday && (
                  <Badge variant="outline" className="text-[9px] bg-indigo-500/20 text-indigo-300 border-indigo-500/40">
                    Today
                  </Badge>
                )}
              </div>

              {/* Day Events */}
              <div className="space-y-2 flex-1">
                {dayEvents.length === 0 ? (
                  <span className="text-[11px] text-slate-600 italic block pt-2">
                    No events
                  </span>
                ) : (
                  dayEvents.map((ev) => {
                    const cfg = EVENT_TYPE_CONFIG[ev.type] || EVENT_TYPE_CONFIG.exam_date;
                    return (
                      <div
                        key={ev.id}
                        className={`p-2 rounded-xl border space-y-1.5 ${cfg.bg} ${cfg.border} text-xs`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-bold uppercase ${cfg.text}`}>
                            {cfg.label}
                          </span>
                          <CertaintyBadge certainty={ev.certainty} />
                        </div>

                        <h4 className="font-bold text-white text-[11px] leading-tight">
                          {ev.title}
                        </h4>

                        <p className="text-[10px] text-slate-300 truncate">
                          {ev.examName}
                        </p>

                        {ev.examId && (
                          <Link
                            href={`/examinations/${ev.examId}`}
                            className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-white font-medium"
                          >
                            Details <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
