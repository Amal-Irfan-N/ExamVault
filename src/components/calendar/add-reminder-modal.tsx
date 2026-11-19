"use client";

import React, { useState } from "react";
import {
  X,
  BellRing,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useExaminations } from "@/context/ExaminationContext";
import { CalendarEvent, CalendarEventType } from "@/types/calendar";
import { DateCertainty } from "@/types/examination";

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: CalendarEvent) => void;
}

const EVENT_TYPE_OPTIONS: { type: CalendarEventType; label: string }[] = [
  { type: "exam_date", label: "Examination Day" },
  { type: "app_deadline", label: "Application Closing Deadline" },
  { type: "fee_deadline", label: "Fee Payment Deadline" },
  { type: "hall_ticket", label: "Admit Card / Hall Ticket Release" },
  { type: "city_intimation", label: "City Intimation Slip" },
  { type: "answer_key", label: "Answer Key Publication" },
  { type: "objection_deadline", label: "Objection Submission Deadline" },
  { type: "result", label: "Result / Scorecard Declaration" },
  { type: "custom_reminder", label: "Custom Preparation Reminder" },
];

function createEventId(title: string, date: string): string {
  const clean = title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20);
  return `ev-custom-${clean}-${date}`;
}

export function AddReminderModal({
  isOpen,
  onClose,
  onAddEvent,
}: AddReminderModalProps) {
  const { examinations } = useExaminations();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<CalendarEventType>("exam_date");
  const [certainty, setCertainty] = useState<DateCertainty>("confirmed");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [reminderPreset, setReminderPreset] = useState<number>(7); // 7 days before
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    const linkedExam = examinations.find((x) => x.id === selectedExamId);

    const newEvent: CalendarEvent = {
      id: createEventId(title.trim(), date),
      examId: selectedExamId || undefined,
      examName: linkedExam?.examName || "Personal Calendar Event",
      title: title.trim(),
      date,
      type,
      certainty,
      notes: notes.trim()
        ? `${notes.trim()} (Reminder set: ${reminderPreset} days prior)`
        : `Reminder set: ${reminderPreset} days prior`,
    };

    onAddEvent(newEvent);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setNotes("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#0d1017] border border-[#232a3e] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-8 max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1e2536] bg-[#121622]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Add Calendar Event & Reminder
              </h2>
              <p className="text-xs text-slate-400">
                Schedule deadlines, admit card releases and test dates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Event Title *
            </label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. UPSC CSE Prelims Test Day or Admit Card Release"
              className="bg-[#121620] border-[#1e2536] text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Event Date *
              </label>
              <Input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-[#121620] border-[#1e2536] text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Date Certainty *
              </label>
              <select
                value={certainty}
                onChange={(e) => setCertainty(e.target.value as DateCertainty)}
                className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="confirmed">Confirmed Date</option>
                <option value="tentative">Tentative / Expected</option>
                <option value="unannounced">Unannounced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Milestone Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CalendarEventType)}
                className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                {EVENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.type} value={opt.type}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Linked Examination (Optional)
              </label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-[#1e2536] bg-[#121620] px-3 py-1 text-xs text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="">Standalone Event</option>
                {examinations.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.examName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reminder Timing Presets */}
          <div className="p-3 rounded-xl bg-[#0b0e14] border border-[#1e2536] space-y-2">
            <span className="font-semibold text-white block text-[11px] uppercase tracking-wider">
              Notification Reminder Schedule
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { days: 30, label: "30 Days Before" },
                { days: 15, label: "15 Days Before" },
                { days: 7, label: "7 Days Before" },
                { days: 3, label: "3 Days Before" },
                { days: 1, label: "1 Day Before" },
                { days: 0, label: "On Event Date" },
              ].map((p) => (
                <button
                  type="button"
                  key={p.days}
                  onClick={() => setReminderPreset(p.days)}
                  className={`p-2 rounded-lg text-center text-xs font-medium border transition-colors cursor-pointer ${
                    reminderPreset === p.days
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-[#121620] border-[#1e2536] text-slate-400 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Personal Event Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Remember to carry black ballpoint pen and original photo ID"
              className="w-full rounded-lg border border-[#1e2536] bg-[#121620] p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#1a2133]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-9 px-4 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs h-9 px-5 bg-indigo-600 hover:bg-indigo-500 font-semibold gap-1.5 cursor-pointer shadow-lg shadow-indigo-950/40"
            >
              <CheckCircle2 className="w-4 h-4" />
              Schedule Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
