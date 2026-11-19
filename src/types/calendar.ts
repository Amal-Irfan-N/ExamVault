import { DateCertainty } from "./examination";

export type CalendarEventType =
  | "exam_date"
  | "app_deadline"
  | "fee_deadline"
  | "hall_ticket"
  | "city_intimation"
  | "answer_key"
  | "objection_deadline"
  | "result"
  | "custom_reminder";

export interface CalendarEvent {
  id: string;
  examId?: string;
  examName: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: CalendarEventType;
  certainty: DateCertainty;
  notes?: string;
  urgency?: "urgent" | "soon" | "upcoming" | "past";
  actionUrl?: string;
}

export interface ReminderSetting {
  id: string;
  eventId: string;
  examId?: string;
  title: string;
  eventDate: string;
  notifyDaysBefore: number; // 30, 15, 7, 3, 1, 0
  notificationDate: string; // computed date
  isTriggered: boolean;
  notes?: string;
}

export const EVENT_TYPE_CONFIG: Record<
  CalendarEventType,
  { label: string; color: string; bg: string; border: string; text: string }
> = {
  exam_date: {
    label: "Exam Day",
    color: "purple",
    bg: "bg-purple-500/20",
    border: "border-purple-500/40",
    text: "text-purple-300",
  },
  app_deadline: {
    label: "Application Deadline",
    color: "amber",
    bg: "bg-amber-500/20",
    border: "border-amber-500/40",
    text: "text-amber-300",
  },
  fee_deadline: {
    label: "Fee Payment Cutoff",
    color: "rose",
    bg: "bg-rose-500/20",
    border: "border-rose-500/40",
    text: "text-rose-300",
  },
  hall_ticket: {
    label: "Admit Card Release",
    color: "indigo",
    bg: "bg-indigo-500/20",
    border: "border-indigo-500/40",
    text: "text-indigo-300",
  },
  city_intimation: {
    label: "City Intimation",
    color: "cyan",
    bg: "bg-cyan-500/20",
    border: "border-cyan-500/40",
    text: "text-cyan-300",
  },
  answer_key: {
    label: "Answer Key",
    color: "blue",
    bg: "bg-blue-500/20",
    border: "border-blue-500/40",
    text: "text-blue-300",
  },
  objection_deadline: {
    label: "Objection Deadline",
    color: "red",
    bg: "bg-red-500/20",
    border: "border-red-500/40",
    text: "text-red-300",
  },
  result: {
    label: "Result Announcement",
    color: "emerald",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/40",
    text: "text-emerald-300",
  },
  custom_reminder: {
    label: "Custom Reminder",
    color: "teal",
    bg: "bg-teal-500/20",
    border: "border-teal-500/40",
    text: "text-teal-300",
  },
};

/**
 * Generates an iCalendar (.ics) string from an array of calendar events
 * for one-click import into Google Calendar, Outlook, and Apple Calendar.
 */
export function generateICSContent(events: CalendarEvent[]): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ExamVault//Examination Management Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  events.forEach((ev) => {
    if (!ev.date) return;
    const cleanDate = ev.date.replace(/-/g, "");
    const uid = `${ev.id}@examvault.app`;
    const now = new Date();
    const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(
      now.getUTCDate()
    )}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

    ics.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${cleanDate}`,
      `DTEND;VALUE=DATE:${cleanDate}`,
      `SUMMARY:${ev.title.replace(/[,;]/g, " ")} (${ev.examName.replace(/[,;]/g, " ")})`,
      `DESCRIPTION:${(ev.notes || `ExamVault reminder for ${ev.examName}`).replace(/[,;]/g, " ")}`,
      `STATUS:${ev.certainty === "confirmed" ? "CONFIRMED" : "TENTATIVE"}`,
      "END:VEVENT"
    );
  });

  ics.push("END:VCALENDAR");
  return ics.join("\r\n");
}
