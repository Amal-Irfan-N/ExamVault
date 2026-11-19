import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "Unannounced";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "Unannounced";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getDaysRemaining(targetDateStr?: string | null): {
  days: number;
  label: string;
  isPast: boolean;
  isUrgent: boolean;
} {
  if (!targetDateStr) {
    return { days: 0, label: "TBD", isPast: false, isUrgent: false };
  }
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: Math.abs(diffDays),
      label: `${Math.abs(diffDays)}d ago`,
      isPast: true,
      isUrgent: false,
    };
  } else if (diffDays === 0) {
    return { days: 0, label: "Today", isPast: false, isUrgent: true };
  } else if (diffDays === 1) {
    return { days: 1, label: "Tomorrow", isPast: false, isUrgent: true };
  } else {
    return {
      days: diffDays,
      label: `in ${diffDays} days`,
      isPast: false,
      isUrgent: diffDays <= 7,
    };
  }
}
