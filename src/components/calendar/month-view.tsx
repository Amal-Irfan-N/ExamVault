"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ExternalLink,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent, EVENT_TYPE_CONFIG } from "@/types/calendar";
import { CertaintyBadge } from "@/components/ui/status-badge";
import Link from "next/link";

interface MonthViewProps {
  events: CalendarEvent[];
  onAddEvent?: () => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthView({ events, onAddEvent }: MonthViewProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Calculate days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Group events by date string "YYYY-MM-DD"
  const eventsByDate = React.useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((ev) => {
      if (!ev.date) return;
      if (!map[ev.date]) map[ev.date] = [];
      map[ev.date].push(ev);
    });
    return map;
  }, [events]);

  // Construct calendar cells
  const cells: {
    dayNumber: number;
    dateStr: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    events: CalendarEvent[];
  }[] = [];

  // 1. Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = totalDaysInPrevMonth - i;
    const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    cells.push({
      dayNumber: day,
      dateStr,
      isCurrentMonth: false,
      isToday: false,
      events: eventsByDate[dateStr] || [],
    });
  }

  // 2. Current month days
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isToday =
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear();

    cells.push({
      dayNumber: day,
      dateStr,
      isCurrentMonth: true,
      isToday,
      events: eventsByDate[dateStr] || [],
    });
  }

  // 3. Next month leading days to complete the 35 or 42 grid
  const remainingCells = 42 - cells.length;
  for (let day = 1; day <= (remainingCells >= 7 ? remainingCells : remainingCells + 7); day++) {
    if (cells.length >= 35 && cells.length % 7 === 0) break;
    const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    cells.push({
      dayNumber: day,
      dateStr,
      isCurrentMonth: false,
      isToday: false,
      events: eventsByDate[dateStr] || [],
    });
  }

  // Selected date events
  const selectedDayEvents = selectedDateStr ? eventsByDate[selectedDateStr] || [] : [];

  return (
    <div className="space-y-4">
      {/* Month Navigation Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-[#121620] border border-[#1e2536]">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
          </h2>

          <Button
            size="sm"
            variant="outline"
            onClick={handleToday}
            className="text-xs h-7 px-2.5 border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrevMonth}
            className="p-1.5 h-8 w-8 rounded-lg border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNextMonth}
            className="p-1.5 h-8 w-8 rounded-lg border-[#28324a] text-slate-300 hover:text-white cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {onAddEvent && (
            <Button
              size="sm"
              onClick={onAddEvent}
              className="text-xs h-8 px-3 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 ml-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Event
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl bg-[#121620] border border-[#1e2536] overflow-hidden shadow-xl">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[#1e2536] bg-[#0f131c] text-center text-xs font-bold text-slate-400 py-2.5">
          {DAYS_OF_WEEK.map((d, i) => (
            <div key={d} className={i === 0 || i === 6 ? "text-indigo-400" : ""}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#1e2536]">
          {cells.map((cell) => {
            const isSelected = selectedDateStr === cell.dateStr;

            return (
              <div
                key={cell.dateStr}
                onClick={() => setSelectedDateStr(cell.dateStr)}
                className={`min-h-[95px] sm:min-h-[110px] p-1.5 sm:p-2 transition-all cursor-pointer flex flex-col justify-between ${
                  !cell.isCurrentMonth
                    ? "bg-[#0b0e14]/40 opacity-40 hover:opacity-75"
                    : "bg-[#121620] hover:bg-[#141926]"
                } ${isSelected ? "ring-2 ring-indigo-500 bg-[#161d2d]" : ""} ${
                  cell.isToday ? "border-l-2 border-l-indigo-500" : ""
                }`}
              >
                {/* Cell Header: Day Number & Today indicator */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      cell.isToday
                        ? "bg-indigo-600 text-white shadow-sm"
                        : cell.isCurrentMonth
                        ? "text-slate-200"
                        : "text-slate-500"
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {cell.events.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  )}
                </div>

                {/* Event Chips inside Cell */}
                <div className="space-y-1 flex-1 overflow-hidden">
                  {cell.events.slice(0, 2).map((ev) => {
                    const cfg = EVENT_TYPE_CONFIG[ev.type] || EVENT_TYPE_CONFIG.exam_date;
                    return (
                      <div
                        key={ev.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${cfg.bg} ${cfg.border} ${cfg.text}`}
                        title={`${ev.title} (${ev.examName})`}
                      >
                        {ev.title}
                      </div>
                    );
                  })}

                  {cell.events.length > 2 && (
                    <span className="text-[9px] text-slate-400 font-mono block pl-1">
                      +{cell.events.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Event Drawer / Detail Inspector */}
      {selectedDateStr && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#101420] border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                Events for {selectedDateStr}
              </h3>
              <Badge variant="outline" className="text-[10px] text-slate-400">
                {selectedDayEvents.length} milestone(s)
              </Badge>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedDateStr(null)}
              className="text-xs h-7 px-2 text-slate-400 hover:text-white cursor-pointer"
            >
              Dismiss
            </Button>
          </div>

          {selectedDayEvents.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              No examination milestones or deadlines scheduled for this date.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedDayEvents.map((ev) => {
                const cfg = EVENT_TYPE_CONFIG[ev.type] || EVENT_TYPE_CONFIG.exam_date;
                return (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl bg-[#0b0e14] border border-[#1e2536] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${cfg.bg} ${cfg.border} ${cfg.text}`}
                      >
                        {cfg.label}
                      </span>
                      <CertaintyBadge certainty={ev.certainty} />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                      <p className="text-[11px] text-slate-400">{ev.examName}</p>
                    </div>

                    {ev.notes && (
                      <p className="text-[10px] text-slate-500 italic bg-[#121620] p-1.5 rounded">
                        {ev.notes}
                      </p>
                    )}

                    {ev.examId && (
                      <Link
                        href={`/examinations/${ev.examId}`}
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium pt-1"
                      >
                        View Examination <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
